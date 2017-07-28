import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { ChatMessages } from '/imports/api/chatMessages/chatMessages';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import Form from '/imports/ui/components/chat/Form.jsx';
import { ProfileThumbImage } from '/imports/ui/helpers/user';
import moment from 'moment';
import cx from 'classnames';

class Window extends Component {
  static propTypes = {
    messages: PropTypes.array.isRequired
  };

  componentDidMount() {
    // Update it every minute to refresh time ago
    this.updateTimer = setInterval(() => {
      this.forceUpdate();
    }, 60000);
  }

  componentWillReceiveProps() {
    this.scrollToBottomOnUpdate = this.messagesBox.scrollHeight - this.messagesBox.scrollTop === this.messagesBox.clientHeight;
  }

  componentDidUpdate() {
    const { messages } = this.props;
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
    this.messagesBox.scrollTop = this.messagesBox.scrollHeight;
  }

  renderMessage(message) {
    const klass = cx({
      right: Meteor.userId() === message.createdBy
    });

    return (
      <li key={message._id} className={klass}>
        <Link to={`/profile/${message.createdBy}`}>
          <div className="image" style={{ backgroundImage: `url(${ProfileThumbImage(message.userImage)})` }} />
        </Link>
        <div className="info">
          <div className="username">
            <Link to={`/profile/${message.username}`}>{message.username}</Link>
          </div>
          <div className="date">
            {moment(message.createdAt).fromNow()}
          </div>
        </div>
        <div className="message">
          {message.comment}
        </div>
      </li>
    );
  }

  render() {
    const { messages } = this.props;
    return (
      <div className="chat-window">
        <div className="messages" ref={(c) => { this.messagesBox = c; }}>
          <ul>
            {messages.map(m => this.renderMessage(m))}
          </ul>
        </div>
        <Form />
      </div>
    );
  }
}

export default createContainer(() => {
  const messagesHandle = Meteor.subscribe('chatMessages.list');
  return {
    messages: ChatMessages.find({ }, { sort: { createdAt: 1 } }).fetch() || [],
    loading: !messagesHandle.ready()
  };
}, Window);
