import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Notifications = new Mongo.Collection('Notifications');

// Deny all client-side updates since we will be using methods to manage this collection
Notifications.deny({
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


Notifications.schema = new SimpleSchema({
  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      }
    }
  },
  type: {
    type: String
  },
  entity: {
    type: String
  },
  createdBy: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  receiverId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  docId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  data: {
    type: Object,
    blackbox: true
  },
  read: {
    type: Boolean,
    autoValue() {
      if (this.isInsert) {
        return false;
      }
    }
  }
});

Notifications.attachSchema(Notifications.schema);

Notifications.publicFields = {};


export const createNotificationSchema = Notifications.schema.pick('type', 'receiverId', 'data', 'docId', 'createdBy', 'entity');

