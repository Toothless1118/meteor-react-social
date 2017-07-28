import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Factory } from 'meteor/factory';

export const Connections = new Mongo.Collection('Connections');

// Deny all client-side updates since we will be using methods to manage this collection
Connections.deny({
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


Connections.schema = new SimpleSchema({
  userId: { type: String },
  host: { type: String },
  username: { type: String },
  password: { type: String },
  status: { type: String, optional: true },
  obj: { type: String, optional: true },
  updatedAt: {
    type: Date,
    autoValue() {
      if (this.isUpdate) {
        return new Date();
      }
      if (this.isInsert) {
        return new Date();
      }
      this.unset();
    },
    optional: true
  },
});

Connections.attachSchema(Connections.schema);

Factory.define('connections', Connections, {});

Connections.publicFields = {
};

export const connectionFormSchema = Connections.schema.pick('host', 'username', 'password', 'obj');
