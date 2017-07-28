import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { map, includes } from 'lodash';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { t } from '/imports/ui/helpers/translate';
import { Comments } from '../comments';


export const getCount = new ValidatedMethod({
  name: 'comments.getCount',
  validate: null,
  run({ search = {} }) {
    return Comments.find(search).count();
  }
});

const POST_METHODS = map([
  getCount
], 'name');


if (Meteor.isServer) {
  // Only allow 5 users operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return includes(POST_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() {
      return true;
    }
  }, 5, 1000);
}
