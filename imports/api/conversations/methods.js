import { Meteor } from 'meteor/meteor';
import { map, includes, without } from 'lodash';
import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { Conversations, conversationMessageFormSchema } from './conversations';

export const start = new ValidatedMethod({
  name: 'conversations.start',
  validate: new SimpleSchema({
    userId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),
  run({ userId }) {
    const currentConversation = Conversations.findOne({
      participants: { $all: [this.userId, userId] }
    }, { fields: { _id: 1 } });

    if (!currentConversation) {
      return Conversations.insert({
        createdBy: this.userId,
        participants: [this.userId, userId]
      });
    }
    return currentConversation._id;
  }
});


export const message = new ValidatedMethod({
  name: 'conversations.message',
  validate: new SimpleSchema({
    conversationId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).extend(conversationMessageFormSchema).validator(),
  run({ message: conversationMessage, conversationId }) {
    if (!this.userId) {
      throw new Meteor.Error('must_login', 'Please login.');
    }

    const receiverId = without(Conversations.findOne(conversationId).participants, this.userId)[0];

    Conversations.update({
      _id: conversationId,
      participants: this.userId
    }, {
      $push: {
        messages: {
          createdBy: this.userId,
          message: conversationMessage
        }
      },
      $set: {
        lastMessage: conversationMessage
      },
      $inc: {
        [`badgesCount.${receiverId}`]: 1
      }
    });
  }
});


export const markRead = new ValidatedMethod({
  name: 'conversations.markRead',
  validate: new SimpleSchema({
    conversationId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),
  run({ conversationId }) {
    Conversations.update({
      _id: conversationId,
      participants: this.userId
    }, {
      $set: {
        [`badgesCount.${this.userId}`]: 0
      }
    }, { bypassCollection2: true });
  }
});

const CONVERSATIONS_METHODS = map([
  start,
  message
], 'name');


if (Meteor.isServer) {
  // Only allow 5 users operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return includes(CONVERSATIONS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() {
      return true;
    }
  }, 5, 1000);
}