import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const ChatMessages = new Mongo.Collection('ChatMessages');

// Deny all client-side updates since we will be using methods to manage this collection
ChatMessages.deny({
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


ChatMessages.schema = new SimpleSchema({
  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      }
    }
  },
  createdBy: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  username: {
    type: String
  },
  userImage: {
    type: String,
    optional: true
  },
  comment: {
    type: String,
    max: 200
  }
});

ChatMessages.attachSchema(ChatMessages.schema);

ChatMessages.publicFields = {};


export const chatMessageFormSchema = ChatMessages.schema.pick('comment');
