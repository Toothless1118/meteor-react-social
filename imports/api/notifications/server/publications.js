import { Meteor } from 'meteor/meteor';
import { Notifications } from '../notifications';

Meteor.publish('notifications.unread', function () {
  return Notifications.find({
    receiverId: this.userId,
    read: false
  }, {
    sort: {
      createdAt: -1
    }
  });
});
