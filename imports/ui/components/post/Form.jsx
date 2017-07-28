import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import LongTextField from 'uniforms-bootstrap3/LongTextField';
import { postFormSchema } from '/imports/api/posts/posts';
import { create, edit as editMethod } from '/imports/api/posts/methods';
import { throttle } from 'lodash';
import ExternalLink from '/imports/ui/components/post/ExternalLink.jsx';
import { getURLs } from '/imports/ui/helpers/string';
import Alert from '/imports/ui/helpers/notification';
import UploadForm from '/imports/ui/components/global/UploadFile.jsx';

class Form extends Component {
  static propTypes = {
    edit: PropTypes.bool,
    post: PropTypes.object,
    onSave: PropTypes.func
  };

  static defaultProps = {
    edit: false,
    post: { }
  };

  constructor(props) {
    super(props);
    this.onKeyUp = throttle(this.onKeyUp.bind(this), 1000);
    this.toggleUploadForm = this.toggleUploadForm.bind(this);
    this.save = this.save.bind(this);
  }
  state = {
    url: this.props.post.link ? this.props.post.link.url : null,
    uploadFormOpen: false
  };

  onKeyUp() {
    const urls = getURLs(this.input.value);
    if (urls && this.state.url !== urls[0]) {
      this.setState({
        url: urls[0]
      });
    }
  }

  save(doc) {
    const { edit, onSave, post } = this.props;
    const method = !edit ? create : editMethod;
    const postId = edit ? { postId: post._id } : undefined;

    method.call({ ...doc, images: this.images ? this.images.state.value : [], ...postId }, (err) => {
      if (err) {
        Alert.error(err);
      } else {
        this.form.reset();
        this.setState({
          url: null
        });
        if (onSave) {
          onSave();
        }
      }
    });
  }

  toggleUploadForm(e) {
    e.preventDefault();
    this.setState({
      uploadFormOpen: !this.state.uploadFormOpen
    });
  }

  getModel() {
    const { edit, post } = this.props;
    return !edit ? {} : { post: post.post };
  }

  render() {
    const { url, uploadFormOpen } = this.state;
    const { post } = this.props;
    const hasImages = !!(post.images || []).length;
    return (
      <div className="well form-submit-outline post-form">
        <AutoForm schema={postFormSchema} model={this.getModel()} onSubmit={this.save} ref={(c) => { this.form = c; }} showInlineError>
          <LongTextField
            name="post"
            placeholder="What are you doing to lose weight today? Log your activities and take pics of your weight loss meals."
            label={false}
            inputRef={(c) => { if (c) { this.input = c; c.onkeyup = this.onKeyUp; } }}
          />
          {url ?
            <ExternalLink url={url} edit />
            : null
          }

          {uploadFormOpen || hasImages ?
            <UploadForm
              ref={(c) => { this.images = c; }}
              type="postPictures"
              name="images"
              max={5}
              files={post.images || []}
              multiple
            /> :
            null
          }
          <div className="buttons">
            <input type="submit" className="btn btn-danger btn-lg pull-right" value="Submit" />
            <a href="/" className="btn btn-default btn-lg pull-right file-upload-btn" onClick={this.toggleUploadForm}>
              <i className="fa fa-camera" />
            </a>
          </div>
        </AutoForm>
      </div>
    );
  }
}

export default Form;
