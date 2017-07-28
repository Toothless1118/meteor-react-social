import React from 'react';
import { Link, browserHistory } from 'react-router';
import { Accounts } from 'meteor/accounts-base';
import { resetPasswordSchema } from '/imports/api/users/users';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import TextField from 'uniforms-bootstrap3/TextField';
import Alert from '/imports/ui/helpers/notification';

const ResetPasswordPage = ({ params: { token } }) => {
  const setPassword = ({ newPassword }) => {
    Accounts.resetPassword(token, newPassword, (err) => {
      if (err) {
        Alert.error(err);
      } else {
        Alert.success('Your password has been changed.');
        browserHistory.push('/');
      }
    });
  };

  return (
    <div className="wrapper-small">
      <h1 className="text-center">Reset your password</h1>
      <div className="well">
        <AutoForm schema={resetPasswordSchema} onSubmit={(doc) => { setPassword(doc); }} label={false} showInlineError>
          <div className="ui massive message blue">
            <h3 className="text-center">Enter Your New Password</h3>
          </div>
          <TextField type="password" name="newPassword" placeholder="New Password" />
          <TextField type="password" name="confirmNewPassword" placeholder="Confirm New Password" />
          <br />
          <input type="submit" className="btn btn-primary btn-lg btn-block" value="Submit" />
        </AutoForm>
        <br />
        <p className="text-center"><Link to="/login">Cancel</Link></p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
