import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Orders = new Mongo.Collection('Orders');

// Deny all client-side updates since we will be using methods to manage this collection
Orders.deny({
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


Orders.schema = new SimpleSchema({
  createdAt: { type: Date, defaultValue: new Date() },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  skype: {
    type: String,
    optional: true
  },
  phone: {
    type: String,
    optional: true
  },
  workOn: {
    type: String,
    optional: true
  },
  plan: {
    type: String
  },
  amountPaid: {
    type: String
  },
  instructorName: {
    type: String,
    optional: true
  },
  hours: {
    type: String,
    optional: true
  }
});

Orders.attachSchema(Orders.schema);

Orders.publicFields = {

};

export const paymentSchema = new SimpleSchema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  cardNumber: {
    type: String
  },
  expirationMonth: {
    type: Number,
    allowedValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  expirationYear: {
    type: Number,
    allowedValues: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]
  },
  cvc: {
    type: Number
  },
  phone: {
    type: String
  }
});
