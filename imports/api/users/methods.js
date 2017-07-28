import { Meteor } from 'meteor/meteor';
import { map, includes, find } from 'lodash';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { Accounts } from 'meteor/accounts-base';
import { t } from '/imports/ui/helpers/translate';
import { Random } from 'meteor/random';
import MessageBox from 'message-box';
import { create as createPost } from '/imports/api/posts/methods';
import { Posts } from '/imports/api/posts/posts';
import { Comments } from '/imports/api/comments/comments';
import { signUpSchema, onboardingSchema, currentWeightSchema, editProfileSchema, subscriptionSchema } from './users';

MessageBox.defaults({
  messages: {
    en: {
      passwordMismatch: 'Passwords do not match'
    }
  }
});

/**
 * Create a new user
 */
export const create = new ValidatedMethod({
  name: 'users.create',
  validate: signUpSchema.validator(),
  run(params) {
    const { username, email, password, confirmPassword, ...profile } = params;
    if (!this.isSimulation) {
      Accounts.createUser({ username, email, password, profile });
    }
  }
});

export const editProfile = new ValidatedMethod({
  name: 'users.editProfile',
  validate: editProfileSchema.validator(),
  run(params) {
    const { firstName, lastName, email, image } = params;
    const user = Meteor.users.findOne(this.userId);

    if (!this.isSimulation && email && !find(user.emails, { address: email })) {
      Accounts.addEmail(this.userId, email);
      Accounts.sendVerificationEmail(this.userId, email);
    }

    const extraFields = {};
    const unset = { a: '' };
    if (!this.isSimulation && image && image.url) {
      import { moveUploadedFile } from '/imports/api/server/upload';

      const uploadedFile = moveUploadedFile(image.url, 'profile');
      if (uploadedFile) {
        extraFields.image = uploadedFile;
        Posts.update({
          createdBy: this.userId
        }, {
          $set: {
            userImage: uploadedFile
          }
        });

        Comments.update({
          createdBy: this.userId
        }, {
          $set: {
            userImage: uploadedFile
          }
        });
      }
    }

    if (!image) {
      unset.image = '';
    }

    Meteor.users.update(this.userId, {
      $set: {
        firstName,
        lastName,
        email,
        ...extraFields
      },
      $unset: {
        ...unset
      }
    });
  }
});


export const addNewGoal = new ValidatedMethod({
  name: 'users.addNewGoal',
  validate: onboardingSchema.pick('startingWeight', 'goal').validator(),
  run({ startingWeight, goal }) {
    const user = Meteor.users.findOne(this.userId);

    if (!user) {
      throw new Meteor.Error(404, 'user_not_found');
    }

    const currentGoal = {
      _id: Random.id(),
      startingWeight,
      plannedWeight: startingWeight - goal,
      currentWeight: startingWeight,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    Meteor.users.update(this.userId, {
      $push: {
        goals: {
          $each: [{ ...currentGoal }],
          $position: 0
        }
      }
    });

    createPost.call({
      post: `${user.username} wants to lose ${goal} pounds! Give her your support!`,
      type: 'newGoal'
    });
  }
});



export const saveOnboardingInfo = new ValidatedMethod({
  name: 'users.saveOnboardingInfo',
  validate: onboardingSchema.validator(),
  run(params) {
    const { goal, ...userData } = params;
    Meteor.users.update({
      _id: this.userId
    }, {
      $set: {
        ...userData,
        accountStatus: 'active'
      }
    });

    addNewGoal.call({
      startingWeight: userData.startingWeight,
      goal
    });
  }
});


export const updateGoalWeight = new ValidatedMethod({
  name: 'users.updateGoalWeight',
  validate: currentWeightSchema.validator(),
  run({ currentWeight }) {
    const user = Meteor.users.findOne(this.userId);

    if (!user) {
      throw new Meteor.Error('user_not_found', 'User not found');
    }

    Meteor.users.update(this.userId, {
      $set: {
        'goals.0.currentWeight': currentWeight,
        updatedAt: new Date()
      },
      $inc: {
        'stats.updates': 1
      }
    });

    const oldWeight = user.goals && user.goals[0] && user.goals[0].currentWeight;

    if (!oldWeight) {
      return;
    }

    const post = currentWeight < oldWeight ?
      `I have updated my status. I lost ${oldWeight - currentWeight} lbs!` :
      `I have updated my status. My new weight is ${currentWeight} lbs.`;

    createPost.call({
      post,
      type: currentWeight < oldWeight ? 'lostWeight' : 'gainedWeight',
      data: {
        weightDifference: Math.abs(oldWeight - currentWeight)
      }
    });
  }
});


export const changeSubscriptionSettings = new ValidatedMethod({
  name: 'users.changeSubscriptionSettings',
  validate: subscriptionSchema.validator(),
  run({ subscribed }) {
    Meteor.users.update(this.userId, {
      $set: {
        subscribed
      }
    });
  }
});


export const lastPublicChatActivity = new ValidatedMethod({
  name: 'users.lastPublicChatActivity',
  validate: null,
  run() {
    Meteor.users.update(this.userId, {
      $set: {
        'stats.lastViewedPublicChat': new Date()
      }
    });
  }
});


const USERS_METHODS = map([
  create,
  saveOnboardingInfo,
  addNewGoal,
  updateGoalWeight,
  editProfile,
  changeSubscriptionSettings
], 'name');


if (Meteor.isServer) {
  // Only allow 5 users operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return includes(USERS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() {
      return true;
    }
  }, 5, 1000);
}
