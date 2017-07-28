import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import moment from 'moment';
import cx from 'classnames';
import CircularProgressbar from 'react-circular-progressbar';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import NumField from 'uniforms-bootstrap3/NumField';
import { createContainer } from 'meteor/react-meteor-data';
import ProfileStats from '/imports/ui/components/user/ProfileStats.jsx';
import PostForm  from '/imports/ui/components/post/Form.jsx';
import PostsList from '/imports/ui/components/post/List.jsx';
import CommentsList from '/imports/ui/components/comment/List.jsx';
import { currentWeightSchema } from '/imports/api/users/users';
import { updateGoalWeight } from '/imports/api/users/methods';
import Alert from '/imports/ui/helpers/notification';
import { StartConversation } from '/imports/ui/helpers/user';

class Profile extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
  };

  canEdit() {
    const { user } = this.props;
    return Meteor.userId() && Meteor.user().username === user.username;
  }


  renderTabs() {
    const { username, _id, firstName, lastName } = this.props.user;
    const tabs = [
      {
        id: 'posts',
        title: 'Posts',
        onClick: () => {},
        show: () => true
      }, {
        id: 'comments',
        title: 'Comments',
        onClick: () => {},
        show: () => true
      }, {
        id: 'message',
        title: `Message ${firstName}`,
        icon: 'fa fa-comment-o',
        customClass: 'pull-right',
        onClick: (e) => {
          e.preventDefault();
          StartConversation(_id);
        },
        show: () => !!Meteor.userId()
      }
    ];

    return (
      <ul className="nav nav-tabs">
        {tabs.map(tab =>
          tab.show() ?
            <li className={cx('postTab', tab.customClass, { active: this.activeView === tab.id })} key={tab.id}>
              <Link to={`/profile/${username}/${tab.id}`} onClick={tab.onClick}>
                <h5 className="visible-lg visible-md">
                  {tab.icon && <i className={tab.icon} />} {tab.title}</h5>
              </Link>
            </li>
            : null
        )}
      </ul>
    );
  }

  renderActiveTab() {
    let content;

    switch (this.activeView) {
      case 'posts':
        content = this.renderPostsTab();
        break;
      case 'comments':
        content = this.renderCommentsTab();
        break;
      case 'messages':
        content = this.renderMessagesTab();
        break;
      default:
        content = null;
        break;
    }
    return (
      <div className="tab-content">
        <div role="tabpanel" className="tab-pane active">
          {content}
        </div>
      </div>
    );
  }

  renderPostsTab() {
    const { user } = this.props;
    return (
      <div>
        {this.canEdit() && <PostForm />}
        <PostsList search={{ createdBy: user._id }}  notFoundMessage={`${user.firstName} ${user.lastName} hasn't added any posts yet.`} />
      </div>
    );
  }

  renderCommentsTab() {
    const { user } = this.props;
    return (
      <div>
        <CommentsList search={{ createdBy: user._id }} notFoundMessage={`${user.firstName} ${user.lastName} hasn't added any comments yet.`} />
      </div>
    );
  }

  renderMessagesTab() {

  }

  render() {
    const { user, loading } = this.props;
    if (loading) {
      return null;
    }

    this.activeView = this.props.params.view || 'posts';

    const haveGoals = user && user.goals;

    return (
      <div className={cx('profile-page', { 'no-goals': !haveGoals })}>
        {haveGoals && <Goal goal={user.goals[0]} user={user} edit={this.canEdit()} />}
        <div className="col-sm-12 col-md-4">
          <ProfileStats user={user} />
        </div>

        <div className="col-sm-12 col-md-8 tabs-wrapper">
          {haveGoals && this.renderTabs()}
          {this.renderActiveTab()}
        </div>
      </div>
    );
  }
}

export default createContainer(({ params }) => {
  const { username } = params;
  const userHandle = Meteor.subscribe('user.profile', username);
  return {
    user: Meteor.users.findOne({ username }),
    loading: !userHandle.ready()
  };
}, Profile);


class Goal extends Component {
  static propTypes = {
    goal: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    edit: PropTypes.bool
  };

  static defaultProps = {
    edit: false
  };

  constructor(props) {
    super(props);
    this.showUpdateForm = this.showUpdateForm.bind(this);
    this.hideUpdateForm = this.hideUpdateForm.bind(this);
    this.saveCurrentWeight = this.saveCurrentWeight.bind(this);
  }

  state = {
    isEditingWeight: false
  };

  hideUpdateForm(e) {
    if (e) {
      e.preventDefault();
    }
    this.setState({
      isEditingWeight: false
    });
  }

  saveCurrentWeight(doc) {
    updateGoalWeight.call({ ...doc }, (err) => {
      if (err) {
        Alert.error(err);
      } else {
        this.hideUpdateForm();
      }
    });
  }

  getProgressPercentage() {
    const { goal } = this.props;
    const totalToLose = goal.startingWeight - goal.plannedWeight;
    const totalLost = goal.startingWeight - goal.currentWeight;
    const percentage = parseInt((totalLost / totalToLose) * 100, 10);
    return { progressPercentage: percentage > 0 ? percentage < 101 ? percentage : 100 : 0, realPercentage: percentage };
  }

  showUpdateForm(e) {
    if (e) {
      e.preventDefault();
    }
    this.setState({
      isEditingWeight: true
    });
  }

  renderCurrentWeight() {
    const { goal, edit } = this.props;
    return (
      <div>
        Current Weight:<br />
        <span className="weight">{goal.currentWeight} lbs</span><br />
        <span className="date">{moment(goal.updatedAt).format('LL')}</span>

        {edit &&
        <div className="update">
          <a href="/" onClick={this.showUpdateForm}>Update</a>
          <Link to="/new/goal">Set New Goal</Link>
        </div>
        }
      </div>
    );
  }

  renderWeightUpdateForm() {
    return (
      <div className="weight-edit-form">
        Current Weight:
        <AutoForm
          schema={currentWeightSchema}
          onSubmit={this.saveCurrentWeight}
        >
          <NumField name="currentWeight" inputClassName="small" label={false} />
          <a href="/" onClick={this.hideUpdateForm}>Cancel</a>
          <button className="btn">Save</button>
        </AutoForm>
      </div>
    );
  }


  render() {
    const { goal, user, edit } = this.props;
    const { isEditingWeight } = this.state;
    const { progressPercentage, realPercentage } = this.getProgressPercentage();

    return (
      <div className="profile-page-goal jumbotron">
        <h2>Current Goal {goal.plannedWeight} lbs!</h2>
        <div className="row wrapper">
          <div className="col-sm-12 col-md-4 starting-weight">
            Starting Weight:<br />
            <span className="weight"> {goal.startingWeight} lbs</span>
            <span className="date">{moment(goal.createdAt).format('LL')}</span>
          </div>
          <div className="col-sm-12 col-md-4 circular-progress">
            <CircularProgressbar
              percentage={progressPercentage}
              textForPercentage={() => `${realPercentage}%`}
              initialAnimation
            />
          </div>
          <div className="col-sm-12 col-md-4 current-weight">
            {!isEditingWeight ? this.renderCurrentWeight() : this.renderWeightUpdateForm()}
          </div>
        </div>
      </div>
    );
  }
}
