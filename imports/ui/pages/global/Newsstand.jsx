import React from 'react';
import { Link } from 'react-router';
import NewsStand from '/imports/ui/components/global/NewsStand.jsx';

const Newsstand = () => (<div className="newsstand-page">
  <div className="mobile-home-nav hidden-md hidden-lg">
    <Link to="/" activeClassName="active"><i className="fa fa-home" /></Link>
    <Link to="/newsstand" activeClassName="active"><i className="fa fa-rss" /></Link>
  </div>
  <NewsStand count={10} /></div>
);

export default Newsstand;
