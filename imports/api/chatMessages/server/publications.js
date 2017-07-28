import { Meteor } from 'meteor/meteor';
import { ChatMessages } from '../chatMessages';

Meteor.publish('chatMessages.list', () =>
  ChatMessages.find({}, { fields: ChatMessages.publicFields, limit: 100, sort: { createdAt: -1 } })
);
