import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import url from 'url';
import { Factory } from 'meteor/factory';

export const Posts = new Mongo.Collection('Posts');

export const publicFields = {

};

// Deny all client-side updates since we will be using methods to manage this collection
Posts.deny({
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


Posts.schema = new SimpleSchema({
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
      if (this.isUpdate) {
        return new Date();
      }
      this.unset();
    },
    optional: true
  },
  createdBy: { type: String },
  username: { type: String },
  name: { type: String },
  userImage: { type: String, optional: true },
  post: {
    type: String,
    optional: true,
    custom() {
      if (!this.value && !this.field('link.url').value) {
        return 'required';
      }
    }
  },
  images: { type: Array, optional: true },
  'images.$': { type: Object },
  'images.$.url': { type: String },
  'images.$.title': { type: String, optional: true },
  link: { type: Object, optional: true },
  'link.title': { type: String, optional: true },
  'link.description': { type: String, optional: true },
  'link.url': { type: String, optional: true },
  'link.image': { type: String, optional: true },
  likesCount: { type: Number, defaultValue: 0 },
  likes: { type: Array, optional: true },
  'likes.$': { type: Object },
  'likes.$.userId': { type: String },
  'likes.$.createdAt': { type: Date },
  commentsCount: { type: Number, defaultValue: 0 },
  type: {
    type: String,
    optional: true
  },
  data: {
    type: Object,
    blackbox: true,
    optional: true
  }
});

Posts.attachSchema(Posts.schema);

Factory.define('posts', Posts, {});

Posts.publicFields = {
  createdAt: 1,
  updatedAt: 1,
  messages: 1,
  room: 1,
  participants: 1
};

export const postFormSchema = Posts.schema.pick('post', 'images', 'images.$', 'images.$.url', 'images.$.title', 'link', 'link.url', 'type', 'data');

