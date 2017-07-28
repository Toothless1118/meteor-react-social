import { Meteor } from 'meteor/meteor';
import { Folders } from '../folders';
import { Connections } from '../connections';

Meteor.publish('folders.list', function () {
  return Folders.find({ userId: this.userId });
});
Meteor.publish('connections.list', function () {
  return Connections.find({ userId: this.userId });
});



