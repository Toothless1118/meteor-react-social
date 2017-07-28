import { Meteor } from 'meteor/meteor';
import { GUID } from '/imports/ui/helpers/string';
import { Slingshot } from 'meteor/edgee:slingshot';

const getTempKey = (file) => {
  const id = GUID();
  let extension = '.jpg';
  if (file.type === 'image/png') {
    extension = '.png';
  }
  return `temp/${id}${extension}`;
};

Slingshot.fileRestrictions('profilePicture', {
  allowedFileTypes: ['image/jpeg', 'image/png'],
  maxSize: 2 * 1024 * 1024 // 2 MB (use null for unlimited).
});

Slingshot.createDirective('profilePicture', Slingshot.S3Storage, {
  bucket: Meteor.settings.S3.bucket,
  AWSAccessKeyId: Meteor.settings.S3.key,
  AWSSecretAccessKey: Meteor.settings.S3.secret,
  region: Meteor.settings.S3.region,

  acl: 'public-read',

  authorize() {
    return true;
  },

  key(file) {
    return getTempKey(file);
  }
});


Slingshot.fileRestrictions('postPictures', {
  allowedFileTypes: ['image/jpeg', 'image/png'],
  maxSize: 2 * 1024 * 1024 // 2 MB (use null for unlimited).
});

Slingshot.createDirective('postPictures', Slingshot.S3Storage, {
  bucket: Meteor.settings.S3.bucket,
  AWSAccessKeyId: Meteor.settings.S3.key,
  AWSSecretAccessKey: Meteor.settings.S3.secret,
  region: Meteor.settings.S3.region,

  acl: 'public-read',

  authorize() {
    return !!Meteor.userId();
  },

  key(file) {
    return getTempKey(file);
  }
});

Slingshot.fileRestrictions('ftpFiles', {
  allowedFileTypes: /.*/i,
  maxSize: null
});

Slingshot.createDirective('ftpFiles', Slingshot.S3Storage, {
  bucket: Meteor.settings.S3.bucket,
  AWSAccessKeyId: Meteor.settings.S3.key,
  AWSSecretAccessKey: Meteor.settings.S3.secret,
  region: Meteor.settings.S3.region,

  acl: 'public-read',

  authorize() {
    return !!Meteor.userId();
  },

  key(file) {
    return file.name;
  }
});
