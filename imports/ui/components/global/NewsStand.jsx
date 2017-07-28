import React, { Component } from 'react';
import PropTypes from 'prop-types';
import extractDomain from 'extract-domain';
import { get } from '/imports/api/feeds/methods';
import Loader from '/imports/ui/components/global/ComponentLoader.jsx';

const tabs = [{
  id: 'healthy-living',
  title: 'Healthy Living'
}];

export default class NewsStand extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.string),
    activeTab: PropTypes.string,
    count: PropTypes.Number
  };

  static defaultProps = {
    items: ['healthy-living'],
    activeTab: 'healthy-living',
    count: 5
  };

  constructor(props) {
    super(props);
    this.POSTS_PER_PAGE = this.props.count;
    this.loadMore = this.loadMore.bind(this);
  }

  state = {
    activeTab: this.props.activeTab,
    page: 1,
    posts: [],
    hasMore: true,
    loading: true,
    moreLoaded: false
  };

  componentDidMount() {
    this.updateFeed();
  }

  loadMore(e) {
    e.preventDefault();
    this.setState({
      moreLoaded: true
    });
    // this.state.page = this.state.page + 1;
    // this.updateFeed();
  }

  updateFeed() {
    const { activeTab, page } = this.state;
    this.setState({
      loading: true
    });

    get.call({ group: activeTab, page, perPage: this.POSTS_PER_PAGE + 10 }, (err, { posts, hasMore } = {}) => {
      if (!err) {
        this.setState({ posts, hasMore: posts.length > this.POSTS_PER_PAGE, loading: false });
      } else {
        console.log(err);
      }
    });
  }

  renderTab() {
    return null;
  }

  renderMoreButton() {
    return (
      <a className="more" onClick={this.loadMore}>More</a>
    );
  }

  renderPosts() {
    const posts = !this.state.moreLoaded ? this.state.posts.slice(0, this.POSTS_PER_PAGE) : this.state.posts;
    return (
      <ul>
        {posts.map(post =>
          <li key={post._id}>
            <a href={post.link} target="_blank" rel="noopener noreferrer">
              <div className="title">
                {post.title}
                <span className="source">{extractDomain(post.link)}</span>
              </div>
            </a>
          </li>
        )}
      </ul>
    );
  }

  render() {
    const { items } = this.props;
    const { loading, moreLoaded, hasMore } = this.state;

    return (
      <div className="newsstand-feed">
        <div className="title">Trending articles</div>
        {items.map(item => this.renderTab(item))}
        <div className="tab-content">
          {!loading ? this.renderPosts() : <Loader />}
          {!moreLoaded && hasMore ? this.renderMoreButton() : null}
        </div>
      </div>
    );
  }
}
