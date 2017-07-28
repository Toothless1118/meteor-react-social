import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router';
import PostForm from '/imports/ui/components/post/Form.jsx';
import PostList from '/imports/ui/components/post/List.jsx';
import LoginTo from '/imports/ui/components/global/LoginTo.jsx';
import NewsStand from '/imports/ui/components/global/NewsStand.jsx';

class HomePage extends Component {
  isLoggedIn() {
    return !!Meteor.userId();
  }

  render() {
    return (
      <div className="home-page">
        <div className="mobile-home-nav hidden-md hidden-lg">
          <Link to="/" activeClassName="active"><i className="fa fa-home" /></Link>
          <Link to="/newsstand" activeClassName="active"><i className="fa fa-rss" /></Link>
        </div>
        <div className="wrapper-home">
          <div className="row">
            {this.isLoggedIn() ? <PostForm /> : <LoginTo description="to journal your progress!" className="well" />}
          </div>
          <PostList />
        </div>
        <div className="sidebar hidden-xs hidden-sm">
          <NewsStand />
        </div>
      </div>
    );
  }
}

export default HomePage;
