import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import ProfileCard from '/imports/ui/components/user/ProfileCard.jsx';
import { ReactiveVar } from 'meteor/reactive-var';

const search = new ReactiveVar('');

class LastActiveList extends Component {
  static propTypes = {
    users: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.searchUsers = this.searchUsers.bind(this);
  }

  searchUsers() {
    search.set(this.searchInput.value);
  }

  render() {
    const { users, loading } = this.props;
    return (
      <div className="last-active-users wrapper-large">
        <div className="text-center">
          <h3>Most Recent Active Users</h3>
          <hr />
          <input className="search" type="text" ref={(c) => { this.searchInput = c; }} onKeyUp={this.searchUsers} placeholder="Search..." />
        </div>
        <div className="row">
          {!loading && !users.length ?
            <div className="no-results">No users found</div>
            : null
          }
          {users.map(user =>
            <div className="col-md-4" key={user._id}>
              <ProfileCard user={user} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default createContainer(() => {
  const usersHandle = Meteor.subscribe('users.lastActive', { search: search.get() });
  return {
    users: Meteor.users.find({
      accountStatus: 'active',
      username: { $regex: search.get(), $options: 'i' }
    }, { sort: { 'status.lastLogin.date': -1, createdAt: -1 } }).fetch(),
    loading: !usersHandle.ready()
  };
}, LastActiveList);
