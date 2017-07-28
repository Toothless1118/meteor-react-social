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


class FtpLogin extends Component {
    state = {
        connecting: false,
        connected: false,
        host: null, 
        username: null, 
        password: null,
    };

    constructor(props){
      super(props);
      this.onConnectFTP = this.onConnectFTP.bind(this);
    }
    
    componentWillReceiveProps(nextProps) {
        const { connections } = nextProps;
        const { host, username, password } = this.state;
        console.log('componentWillReceiveProps', this.state.connecting);
        if (this.state.connecting) {
            if (connections && connections.length) {
                if (connections[0].status == 'success') {
                    console.log('aaa');
                    Alert.success('FTP connection has been updated.');
                    this.props.onConnect({host, username, password, connected:true});
                }
                else if (connections[0].status == 'error') {
                    Alert.error('Your Network is slow or FTP credential is not valid.');
                    this.props.onConnect({host, username, password, connected:false});
                }
                this.setState({ connecting: false });
            }
        }
    }

    onConnectFTP(doc) {
        const {host, username, password} = doc;
        Meteor.call('ftp.createConnection',  { host, username, password, dir: '.'} ,  Meteor.bindEnvironment((err, res) => {}));
        
        this.setState({ connecting: true, host, username, password });
    }

    render() {
        const model = {
            host: '',
            username: '',
            password: '',
        };
        console.log('connecting', this.state.connecting);
        return(
            <div>
                <AutoForm schema={connectionFormSchema} model={model} onSubmit={this.onConnectFTP} label={false} showInlineError>
                <div className="ui massive message blue">
                    <h3 className="text-center">Ftp connection page</h3>
                </div>
                <div className="first-last-name row">
                    <TextField name="host" grid="col-xs-12 col-md-12" inputClassName="input-lg" placeholder="Host" />
                    <TextField name="username" grid="col-xs-12 col-md-12" inputClassName="input-lg" placeholder="Username" />
                    <TextField name="password" grid="col-xs-12 col-md-12" inputClassName="input-lg" placeholder="Password" />
                </div>
                <input type="submit" className="btn btn-primary btn-lg btn-block" value="FTP Connect" />
                </AutoForm>            
            </div>
        );
    }
}
export default createContainer(({}) => {
  const user =  Meteor.user();
  const connectionsHandle = Meteor.subscribe('connections.list');
  return {
   connections: Connections.find({}).fetch(),
   loading: !connectionsHandle.ready()
  };
}, FtpLogin);
