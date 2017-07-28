import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import TextField from 'uniforms-bootstrap3/TextField';
import { create } from '/imports/api/comments/methods';
import { commentFormSchema } from '/imports/api/comments/comments';
import LoginTo from '/imports/ui/components/global/LoginTo.jsx';
import Alert from '/imports/ui/helpers/notification';

export default class CommentForm extends Component {
  static propTypes = {
    postId: PropTypes.string.isRequired,
    onSave: PropTypes.func
  };

  save(doc) {
    const { postId, onSave } = this.props;
    create.call({ ...doc, postId }, (err) => {
      if (err) {
        Alert.error(err);
      } else {
        this.form.reset();
        if (onSave) {
          onSave();
        }
      }
    });
  }

  render() {
    return (
      <div className="comment-form">
        {Meteor.userId() ?
          <AutoForm
            schema={commentFormSchema}
            onSubmit={(doc) => { this.save(doc); }}
            ref={(c) => { this.form = c; }}
          >
            <TextField
              showInlineError
              name="comment"
              placeholder="Add a comment.."
              inputClassName="small"
              label={false}
            />
            <button className="btn btn-default submit-comment-button">Submit</button>
          </AutoForm>
          : <LoginTo description="to add a comment!" />
        }
      </div>
    );
  }
}
