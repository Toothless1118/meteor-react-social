import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import { Notifications } from '/imports/api/notifications/notifications';
import { clear } from '/imports/api/notifications/methods';

const NotificationsList = ({ notifications }) => {
  if (notifications.length) {
    document.title = `(${notifications.length}) inSlim | A Weight Loss Resource`;
  } else {
    document.title = 'inSlim | A Weight Loss Resource';
  }
  const clearNotification = (id) => {
    clear.call({ id });
  };

  const getLink = (n) => {
    const { type, entity, data, docId } = n;
    let link = `/post/${docId}`;
    let description = '';

    switch (entity) {
      case 'comment':
        switch (type) {
          case 'like':
            description = `${data.username} has liked your comment.`;
            link = `/post/${data.postId}`;
            break;
          case 'add':
            description = `${data.username} has made a comment on  your post.`;
            link = `/post/${data.postId}`;
            break;
          default:
            return null;
        }
        break;

      case 'post':
        switch (type) {
          case 'like':
            description = `${data.username} has liked your post.`;
            break;
          default:
            return null;
        }
        break;
      default:
        return null;
    }

    return <Link to={link} onClick={clearNotification.bind(this, n._id)}>{description}</Link>;
  };

  if (!notifications.length) {
    return (
      <li className="dropdown">
        <a href="#">
          <i className="fa fa-bell" />
        </a>
        <ul className="dropdown-menu alert-dropdown">
          <li>
            <a>No Notifications</a>
          </li>
        </ul>
      </li>
    );
  }

  return (
    <li className="dropdown has-notifications">
      <a href="#">
        <i className="fa fa-bell" />
        <span className="badge">{notifications.length}</span>
      </a>
      <ul className="dropdown-menu alert-dropdown">
        {notifications.map(n =>
          <li key={n._id}>
            {getLink(n)}
          </li>
        )}
      </ul>
    </li>
  );
};

export default createContainer(() => {
  const notificationsHandle = Meteor.subscribe('notifications.unread');
  return {
    notifications: Notifications.find({ read: false, receiverId: Meteor.userId() }, { sort: { createdAt: -1 } }).fetch() || [],
    loading: !notificationsHandle.ready()
  };
}, NotificationsList);
