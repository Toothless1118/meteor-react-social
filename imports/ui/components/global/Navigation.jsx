import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import cx from 'classnames';
import NotificationsList from '/imports/ui/components/global/Notifications.jsx';
import Ad from '/imports/ui/components/global/Ad.jsx'

class Navigation extends Component {
  static propTypes = {
    user: PropTypes.object
  };

  static defaultProps = {
    user: null
  };

  constructor(props) {
    super(props);
    this.toggleSidebar = this.toggleSidebar.bind(this);
  }

  state = {
    mobileMenuOpen: false,
    chatBadgeCount: 0
  };

  componentDidMount() {
    this.updateUnreadChatCount();
    setInterval(() => {
      this.updateUnreadChatCount();
    }, 60000);
  }

  componentWillReceiveProps() {
    if (window.location.pathname === '/chat') {
      this.setState({
        chatBadgeCount: 0
      });
    }
  }

  updateUnreadChatCount() {
    if (Meteor.user() && Meteor.user().stats && Meteor.user().stats.lastViewedPublicChat) {
      Meteor.call('chatMessages.getUnreadChatMessagesCount', {
        lastViewed: Meteor.user().stats.lastViewedPublicChat
      }, (err, chatBadgeCount) => {
        if (!err) {
          this.setState({
            chatBadgeCount
          });
        }
      });
    }
  }

  /**
   * Logout user
   * @param e
   * @private
   */
  logout(e) {
    e.preventDefault();
    Meteor.logout();
    browserHistory.push('/');
  }

  /**
   * Tiggles a sidebar, only on mobile devices
   * @param e
   */
  toggleSidebar(e) {
    if (e) {
      e.preventDefault();
    }
    this.setState({
      mobileMenuOpen: !this.state.mobileMenuOpen
    });
  }

  /**
   * Render logged in user nav part
   * @returns {XML}
   */
  renderLoggedInMenu() {
    const { user } = this.props;
    return (
      <ul className="nav navbar-right top-nav hidden-xs">
        <li>
          <Link to={`/profile/${user.username}`} className="navbar-brand">{user.firstName}</Link>
        </li>
        <li>
          <Link to="/conversations" activeClassName="active" onClick={() => this.toggleSidebar()}>
            <i className="fa fa-fw fa-envelope" />
          </Link>
        </li>
        <NotificationsList />
        <li className="dropdown">
          <a href="#" className="dropdown-toggle">
            <i className="fa fa-gear" />
            <b className="caret" />
          </a>
          <ul className="dropdown-menu">
            <li>
              <Link to={`/profile/${user.username}`}>
                <i className="fa fa-fw fa-user" />
                Profile
              </Link>
            </li>
            <li>
              <Link to="/edit-profile">
                <i className="fa fa-fw fa-wrench" />
                Edit Profile
              </Link>
            </li>
            <li>
              <Link to="/profile/inslimSupport">
                <i className="fa fa-fw fa-heart" />
                Support
              </Link>
            </li>
            <li className="divider" />
            <li>
              <a href="/" onClick={this.logout}>
                <i className="fa fa-fw fa-power-off" />
                Log Out
              </a>
            </li>
          </ul>
        </li>

      </ul>
    );
  }

  /**
   * Render logged out user nav part
   * @returns {XML}
   */
  renderLoggedOutMenu() {
    return (
      <ul className="nav navbar-right top-nav hidden-xs">
        <li>
          <Link to="/login" className="navbar-brand">Login</Link>
        </li>
        <li>
          <Link to="/register" className="navbar-brand">Register</Link>
        </li>
      </ul>
    );
  }

  /**
   * Render a mobile nav
   */
  renderSidebar() {
    const { user } = this.props;
    const { chatBadgeCount } = this.state;
    return (
      <div className={cx('navbar-collapse', { collapse: !this.state.mobileMenuOpen })}>
        <ul className="nav navbar-nav side-nav">
          {user &&
            <li className="visible-xs">
              <Link to={`/profile/${user.username}`} onClick={() => this.toggleSidebar()}>
                <i className="fa fa-fw fa-user" />
                {user.firstName}
              </Link>
            </li>
          }
          <li>
            <Link to="/" activeClassName="active" onClick={() => this.toggleSidebar()}>
              <i className="fa fa-fw fa-comments-o" />
              Weight Loss Feed
            </Link>
          </li>
          <li>
            <Link to="/chat" activeClassName="active" onClick={() => this.toggleSidebar()}>
              <i className="fa fa-fw fa-comment" />
              Member Chat
              {chatBadgeCount && window.location.pathname !== '/chat' ? <span className="badge">{chatBadgeCount}</span> : null}
            </Link>
          </li>
          <li>
            <Link to="/videos" activeClassName="active" onClick={() => this.toggleSidebar()}>
              <i className="fa fa-fw fa-video-camera" />
              Watch Videos
            </Link>
          </li>
          <li>
            <Link to="/users" activeClassName="active" onClick={() => this.toggleSidebar()}>
              <i className="fa fa-fw fa-users" />
              Users
            </Link>
          </li>
          <li>
            <Link to="/ftpconnect" activeClassName="active" onClick={() => this.toggleSidebar()}>
              <i className="fa fa-fw fa-upload" />
              Ftp Connection
            </Link>
          </li>


          <li className="visible-xs">
            <Link to="/profile/inslimSupport" onClick={() => this.toggleSidebar()}>
              <i className="fa fa-fw fa-heart" />
              Support
            </Link>
          </li>
          <li className="visible-xs">
            <Link to="/profile/dovydas/edit" onClick={() => this.toggleSidebar()}>
              <i className="fa fa-fw fa-wrench" />
              Edit Profile
            </Link>
          </li>

          <li className="visible-xs">
            <a href="#" onClick={this.logout}>
              <i className="fa fa-fw fa-power-off" />
              Logout
            </a>
          </li>
          <li className="hidden-xs" style={{ width: '100%' }}>
            <Ad type="sidebar" />
          </li>
        </ul>
      </div>
    );
  }

  render() {
    const { user } = this.props;

    return (
      <nav className="navbar navbar-fixed-top" role="navigation">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle" onClick={this.toggleSidebar}>
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </button>

          <Link className="navbar-brand" to="/">
            <div className="logo">
              <span className="i-logo">in</span>
              <span className="s-logo">Slim</span>
            </div>
          </Link>

          <ul className="nav top-nav visible-xs">
            <NotificationsList />
          </ul>
        </div>

        <div className="col-lg-8 col-lg-offset-2">
          {user ? this.renderLoggedInMenu() : this.renderLoggedOutMenu()}
        </div>
        {this.renderSidebar()}
      </nav>
    );
  }
}

export default Navigation;
