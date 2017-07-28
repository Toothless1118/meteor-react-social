import { Meteor } from 'meteor/meteor';
import { map, includes } from 'lodash';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import getdripAPI from 'getdrip-api';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { Accounts } from 'meteor/accounts-base';

const { accountId, apiToken } = Meteor.settings.drip;

const drip = getdripAPI(apiToken, accountId);

export const sendVerificationEmail = new ValidatedMethod({
  name: 'users.sendVerificationEmail',
  validate: null,
  run() {
    Accounts.sendVerificationEmail(this.userId);
  }
});


export const subscribeDrip = new ValidatedMethod({
  name: 'users.subscribeDrip',
  validate: new SimpleSchema({
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    },
    _id: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    firstName: String,
    lastName: String
  }).validator(),
  run({ _id, email, firstName, lastName }) {
    drip.createSubscriber(email, {
      new_email: email,
      custom_fields: {
        _id,
        firstName,
        lastName
      }
    }, Meteor.bindEnvironment((err, res) => {
      if (err) {
        console.log('Error inserting user to Drip', err);
      } else {
        Meteor.users.update(_id, {
          $set: {
            dripSubscriptionId: res.body.subscribers[0].id
          }
        });
      }
    }));
  }
});


const USERS_METHODS = map([
  sendVerificationEmail
], 'name');


if (Meteor.isServer) {
  // Only allow 5 users operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return includes(USERS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() {
      return true;
    }
  }, 5, 1000);
}