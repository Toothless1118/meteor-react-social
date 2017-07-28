import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { ProfileThumbImage } from '/imports/ui/helpers/user';

class Users extends Component {
  static propTypes = {
    users: PropTypes.array.isRequired,
    onClick: PropTypes.func
  };

  state = {
    activeUser: null
  };

  onClick(user) {
    const isDifferentUser = this.state.activeUser !== user._id;
    if (this.props.onClick) {
      this.props.onClick(isDifferentUser ? user : null);
    }
    this.setState({
      activeUser: isDifferentUser ? user._id : null
    });
  }

  renderUser(user) {
    const klass = cx({
      active: this.state.activeUser === user._id
    });

    return (
      <li key={user._id} className={klass} onClick={() => { this.onClick(user); }}>
        <div className="image" style={{ backgroundImage: `url(${ProfileThumbImage(user.image)})` }} />
        <div className="info">
          <div className="username">{user.firstName} {user.lastName}</div>
          <div className="text">{user.funFact}</div>
        </div>
      </li>
    );
  }

  render() {
    const { users } = this.props;
    return (
      <div className="chat-users">
        <ul>
          {users.map(u => this.renderUser(u))}
        </ul>
      </div>
    );
  }
};

export default createContainer(() => {
  const usersHandle = Meteor.subscribe('user.chat');
  return {
    users: Meteor.users.find({}, { sort: { 'status.lastLogin.date': -1, createdAt: -1, username: 1 } }).fetch() || [],
    loading: !usersHandle.ready()
  };
}, Users);
