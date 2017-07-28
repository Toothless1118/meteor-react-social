import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Posts } from '/imports/api/posts/posts';
import { ProfileThumbImage } from '/imports/ui/helpers/user';
import Post from '/imports/ui/components/post/Post.jsx';

class SinglePost extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired
  };

  render() {
    const { post, loading } = this.props;
    if (loading) {
      return null;
    }

    return (
      <div className="single-post-page">
        <div className="jumbotron text-center">
          <Link to={`/profile/${post.username}`}>
            <img className="circular image" alt="..." src={ProfileThumbImage(post.userImage)} />
          </Link>

          <h3><Link to={`/profile/${post.username}`}>{post.username} posted</Link></h3>
        </div>
        <div className="wrapper-large">
          <Post post={post} showComments />
        </div>
      </div>
    );
  }
}

export default createContainer(({ params: { id } }) => {
  const postHandle = Meteor.subscribe('posts.single', id);
  return {
    post: Posts.findOne(id) || {},
    loading: !postHandle.ready()
  };
}, SinglePost);
