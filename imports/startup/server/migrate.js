import { Meteor } from 'meteor/meteor';
import { Posts } from '/imports/api/posts/posts';
import { Comments } from '/imports/api/comments/comments';
import { Crourses } from '/imports/api/courses/courses';
import { Random } from 'meteor/random';
import { Mongo } from 'meteor/mongo';

// Meteor.startup(() => {
//   console.log('Total users to migrate', Meteor.users.find().fetch().length)
//   let usersMigrated = 0;
//   Meteor.users.find().fetch().map(user => {
//     try {
//       const subscription = {};
//       const goals = [];
//       if (user.paidMember) {
//         subscription.status = user.paidMember.status;
//         subscription.id = user.paidMember.subId;
//         subscription.type = user.paidMember.type;
//       }
//       if (user.profile.goals && user.profile.goals[0]) {
//         goals.push({
//           _id: Random.id(),
//           startingWeight: user.profile.goals[0].startingWeight,
//           plannedWeight: user.profile.goals[0].goalWeight,
//           currentWeight: user.profile.weightLog && user.profile.weightLog.length ? user.profile.weightLog[0].weight : user.profile.goals[0].startingWeight,
//           createdAt: user.profile.goals[0].createdAt,
//           updatedAt: user.profile.weightLog && user.profile.weightLog.length ? user.profile.weightLog[0].updatedAt : user.profile.goals[0].createdAt
//         });
//       }
//       Meteor.users.update(user._id, {
//         $set: {
//           firstName: user.profile.name,
//           lastName: user.profile.last_name,
//           email: user.emails && user.emails[0] ? user.emails[0].address : '',
//           accountStatus: user.profile.active ? 'active' : null,
//           image: user.profile.image ? user.profile.image.substring(user.profile.image.lastIndexOf('/') + 1) : null,
//           idealWeight: user.profile.idealWeight,
//           funFact: user.profile.funFact,
//           stats: {
//             lastViewedPublicChat: new Date(),
//             updates: (user.profile.weightLog || []).length
//           },
//           ...subscription,
//           goals
//         }
//       });
//       usersMigrated += 1;
//     } catch (e) {
//       console.log('Error migrating user', user._id, e)
//     }
//   })
//   console.log('sucessfully migrated users:', usersMigrated)
// })

//TODO: STATS COMMENTS AND STATS POSTS

// Meteor.startup(() => {
//   const questions = new Mongo.Collection('questions');
//   console.log('migrating questions:', questions.find().count())
//   let migrated = 0;
//     questions.find().fetch().map(q => {
//       try {
//         Posts.insert({
//           _id: q._id,
//           createdBy: q.user_id,
//           username: q.username,
//           userImage: (Meteor.users.findOne(q.user_id) || {}).image || null,
//           createdAt: q.submitted,
//           likesCount: q.likes || 0,
//           post: q.question,
//           likes: (q.upvoters || []).map(u => { return { userId: u, createdAt: new Date() } })
//         });
//         Meteor.users.update(q.user_id, {
//           $inc: {
//             'stats.posts': 1
//           }
//         });
//         migrated += 1;
//       } catch (e) {
//         console.log('Error migrating posts', e)
//       }
//     })
//   console.log('migrated', migrated)
// })

// Meteor.startup(() => {
//   const questions = new Mongo.Collection('questions');
//   questions.find().fetch().map(q => {
//     Posts.update(q._id, {
//       $set: {
//         createdAt: q.submitted
//       }
//     }, { bypassCollection2: true })
//   })
//   console.log('done')
// })



//TODO: update post comments count

// Meteor.startup(() => {
//   const answers = new Mongo.Collection('answers');
//   console.log('migrating comments:', answers.find().count())
//   let count = 0;
//   Comments.find().fetch().map(a => {
//     try {
//       Comments.update(a._id, {
//         $set: {
//           userImage: (Meteor.users.findOne(a.createdBy) || {}).image || null,
//         }
//       }, { bypassCollection2: true })
//       count++;
//     } catch (e) {
//       console.log('Error migrating', e)
//     }
//   })
//   console.log('migrated', count)
// })