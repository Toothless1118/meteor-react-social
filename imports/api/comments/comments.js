import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Factory } from 'meteor/factory';

export const Comments = new Mongo.Collection('Comments');

// Deny all client-side updates since we will be using methods to manage this collection
Comments.deny({
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


Comments.schema = new SimpleSchema({
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
  postId: { type: String },
  comment: { type: String, min: 1 },
  likesCount: { type: Number, defaultValue: 0 },
  likes: { type: Array, optional: true },
  'likes.$': { type: Object },
  'likes.$.userId': { type: String },
  'likes.$.createdAt': {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      }
    }
  }
});

Comments.attachSchema(Comments.schema);

Factory.define('comments', Comments, {});

Comments.publicFields = {

};

export const commentFormSchema = Comments.schema.pick('comment');
