import { Accounts } from 'meteor/accounts-base';


Accounts.emailTemplates.siteName = 'Games';
Accounts.emailTemplates.from = 'inSlim <accounts@inslim.com>';

Accounts.emailTemplates.resetPassword = {
  subject() {
    return '';
  },
  text(user, url) {
    return user + url;
  }
};
