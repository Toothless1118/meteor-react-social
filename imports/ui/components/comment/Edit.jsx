import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import TextField from 'uniforms-bootstrap3/TextField';
import { edit } from '/imports/api/comments/methods';
import { commentFormSchema } from '/imports/api/comments/comments';
import Alert from '/imports/ui/helpers/notification';

export default class CommentForm extends Component {
  static propTypes = {
    comment: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired
  };

  save(doc) {
    const { comment, onSave } = this.props;
    edit.call({ ...doc, commentId: comment._id }, (err) => {
      if (err) {
        Alert.error(err);
      } else {
        this.form.reset();
        onSave();
      }
    });
  }

  render() {
    const { comment } = this.props;
    return (
      <div className="comment-edit">
        <AutoForm
          schema={commentFormSchema}
          model={{ comment: comment.comment }}
          onSubmit={(doc) => { this.save(doc); }}
          ref={(c) => { this.form = c; }}
        >
          <TextField
            showInlineError
            name="comment"
            placeholder="A comment.."
            inputClassName="small"
            label={false}
          />
          <button className="btn btn-default submit-comment-button">Submit</button>
        </AutoForm>
      </div>
    );
  }
}
