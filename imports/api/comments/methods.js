import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { map, includes, uniq, filter } from 'lodash';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { t } from '/imports/ui/helpers/translate';
import { Posts } from '/imports/api/posts/posts';
import { sendNotificationEmail } from '/imports/api/emails';
import { create as CreateNotification } from '/imports/api/notifications/methods';
import { Comments, commentFormSchema } from './comments';
import { Roles } from 'meteor/nicolaslopezj:roles';

/**
 * Create a new comment
 */
export const create = new ValidatedMethod({
  name: 'comments.create',
  validate: new SimpleSchema({
    postId: String
  }).extend(commentFormSchema).validator(),
  run({ postId, comment }) {
    const user = Meteor.users.findOne(this.userId);
    const commentId = Comments.insert({
      createdBy: this.userId,
      username: user.username,
      name: `${user.firstName} ${user.lastName}`,
      userImage: user.image,
      postId,
      comment
    });

    Posts.update({
      _id: postId
    }, {
      $inc: {
        commentsCount: 1
      }
    });

    if (commentId) {
      Meteor.users.update(this.userId, {
        $inc: {
          'stats.comments': 1
        }
      });

      const { createdBy } = Posts.findOne(postId, { fields: { createdBy: 1 } });
      if (createdBy === this.userId) {
        return;
      }

      CreateNotification.call({
        type: 'add',
        entity: 'comment',
        createdBy: this.userId,
        receiverId: createdBy,
        docId: commentId,
        data: {
          username: user.username,
          postId
        }
      });

      if (Meteor.isServer) {
        this.unblock();
        const { email: receiverEmail, firstName: receiverFirstName, status, _id: receiverId } = Meteor.users.findOne(createdBy);

        if (!status.online) {
          sendNotificationEmail({ type: 'comment.new', senderUsername: user.username, to: receiverEmail, receiverFirstName, pathname: `post/${postId}` });
        }

        // find other participants in conversation and send emails to them
        const participants = uniq(filter(
          Comments.find({ postId }, { fields: { createdBy: 1 } }).fetch().map(c => c.createdBy),
          p => p !== this.userId && p !== receiverId));

        if (participants.length) {
         const participatingUsers = Meteor.users.find({
           _id: {
             $in: participants
           }
         }, {
           fields: {
             firstName: 1,
             email: 1
           }
         });
         participatingUsers.map((u) => {
           sendNotificationEmail({ type: 'comment.conversation', senderUsername: user.username, to: u.email, receiverFirstName: u.firstName, pathname: `post/${postId}` });
         });
        }
      }
    }

    return commentId;
  }
});


export const edit = new ValidatedMethod({
  name: 'comments.edit',
  validate: new SimpleSchema({
    commentId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).extend(commentFormSchema).validator(),
  run({ commentId, comment }) {
    Comments.update({
      _id: commentId,
      createdBy: this.userId
    }, {
      $set: {
        comment,
        updatedAt: new Date()
      }
    });
  }
});


/**
 * Remove a comment
 */
export const remove = new ValidatedMethod({
  name: 'comments.remove',
  validate: new SimpleSchema({
    _id: String,
    postId: String
  }).validator(),
  run({ _id, postId }) {
    let { userId } = this;

    if (Roles.userHasRole(Meteor.userId(), 'admin')) {
      userId = Comments.findOne(_id).createdBy;
    }

    const rem = Comments.remove({
      _id,
      postId,
      createdBy: userId
    });
    if (rem) {
      Posts.update({
        _id: postId
      }, {
        $inc: {
          commentsCount: -1
        }
      });

      Meteor.users.update(userId, {
        $inc: {
          'stats.comments': -1
        }
      });
    }
  }
});

export const like = new ValidatedMethod({
  name: 'comments.like',
  validate: new SimpleSchema({
    _id: String
  }).validator(),
  run({ _id }) {
    const upd = Comments.update({
      _id,
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
      const { createdBy } = Comments.findOne(_id, { fields: { createdBy: 1 } });
      const { username } = Meteor.users.findOne(this.userId, { fields: { username: 1 } });

      const comment = Comments.findOne(_id);

      CreateNotification.call({
        type: 'like',
        entity: 'comment',
        createdBy: this.userId,
        receiverId: createdBy,
        docId: _id,
        data: {
          username,
          postId: comment.postId
        }
      });

      if (Meteor.isServer) {
        this.unblock();
        const { email: receiverEmail, firstName: receiverFirstName, status } = Meteor.users.findOne(createdBy);

        if (!status.online) {
          sendNotificationEmail({ type: 'comment.like', senderUsername: username, to: receiverEmail, receiverFirstName, pathname: `post/${comment.postId}` });
        }
      }
    } else {
      throw new Meteor.Error('like_own_comment', 'You have already voted or trying to vote on your own comment.');
    }
  }
});

const COMMENT_METHODS = map([
  create,
  remove,
  like
], 'name');


if (Meteor.isServer) {
  // Only allow 5 users operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return includes(COMMENT_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() {
      return true;
    }
  }, 5, 1000);
}
