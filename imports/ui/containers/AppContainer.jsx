import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import App from '../layouts/App.jsx';

export default createContainer(() => {
  const userHandle = Meteor.subscribe('users.me');
  return {
    user: Meteor.user(),
    loading: !userHandle.ready(),
    connected: Meteor.status().connected
  };
}, App);
