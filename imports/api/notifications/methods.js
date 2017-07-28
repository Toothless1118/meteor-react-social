import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { map, includes } from 'lodash';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { t } from '/imports/ui/helpers/translate';
import { Notifications, createNotificationSchema } from './notifications';


/**
 * Create a new notification
 */
export const create = new ValidatedMethod({
  name: 'notifications.create',
  validate: createNotificationSchema.validator(),
  run(notification) {
    Notifications.insert(notification);
  }
});


/**
 * Clear notification, set it to read
 */
export const clear = new ValidatedMethod({
  name: 'notifications.clear',
  validate: new SimpleSchema({
    id: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),
  run({ id }) {
    Notifications.update({
      _id: id,
      receiverId: this.userId
    }, {
      $set: {
        read: true
      }
    });
  }
});

const NOTIFICATIONS_METHODS = map([
  create,
  clear
], 'name');


if (Meteor.isServer) {
  // Only allow 5 users operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return includes(NOTIFICATIONS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() {
      return true;
    }
  }, 5, 1000);
}
