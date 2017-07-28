import { Meteor } from 'meteor/meteor';
import { Courses } from '../courses';

Meteor.publish('courses.list', () => {
  return Courses.find();
});

Meteor.publish('courses.single', (slug, id) => {
  return Courses.find({
    slug
  }, {
    fields: Courses.publicFields
  });
});
