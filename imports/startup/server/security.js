import { Meteor } from 'meteor/meteor';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { includes } from 'lodash';
import { BrowserPolicy } from 'meteor/browser-policy-common';

// Don't let people write arbitrary data to their 'profile' field from the client
Meteor.users.deny({
  update() {
    return true;
  }
});

// Get a list of all accounts methods by running `Meteor.server.method_handlers` in meteor shell
const AUTH_METHODS = [
  'login',
  'logout',
  'logoutOtherClients',
  'getNewToken',
  'removeOtherTokens',
  'configureLoginService',
  'changePassword',
  'forgotPassword',
  'resetPassword',
  'verifyEmail',
  'createUser',
  'ATRemoveService',
  'ATCreateUserServer',
  'ATResendVerificationEmail'
];

if (Meteor.isServer) {
  // Only allow 2 login attempts per connection per 5 seconds
  DDPRateLimiter.addRule({
    name(name) {
      return includes(AUTH_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() {
      return true;
    }
  }, 2, 5000);
}



BrowserPolicy.content.allowImageOrigin('*');
BrowserPolicy.content.allowEval();

BrowserPolicy.content.allowFrameOrigin('youtube.com');
BrowserPolicy.content.allowFrameOrigin('www.youtube.com');


BrowserPolicy.content.allowImageOrigin('blob:');
const constructedCsp = BrowserPolicy.content._constructCsp();
BrowserPolicy.content.setPolicy(`${constructedCsp} media-src blob:;`);

BrowserPolicy.content.allowOriginForAll('*.clickfunnels.com');
BrowserPolicy.content.allowOriginForAll('fonts.gstatic.com');
BrowserPolicy.content.allowOriginForAll('fonts.googleapis.com');
BrowserPolicy.content.allowOriginForAll('maxcdn.bootstrapcdn.com');

BrowserPolicy.content.allowOriginForAll('*.stripe.com');

BrowserPolicy.content.allowOriginForAll('content.jwplatform.com');

BrowserPolicy.content.allowFrameOrigin('checkout.paypal.com');

BrowserPolicy.content.allowOriginForAll('*.googlesyndication.com');
BrowserPolicy.content.allowOriginForAll('*.doubleclick.net');