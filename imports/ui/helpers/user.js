import React from 'react';
import { Meteor } from 'meteor/meteor';
import { startsWith } from 'lodash';
import { Accounts } from 'meteor/accounts-base';
import Alert from '/imports/ui/helpers/notification';
import { openConversationsStore} from '/imports/ui/helpers/store';
import { start } from '/imports/api/conversations/methods';
import cx from 'classnames';

export const ProfileThumbImage = (img, fallback) => {
  if (startsWith(img, 'https://') || startsWith(img, 'http://')) {
    return img;
  }
  return img ? Meteor.settings.public.S3.profile_thumb_img + img : fallback || 'https://s3.amazonaws.com/myinslim/subfolder/352b8234-3987-409a-a1bb-80fbeed8c179.png';
};

export const VerifyEmail = (token) => {
  Accounts.verifyEmail(token, err => err ? Alert.error(err) : Alert.success('Email successfully verified!'));
};

export const StartConversation = (userId) => {
  start.call({ userId }, (err, conversationId ) => {
    if (!err) {
      openConversationsStore.dispatch({
        type: 'add',
        state: {
          _id: conversationId,
          open: true
        }
      });
    } else {
      Alert.error(err);
    }
  });
};


export const onlineStatusBadge = isOnline => <span className={cx('online-status-badge', { online: isOnline })} />;
