import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { find, without, uniq, flatten } from 'lodash';
import { ProfileThumbImage } from '/imports/ui/helpers/user';
import { Conversations } from '/imports/api/conversations/conversations';
import { onlineStatusBadge } from '/imports/ui/helpers/user';
import { markRead } from '/imports/api/conversations/methods';

class Users extends Component {
  static propTypes = {
    users: PropTypes.array.isRequired,
    conversations: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  state = {
    activeConversation: null
  };

  componentWillReceiveProps({ loading, conversations, onLoad }) {
    if (!loading) {
      let badges = 0;
      conversations.map(conv => {
        badges += ((conv.badgesCount || {})[Meteor.userId()] || 0);
      });
      onLoad({ hasItems: !!conversations.length, badgesCount: badges });
    }
  }

  componentDidUpdate({ loading, conversations, users }) {
    if (!this.state.activeConversation && conversations[0]) {
      const user = find(users, { _id: without(conversations[0].participants, Meteor.userId())[0] });
      if (user) {
        this.onClick(conversations[0]);
      }
    }
  }

  onClick(conversation) {
    const { users } = this.props;

    const isDifferentConversation = this.state.activeConversation !== conversation._id;

    const user = find(users, { _id: without(conversation.participants, Meteor.userId())[0] });


    if (isDifferentConversation) {
      if (this.props.onClick) {
        this.props.onClick({ user, conversation });
      }
      this.setState({
        activeConversation: conversation._id
      });
      markRead.call({ conversationId: conversation._id });
    }
  }

  renderUser(conversation) {
    const { users } = this.props;

    const user = find(users, { _id: without(conversation.participants, Meteor.userId())[0] }) || {};

    const klass = cx({
      active: this.state.activeConversation === conversation._id
    });

    const badgesCount = (conversation.badgesCount || {})[Meteor.userId()] || 0;

    return (
      <li key={conversation._id} className={klass} onClick={() => { this.onClick(conversation); }}>
        <div className="image" style={{ backgroundImage: `url(${ProfileThumbImage(user.image)})` }}>
          {onlineStatusBadge(user.status.online)}
          {badgesCount ? <span className="badge">{badgesCount}</span> : null}
        </div>
        <div className="info">
          <div className="username">{user.firstName} {user.lastName}</div>
          <div className="text">{conversation.lastMessage}</div>
        </div>
      </li>
    );
  }

  render() {
    const { loading, conversations, onLoad } = this.props;
    if (loading) {
      return null;
    }

    return (
      <div className="chat-users">
        <ul>
          {conversations.map(u => this.renderUser(u))}
        </ul>
      </div>
    );
  }
};

export default createContainer(() => {
  const conversationsHandle = Meteor.subscribe('conversations.list');

  const conversations = Conversations.find({ participants: Meteor.userId() }, { fields: { participants: 1 } }).fetch();
  const userIds = uniq(flatten(conversations.map(c => c.participants)));

  const usersHandle = Meteor.subscribe('users.in', userIds);

  return {
    conversations: Conversations.find({ participants: Meteor.userId() }, { sort: { updatedAt: -1 } }).fetch(),
    users: Meteor.users.find({}).fetch(),
    loading: !conversationsHandle.ready() || !usersHandle.ready()
  };
}, Users);
