import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/nicolaslopezj:roles';

Meteor.startup(() => {
  const admins = Meteor.users.find({ username: { $in: ['inslimSupport', 'dovydas'] } }).fetch();
  admins.map((admin) => {
    Roles.setUserRoles(admin._id, 'admin');
  });
});

