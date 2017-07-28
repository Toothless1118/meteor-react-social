import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { browserHistory } from 'react-router';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import TextField from 'uniforms-bootstrap3/TextField';
import NumField from 'uniforms-bootstrap3/NumField';
import SelectField from 'uniforms-bootstrap3/SelectField';
import { paymentSchema } from '/imports/api/orders/orders';
import { Helmet } from 'react-helmet';
import Alert from '/imports/ui/helpers/notification';
import RegisterLoginTabs from '/imports/ui/components/user/RegisterLoginTabs.jsx';
import Braintree from 'braintree-web';
import moment from 'moment';

export default class SignUpPay extends Component {
  constructor(props) {
    super(props);
    this.payWithBraintree = this.payWithBraintree.bind(this);
  }

  pay(doc) {
    const { cardNumber: number, cvc, expirationMonth: exp_month, expirationYear: exp_year } = doc;
    Stripe.setPublishableKey(Meteor.settings.public.stripe.key);
    Stripe.card.createToken({
      number,
      cvc,
      exp_month,
      exp_year
    }, (status, { error, id: token }) => {
      if (error) {
        Alert.error(error);
      } else {
        Meteor.call('orders.subscribeStripe', {
          ...doc,
          expirationMonth: parseInt(exp_month, 10),
          expirationYear: parseInt(exp_year, 10),
          token
        }, (err) => {
          if (err) {
            Alert.error(err);
          } else {
            browserHistory.push('/payment-confirmation');
          }
        });
      }
    });
  }

  payWithBraintree() {
    Meteor.call('orders.generateBraintreeToken', (err, token) => {
      if (err) {
        Alert.error(err);
        return;
      }
      Braintree.client.create({
        authorization: token
      }, (clientErr, clientInstance) => {
        if (clientErr) {
          Alert.error(clientErr);
          return;
        }

        Braintree.paypal.create({
          client: clientInstance
        }, (paypalErr, paypalInstance) => {
          if (paypalErr) {
            Alert.error(paypalErr);
            return;
          }
          paypalInstance.tokenize({
            flow: 'vault'
          }, (tokenizeErr, payload) => {
            if (tokenizeErr) {
              Alert.error(tokenizeErr);
              return;
            }
            Meteor.call('orders.subscribeBraintree', {
              nonce: payload.nonce
            }, (paymentErr) => {
              if (paymentErr) {
                Alert.error(paymentErr);
              } else {
                browserHistory.push('/payment-confirmation');
              }
            });
          });
        });
      });
    });
  }

  renderTable() {
    return (
      <div className="table-wrapper">
        <table>
          <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>
              <i className="fa fa-check" aria-hidden="true" /> Inslim Fitness-Over-50 Free Trial
            </td>
            <td>$0.00</td>
          </tr>
          <tr>
            <td>
              <i className="fa fa-check" aria-hidden="true" /> Free Fitness-Over-50 Best Selling E-book
            </td>
            <td>$0.00</td>
          </tr>
          <tr>
            <td>
              <i className="fa fa-check" aria-hidden="true" /> One time Processing Fee
            </td>
            <td>$0.99</td>
          </tr>
          <tr>
            <td><b>Total (Limited Time Low Price)</b></td>
            <td>$0.99</td>
          </tr>
          </tbody>
        </table>
      </div>
    );
  }

  renderForm() {
    return (
      <AutoForm schema={paymentSchema} onSubmit={this.pay} label={false} showInlineError>
        <TextField name="firstName" grid="col-sm-6" placeholder="First Name" />
        <TextField name="lastName" grid="col-sm-6" placeholder="Last Name" />
        <TextField type="email" name="email" grid="col-sm-12" placeholder="Email" />
        <TextField name="cardNumber" grid="col-sm-12" placeholder="Card Number" />
        <SelectField name="expirationMonth" grid="col-sm-6" placeholder="Exp. Month" />
        <SelectField name="expirationYear" grid="col-sm-6" placeholder="Exp. Year" />
        <NumField name="cvc" grid="col-sm-6" placeholder="CVC" />
        <TextField name="phone" grid="col-sm-6" placeholder="Phone" />
        <div className="col-sm-12">
          <button type="submit" className="btn btn-danger btn-lg btn-block">Start Trial</button>
        </div>
      </AutoForm>
    );
  }

  render() {
    if (!Meteor.userId()) {
      return <RegisterLoginTabs openTab="login" />;
    }

    return (
      <div className="payment-page">
        <Helmet>
          <script type="text/javascript" src="https://js.stripe.com/v2/" />
        </Helmet>
        <div className="wrapper-small">
          <h1>Start Your 7 Day Trial</h1>
          <p>Accelerate your weight loss and fitness today by watching these exclusive step-by-step videos </p>
          {this.renderTable()}
          <div className="row">
            {this.renderForm()}
          </div>
          <img
            src="https://nodo.s3.amazonaws.com/assets/images/graphics/credit-only.png"
            className="cards"
            alt=""
          />
          <a onClick={this.payWithBraintree} className="btn paypal-btn">Pay with Paypal</a>

          <p className="smaller"> If you love your program and decide to continue past the trial period, you will be billed ${Meteor.settings.public.subscription.monthlyCost} per month
            starting {moment().add(7, 'days').format('LL')}. You can cancel your membership any time from your profile.</p>
        </div>

        <div className="row features wrapper-large">
          <hr />
          <div className="col-sm-12 col-md-6">
            <div className="row">
              <div className="col-md-3">
                <img src="https://nodo.s3.amazonaws.com/assets/images/graphics/seal1.png" alt="" />
              </div>
              <div className="col-md-9">
                <h2>7 Day Trial</h2>
                <p>Cancel anytime. No question asked.. guaranteed. If you are unhappy for any reason, easily cancel your
                  trial or membership without hassles.</p>
              </div>
            </div>
          </div>

          <div className="col-sm-12 col-md-6">
            <div className="col-md-3">
              <img src="https://nodo.s3.amazonaws.com/assets/images/graphics/grey-lock.png" alt="" />
            </div>
            <div className="col-md-9">
              <h2>Secure Payment</h2>
              <p>All orders are through a very secure network. Your credit card information is never stored in any way.
                We respect your privacy...
              </p>
            </div>
          </div>

        </div>
      </div>
    );
  }
}
