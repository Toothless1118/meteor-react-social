import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Feeds = new Mongo.Collection('Feeds');

// Deny all client-side updates since we will be using methods to manage this collection
Feeds.deny({
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


Feeds.schema = new SimpleSchema({
  createdAt: { type: Date },
  source: String,
  group: String,
  title: String,
  description: {
    type: String,
    optional: true
  },
  link: {
    type: String,
    optional: true
  },
  data: {
    type: Object,
    blackbox: true,
    optional: true
  }
});

Feeds.attachSchema(Feeds.schema);

Feeds.publicFields = {};
