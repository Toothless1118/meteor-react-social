import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Meteor } from 'meteor/meteor';
import i18n from 'meteor/universe:i18n';
import { VerifyEmail } from '/imports/ui/helpers/user';

// route components
import AppContainer from '/imports/ui/containers/AppContainer.jsx';
import {
  HomePage,
  NotFoundPage,
  UserRegisterPage,
  UserLoginPage,
  UserWelcomePage,
  UserLastActiveList,
  UserProfilePage,
  UserNewGoalPage,
  UserEditProfilePage,
  UserUnsubscribePage,
  TrialPage,
  SignUpPay,
  VideosPage,
  SingleVideoPage,
  CourseCompletedPage,
  PaymentConfirmationPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  SinglePostPage,
  ChatPage,
  SignUpPlaceholderPage,
  TermsPage,
  ConversationsPage,
  NewsStandPage,
  FtpConnection
} from '/imports/ui/pages';

i18n.setLocale('en');

const onRouteUpdate = () => {
  if (window.location.pathname !== '/welcome' && window.location.pathname !== '/' && Meteor.user() && Meteor.user().accountStatus !== 'active') {
    browserHistory.replace('/welcome');
  }
  if (Meteor.userId() && (['/login', '/register', 'forgot-password'].indexOf(window.location.pathname) !== -1)) {
    browserHistory.replace('/');
  }
  window.scrollTo(0, 0);
};

const ensureLogin = (nextState, replace, callback) => {
  if (!Meteor.userId()) {
    replace('/login');
  }
  callback();
};

const onEmailRouteEnter = (nextState, replace, callback) => {
  replace('/');
  callback();
  VerifyEmail(nextState.params.token);
};


export const renderRoutes = () => (
  <Router history={browserHistory} onUpdate={onRouteUpdate}>
    <Route path="home.html" component={SignUpPlaceholderPage} />
    <Route component={AppContainer}>
      <Route path="/" component={HomePage} />
      <Route path="register" component={UserRegisterPage} />
      <Route path="login" component={UserLoginPage} />
      <Route path="verify-email-address/:token" component={HomePage} onEnter={onEmailRouteEnter} />
      <Route path="forgot-password" component={ForgotPasswordPage} />
      <Route path="reset-password/:token" component={ResetPasswordPage} />
      <Route path="welcome" component={UserWelcomePage} onEnter={ensureLogin} />
      <Route path="users" component={UserLastActiveList} />
      <Route path="post/:id" component={SinglePostPage} />
      <Route path="trial" component={TrialPage} />
      <Route path="welcomeSignupPay" component={SignUpPay} />
      <Route path="payment-confirmation" component={PaymentConfirmationPage} />
      <Route path="videos" component={VideosPage} />
      <Route path="video/congratulations" component={CourseCompletedPage} />
      <Route path="video/:slug(/:id)" component={SingleVideoPage} />
      <Route path="profile/:username(/:view)" component={UserProfilePage} />
      <Route path="edit-profile" component={UserEditProfilePage} onEnter={ensureLogin} />
      <Route path="unsubscribe/:id" component={UserUnsubscribePage} onEnter={ensureLogin} />
      <Route path="new/goal" component={UserNewGoalPage} onEnter={ensureLogin} />
      <Route path="chat" component={ChatPage} />
      <Route path="conversations" component={ConversationsPage} />
      <Route path="terms" component={TermsPage} />
      <Route path="newsstand" component={NewsStandPage} />
      <Route path="ftpconnect" component={FtpConnection} />
      <Route path="*" component={NotFoundPage} />
    </Route>
  </Router>
);

