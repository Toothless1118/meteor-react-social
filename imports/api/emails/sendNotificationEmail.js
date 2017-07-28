import { Meteor } from 'meteor/meteor';

export const sendNotificationEmail = ({ type, senderUsername, receiverFirstName = '', to, pathname = '' }) => {
  if (Meteor.isServer) {
    import { NotificationEmail } from './server';
    import { sendEmail } from './server/sendEmail';

    let subject;
    let body;
    const url = Meteor.absoluteUrl() + pathname;

    switch (type) {
      case 'comment.new':
        subject = 'You have a new comment on one of your posts';
        body = `${senderUsername} has posted a new comment on your post.`
        break;
      case 'comment.like':
        subject = 'Someone liked your comment';
        body = `${senderUsername} has liked your comment.`
        break;
      case 'comment.conversation':
        subject = 'New comment in conversation your participate';
        body = `${senderUsername} has posted a new comment in conversation you participate`;
        break;
      case 'post.like':
        subject = 'Someone liked your post';
        body = `${senderUsername} has liked your post.`
        break;
      default:
        break;
    }

    sendEmail({
      to,
      subject,
      html: NotificationEmail({ receiverFirstName, subject, body, url })
    });
  }
};
