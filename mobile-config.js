/* globals App */
/* eslint-disable quote-props */

App.info({
  name: 'Games',
  description: 'Description',
  author: 'a',
  email: 'a@b.com',
  website: 'a',
  version: '0.0.1'
});

App.icons({
  // iOS
  'iphone': '',
  'iphone_2x': '',
  'ipad': '',
  'ipad_2x': '',

  // Android
  'android_ldpi': '',
  'android_mdpi': '',
  'android_hdpi': '',
  'android_xhdpi': ''
});

App.launchScreens({
  // iOS
  'iphone': '',
  'iphone_2x': '',
  'iphone5': '',
  'ipad_portrait': '',
  'ipad_portrait_2x': '',
  'ipad_landscape': '',
  'ipad_landscape_2x': '',

  // Android
  'android_ldpi_portrait': '',
  'android_ldpi_landscape': '',
  'android_mdpi_portrait': '',
  'android_mdpi_landscape': '',
  'android_hdpi_portrait': '',
  'android_hdpi_landscape': '',
  'android_xhdpi_portrait': '',
  'android_xhdpi_landscape': ''
});

App.setPreference('StatusBarOverlaysWebView', 'false');
App.setPreference('StatusBarBackgroundColor', '#000000');
