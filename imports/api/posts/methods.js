import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { map, includes } from 'lodash';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { create as CreateNotification } from '/imports/api/notifications/methods';
import { sendNotificationEmail } from '/imports/api/emails';
import { t } from '/imports/ui/helpers/translate';
import { Roles } from 'meteor/nicolaslopezj:roles';
import { Posts, postFormSchema } from './posts';

/**
 * Create a new post
 */
export const create = new ValidatedMethod({
  name: 'posts.create',
  validate: postFormSchema.validator(),
  run({ post = '', link, images, type, data }) {
    const user = Meteor.users.findOne(this.userId);
    let metaObj = {};
    if (link && link.url) {
      if (!Meteor.isSimulation) {
        const linkInfo = Meteor.call('posts.getLinkInfo', { url: link.url });
        if (linkInfo) {
          metaObj = { link: { ...linkInfo, url: link.url } };
        }
      }
    }

    const extraFields = {};
    if (!this.isSimulation && images && images.length) {
      import { moveUploadedFile } from '/imports/api/server/upload';

      extraFields.images = [];
      images.map((img) => {
        const uploadedFile = moveUploadedFile(img.url, 'post');
        if (uploadedFile) {
          extraFields.images.push({ url: uploadedFile, title: img.title });
        }
      });
    }

    const postId = Posts.insert({
      createdBy: this.userId,
      username: user.username,
      name: `${user.firstName} ${user.lastName}`,
      userImage: user.image,
      type,
      post,
      ...metaObj,
      ...extraFields,
      data
    });

    if (postId) {
      Meteor.users.update(this.userId, {
        $inc: {
          'stats.posts': 1
        }
      });
    }


    return postId;
  }
});


export const edit = new ValidatedMethod({
  name: 'posts.edit',
  validate: new SimpleSchema({
    postId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).extend(postFormSchema).validator(),
  run({ post = '', link, images, postId }) {
    const set = { post, images: [] };
    const unset = { a: '' };

    if (link && link.url) {
      if (!Meteor.isSimulation) {
        const linkInfo = Meteor.call('posts.getLinkInfo', { url: link.url });
        if (linkInfo) {
          set.link = { ...linkInfo, url: link.url };
        }
      }
    } else {
      unset.link = '';
    }

    if (!this.isSimulation && images && images.length) {
      import { moveUploadedFile } from '/imports/api/server/upload';

      images.map((img) => {
        const uploadedFile = moveUploadedFile(img.url, 'post');
        if (uploadedFile) {
          set.images.push({ url: uploadedFile, title: img.title });
        }
      });
    }


    Posts.update({
      _id: postId,
      createdBy: this.userId
    }, {
      $set: {
        ...set
      },
      $unset: {
        ...unset
      }
    });
  }
});


/**
 * Remove a post
 */
export const remove = new ValidatedMethod({
  name: 'posts.remove',
  validate: new SimpleSchema({
    id: String
  }).validator(),
  run({ id }) {
    let { userId } = this;

    if (Roles.userHasRole(Meteor.userId(), 'admin')) {
      userId = Posts.findOne(id).createdBy;
    }

    Posts.remove({
      _id: id,
      createdBy: userId
    });
    Meteor.users.update(userId, {
      $inc: {
        'stats.posts': -1
      }
    });
  }
});

export const like = new ValidatedMethod({
  name: 'posts.like',
  validate: new SimpleSchema({
    id: String
  }).validator(),
  run({ id }) {
    const upd = Posts.update({
      _id: id,
      createdBy: {
        $ne: this.userId
      },
      likes: {
        $not: {
          $elemMatch: {
            userId: this.userId
          }
        }
      }
    }, {
      $inc: {
        likesCount: 1
      },
      $push: {
        likes: {
          userId: this.userId,
          createdAt: new Date()
        }
      }
    });

    if (upd) {
      const { createdBy } = Posts.findOne(id, { fields: { createdBy: 1 } });
      const { username } = Meteor.users.findOne(this.userId, { fields: { username: 1 } });

      CreateNotification.call({
        type: 'like',
        entity: 'post',
        createdBy: this.userId,
        receiverId: createdBy,
        docId: id,
        data: {
          username
        }
      });

      if (Meteor.isServer) {
        this.unblock();
        const { email: receiverEmail, firstName: receiverFirstName, status } = Meteor.users.findOne(createdBy);

        if (!status.online) {
          sendNotificationEmail({ type: 'post.like', senderUsername: username, to: receiverEmail, receiverFirstName, pathname: `post/${id}` });
        }
      }
    } else {
      throw new Meteor.Error('like_own_post', 'You have already voted or trying to vote on your own comment.');
    }
  }
});

const POST_METHODS = map([
  create,
  remove,
  like
], 'name');


if (Meteor.isServer) {
  // Only allow 5 users operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return includes(POST_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() {
      return true;
    }
  }, 5, 1000);
}
