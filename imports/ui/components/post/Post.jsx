import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router';
import { remove, like } from '/imports/api/posts/methods';
import ExternalLink from '/imports/ui/components/post/ExternalLink.jsx';
import CommentForm from '/imports/ui/components/comment/Form.jsx';
import CommentsList from '/imports/ui/components/comment/List.jsx';
import Gallery from '/imports/ui/components/post/Gallery.jsx';
import { ProfileThumbImage } from '/imports/ui/helpers/user';
import PostForm from '/imports/ui/components/post/Form.jsx';
import Alert from '/imports/ui/helpers/notification';
import Autolinker from 'autolinker';
import cx from 'classnames';
import { Roles } from 'meteor/nicolaslopezj:roles';

class Post extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
    showComments: PropTypes.bool
  };

  static defaultProps = {
    showComments: false
  }

  constructor(props) {
    super(props);
    this.remove = this.remove.bind(this);
    this.like = this.like.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.toggleComments = this.toggleComments.bind(this);
    this.onCommentSave = this.onCommentSave.bind(this);
    this.onPostEdited = this.onPostEdited.bind(this);
  }

  state = {
    editMode: false,
    showComments: this.props.showComments
  };

  isMyPost() {
    const { post } = this.props;
    return post.createdBy === Meteor.userId() || Roles.userHasRole(Meteor.userId(), 'admin');
  };

  remove(e) {
    e.preventDefault();
    const { _id } = this.props.post;
    remove.call({ id: _id });
  }

  like(e) {
    e.preventDefault();
    const { _id } = this.props.post;
    like.call({ id: _id }, (err) => {
      if (err) {
        Alert.error(err);
      }
    });
  }

  toggleEditMode(e) {
    e.preventDefault();
    this.setState({
      editMode: !this.state.editMode
    });
  }

  onPostEdited() {
    this.setState({
      editMode: false
    });
  }

  toggleComments(e) {
    if (e) {
      e.preventDefault();
    }
    this.setState({
      showComments: !this.state.showComments
    });
  }

  onCommentSave() {
    if (!this.state.showComments) {
      this.toggleComments();
    }
  }


  renderBy(username, type, name) {
    const link = <Link to={`/profile/${username}`}>{name}</Link>;
    switch (type) {
      case 'newGoal':
        return <span className="author">{link} set their new goal!</span>;
      case 'lostWeight':
        return <span className="author">{link} updated their goal!</span>;
      default:
        return <span className="author">by {link}</span>;
    }
  }

  renderGraphic(post) {
    switch (post.type) {
      case 'lostWeight':
        return <div className="graphic-wrapper"><div className="graphic"><span>I lost</span><span className="amount">{post.data.weightDifference}</span><span>lbs!</span></div></div>;
      default:
        return null;
    }
  }

  render() {
    const { post } = this.props;
    const klass = cx('post-wrapper', {
      [post.type]: !!post.type
    });
    return (
      <div className={klass}>
        <div className="feed-post row">
          <div className="col-sm-12 col-md-2 hidden-xs hidden-sm">
            <figure className="thumbnail pull-right">
              <Link to={`/profile/${post.username}`}>
                <img className="img-responsive" src={ProfileThumbImage(post.userImage)} />
              </Link>
            </figure>
          </div>

          {this.renderGraphic(post)}
          <div className="col-sm-12 col-md-10 ">
            <div className="meta">
              <time className="date">
                <i className="fa fa-clock-o" />
                <span>
                  {moment(post.createdAt).fromNow()}
                </span>
              </time>
              {this.renderBy(post.username, post.type, post.name)}
            </div>

            <div className="content">
              {!this.state.editMode ?
                <div>
                  <div dangerouslySetInnerHTML={{ __html: Autolinker.link(post.post, { stripPrefix: false, email: false }) }} />
                  {post.images && post.images.length && <Gallery images={post.images} />}
                  {post.link ? <ExternalLink link={post.link} /> : null }
                </div> :
                <PostForm post={post} onSave={this.onPostEdited} edit />
              }
            </div>
            {this.isMyPost() ?
              <div className="actions">
                {!post.type && post.createdBy === Meteor.userId() ?
                  !this.state.editMode ?
                    <a href="/" className="edit" onClick={this.toggleEditMode}>Edit</a> :
                    <a href="/" className="edit" onClick={this.toggleEditMode}>Cancel</a> :
                  null
                }
                <a href="/" className="delete" onClick={this.remove}>Delete</a>
              </div>
              : null
            }
          </div>

          <div className="buttons">
            <a href="/" className="view-comments" onClick={this.toggleComments}> Comments ({post.commentsCount})<i className="fa fa-fw fa-caret-down" /></a>
            <button className="btn btn-sm btn-default like" onClick={this.like}>
              <i className="fa fa-heart big-icon" />
              <span>Like {post.likesCount}</span>
            </button>
          </div>
        </div>
        <CommentForm postId={post._id} onSave={this.onCommentSave} />
        {this.state.showComments && <CommentsList postId={post._id} search={{ postId: post._id }} />}
      </div>
    );
  }
}

export default Post;
