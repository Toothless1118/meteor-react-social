import React, { Component } from 'react';
import { Link } from 'react-router';
import ProfileStats from '/imports/ui/components/user/ProfileStats.jsx';
import Users from '/imports/ui/components/chat/Users.jsx';
import Window from '/imports/ui/components/chat/Window.jsx';
import { lastPublicChatActivity } from '/imports/api/users/methods'

export default class Chat extends Component {
  state = {
    user: null
  };

  componentDidMount() {
    this.logLastActivity();
  }

  componentWillUnmount() {
    this.logLastActivity();
  }

  logLastActivity() {
    lastPublicChatActivity.call();
  }

  changeUser(user) {
    this.setState({
      user
    });
  }

  render() {
    const { user } = this.state;
    return (
      <div className="chat-page">
        <Users onClick={(user) => { this.changeUser(user); }} />
        <Window />
        <div className="chat-profile-view">
          {user && <ProfileStats user={user} />}
          {user && <Link to={`/profile/${user.username}`} className="btn btn-success">View Profile</Link>}
        </div>
      </div>
    );
  }
}