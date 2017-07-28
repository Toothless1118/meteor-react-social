import { Meteor } from 'meteor/meteor';
import { map, includes } from 'lodash';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { ChatMessages, chatMessageFormSchema } from './chatMessages';

export const create = new ValidatedMethod({
  name: 'chatMessages.create',
  validate: chatMessageFormSchema.validator(),
  run({ comment }) {
    if (!this.userId) {
      throw new Meteor.Error('must_login', 'Please login.');
    }
    const { username, image: userImage } = Meteor.users.findOne(this.userId);
    ChatMessages.insert({
      createdBy: this.userId,
      comment,
      username,
      userImage
    });
  }
});


const CHATMESSAGES_METHODS = map([

], 'name');


if (Meteor.isServer) {
  // Only allow 5 users operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return includes(CHATMESSAGES_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() {
      return true;
    }
  }, 5, 1000);
}


if (Meteor.isServer) {
  // Only allow 5 users operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return includes(['chatMessages.create'], name);
    },

    // Rate limit per connection ID
    connectionId() {
      return true;
    }
  }, 2, 5000);
}
