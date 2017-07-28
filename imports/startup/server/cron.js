import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/percolate:synced-cron';
import { AutomaticEmails } from '/imports/api/emails/server';
import { fetchInstagramFeed } from '/imports/api/server/instagram';
import { updateNewsStand} from '/imports/api/server/newsstand';

Meteor.startup(() => {
  SyncedCron.add({
    name: 'Sending emails for not active users',
    schedule(parser) {
      return parser.text('at 3:00pm');
    },
    job() {
      AutomaticEmails.inactiveUsers();
    }
  });

  SyncedCron.add({
    name: 'Sending emails asking to update goal',
    schedule(parser) {
      return parser.text('at 4:00pm');
    },
    job() {
      AutomaticEmails.updateGoal();
    }
  });


  SyncedCron.add({
    name: 'Sending emails reminding them they still have x pounds pending from their goal',
    schedule(parser) {
      return parser.text('at 5:00pm');
    },
    job() {
      AutomaticEmails.remindGoal();
    }
  });


  SyncedCron.add({
    name: 'Sending emails for users who have over 50 chat messages unread',
    schedule(parser) {
      return parser.text('at 6:00pm');
    },
    job() {
      AutomaticEmails.chatMessages();
    }
  });

  SyncedCron.add({
    name: 'Updating instagram feed',
    schedule(parser) {
      return parser.text('every 10 minutes');
    },
    job() {
      fetchInstagramFeed();
    }
  });

  SyncedCron.add({
    name: 'Updating Newsstand feed',
    schedule(parser) {
      return parser.text('every 12 minutes');
    },
    job() {
      updateNewsStand();
    }
  });


  SyncedCron.add({
    name: 'Send email for unread private messages',
    schedule(parser) {
      return parser.text('every 15 minutes');
    },
    job() {
      AutomaticEmails.privateChatMessages();
    }
  });

  SyncedCron.start();
});
