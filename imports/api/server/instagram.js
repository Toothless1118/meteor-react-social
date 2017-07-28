import { Meteor } from 'meteor/meteor';
import { InstagramPosts } from 'instagram-screen-scrape';
import { Posts } from '/imports/api/posts/posts'
import moment from 'moment';

const users = ['amandabisk', '_fitbaby','linamarie42403', '_autumnstarr', 'dopeitsali', 'angelcrickmore', 'lobsgetsfit', 'dopeitsali', 'lyssfit24']
const others = ['jmb_sospicy', 'louisefitbrock','jodilounds', 'thoroughbred1913','fabshoenista','meli_gettinfit0511','misscarlijay_healthyliving','wellnesscoach_stephy','lb_flufftobuff','jules_vsg','anniceblaine54','jemma_makeupartistry','kellies_journey','healthy_living_bella','persistencepays','siedahslimmingdown','successful_weightloss.goal','dianas_big_journey','fitfulfilledandfocused','krystlefit','vsg_estrellita','talias_resolution']
Meteor.startup(() => {
  users.map((usr) => {
    if (!Meteor.users.findOne({ username: usr })) {
      Meteor.users.insert({
        username: usr,
        autoAccount: 'instagram',
        createdAt: randomDate(new Date(2017, 2, 1), new Date(2017, 4, 19)),
        email: 'dovek53@gmail.com',
        accountStatus: 'active'
      });
    } else {
      console.log('User for instagram already exists', usr);
    }
  });
});

export const fetchInstagramFeed = () => {
  const checkTime = moment().subtract(10, 'minutes').utc();

  users.map((u, key) => {
    Meteor.setTimeout(() => {
      const streamOfPosts = new InstagramPosts({
        username: u
      });

      const user = Meteor.users.findOne({
        username: u
      });

      let count = 0;

      streamOfPosts.on('data', Meteor.bindEnvironment((post) => {
        const time = new Date(post.time * 1000);

        if (moment(time).isBefore(checkTime)) {
          streamOfPosts.destroy();
        } else {
          const image = { };
          if (post.media) {
            image.images = [{ url: post.media }];
          }

          const postId = Posts.insert({
            createdAt: time,
            createdBy: user._id,
            username: post.username,
            post: (post.text || '').replace(/@\S+/g, '').replace(/#\S+/g, ''),
            commentsCount: 0,
            likesCount: 0,
            ...image
          }, { bypassCollection2: true });

          if (postId) {
            Meteor.users.update({ username: u }, {
              $inc: {
                'stats.posts': 1
              }
            });
          }
          if (count === 0) {
            count += 1;
            Meteor.users.update({ username: u }, {
              $set: {
                'status.lastLogin.date': time
              }
            });
          }
        }
      }));


    }, 2000 * key);
  });
};


function randomDate(start, end) {
  return new Date(+start + Math.random() * (end - start));
}
