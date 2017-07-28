import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import { create } from '/imports/api/users/methods';
import TextField from 'uniforms-bootstrap3/TextField';
import { signUpSchema } from '/imports/api/users/users';
import { browserHistory } from 'react-router';
import UploadForm from '/imports/ui/components/global/UploadFile.jsx';
import Alert from '/imports/ui/helpers/notification';

export default class RegisterForm extends Component {
  register(doc) {
    create.call({ ...doc, image: this.images.state.value[0] }, (err) => {
      if (err) {
        Alert.error(err);
      } else {
        Meteor.loginWithPassword(doc.email, doc.password, (loginErr) => {
          if (!loginErr) {
            browserHistory.replace('/welcome');
          }
        });
      }
    });
  }

  render() {
    return (
      <AutoForm schema={signUpSchema} onSubmit={(doc) => { this.register(doc); }} label={false} showInlineError>
        <div className="ui massive message blue">
          <h3 className="text-center">Join The Network</h3>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <span className="text-muted">Your first and last name will be kept private</span>
          </div>
          <div className="col-sm-12 first-last-name">
            <div className="row">
              <TextField name="firstName" grid="col-xs-6 col-md-6" inputClassName="first-name" placeholder="First Name" />
              <TextField name="lastName" grid="col-xs-6 col-md-6" inputClassName="last-name" placeholder="Last Name" />
            </div>
          </div>
        </div>

        <span className="text-muted">Your username will be visible to the public</span>

        <TextField name="username" placeholder="Username" />
        <TextField type="email" name="email" placeholder="Email" />
        <TextField type="password" name="password" placeholder="Password" />
        <TextField type="password" name="confirmPassword" placeholder="Repeat Password" />
        <UploadForm ref={(c) => { this.images = c; }} type="profilePicture" enableTitle={false} name="image" />
        <input type="submit" className="btn btn-primary btn-lg btn-block" value="Register" />
      </AutoForm>
    );
  }
}
