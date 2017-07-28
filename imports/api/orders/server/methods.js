import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { map, includes } from 'lodash';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import connectToStripe from 'stripe';
import { Braintree } from './Braintree';
import { Orders, paymentSchema } from '../orders';
import { t } from '/imports/ui/helpers/translate';

export const Stripe = connectToStripe(Meteor.settings.stripe.key);

/**
 * Create a stripe subscription
 */
export const subscribeStripe = new ValidatedMethod({
  name: 'orders.subscribeStripe',
  validate: new SimpleSchema({
    token: String
  }).extend(paymentSchema).validator(),
  run(params) {
    this.unblock();
    let customer;
    try {
      customer = Meteor.wrapAsync(
        Stripe.customers.retrieve.bind(Stripe.customers)
      )(this.userId);
    } catch (err) {
      customer = null;
    }

    const { token, email } = params;
    if (!customer) {
      customer = Meteor.wrapAsync(Stripe.customers.create.bind(Stripe.customers))({
        source: token,
        id: this.userId,
        email
      });
    } else {
      const user = Meteor.users.findOne(this.userId);
      if (user && user.subscription && user.subscription.status === 'active') {
        throw new Meteor.Error('already_subscribed', 'Already subscribed');
      }
    }

    const { initialCost: amount } = Meteor.settings.public.subscription;

    const charge = Meteor.wrapAsync(Stripe.charges.create.bind(Stripe.charges))({
      amount: amount * 100, // Stripe requires amount in pence
      currency: 'usd',
      customer: customer.id
    });

    if (charge) {
      const subscription = Meteor.wrapAsync(Stripe.subscriptions.create.bind(Stripe.subscriptions))({
        customer: customer.id,
        plan: 'monthly'
      });

      Meteor.users.update(this.userId, {
        $set: {
          subscription: {
            status: subscription.status,
            id: subscription.id,
            customerId: customer.id,
            createdAt: new Date(),
            type: 'stripe'
          }
        }
      });
    }
  }
});


/**
 * Create a Braintree subscription
 */
export const subscribeBraintree = new ValidatedMethod({
  name: 'orders.subscribeBraintree',
  validate: new SimpleSchema({
    nonce: String
  }).validator(),
  run({ nonce }) {
    this.unblock();

    const user = Meteor.users.findOne(this.userId);
    if (user && user.subscription && user.subscription.status === 'active') {
      throw new Meteor.Error('already_subscribed', 'Already subscribed');
    }

    let customer;

    try {
      customer = Meteor.wrapAsync(Braintree.customer.find.bind(Braintree.customer))(this.userId);
    } catch (e) {
      customer = Meteor.wrapAsync(Braintree.customer.create.bind(Braintree.customer))({
        id: this.userId,
        paymentMethodNonce: nonce
      }).customer;
    }

    const { initialCost: amount } = Meteor.settings.public.subscription;

    const sale = Meteor.wrapAsync(Braintree.transaction.sale.bind(Braintree.transaction))({
      amount,
      paymentMethodToken: customer.paymentMethods[0].token,
      options: {
        submitForSettlement: true
      }
    });

    if (sale) {
      const subscription = Meteor.wrapAsync(Braintree.subscription.create.bind(Braintree.subscription))({
        planId: 'monthly',
        paymentMethodToken: customer.paymentMethods[0].token
      });

      if (subscription) {
        Meteor.users.update(this.userId, {
          $set: {
            subscription: {
              status: subscription.status,
              id: subscription.id,
              customerId: customer.id,
              createdAt: new Date(),
              type: 'braintree'
            }
          }
        });
      }
    }
  }
});


/**
 * Generate Braintree token
 */
export const generateBraintreeToken = new ValidatedMethod({
  name: 'orders.generateBraintreeToken',
  validate: null,
  run() {
    const res = Meteor.wrapAsync(Braintree.clientToken.generate.bind(Braintree.clientToken))();
    if (res && res.success) {
      return res.clientToken;
    }
    throw new Meteor.Error('braintree_token', 'Error generating Braintree token');
  }
});


const ORDER_METHODS = map([
  subscribeStripe,
  subscribeBraintree,
  generateBraintreeToken
], 'name');


if (Meteor.isServer) {
  // Only allow 5 users operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return includes(ORDER_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() {
      return true;
    }
  }, 5, 1000);
}
