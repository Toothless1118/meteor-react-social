import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router';
import { Accounts } from 'meteor/accounts-base';
import { forgotPasswordSchema } from '/imports/api/users/users';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import TextField from 'uniforms-bootstrap3/TextField';
import Alert from '/imports/ui/helpers/notification';

const ForgotPasswordPage = () => {
  const sendResetEmail = ({ email }) => {
    Accounts.forgotPassword({ email }, (err) => {
      if (err) {
        Alert.error(err);
      } else {
        Alert.success('We\'ve sent you an email with further instructions');
        this.form.reset();
      }
    });
  };

  return (
   <div className="wrapper-small">
     <h1 className="text-center">Forgot your password?</h1>
     <div className="well">
       <AutoForm schema={forgotPasswordSchema} ref={(c) => { this.form = c; }} onSubmit={(doc) => { sendResetEmail(doc); }} label={false} showInlineError>
         <div className="ui massive message blue">
           <h3 className="text-center">Enter Your Email</h3>
         </div>
         <TextField type="email" name="email" placeholder="Email" />
         <br />
         <input type="submit" className="btn btn-primary btn-lg btn-block" value="Submit" />
       </AutoForm>
       <br />
       <p className="text-center"><Link to="/login">Cancel</Link></p>
     </div>
   </div>
  );
};

export default ForgotPasswordPage;
