import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import NumField from 'uniforms-bootstrap3/NumField';
import { browserHistory } from 'react-router';
import { onboardingSchema } from '/imports/api/users/users';
import { addNewGoal } from '/imports/api/users/methods';
import { omit } from 'lodash';

export default class Welcome extends Component {
  state = {
    step: 1
  };

  save() {
    addNewGoal.call(omit(this.state, ['step']), (err) => {
      if (err) {
        console.log(err)
      } else {
        browserHistory.push(`/profile/${Meteor.user().username}`);
      }
    });
  }

  renderStep() {
    switch (this.state.step) {
      case 1:
        return this.renderStep1();
      case 2:
        return this.renderStep2();
      default:
        return null;
    }
  }

  renderStep1() {
    return (
      <div>
        <h2>How much weight would you like to lose in the next few weeks?</h2>
        <p> Set a short term goal. <br /> Example: 5 lbs.</p>
        <AutoForm
          schema={onboardingSchema.pick('goal')}
          onSubmit={(doc) => {
            this.setState({
              step: 2,
              goal: doc.goal
            });
          }}
        >
          <div className="weight-wrapper">
            <NumField name="goal" placeholder="Ex. 5" label={false} />
            <span className="lbs">Lbs.</span>
          </div>
          <button className="btn btn-danger btn-lg">Next Step</button>
        </AutoForm>
      </div>
    );
  }

  renderStep2() {
    return (
      <div>
        <h2>What’s your current weight?</h2>
        <p> (If unsure you can guesstimate,<br /> you can edit this later)</p>
        <AutoForm
          schema={onboardingSchema.pick('startingWeight')}
          onSubmit={(doc) => {
            this.setState({
              step: 5,
              startingWeight: doc.startingWeight
            });
            this.save();
          }}
        >
          <div className="weight-wrapper">
            <NumField name="startingWeight" inputClassName="input-lg weight-input" label={false} />
            <span>Lbs.</span>
          </div>
          <button className="btn btn-danger btn-lg">Finished</button>
        </AutoForm>
      </div>
    );
  }

  render() {
    return (
      <div className="welcome-section new-goal">
        {this.renderStep()}
      </div>
    );
  }
}
