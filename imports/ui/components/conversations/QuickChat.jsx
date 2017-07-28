import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { without } from 'lodash';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { openConversationsStore } from '/imports/ui/helpers/store';
import Users from '/imports/ui/components/conversations/Users.jsx';
import Window from '/imports/ui/components/conversations/Window.jsx';
import { Conversations, conversationMessageFormSchema } from '/imports/api/conversations/conversations';
import Loader from '/imports/ui/components/global/ComponentLoader.jsx';
import { markRead } from '/imports/api/conversations/methods';

export default class QuickChat extends Component {
  state = {
    expanded: false,
    conversation: null,
    hasItems: false,
    badgesCount: 0
  };

  constructor(props) {
    super(props);
    this.toggleView = this.toggleView.bind(this);
    this.onLoad = this.onLoad.bind(this);
  }

  componentDidMount() {
    openConversationsStore.subscribe(() => {
      this.setState({
        conversation: openConversationsStore.getState(),
        expanded: true
      });
    });
  }

  changeConversation(conversation) {
    this.setState({
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
      if (this.state.expanded) {
        markRead.call({ conversationId: this.state.conversation._id });
      }
    }
  }

  toggleView(e) {
    e.preventDefault();
    const { expanded, conversation } = this.state;

    if (!expanded && conversation) {
      markRead.call({ conversationId: conversation._id });
    }
    this.setState({
      expanded: !expanded
    });
  }

  render() {
    const { badgesCount, expanded, hasItems, conversation } = this.state;

    return (
      <div className={cx('quick-chat-wrapper', { expanded, hide: !hasItems })}>
        <div className="quick-chat-window">
          <a className="toggle-view" onClick={this.toggleView}>
            {!expanded ?
              <i className="fa fa-envelope" />
              : <i className="fa fa-close" />
            }
            {badgesCount && !expanded ? <span className="badge">{badgesCount}</span> : null}
          </a>
          <Users onClick={({ conversation }) => { this.changeConversation(conversation); }} onLoad={this.onLoad} />
          {conversation && <Window conversationId={conversation._id} />}
        </div>
      </div>
    );
  }
}
