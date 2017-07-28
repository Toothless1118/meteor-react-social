import { Meteor } from 'meteor/meteor';
import { uniq, flatten } from 'lodash';
import { Conversations } from '../conversations';

Meteor.publish('conversations.single', function (conversationId) {
  return Conversations.find({ _id: conversationId, participants: this.userId });
});


Meteor.publish('conversations.list', function () {
  return Conversations.find({ participants: this.userId }, { fields: { lastMessage: 1, updatedAt: 1, participants: 1 } });
});
