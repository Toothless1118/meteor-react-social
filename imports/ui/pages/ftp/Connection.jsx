import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import moment from 'moment';
import cx from 'classnames';
import CircularProgressbar from 'react-circular-progressbar';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import NumField from 'uniforms-bootstrap3/NumField';
import TextField from 'uniforms-bootstrap3/TextField';
import { createContainer } from 'meteor/react-meteor-data';
import Alert from '/imports/ui/helpers/notification';
import {Folders, folderFormSchema}  from '/imports/api/ftp/folders';
import {Connections, connectionFormSchema}  from '/imports/api/ftp/connections';
//import {saveConnection} from '/imports/api/ftp/methods';
import {Treebeard} from 'react-treebeard';
import TreeView from 'treeview-react-bootstrap';
import UploadFtpFile from '/imports/ui/components/global/UploadFtpFile.jsx';

import FtpLogin from './Ftplogin.jsx';
import FtpDir from './Ftpdir.jsx';

class FtpConnection extends Component {
  state = {
    connection: null
  };
  constructor(props){
      super(props);
      this.state = { dir: '', host: null, username: null, password: null, files: [], connected: false };
  }

  handleConnect(connectionInfo) {
    console.log('handleConnect', connectionInfo);
    this.setState({...connectionInfo});
  }

  handleSelect(dir) {
    const { host, username, password } = this.state;
    this.setState({ dir });
    
    if(host && username) {
      Meteor.call('ftp.createConnection',  { host, username, password, dir } ,  Meteor.bindEnvironment((err, res) => {
        if (err) {
            Alert.error(err);
        } else {
            Alert.success('FTP connection has been updated.');
        }
      }));
    }
  }

  doUpload() {
    const { host, username, password, dir } = this.state;
    console.log('uploader', this.uploader);
    if(this.uploader.files && this.uploader.files.length) {
      const { name, url } = this.uploader.files[0];
      Meteor.call('ftp.uploadFile', { host, username, password, name, url, dir },  Meteor.bindEnvironment((err, res) => {
        if (err) {
            Alert.error(err);
        } else {
            Alert.success('FTP file has been uploaded.');
        }
      }));
    }
  }

  render() {
    return(
      <div>
        <FtpLogin dir={this.state.dir} onConnect={(doc) => this.handleConnect(doc)}/>
        { this.state.connected ?
          <div>
            <FtpDir onSelect={(dir) => this.handleSelect(dir)}/>
            <UploadFtpFile ref={(c) => { this.uploader = c; }} type="ftpFiles" enableTitle={false} name="ftpFiles" />
            <button onClick={() => this.doUpload()}>Upload Files</button>
          </div>
          : null
        }
      </div>
    );
  }
}

export default FtpConnection;
