import React, { Component } from 'react';
import PostForm from '/imports/ui/components/post/Form.jsx';

export default class CourseCompleted extends Component {
  render() {
    return (
      <div className="course-complete wrapper-large">
        <h1>Congratulations! <br />You Have Completed This Course</h1>
        <h3>
          Your progress starts here! Stay in touch with the community to remain accountable and lose weight faster.
        </h3>
        <h4>Ask A Question or tell the community about yourself!</h4>
        <PostForm />
      </div>
    );
  }
}
