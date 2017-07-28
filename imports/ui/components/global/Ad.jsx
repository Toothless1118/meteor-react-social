import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Ad extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired
  }

  componentDidMount(){
    (adsbygoogle = window.adsbygoogle || []).push({});
  }


  renderAd() {
    switch (this.props.type) {
      case 'sidebar':
        return (
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-3640037651036350"
            data-ad-slot="9273210525"
          />
        );
      default:
        return null;
    }
  }

  render() {
    return <div className="ad">{this.renderAd()}</div>;
  }
}
