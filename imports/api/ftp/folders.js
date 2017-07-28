import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Factory } from 'meteor/factory';

export const Folders = new Mongo.Collection('Folders');

// Deny all client-side updates since we will be using methods to manage this collection
Folders.deny({
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


Folders.schema = new SimpleSchema({
  userId: {type: String},
  currentFtp: {type: String},
  entry: {type: String},
  lists: [{ type: String, optional: true }],
});

Folders.attachSchema(Folders.schema);

Factory.define('folders', Folders, {});

Folders.publicFields = {
};

export const folderFormSchema = Folders.schema.pick('userId', 'currentFtp', 'entry', 'lists');
