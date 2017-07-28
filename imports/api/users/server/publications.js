import { Meteor } from 'meteor/meteor';
import { publicFields } from '../users';

Meteor.publish('users.me', function cb() {
  return Meteor.users.find({
    _id: this.userId
  }, {
    fields: publicFields
  });
});

Meteor.publish('users.lastActive', ({ skip = 0, limit = 20, search = '' }) => {
  return Meteor.users.find({
    accountStatus: 'active',
    username: { $regex: search, $options: 'i' }
  }, { fields: publicFields, sort: { 'status.lastLogin.date': -1, createdAt: -1 }, skip, limit });
});


Meteor.publish('user.profile', (username) => {
  return Meteor.users.find({ username }, { fields: publicFields });
});


Meteor.publish('user.chat', () => Meteor.users.find({}, {
  fields: publicFields,
  sort: { 'status.lastLogin.date': -1, createdAt: -1, username: 1 },
  limit: 25
}));


Meteor.publish('users.in', (list = []) => {
  return Meteor.users.find({ _id: { $in: list } }, { fields: publicFields });
});
