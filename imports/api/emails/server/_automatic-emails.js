import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { forEach, uniq } from 'lodash';
import { ProfileThumbImage } from '/imports/ui/helpers/user';
import { Conversations } from '/imports/api/conversations/conversations';
import { ChatMessages } from '/imports/api/chatMessages/chatMessages';
import { UsersList, NotificationEmail } from './';
import { sendEmail } from './sendEmail';

/**
 * Send an email for inactive users for 5 days.
 * Finding a random person who has updated their goal during last few days
 * and sending it
 */
const inactiveUsers = () => {
  const DAYS = 5; // Days
  // Find all inactive users
  const inactiveUsers = Meteor.users.find({
    'status.lastLogin.date': {
      $lt: moment().subtract(DAYS, 'days').toDate()
    },
    email: {
      $exists: true
    },
    $or: [
      { createdAt: {
          $gt: moment().subtract(30, 'days').toDate()
        }
      },
      { 'status.lastLogin.date': {
          $gt: moment().subtract(30, 'days').toDate()
        }
      }
    ]
  }, {
    fields: {
      firstName: 1,
      email: 1
    }
  }).fetch();

  const usersWhoSetGoal = Meteor.users.find({
    'goals.0.createdAt': {
      $gt: moment().subtract(DAYS, 'days').toDate()
    }
  }, {
    sort: {
      'status.lastLogin.date': -1
    },
    limit: 3,
    fields: {
      username: 1,
      image: 1,
      goals: {
        $slice: 1
      }
    }
  }).fetch();

  const users = usersWhoSetGoal.map((u) => {
    return {
      username: u.username,
      image: ProfileThumbImage(u.image),
      emailText: `Wants to lose ${u.goals[0].startingWeight - u.goals[0].plannedWeight} lbs!`
    };
  });

  if (!users.length) {
    return;
  }

  inactiveUsers.map((u) => {
    sendEmail({
      to: u.email,
      subject: 'A lot has happened since you last logged in...',
      html: UsersList({
        receiverFirstName: u.firstName,
        url: Meteor.absoluteUrl(),
        subject: 'A lot has happened since you last logged in...',
        body: 'Since you last logged in, these users set new goal. Why not join them?',
        users
      })
    });
  });

};


/**
 * Send an email asking to update their goal
 */
const updateGoal = () => {
  const DAYS = [3, 7, 14, 30, 60, 90].map(day => {
    return {
      'goals.0.updatedAt': {
        $gt: moment().subtract(day, 'days').startOf('day').toDate(),
        $lt: moment().subtract(day, 'days').endOf('day').toDate()
      }
    };
  })


  // Find all inactive users
  const users = Meteor.users.find({
    $or: DAYS,
    email: {
      $exists: true
    }
  }, {
    fields: {
      firstName: 1,
      email: 1,
      goals: {
        $slice: 1
      }
    }
  }).fetch();

  users.map(u => {
    sendEmail({
      to: u.email,
      subject: 'Community is waiting for your update',
      html: NotificationEmail({
        receiverFirstName: u.firstName,
        url: Meteor.absoluteUrl(),
        subject: 'Community is waiting for your update',
        body: `It's been almost ${moment(u.goals[0].updatedAt).fromNow(true)} since you updated your weight. Let your friends know how are you doing with your goal!`
      })
    });
  });
};


/**
 * Sending emails reminding them they still have x pounds pending from their goal
 */
const remindGoal = () => {
  const DAYS = [4, 9, 17, 35, 65, 95].map(day => {
    return {
      'goals.0.createdAt': {
        $gt: moment().subtract(day, 'days').startOf('day').toDate(),
        $lt: moment().subtract(day, 'days').endOf('day').toDate()
      }
    }
  })


  // Find all inactive users
  const users = Meteor.users.find({
    $or: DAYS,
    email: {
      $exists: true
    }
  }, {
    fields: {
      firstName: 1,
      email: 1,
      goals: {
        $slice: 1
      }
    }
  }).fetch();


  users.map(u => {
    const diff = u.goals[0].currentWeight - u.goals[0].plannedWeight;
    const body = diff > 0 ?
      `When you made the last update, you were only ${diff} lbs away from your goal! Let the community know how are you doing by updating your current weight!`
      : `You have already surpassed your goal by ${Math.abs(diff)} lbs. Maybe it's time to set a new goal?`;

    sendEmail({
      to: u.email,
      subject: 'How are you doing with your goal?',
      html: NotificationEmail({
        receiverFirstName: u.firstName,
        url: Meteor.absoluteUrl(),
        subject: 'How are you doing with your goal?',
        body
      })
    });
  });
};


/**
 * Sending emails for users who have over 50 chat messages unread
 */
const chatMessages = () => {
  const messages = 50;

  const chats = ChatMessages.find({}, { sort: { createdAt: -1 }, limit: 50 }).fetch()

  const lastTime = chats[chats.length - 1].createdAt;

  // Find all inactive users
  const users = Meteor.users.find({
    'stats.lastViewedPublicChat': {
      $lt: lastTime
    },
    email: {
      $exists: true
    },
    $or: [
      { createdAt: {
        $gt: moment().subtract(30, 'days').toDate()
      }
      },
      { 'status.lastLogin.date': {
        $gt: moment().subtract(30, 'days').toDate()
      }
      }
    ]
  }, {
    fields: {
      firstName: 1,
      email: 1
    }
  }).fetch();


  users.map(u => {
    sendEmail({
      to: u.email,
      subject: 'You have unread messages',
      html: NotificationEmail({
        receiverFirstName: u.firstName,
        url: `${Meteor.absoluteUrl()}chat`,
        subject: 'You have unread messages',
        body: `You have over ${messages} unread messages since your last visit. Don't miss anything important!`
      })
    });
  });
};


export const privateChatMessages = () => {
  const ago = moment().subtract(15, 'minutes').toDate();

  const conversations = Conversations.find({
    updatedAt: {
      $gt: ago
    }
  }, {
    fields: {
      badgesCount: 1
    }
  }).fetch();

  const users = [];
  conversations.map((conv) => {
    if (conv.badgesCount) {
      forEach(conv.badgesCount, (count, key) => {
        if (count > 0) {
          users.push(key);
        }
      });
    }
  });

  const uniqUsers = uniq(users);

  const usersData = Meteor.users.find({
    _id: { $in: uniqUsers },
    email: { $exists: true },
    accountStatus: 'active',
    'status.online': false
  }, {
    $fields: {
      firstName: 1,
      email: 1
    }
  });

  usersData.map((u, key) => {
    Meteor.setTimeout(() => {
      sendEmail({
        to: u.email,
        subject: 'You have unread messages',
        html: NotificationEmail({
          receiverFirstName: u.firstName,
          url: `${Meteor.absoluteUrl()}conversations`,
          subject: 'You have unread messages',
          body: 'You have unread private chat messages. Login now to reply!'
        })
      });
    }, key * 200);
  });
};

export default {
  inactiveUsers,
  updateGoal,
  remindGoal,
  chatMessages,
  privateChatMessages
};
