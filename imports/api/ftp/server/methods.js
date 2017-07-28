import { Meteor } from 'meteor/meteor';
import { map, includes } from 'lodash';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import  ftpClient  from 'jsftp';
//import  ftpClient  from 'ftp-client';
import { Folders } from '../folders';
import { connectionFormSchema, Connections } from '../connections';
import  stringifyObject  from 'stringify-object';
const fs = Npm.require('fs');
const http = Npm.require('https');
const fiber = Npm.require( 'fibers' ); 
const path = Npm.require('path');

export const createConnection = new ValidatedMethod({
  name: 'ftp.createConnection',
  validate: null,
  run({host, username, password, dir}) {
    console.log('createConnection', host, username, password, dir);
    const user = Meteor.users.findOne(this.userId);

    const options = { logging: 'basic'};
    const config = {
        host: host,
        port: 21,
        user: username,
        pass: password
    };
    try {
        process.on('uncaughtException', (err) => {
          if (err) {
            fiber(function() {
                const connection = Connections.findOne({userId: user._id});
                if(connection) {
                  Connections.update({_id: connection._id}, {
                    $set: {
                      host: host, username: username, password: password, status: 'error'
                    }
                  });
                  Folders.remove({userId: user._id });
                }
            }).run();
          }

        });
        const client =  new ftpClient(config, options);
        
        if (client) {
          client.ls(dir, Meteor.bindEnvironment(function(err, response) {
            if (!err) {
              const lists = [];
              response.forEach(r => lists.push(JSON.stringify(r)));

              // const res = stringifyObject(response, {indent: '  ', singleQuotes: false });
              const connection = Connections.findOne({userId: user._id});
              if(connection) {
                Connections.update({_id: connection._id}, {
                  $set: {
                    host: host, username: username, password: password, status: 'success'
                  }
                });
                const directory = Folders.findOne({userId: user._id, currentFtp: connection._id });
                if (directory) {
                  Folders.update({_id: directory._id}, {
                    $set: {entry: dir, lists: lists}
                  });
                }
                else {
                  Folders.insert({userId: user._id, currentFtp: connection._id, entry: dir, lists: lists });
                }  
              }
              else {
                Connections.insert({ userId: user._id, host: host, username: username, password: password, status: 'success', obj: '' });
                const newConnection = Connections.findOne({userId: user._id, host: host, username: username });
                if(newConnection) {
                  Folders.insert({userId: user._id, currentFtp: newConnection._id, entry: dir, lists: lists });
                }
              }
            }
          }));

        }
        else {
          
        }
    }
    catch(e) {
        return e;
    }
  }
});

export const uploadFile = new ValidatedMethod({
  name: 'ftp.uploadFile',
  validate: null,
  run({host, username, password, name, url, dir}) {
    console.log('uploadFile', host, username, password, name, url, dir);
    
    const user = Meteor.users.findOne(this.userId);

    const options = { logging: 'basic'};
    const config = {
        host: host,
        port: 21,
        user: username,
        pass: password
    };
    try {
      let meteor_root = Npm.require('fs').realpathSync( process.cwd() + '/../' );
      let application_root = Npm.require('fs').realpathSync( meteor_root + '/../' );

      // if running on dev mode
      if( Npm.require('path').basename( Npm.require('fs').realpathSync( meteor_root + '/../../../' ) ) == '.meteor' ){
          application_root =  Npm.require('fs').realpathSync( meteor_root + '/../../../../' );
      }
      const uploadPath = path.join(application_root +  '/../uploads/_tmpftp/');
      console.log('uploadPath', uploadPath);
      if(!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, 777);
      }
      
      fs.access(uploadPath, Meteor.bindEnvironment((err) => {
        if(err)
          fs.mkdirSync(uploadPath, 777);

        var file = fs.createWriteStream(uploadPath + name);

        var request = http.get(url, Meteor.bindEnvironment(function(response) {
          response.pipe(file);
          console.log(uploadPath + name, fs.existsSync(uploadPath + name));

          const client =  new ftpClient(config, options);
          
          if (client) {
            const dest = dir ? dir + '/' + name: name;
            
            client.put(uploadPath + name, dest, Meteor.bindEnvironment(function(putErr) {
              if (putErr) {
                console.error(putErr);
              }
              else {
                const entry = dir ? dir: '.';
                client.ls(entry, Meteor.bindEnvironment(function(err, response) {
                  if (!err) {
                    const lists = [];
                    response.forEach(r => lists.push(JSON.stringify(r)));

                    // const res = stringifyObject(response, {indent: '  ', singleQuotes: false });
                    const connection = Connections.findOne({userId: user._id});
                    if(connection) {
                      Folders.remove({userId: user._id, currentFtp: connection._id });
                      Folders.insert({userId: user._id, currentFtp: connection._id, entry: entry, lists: lists });
                    }
                    else {
                      Connections.insert({ userId: user._id, host: host, username: username, password: password, status: 'success' });
                      const newConnection = Connections.findOne({userId: user._id, host: host, username: username });
                      if(newConnection) {
                        Folders.insert({userId: user._id, currentFtp: newConnection._id, entry: entry, lists: lists });
                      }
                    }
                  }
                }));
              }
            }));

          }
          else {
            
          }
        }));
      }));
    }
    catch(e) {
        return e;
    }
  }
});

const FTP_METHODS = map([
  createConnection,
  uploadFile
], 'name');


if (Meteor.isServer) {
  // Only allow 5 users operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return includes(FTP_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() {
      return true;
    }
  }, 5, 1000);
}

