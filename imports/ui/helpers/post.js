import { Meteor } from 'meteor/meteor';
import { startsWith } from 'lodash';

export const PostThumbImage = (img, fallback) => {
  if (startsWith(img, 'https://') || startsWith(img, 'http://')) {
    return img;
  }
  return img ? Meteor.settings.public.S3.post_thumb_img + img : fallback || 'https://s3.amazonaws.com/myinslim/subfolder/352b8234-3987-409a-a1bb-80fbeed8c179.png';
};
