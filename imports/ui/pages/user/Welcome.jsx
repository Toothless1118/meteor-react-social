import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { browserHistory } from 'react-router';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import LongTextField from 'uniforms-bootstrap3/LongTextField';
import NumField from 'uniforms-bootstrap3/NumField';
import { onboardingSchema } from '/imports/api/users/users';
import { saveOnboardingInfo } from '/imports/api/users/methods';
import { omit } from 'lodash';

export default class Welcome extends Component {
  constructor(props) {
    super(props);
    this.goToNextStep = this.goToNextStep.bind(this);
  }

  state = {
    step: 1
  };

  save() {
    saveOnboardingInfo.call(omit(this.state, ['step']));
    if (this.state.step === 6) {
      browserHistory.replace('/');
    }
  }

  goToNextStep(e) {
    if (e) {
      e.preventDefault();
    }
    this.setState({
      step: this.state.step + 1
    });
  }

  renderStep() {
    switch (this.state.step) {
      case 1:
        return this.renderStep1();
      case 2:
        return this.renderStep2();
      case 3:
        return this.renderStep3();
      case 4:
        return this.renderStep4();
      case 5:
        return this.renderStep5();
      case 6:
        return this.renderStep6();
      default:
        return null;
    }
  }

  renderStep1() {
    return (
      <div className="intro">
        <p>Thank you for signing up {Meteor.user().firstName}!</p>
        <h2>This site is designed to help you reach your fitness goals.</h2>
        <p>Before you start using the community, we have 3 questions for you.</p>
        <a href="/" className="btn btn-danger btn-lg" onClick={this.goToNextStep}>Ok, shoot!</a>
      </div>
    );
  }

  renderStep2() {
    return (
      <div className="step">
        <h2>What's your ideal weight?</h2>
        <p>Set something ambitious yet realistic.</p>
        <AutoForm
          schema={onboardingSchema.pick('idealWeight')}
          onSubmit={(doc) => {
            this.setState({
              step: 3,
              idealWeight: doc.idealWeight
            });
          }}
        >
          <div className="weight-wrapper">
            <NumField name="idealWeight" label={false} />
            <span>Lbs.</span>
          </div>
          <button type="submit " className="btn btn-danger btn-lg">Next Step</button>
        </AutoForm>
      </div>
    );
  }

  renderStep3() {
    return (
      <div className="step">
        <h2>How much weight would you like to lose in the next few weeks?</h2>
        <p> Set a short term goal. <br /> Example: 5 lbs.</p>
        <AutoForm
          schema={onboardingSchema.pick('goal')}
          onSubmit={(doc) => {
            this.setState({
              step: 4,
              goal: doc.goal
            });
          }}
        >
          <div className="weight-wrapper">
            <NumField name="goal" placeholder="Ex. 5" label={false} />
            <span>Lbs.</span>
          </div>
          <button className="btn btn-danger btn-lg">Next Step</button>
        </AutoForm>
      </div>
    );
  }

  renderStep4() {
    return (
      <div className="step">
        <h2>What’s your current weight?</h2>
        <p>(If unsure you can guesstimate,<br /> you can edit this later)</p>
        <AutoForm
          schema={onboardingSchema.pick('startingWeight')}
          onSubmit={(doc) => {
            this.setState({
              step: 5,
              startingWeight: doc.startingWeight
            });
          }}
        >
          <div className="weight-wrapper">
            <NumField name="startingWeight" label={false} />
            <span>Lbs.</span>
          </div>
          <button className="btn btn-danger btn-lg">Next Step</button>
        </AutoForm>
      </div>
    );
  }

  renderStep5() {
    return (
      <div className="step">
        <h2>Tell us a fun fact about yourself.</h2>
        <p> We will feature it in your profile.</p>
        <AutoForm
          schema={onboardingSchema.pick('funFact')}
          onSubmit={(doc) => {
            this.setState({
              step: 6,
              funFact: doc.funFact
            });
          }}
        >
          <LongTextField name="funFact" placeholder="Example: I can play the violin" label={false} />
          <button className="btn btn-danger btn-lg">Next Step</button>
        </AutoForm>
      </div>
    );
  }

  renderStep6() {
    return (
      <div className="step">
        <h2>Lastly, tell the community what's your first action step to lose weight.</h2>
        <p>Your update will be featured for others to comment and like.</p>
        <AutoForm
          schema={onboardingSchema.pick('post')}
          onSubmit={(doc) => {
            this.setState({
              post: doc.post
            });
            this.save();
          }}
        >
          <LongTextField name="post" placeholder="Example: I will drink unsweetened iced tea instead of soda today" label={false} />
          <button className="btn btn-danger btn-lg">Completed!</button>
        </AutoForm>
      </div>
    );
  }

  render() {
    return (
      <div className="welcome-section">
        {this.renderStep()}
      </div>
    );
  }
}
