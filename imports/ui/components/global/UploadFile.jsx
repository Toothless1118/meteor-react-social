import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { each, uniqueId, find, remove } from 'lodash';
import cx from 'classnames';
import { Slingshot } from 'meteor/edgee:slingshot';
import { ProfileThumbImage } from '/imports/ui/helpers/user';
import { PostThumbImage } from '/imports/ui/helpers/post';
import Dropzone from 'react-dropzone';
import Sortable from 'sortablejs';
import { T, t } from '/imports/ui/helpers/translate';
import Alert from '/imports/ui/helpers/notification';

export default class UploadForm extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    multiple: PropTypes.bool,
    max: PropTypes.number,
    maxSize: PropTypes.number,
    enableTitle: PropTypes.bool,
    files: PropTypes.array
  };

  static defaultProps = {
    multiple: false,
    maxSize: Infinity,
    enableTitle: true,
    files: [],
    max: 1
  };

  constructor(props) {
    super(props);
    this.state = { value: [] };
    this.files = [];
    this.uploadFiles = this.uploadFiles.bind(this);
    this.processedFiles = this.processedFiles.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.initiateSortable = this.initiateSortable.bind(this);

    (this.props.files || []).map(f => {
      const key = uniqueId('file_');
      const url = props.type === 'postPictures' ? PostThumbImage(f.url) : ProfileThumbImage(f.url);
      const filesObject = {
        progress: 100,
        status: 2,
        preview: url,
        url,
        key
      };

      const valueObject = { url };
      if (f.title) {
        filesObject.title = f.title;
        valueObject.title = f.title;
      }

      this.files.push(filesObject);
      this.state.value.push(valueObject);
    });
  }

  componentDidUpdate() {
    if (this.files.length) {
      this.initiateSortable();
    }
  }


  uploadFiles(files) {
    if (this.files.length + files.length > this.props.max) {
      console.log(this.files.length, files.length, this.props.max);
      Alert.error(t('common.uploader.max_limit', { count: this.props.max }))
      return false;
    }

    each(files, (file) => {
      file.key = uniqueId('file_');
      this.files.push({
        progress: 0,
        status: 0,
        key: file.key,
        preview: file.preview
      });
    });


    files.map((file) => {
      this.uploadFile(file);
    });
  }

  uploadFile(file) {
    const f = find(this.files, { key: file.key })
    f.progressInterval = setInterval(() => {
      f.progress = parseInt(this.uploader.progress() * 100);
      f.status = 1;
      this.forceUpdate();
    }, 1000);

    this.uploader = new Slingshot.Upload(this.props.type);

    this.uploader.send(file, (err, downloadUrl) => {
      clearInterval(f.progressInterval);
      if (err) {
        Alert.error(err);
        f.status = 3;
      } else {
        f.status = 2;
        f.progress = 100;
        f.url = downloadUrl;
        this.state.value.push({
          url: downloadUrl
        });
      }
      this.forceUpdate();
    });
  }

  removeImage(url, e) {
    e.preventDefault();
    remove(this.files, f => f.url === url);
    remove(this.state.value, f => f.url === url);
    this.forceUpdate();
  }

  onFilenameChange(url, e) {
    const file = find(this.state.value, { url });
    if (e.target.value) {
      file.title = e.target.value;
    } else {
      delete file.title;
    }
  }

  move(arr, oldIndex, newIndex) {
    if (newIndex >= arr.length) {
      let k = newIndex - arr.length;
      while ((k--) + 1) {
        arr.push(undefined);
      }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
  }

  initiateSortable() {
    this.sortable = new Sortable(this.sortableDiv, {
      draggable: '.draggable',
      animation: 500,
      onUpdate: (e) => {
        const { oldIndex, newIndex } = e;
        this.state.value = this.move(this.state.value, oldIndex, newIndex);
        this.files = this.move(this.files, oldIndex, newIndex);
      }
    });
  }

  processedFiles() {
    const statuses = [
      { name: t('common.uploader.status.queued'), klass: 'queued' },
      { name: t('common.uploader.status.uploading'), klass: 'uploading' },
      { name: t('common.uploader.status.uploaded'), klass: 'uploaded' },
      { name: t('common.uploader.status.failed'), klass: 'failed' }
    ];

    return (
      <div className="processed-files">
        <div className="row" ref={(c) => { this.sortableDiv = c; }}>
          {this.files.map(file =>
            <div className="col-md-4 col-sm-6 draggable" key={file.key}>
              <div className={`file ${statuses[file.status].klass}`}>
                <div className="image" style={{ backgroundImage: `url(${file.preview})` }}>
                  <a className="remove-btn" href="#" onClick={this.removeImage.bind(this, file.url)}>
                    <i className="fa fa-trash" />
                  </a>
                </div>
                {this.props.enableTitle ?
                  <input type="text" placeholder="Title" defaultValue={file.title} onChange={this.onFilenameChange.bind(this, file.url)} />
                  : null
                }
                <div className="progress-bar" role="progressbar" aria-valuenow={file.progress} aria-valuemin="0" aria-valuemax="100" style={{ width: `${file.progress}%` }}>
                  <span className="sr-only"><T progress={file.progress}>common.uploader.x_complete</T></span>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    );
  }


  render() {
    const hasFiles = !!this.files.length;
    const { multiple } = this.props;

    return (
      <div className={cx('upload-form', { 'has-files': hasFiles, multiple, single: !multiple })}>
        <Dropzone
          onDrop={this.uploadFiles}
          className="upload-drop-zone"
          multiple={multiple}
          maxSize={this.maxSize}
          activeClassName="active"
        >
          <div className="text">Click here or drop file.</div>
        </Dropzone>

        {this.files.length ? this.processedFiles() : null }
      </div>
    );
  }
}

