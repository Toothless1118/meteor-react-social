import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import HiddenField from 'uniforms-bootstrap3/HiddenField';
import { getYoutubeId } from '/imports/ui/helpers/string';

export default class ExternalLink extends Component {
  static defaultProps = {
    edit: false
  };

  static propTypes = {
    edit: PropTypes.bool,
    url: PropTypes.string,
    link: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
  }

  state = {
    info: this.props.link
  };

  componentDidMount() {
    if (this.props.edit) {
      this.getInfo();
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.props.edit) {
      this.props = newProps;
      this.getInfo();
    }
  }

  getInfo() {
    const { url } = this.props;
    Meteor.call('posts.getLinkInfo', { url }, (err, info) => {
      if (!err && info) {
        this.setState({ info });
      }
    });
  }

  close() {
    this.setState({
      info: null
    });
  }

  render() {
    const { edit, url } = this.props;
    const { info } = this.state;

    if (!info) {
      return null;
    }

    if (!info.url) {
      info.url = url;
    }

    const youtubeId = getYoutubeId(info.url);

    return (
      <div className="website-meta">
        <a href={info.url} target="_blank" rel="noopener noreferrer" className="no-hover">
          {youtubeId ?
            <YoutubeEmbed id={youtubeId} />
            :
            info.image && <img src={info.image} alt={info.title} />
          }
          <div className="details">
            <div className="title">{info.title}</div>
            {info.description && <div className="description">{info.description}</div>}
            <div className="url">{info.url}</div>
          </div>
          {edit &&
            <HiddenField name="link.url" value={url} />
          }
        </a>
        {edit &&
          <span onClick={this.close} className="close-btn"><i className="fa fa-close" /></span>
        }
      </div>
    );
  }
}


const YoutubeEmbed = ({ id }) => (
  <div className="video-wrapper">
    <iframe src={`https://www.youtube.com/embed/${id}?feature=player_embedded`} frameBorder="0" />
  </div>
);
