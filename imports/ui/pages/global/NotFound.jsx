import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';

export default class NotFoundPage extends Component {
  componentDidMount() {
    if (!Meteor.userId()) {
      browserHistory.replace('/home.html');
    }
  }

  render() {
    return (
      <div className="not-found jumbotron text-center">
        <h2>404</h2>
        <p>Sorry, we couldn't find a page at this address.</p>
      </div>
    );
  }
}
