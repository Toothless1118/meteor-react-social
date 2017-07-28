import { Meteor } from 'meteor/meteor';
import { Comments } from '../comments';

Meteor.publish('comments.list', (search = {}, limit = 1) => {
  return Comments.find(search, { fields: Comments.publicFields, limit, sort: { createdAt: -1 } });
});
