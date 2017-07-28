import React from 'react';
import { Meteor } from 'meteor/meteor';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import RadioField from 'uniforms-bootstrap3/RadioField';
import { subscriptionSchema } from '/imports/api/users/users';
import { changeSubscriptionSettings } from '/imports/api/users/methods';

const Unsubscribe = ({ props }) => {
  const user = Meteor.user();
  if (!user) {
    return null;
  }

  const email = Meteor.user().email;
  const model = {
    subscribed: user.subscribed
  };

  const labels = {
    true: 'Often, keep me aware of my weight loss journey',
    false: 'Never'
  };

  const save = (doc) => {
    changeSubscriptionSettings.call(doc, (err) => {
      if (err) {
        console.log(err);
      }
    });
  };

  return (
    <div className="unsubscribe small-wrapper">
      <h1>Change Your Email Settings.<br />How Often Should We Email You?</h1>
      <h3>{email}</h3>
      <AutoForm schema={subscriptionSchema} model={model} onSubmit={save}>
        <RadioField name="subscribed" transform={value => labels[value]} label={false} />
        <button className="btn btn-danger btn-lg btn-block">Change Settings</button>
      </AutoForm>
    </div>
  );
};

export default Unsubscribe;