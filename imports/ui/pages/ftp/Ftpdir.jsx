import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

import { createContainer } from 'meteor/react-meteor-data';
import Alert from '/imports/ui/helpers/notification';
import {Folders, folderFormSchema}  from '/imports/api/ftp/folders';
import {Connections, connectionFormSchema}  from '/imports/api/ftp/connections';
import {Treebeard} from 'react-treebeard';

class FtpDir extends Component {
    constructor(props){
      super(props);
      this.state = {};
      this.onToggle = this.onToggle.bind(this);
    }

    onSelect(dir) {
        this.props.onSelect(dir);
    }

    onToggle(node, toggled) {
        this.props.onSelect(node.name);
    }

    getData() {
        const { loading, folders } = this.props;
        let data = null;

        if(!loading) {
            if(folders.length) {
                data = {
                    name: folders[0].entry == '.' ? 'ROOT': folders[0].entry,
                    toggled: true,
                    children: [
                        {
                            name: '..',
                            type: '1',
                            children: [],
                        }
                    ],
                };

                try {
                    if(folders[0].lists && folders[0].lists.length) {
                        folders[0].lists.forEach((f) => {
                            const folder = JSON.parse(f);
                            const child = { name: folder.name, type: folder.type };
                            if(folder.type == '1')
                                child.children = [];
                            data.children.push(child);
                        });
                        data.children.sort((a, b) => {
                            return b.type - a.type
                        })
                    }
                }
                catch(e) {
                    console.log(e);
                }
            }
        }

        return data;
    }

    render() {
        const data = this.getData();

        return(
            <div>
                { data ? 
                    <Treebeard data={data} onToggle={this.onToggle} schema={folderFormSchema} />
                    : null 
                }
            </div>
        );
    }
}
export default createContainer(({}) => {
  const user =  Meteor.user();
  const foldersHandle = Meteor.subscribe('folders.list');
  const connectionsHandle = Meteor.subscribe('connections.list');
  return {
   folders: Folders.find({}).fetch(),
   connections: Connections.find({}).fetch(),
   loading: !foldersHandle.ready()
  };
}, FtpDir);
