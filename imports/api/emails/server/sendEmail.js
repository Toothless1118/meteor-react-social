import { Email } from 'meteor/email';

export const sendEmail = ({ subject, html, to }) => {
  Email.send({
    from: 'inSlim <inslim@inslim.com>',
    to,
    subject,
    html
  });
};
