import React from 'react';
import { Link } from 'react-router';

const LoginTo = ({ description, className }) => {
  return (
    <div className={`${className || ''}`}>
      <div className="text-center">
        <Link to="/login">Log in</Link> {description}
      </div>
    </div>
  );
};

export default LoginTo;
