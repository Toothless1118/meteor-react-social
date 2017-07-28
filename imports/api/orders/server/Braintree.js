import { Meteor } from 'meteor/meteor';
import connectToBraintree from 'braintree';

const { merchantId, privateKey } = Meteor.settings.braintree;
const { publicKey } = Meteor.settings.public.braintree;

export const Braintree = connectToBraintree.connect({
  environment: !Meteor.isProduction ?
    connectToBraintree.Environment.Sandbox :
    connectToBraintree.Environment.Production,
  merchantId,
  publicKey,
  privateKey
});
