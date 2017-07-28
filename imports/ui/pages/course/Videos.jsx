import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Courses } from '/imports/api/courses/courses';

class Videos extends Component {
  static propTypes = {
    courses: PropTypes.array.isRequired
  };

  renderCourse(course) {
    return (
      <div className="video-entry" key={course._id}>
        <div className="row">
          <div className="col-sm-12 col-md-7">
            <h2 className="title">{course.title}</h2>
            <h2 className="subtitle">{course.subtitle}</h2>
            <img className="img-responsive hidden-md hidden-lg" src={course.image} alt={course.title} />
            <p className="lead">{course.videoDescription}<span> {course.description}</span></p>
            <Link className="btn btn-danger btn-large" to={`/video/${course.slug}`}>Get Started</Link>
          </div>
          <div className="col-md-5 hidden-xs hidden-sm">
            <img className="img-responsive" src={course.image} alt={course.title} />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { courses } = this.props;

    return (
      <div className="videos-page wrapper-large">
        {courses.map(c =>
          this.renderCourse(c)
        )}
      </div>
    );
  }
}

export default createContainer(() => {
  const coursesHandle = Meteor.subscribe('courses.list');
  return {
    courses: Courses.find({ }, { sort: { createdAt: 1 } }).fetch() || [],
    loading: !coursesHandle.ready()
  };
}, Videos);
