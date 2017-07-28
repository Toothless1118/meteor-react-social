import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import moment from 'moment';
import { like, remove } from '/imports/api/comments/methods';
import { ProfileThumbImage } from '/imports/ui/helpers/user';
import EditComment from '/imports/ui/components/comment/Edit.jsx';
import Alert from '/imports/ui/helpers/notification';
import Autolinker from 'autolinker';
import { Roles } from 'meteor/nicolaslopezj:roles';

export default class Comment extends Component {
  static propTypes = {
    comment: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.like = this.like.bind(this);
    this.remove = this.remove.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.onCommentEdited = this.onCommentEdited.bind(this);
  }

  state = {
    editMode: false
  };

  isMyComment() {
    const { createdBy } = this.props.comment;
    return createdBy === Meteor.userId() || Roles.userHasRole(Meteor.userId(), 'admin');
  }

  like(e) {
    e.preventDefault();
    const { _id } = this.props.comment;
    like.call({ _id }, (err) => {
      if (err) {
        Alert.error(err);
      }
    });
  }

  toggleEdit(e) {
    e.preventDefault();
    this.setState({
      editMode: !this.state.editMode
    });
  }

  remove(e) {
    e.preventDefault();
    const { _id, postId } = this.props.comment;
    remove.call({ _id, postId });
  }

  onCommentEdited() {
    this.setState({
      editMode: false
    });
  }

  render() {
    const { comment } = this.props;
    return (
      <div className="comment row">
        <div className="col-sm-2 hidden-xs">
          <figure className="thumbnail pull-right">
            <Link to={`/profile/${comment.username}`}>
              <img className="img-responsive" src={ProfileThumbImage(comment.userImage)} alt={comment.username} />
            </Link>
          </figure>
        </div>
        <div className="col-sm-10">
          <div className="panel panel-default">
            <div className="panel-body">
              <div className="meta">
                <div className="user">
                  <i className="fa fa-user" />
                  <Link to={`/profile/${comment.username}`}> {comment.name}</Link>
                </div>
                <div className="time">
                  <i className="fa fa-clock-o" />
                  <span> {moment(comment.createdAt).fromNow()}</span>
                </div>
              </div>

              {!this.state.editMode ?
                <div className="comment-post" dangerouslySetInnerHTML={{ __html: Autolinker.link(comment.comment, { stripPrefix: false }) }} />
                : <EditComment comment={comment} onSave={this.onCommentEdited} />
              }
              {this.isMyComment() ?
                <div className="actions">
                  {comment.createdBy === Meteor.userId() ?
                    !this.state.editMode ?
                      <a href="#" className="edit" onClick={this.toggleEdit}>Edit</a> :
                      <a href="#" className="edit" onClick={this.toggleEdit}>Cancel</a> : null
                  }
                  <a href="#" className="delete" onClick={this.remove}>Delete</a>
                </div>
                : null
              }
              <a href="#" className="vote-up btn btn-danger btn-sm" onClick={this.like}>Vote <i className="fa fa-fw fa-caret-up" />{comment.likesCount}</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
