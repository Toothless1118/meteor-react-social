import { Meteor } from 'meteor/meteor';
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: Meteor.settings.S3.key,
  secretAccessKey: Meteor.settings.S3.secret,
  region: Meteor.settings.S3.region
});


export const moveUploadedFile = function(file, dest){
  const filename = file.split('/').pop();

  const copyParams = {
    Bucket: Meteor.settings.S3.bucket,
    Key: `${dest}/${filename}`,
    CopySource: `${Meteor.settings.S3.bucket}/temp/${filename}`,
    ACL: 'public-read'
  };

  s3.copyObject(copyParams, err => {
    if(err)
      console.log(err);
  });

  return filename;
}

export const removeUploadedFile = function(files, dest) {
  if (Meteor.isServer) {
    if (typeof files === 'string') {
      files = [files];
    }
    let filesObject = files.map(f => {
      f = f.split('/').pop();
      return { Key: `${dest}/${f}` }
    })


    const deleteParams = {
      Bucket: Meteor.settings.S3.bucket,
      Delete: {
        Objects: filesObject
      }
    };

    s3.deleteObjects(deleteParams, (err) => {
      if (err)
        console.log(err);
    })

    return;
  }
}