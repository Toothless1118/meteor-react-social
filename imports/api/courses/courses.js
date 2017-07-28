import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Courses = new Mongo.Collection('Courses');

// Deny all client-side updates since we will be using methods to manage this collection
Courses.deny({
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


Courses.schema = new SimpleSchema({
  createdAt: { type: Date, defaultValue: new Date() },
  slug: { type: String },
  title: { type: String },
  subtitle: { type: String },
  description: { type: String },
  videoDescription: { type: String },
  image: { type: String },
  videosCount: { type: Number },
  videos: { type: Array },
  'videos.$': { type: Object },
  'videos.$.title': { type: String, optional: true },
  'videos.$.url': { type: String }
});

Courses.attachSchema(Courses.schema);

Courses.publicFields = {};
