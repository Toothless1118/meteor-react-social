import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import TextField from 'uniforms-bootstrap3/TextField';
import { browserHistory } from 'react-router';
import { loginSchema } from '/imports/api/users/users';
import Alert from '/imports/ui/helpers/notification';

export default class RegisterForm extends Component {
  login(doc) {
    Meteor.loginWithPassword(doc.email, doc.password, (err) => {
      if (err) {
        Alert.error(err);
      } else if (window.location.pathname !== '/welcomeSignupPay') {
        browserHistory.replace('/');
      }
    });
  }

  render() {
    return (
      <AutoForm schema={loginSchema} onSubmit={(doc) => { this.login(doc); }} label={false} showInlineError>
        <div className="ui massive message blue">
          <h3 className="text-center">Start Losing Weight!</h3>
        </div>
        <TextField name="email" placeholder="Email" />
        <TextField type="password" name="password" placeholder="Password" />
        <input type="submit" className="btn btn-primary btn-lg btn-block" value="Login" />
        <br />
        <p className="text-center"><Link to="/forgot-password">Forgot email or password?</Link></p>
      </AutoForm>
    );
  }
}
