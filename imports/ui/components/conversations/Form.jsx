import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import TextField from 'uniforms-bootstrap3/TextField';
import { message } from '/imports/api/conversations/methods';
import { conversationMessageFormSchema } from '/imports/api/conversations/conversations';
import Alert from '/imports/ui/helpers/notification';

export default class ChatForm extends Component {
  static propTypes = {
    onSave: PropTypes.func,
    conversationId: PropTypes.string.isRequired
  };

  save(doc) {
    const { onSave, conversationId } = this.props;
    message.call({ ...doc, conversationId }, (err) => {
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
          schema={conversationMessageFormSchema}
          onSubmit={(doc) => { this.save(doc); }}
          ref={(c) => { this.form = c; }}
        >
          <TextField
            name="message"
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
