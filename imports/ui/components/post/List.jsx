import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { createContainer } from 'meteor/react-meteor-data';
import InfiniteScroll from 'react-infinite-scroller';
import { Posts } from '/imports/api/posts/posts';
import Post from '/imports/ui/components/post/Post.jsx';
import ComponentLoader from '/imports/ui/components/global/ComponentLoader.jsx';
import PageLoader from '/imports/ui/components/global/PageLoader.jsx';
import { browserHistory } from 'react-router';
const POSTS_PER_PAGE = 5;

class List extends Component {
  static defaultProps = {
    search: {},
    customMethod: null,
    notFoundMessage: 'Not posts found.'
  };

  static propTypes = {
    loading: PropTypes.bool.isRequired,
    search: PropTypes.object,
    customMethod: PropTypes.string,
    posts: PropTypes.array.isRequired,
    notFoundMessage: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.loadItems = debounce(this.loadItems.bind(this), 1000);
  }

  state = {
    totalPosts: 0,
    page: 0
  };

  componentDidMount() {
    this.getCount();
  }

  componentWillReceiveProps() {
    this.getCount();
  }

  getCount() {
    const { search } = this.props;
    Meteor.call('posts.getCount', { search }, (err, count) => {
      if (!err) {
        this.setState({
          totalPosts: count
        });
      }
    });
  }

  loadItems(page) {
    this.setState({ page });
    const { search, customMethod } = this.props;
    Meteor.subscribe(customMethod || 'posts.list', search, (page) * POSTS_PER_PAGE);
  }

  hasMoreItems() {
    return this.state.totalPosts > this.props.posts.length;
  }

  render() {
    const { posts, loading, notFoundMessage } = this.props;
    if (!loading && !posts.length) {
      return (
        <div className="wrapper-small well text-center">
          {notFoundMessage}
        </div>
      );
    }
    return (
      <InfiniteScroll
        pageStart={this.state.page}
        loadMore={this.loadItems}
        hasMore={this.hasMoreItems()}
        loader={<ComponentLoader />}
      >
        <div className="posts-list">
          {posts.slice(0, (this.state.page + 1) * POSTS_PER_PAGE).map(p =>
            <Post post={p} key={p._id} />
          )}
        </div>
      </InfiniteScroll>
    );
  }
}

export default createContainer(({ search = {} }) => {
  const postsHandle = Meteor.subscribe('posts.list', search, POSTS_PER_PAGE);
  return {
    posts: Posts.find(search, { sort: { createdAt: -1 } }).fetch() || [],
    loading: !postsHandle.ready()
  };
}, List);
