import { Meteor } from 'meteor/meteor';
import { Comments } from '/imports/api/comments/comments';
import { uniq, toArray } from 'lodash';
import { Posts, publicFields } from '../posts';

Meteor.publish('posts.list', (search = {}, limit = 10) => {
  return Posts.find(search, { fields: publicFields, limit, sort: { createdAt: -1 } });
});

Meteor.publish('posts.profile-list', (search = {}, limit = 10) => {
  return Posts.find(search, { fields: publicFields, limit, sort: { createdAt: -1 } });
});

Meteor.publish('posts.myCommented', (search = {}) => {
  const postIds = Comments.find(search, { fields: { _id: 0, postId: 1 } }).fetch().map(doc => doc.postId);

  return Posts.find({
    _id: {
      $in: uniq(postIds)
    }
  }, {
    fields: publicFields,
    sort: {
      createdAt: -1
    }
  });
});

Meteor.publish('posts.single', (id) => {
  return Posts.find(id, { fields: publicFields });
});
