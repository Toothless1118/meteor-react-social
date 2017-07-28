import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import { editProfile } from '/imports/api/users/methods';
import TextField from 'uniforms-bootstrap3/TextField';
import { Link } from 'react-router';
import { editProfileSchema } from '/imports/api/users/users';
import UploadForm from '/imports/ui/components/global/UploadFile.jsx';
import Alert from '/imports/ui/helpers/notification';

export default class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.edit = this.edit.bind(this);
  }

  edit(doc) {
    editProfile.call({ ...doc, image: this.images.state.value[0] }, (err) => {
      if (err) {
        Alert.error(err);
      } else {
        Alert.success('Your profile has been updated.');
      }
    });
    if (doc.newPassword) {
      Accounts.changePassword(doc.currentPassword, doc.newPassword, (err) => {
        if (err) {
          Alert.error(err);
        } else {
          Alert.success('Your password has been changed.');
        }
      });
    }
  }

  render() {
    const { firstName, lastName, username, email, image } = Meteor.user();
    const model = {
      firstName,
      lastName,
      username,
      email
    };

    const files = image ? [{ url: image }] : [];

    return (
      <div className="well edit-profile-form">
        <div className="tab-pane">
          <AutoForm schema={editProfileSchema} model={model} onSubmit={this.edit} label={false} showInlineError>
            <div className="ui massive message blue">
              <h3 className="text-center">Edit Your Profile</h3>
            </div>
            <div className="first-last-name row">
              <TextField name="firstName" grid="col-xs-6 col-md-6" inputClassName="input-lg" placeholder="First Name" />
              <TextField name="lastName" grid="col-xs-6 col-md-6" inputClassName="input-lg" placeholder="Last Name" />
            </div>

            <TextField name="username" inputClassName="input-lg" placeholder="Username" disabled />
            <TextField type="email" name="email" inputClassName="input-lg" placeholder="Email" />
            Change Password (optional):
            <TextField type="password" name="currentPassword" inputClassName="input-lg" placeholder="Current Password" />
            <TextField type="password" name="newPassword" inputClassName="input-lg" placeholder="New Password" />
            <TextField type="password" name="confirmNewPassword" inputClassName="input-lg" placeholder="Confirm New Password" />
            <UploadForm ref={(c) => { this.images = c; }} type="profilePicture" enableTitle={false} name="image" files={files} />
            <input type="submit" className="btn btn-primary btn-lg btn-block" value="Submit Changes" />
            <Link to="/unsubscribe/U2FsdGVkX19dYrXY1aFEfw2IGHgcOQhb3Edee0%2Be%26wDxFKxALSNbZOylqjOLvusL" className="text-center">
              <h5>Click Here To Change Email Newsletter Settings</h5>
            </Link>
          </AutoForm>
        </div>
      </div>
    );
  }
}
