import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import TextField from 'uniforms-bootstrap3/TextField';
import { create } from '/imports/api/chatMessages/methods';
import { chatMessageFormSchema } from '/imports/api/chatMessages/chatMessages';
import Alert from '/imports/ui/helpers/notification';

export default class ChatForm extends Component {
  static propTypes = {
    onSave: PropTypes.func
  };

  save(doc) {
    const { onSave } = this.props;
    create.call({ ...doc }, (err) => {
      if (err) {
        Alert.error(err);
      } else {
        this.form.reset();
        if (onSave) {
          onSave();
        }
        setTimeout(() => {
          this.commentInput.focus();
        }, 500);
      }
    });
  }

  render() {
    return (
      <div className="chat-form">
        <AutoForm
          schema={chatMessageFormSchema}
          onSubmit={(doc) => { this.save(doc); }}
          ref={(c) => { this.form = c; }}
        >
          <TextField
            name="comment"
            placeholder="Type a message..."
            label={false}
            inputRef={(c) => { this.commentInput = c; }}
          />
          <button type="submit"><i className="fa fa-send" /></button>
        </AutoForm>
      </div>
    );
  }
}
