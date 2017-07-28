import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Conversations } from '/imports/api/conversations/conversations';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import Form from '/imports/ui/components/conversations/Form.jsx';
import { ProfileThumbImage } from '/imports/ui/helpers/user';
import moment from 'moment';
import cx from 'classnames';
import Loader from '/imports/ui/components/global/ComponentLoader.jsx';
import { markRead } from '/imports/api/conversations/methods';

class Window extends Component {
  static propTypes = {
    conversation: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
  };

  componentDidMount() {
    // Update it every minute to refresh time ago
    this.updateTimer = setInterval(() => {
      this.forceUpdate();
    }, 60000);
  }

  componentWillReceiveProps() {
    if (!this.messagesBox) {
      return;
    }
    this.scrollToBottomOnUpdate = this.messagesBox.scrollHeight - this.messagesBox.scrollTop === this.messagesBox.clientHeight;
  }

  componentDidUpdate() {
    const { conversation: { messages = [] } } = this.props;
    const last = (messages[messages.length - 1] || {})._id;

    if (!this.lastMessageId || this.scrollToBottomOnUpdate) {
      this.scrollToBottom();
    }

    this.lastMessageId = last;
  }

  componentWillUnmount() {
    clearInterval(this.updateTimer);
  }

  scrollToBottom() {
    if (this.messagesBox) {
      this.messagesBox.scrollTop = this.messagesBox.scrollHeight;
    }
  }

  renderMessage(message) {
    const { users } = this.props;

    const klass = cx({
      right: Meteor.userId() === message.createdBy
    });

    const user = users[message.createdBy];

    return (
      <li key={message._id} className={klass}>
        <Link to={`/profile/${message.createdBy}`}>
          <div className="image" style={{ backgroundImage: `url(${ProfileThumbImage(user.image)})` }} />
        </Link>
        <div className="info">
          <div className="username">
            <Link to={`/profile/${user.username}`}>{user.username}</Link>
          </div>
          <div className="date">
            {moment(message.createdAt).fromNow()}
          </div>
        </div>
        <div className="message">
          {message.message}
        </div>
      </li>
    );
  }

  render() {
    const { loading, conversation, conversation: { messages = [] } } = this.props;

    if (loading) {
      return (
        <div className="chat-window">
          <Loader />
        </div>
      );
    }
    return (
      <div className="chat-window">
        <div className="messages" ref={(c) => { this.messagesBox = c; }}>
          {!loading && !conversation.messages ?
            <div className="no-messages">
              No messages.
            </div>
            : null
          }
          <ul>
            {messages.map(m => this.renderMessage(m))}
          </ul>
        </div>
        <Form conversationId={conversation._id} />
      </div>
    );
  }
}

export default createContainer(({ conversationId }) => {
  const messagesHandle = Meteor.subscribe('conversations.single', conversationId);
  const conversation = Conversations.findOne(conversationId) || {};

  const usersHandle = Meteor.subscribe('users.in', conversation.participants);

  const users = {};
  if (usersHandle.ready() && messagesHandle.ready()) {
    users[conversation.participants[0]] = Meteor.users.findOne(conversation.participants[0]);
    users[conversation.participants[1]] = Meteor.users.findOne(conversation.participants[1]);
  }

  return {
    conversation,
    users,
    loading: !messagesHandle.ready() || !usersHandle.ready()
  };
}, Window);
