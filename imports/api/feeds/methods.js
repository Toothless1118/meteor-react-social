import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { map, includes } from 'lodash';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { Feeds } from './feeds';


/**
 * Get feed data
 */
export const get = new ValidatedMethod({
  name: 'feeds.get',
  validate: new SimpleSchema({
    group: String,
    page: Number,
    perPage: Number
  }).validator(),
  run({ group, page, perPage }) {
    const skip = (page - 1) * perPage;
    const limit = perPage + 1;
    const posts = Feeds.find({ group }, { sort: { createdAt: -1 }, skip, limit }).fetch();

    const hasMore = posts.length > perPage;

    if (hasMore) {
      posts.pop();
    }

    return {
      posts,
      hasMore
    };
  }
});


const FEEDS_METHODS = map([
  get
], 'name');


if (Meteor.isServer) {
  // Only allow 5 users operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return includes(FEEDS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() {
      return true;
    }
  }, 5, 1000);
}
