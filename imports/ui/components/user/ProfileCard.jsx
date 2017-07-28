import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import moment from 'moment';
import { ProfileThumbImage } from '/imports/ui/helpers/user';

export default class ProfileCard extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired
  };

  render() {
    const { user } = this.props;
    if (!user.status.lastLogin) {
      user.status.lastLogin = { date: null };
    }
    return (
      <div className="profile-card">
        <Link to={`/profile/${user.username}`}>
          <div className="image" style={{ backgroundImage: `url(${ProfileThumbImage(user.image)})` }} />
        </Link>
        <div className="details">
          <div className="name">
            {user.firstName} {user.lastName}
          </div>
          <div className="last-login">
            <p>Last Login</p>
            {user.status.online ?
              <span className="online">online now</span> :
              <span>{moment(user.status.lastLogin.date || user.createdAt).fromNow()}</span>
            }
          </div>
        </div>
        <Link to={`/profile/${user.username}`} className="btn btn-success btn-sm">
          <i className="fa fa-user" />
          <span> Profile</span>
        </Link>
      </div>
    );
  }
}