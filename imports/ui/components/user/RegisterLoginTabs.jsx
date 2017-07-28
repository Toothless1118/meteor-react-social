import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import RegisterForm from '/imports/ui/components/user/RegisterForm.jsx';
import LoginForm from '/imports/ui/components/user/LoginForm.jsx';
import { find } from 'lodash';
import { browserHistory } from 'react-router';

export default class RegisterLoginTabs extends Component {
  static defaultProps = {
    openTab: 'login'
  };

  static propTypes = {
    openTab: PropTypes.string
  };

  state = {
    openTab: this.props.openTab
  };

  tabs = [
    {
      id: 'login',
      title: 'Login',
      render: <LoginForm />
    }, {
      id: 'register',
      title: 'Create Account',
      render: <RegisterForm />
    }
  ];

  changeTab(newTab, e) {
    e.preventDefault();
    browserHistory.replace(`/${newTab}`);
  }

  render() {
    const { openTab } = this.state;

    return (
      <div className="register-login-tabs centered">
        <div className="modal-header text-center">
          <h1>Be A Part of a Great Network!</h1>
        </div>
        <div className="modal-body col-md-6 col-md-offset-3">
          <div className="well">
            <ul className="nav nav-tabs">
              {this.tabs.map(tab =>
                <li className={cx({ active: openTab === tab.id })} key={tab.id}>
                  <a href="/" onClick={this.changeTab.bind(this, tab.id)}>{tab.title}</a>
                </li>
              )}
            </ul>
            <div className="tab-content">
              <div className="tab-pane active">
                {find(this.tabs, { id: openTab }).render}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
