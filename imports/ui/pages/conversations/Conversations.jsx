import React, { Component } from 'react';
import { Link } from 'react-router';
import ProfileStats from '/imports/ui/components/user/ProfileStats.jsx';
import Users from '/imports/ui/components/conversations/Users.jsx';
import Window from '/imports/ui/components/conversations/Window.jsx';
import { lastPublicChatActivity } from '/imports/api/users/methods';
import { markRead } from '/imports/api/conversations/methods';

export default class Conversations extends Component {
  state = {
    user: null,
    conversation: null,
    isEmpty: false,
    hasItems: true,
    badgesCount: 0
  };

  constructor(props) {
    super(props);
    this.onLoad = this.onLoad.bind(this);
  }

  componentDidMount() {
    this.logLastActivity();
  }

  componentWillUnmount() {
    this.logLastActivity();
  }

  logLastActivity() {
    lastPublicChatActivity.call();
  }

  changeUser({ user, conversation }) {
    this.setState({
      user,
      conversation
    });
  }

  onLoad({ hasItems, badgesCount }) {
    if (this.state.hasItems !== hasItems) {
      this.setState({
        hasItems
      });
    }

    if (this.state.badgesCount !== badgesCount) {
      this.setState({
        badgesCount
      });
      markRead.call({ conversationId: this.state.conversation._id });
    }
  }

  render() {
    const { user } = this.state;
    return (
      <div className="chat-page">
        <Users onClick={({ user, conversation }) => { this.changeUser({ user, conversation }); }} onLoad={this.onLoad} />
        {!this.state.hasItems ?
          <div className="chat-window">
            <div className="messages">
              <div className="no-messages">You don't have any messages. You can start a conversation by going to user's profile and clicking "Message"</div>
            </div>
          </div>
          : null
        }
        {this.state.conversation && <Window conversationId={this.state.conversation._id} />}
        <div className="chat-profile-view">
          {user && <ProfileStats user={user} />}
          {user && <Link to={`/profile/${user.username}`} className="btn btn-success">View Profile</Link>}
        </div>
      </div>
    );
  }
}
