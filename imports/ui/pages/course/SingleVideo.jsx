import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Courses } from '/imports/api/courses/courses';

class SingleVideo extends Component {
  static propTypes = {
    course: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired
  };

  isFirst() {
    const { id } = this.props;
    return id === 1;
  }

  isLast() {
    const { course, id } = this.props;
    return course.videosCount === id;
  }

  render() {
    const { course, loading, id } = this.props;
    if (loading) {
      return null;
    }

    const video = course.videos[id - 1];

    if (!video) {
      return null;
    }

    return (
      <div className="single-video-page wrapper-large">
        <div className="video-wrapper">
          <iframe src={video.url} frameBorder="0" scrolling="auto" />
        </div>
        <div className="video-title">{id}. {video.title}</div>
        <div className="buttons">
          {!this.isFirst() && <Link to={`/video/${course.slug}/${id - 1}`} className="btn btn-danger">Previous</Link>}
          {this.isLast() ?
            <Link to="/video/congratulations" className="btn btn-success">You Are Done!</Link> :
            <Link to={`/video/${course.slug}/${id + 1}`} className="btn btn-danger">Continue</Link>
          }
        </div>
      </div>
    );
  }
}

export default createContainer(({ params: { slug, id = 1 } }) => {
  const videoHandle = Meteor.subscribe('courses.single', slug, id);
  return {
    course: Courses.findOne({ slug }) || {},
    loading: !videoHandle.ready(),
    id: parseInt(id, 10)
  };
}, SingleVideo);
