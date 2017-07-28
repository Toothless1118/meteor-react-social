import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { EmailVerification, ResetPassword } from '/imports/api/emails/server';
import { subscribeDrip } from '/imports/api/users/server/methods';

import { moveUploadedFile } from '/imports/api/server/upload';
import moment from 'moment';

Accounts.config({
  forbidClientAccountCreation: true,
  loginExpirationInDays: 14
});

Accounts.onCreateUser((options, usr) => {
  const user = { ...usr, ...options.profile };
  user.email = options.email;
  user.subscribed = true;
  user.stats = {
    posts: 0,
    comments: 0,
    updates: 0,
    lastViewedPublicChat: moment().subtract(30, 'days').toDate()
  };

  if (user.image && user.image.url) {
    const uploadedFile = moveUploadedFile(user.image.url, 'profile');
    if (uploadedFile) {
      user.image = uploadedFile;
    }
  }
  if (Meteor.isProduction) {
    subscribeDrip.call({
      email: user.emails[0].address,
      _id: user._id,
      firstName: options.profile.firstName,
      lastName: options.profile.lastName
    }, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }

  delete user.profile;
  return user;
});


Accounts.emailTemplates.from = 'inSlim <inslim@inslim.com>';

Accounts.emailTemplates.siteName = 'inSlim';

Accounts.emailTemplates.verifyEmail.subject = () => {
  return 'Confirm Your Email Address';
};

Accounts.emailTemplates.verifyEmail.html = (user, url) => {
  const updatedUrl = url.replace('#/verify-email', 'verify-email-address');
  return EmailVerification({ user, url: updatedUrl });
};

Accounts.emailTemplates.resetPassword.html = (user, url) => {
  const updatedUrl = url.replace('#/reset-password', 'reset-password');
  return ResetPassword({ user, url: updatedUrl });
};
