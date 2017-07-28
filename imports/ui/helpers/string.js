import urlRegex from 'url-regex';
import ytId from 'get-youtube-id';

export const getURLs = (string = '') => {
  return string.match(urlRegex());
};

export const getYoutubeId = string => ytId(string);

export const GUID = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};
