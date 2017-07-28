import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import metafetch from 'metafetch';
import { map, includes } from 'lodash';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Posts, postFormSchema } from '../posts';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { t } from '/imports/ui/helpers/translate';


/**
 * Get a meta stuff for a link
 */
export const getLinkInfo = new ValidatedMethod({
  name: 'posts.getLinkInfo',
  validate: new SimpleSchema({
    url: SimpleSchema.RegEx.Url
  }).validator(),
  run({ url }) {
    this.unblock();
    const meta = Meteor.wrapAsync(metafetch.fetch)(url, { flags: { links: false } });
    if (meta) {
      const { title, description, image } = meta;
      return { title, description, image };
    }
  }
});


export const getCount = new ValidatedMethod({
  name: 'posts.getCount',
  validate: null,
  run({ search = {} }) {
    return Posts.find(search).count();
  }
});

const POST_METHODS = map([
  getLinkInfo
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
