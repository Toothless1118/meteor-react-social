import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Alert from 'react-s-alert';
import { UserLoginPage, TrialPage } from '/imports/ui/pages';
import UnverifiedAccountNotice from '/imports/ui/components/user/UnverifiedAccountNotice.jsx';
import ConnectionNotification from '../components/global/ConnectionNotification.jsx';
import Loading from '../components/global/PageLoader.jsx';
import Navigation from '../components/global/Navigation.jsx';
import QuickChat from '/imports/ui/components/conversations/QuickChat.jsx';

const CONNECTION_ISSUE_TIMEOUT = 5000;

export default class App extends Component {

  static propTypes = {
    user: PropTypes.object,      // current meteor user
    connected: PropTypes.bool,   // server connection status
    loading: PropTypes.bool,     // subscription status
    children: PropTypes.element.isRequired, // matched child route component
    location: PropTypes.object.isRequired  // current router location
  };

  static defaultProps = {
    user: null,
    connected: true,
    loading: false
  };

  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      showConnectionIssue: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      /* eslint-disable react/no-did-mount-set-state */
      this.setState({ showConnectionIssue: true });
    }, CONNECTION_ISSUE_TIMEOUT);
  }


  render() {
    const { showConnectionIssue } = this.state;
    const {
      user,
      connected,
      loading,
      children,
      location
    } = this.props;

    // clone route components with keys so that they can
    // have transitions
    let clonedChildren = children && React.cloneElement(children, {
      key: location.pathname
    });

    if (!loading) {
      if (location.pathname === '/videos') {
        if (!user) {
          clonedChildren = <UserLoginPage />;
        } else if (!user.subscription || user.subscription.status === 'canceled') {
          clonedChildren = <TrialPage />;
        }
      }
    }

    if (loading) {
      return <Loading key="loading" />;
    }
    return (
      <div id="wrapper">
        <Navigation user={user} />
        <div id="page-wrapper">
          {user && !user.emails[0].verified && ['/chat', '/conversations'].indexOf(window.location.pathname) === -1 && <UnverifiedAccountNotice />}
          <ReactCSSTransitionGroup
            transitionName="fade"
            transitionEnterTimeout={200}
            transitionLeaveTimeout={200}
          >
            {loading
              ? <Loading key="loading" />
              : clonedChildren}
          </ReactCSSTransitionGroup>
        </div>
        <Alert position="top-right" />
        {user && ['/chat', '/conversations'].indexOf(window.location.pathname) === -1 ? <QuickChat /> : null}
      </div>
    );
  }
}
