import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router';
import Alert from '/imports/ui/helpers/notification';

const UnverifiedAccountNotice = () => {
  const sendVerificationEmail = (e) => {
    e.preventDefault();
    Meteor.call('users.sendVerificationEmail', (err) => {
      if (err) {
        Alert.error(err);
      } else {
        Alert.success('Verification email sent');
      }
    });
  };

  return (
    <div className="well unverified-account-notice">
    <span>Please verify your email address.
      <a href="#" onClick={sendVerificationEmail}>
        <i className="fa fa-reply" /> Resend Verification Email
      </a> or
      <Link to='/edit-profile'>
        <i className="fa fa-fw fa-wrench" />Edit Profile
      </Link>
    </span>
    </div>
  );
};

export default UnverifiedAccountNotice;
