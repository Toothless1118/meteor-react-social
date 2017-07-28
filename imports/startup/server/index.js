import { Meteor } from 'meteor/meteor';

import { FastRender } from 'meteor/meteorhacks:fast-render';

// This file configures the Accounts package to define the UI of the reset password email.
import './reset-password-email.js';

// Set up some rate limiting and other important security settings.
import './security.js';

import './migrate';

// This defines all the collections, publications and methods that the application provides
// as an API to the client.
import './register-api.js';

import './S3.js';

// import './move_data';

// import './migrate'

// import './cron';

if (Meteor.isDevelopment) {
  process.env.MAIL_URL = 'smtp://postmaster@inslim.com:3a6a2207967bd5911c18c2e623499269@smtp.mailgun.org:587/';
}

FastRender.onAllRoutes(function cb() {
  this.subscribe('users.me');
});

