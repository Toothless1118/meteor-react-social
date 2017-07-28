import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { ProfileThumbImage } from '/imports/ui/helpers/user';

const ProfileStats = ({ user }) => {
  if (!user.status.lastLogin) {
    user.status.lastLogin = { date: null };
  }
  if (!user.stats) {
    user.stats = {};
  }

  return (
    <div className="profile-stats">
      <div className="image" style={{ backgroundImage: `url(${ProfileThumbImage(user.image)})` }} />
      <h4 className="username">{user.firstName} {user.lastName}</h4>
      <div className="stats">
        <ul>
          <li>
            <span className="key">Last Login:</span>
            <span className="value">
              {user.status.online ?
                <span>online now</span> :
                <span>{moment(user.status.lastLogin.date || user.createdAt).fromNow()}</span>
              }
            </span>
          </li>
          <li>
            <span className="key">Joined:</span>
            <span className="value">{moment(user.createdAt).fromNow()}</span>
          </li>
          <li>
            <span className="key">Fun Fact:</span>
            <span className="value">{user.funFact}</span>
          </li>
          <li>
            <span className="key">Updates:</span>
            <span className="value">{user.stats.updates || 0}</span>
          </li>
          <li>
            <span className="key">Comments:</span>
            <span className="value">{user.stats.comments || 0}</span>
          </li>
          <li>
            <span className="key">Ideal Weight:</span>
            <span className="value">{user.idealWeight} lbs</span>
          </li>
          <li>
            <span className="key">Videos Watched:</span>
            <span className="value">{user.stats.videosWatched || 0}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

ProfileStats.propTypes = {
  user: PropTypes.object.isRequired
};

export default ProfileStats;
