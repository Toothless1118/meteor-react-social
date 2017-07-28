import SimpleSchema from 'simpl-schema';

export const publicFields = {
  services: 0
};


export const schema = new SimpleSchema({
  username: { type: String, min: 5, max: 30 },
  firstName: { type: String, min: 2, max: 30 },
  lastName: { type: String, min: 2, max: 50 },
  email: { type: String, regEx: SimpleSchema.RegEx.Email },
  idealWeight: { type: Number, min: 20, max: 500 },
  startingWeight: { type: Number, min: 100, max: 1000 },
  funFact: { type: String },
  image: { type: Object, optional: true },
  'image.url': { type: String }
});


const passwordSchema = new SimpleSchema({
  password: {
    type: String,
    min: 6
  },
  confirmPassword: {
    type: String,
    min: 6,
    custom: function () {
      if (this.value !== this.field('password').value) {
        return 'passwordMismatch';
      }
    }
  }
});

const newPasswordSchema = new SimpleSchema({
  currentPassword: {
    type: String,
    min: 6,
    optional: true,
    custom() {
      if (!this.value && this.field('newPassword').value && this.field('confirmNewPassword').value) {
        return 'required';
      }
    }
  },
  newPassword: {
    type: String,
    min: 6,
    optional: true,
    custom() {
      if (this.field('confirmNewPassword').value && !this.value) {
        return 'required';
      }
    }
  },
  confirmNewPassword: {
    type: String,
    min: 6,
    custom () {
      if (!this.value && this.field('newPassword').value) {
        return 'required';
      }
      if (this.value !== this.field('newPassword').value) {
        return 'passwordMismatch';
      }
    },
    optional: true
  }
})


export const signUpSchema = passwordSchema.extend(schema.pick('username', 'firstName', 'lastName', 'email', 'image', 'image.url'));

export const loginSchema = schema.pick('email').extend(passwordSchema.pick('password'));

export const onboardingSchema = new SimpleSchema({
  goal: { type: Number, min: 1, max: 100 },
  post: { type: String }
}).extend(schema.pick('idealWeight', 'startingWeight', 'funFact'));

export const currentWeightSchema = new SimpleSchema({
  currentWeight: { type: Number, min: 100, max: 1000 }
});

export const editProfileSchema = newPasswordSchema.extend(schema.pick('firstName', 'lastName', 'email', 'username', 'image', 'image.url'));

export const subscriptionSchema = new SimpleSchema({
  subscribed: { type: Boolean, allowedValues: [true, false] }
});

export const forgotPasswordSchema = schema.pick('email');

export const resetPasswordSchema = newPasswordSchema.pick('newPassword', 'confirmNewPassword');
