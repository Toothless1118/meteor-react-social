import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Random } from 'meteor/random';

export const Conversations = new Mongo.Collection('Conversations');

// Deny all client-side updates since we will be using methods to manage this collection
Conversations.deny({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return true;
  }
});


Conversations.schema = new SimpleSchema({
  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      }
    }
  },
  updatedAt: {
    type: Date,
    autoValue() {
      return new Date();
    }
  },
  lastMessage: {
    type: String,
    optional: true
  },
  createdBy: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  participants: {
    type: Array
  },
  'participants.$': {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  messages: {
    type: Array,
    optional: true
  },
  'messages.$': {
    type: Object
  },
  'messages.$._id': {
    type: String,
    optional: true,
    autoValue() {
      return Random.id();
    }
  },
  'messages.$.message': {
    type: String
  },
  'messages.$.createdBy': {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  'messages.$.createdAt': {
    type: Date,
    autoValue() {
      return new Date();
    }
  },
  badgesCount: {
    type: Object,
    optional: true,
    blackbox: true
  }
});

Conversations.attachSchema(Conversations.schema);

Conversations.publicFields = {};


export const conversationMessageFormSchema = new SimpleSchema({
  message: {
    type: String
  }
});

