import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { Comments } from '/imports/api/comments/comments';
import Comment from '/imports/ui/components/comment/Comment.jsx';
import InfiniteScroll from 'react-infinite-scroller';
import ComponentLoader from '/imports/ui/components/global/ComponentLoader.jsx';

class List extends Component {
  static defaultProps = {
    search: {}
  };

  static propTypes = {
    search: PropTypes.object,
    comments: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.loadItems = debounce(this.loadItems.bind(this), 1000);
    this.hasMoreItems = this.hasMoreItems.bind(this);
  }

  state = {
    totalComments: 0
  };

  componentDidMount() {
    const { search } = this.props;
    Meteor.call('comments.getCount', { search }, (err, count) => {
      if (!err) {
        this.setState({
          totalComments: count
        });
      }
    });
  }

  loadItems(page) {
    const { search } = this.props;
    Meteor.subscribe('comments.list', search, (page + 1) * 5);
  }

  hasMoreItems() {
    return this.state.totalComments > this.props.comments.length;
  }

  render() {
    const { comments } = this.props;
    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={this.loadItems}
        hasMore={this.hasMoreItems()}
        loader={<ComponentLoader />}
      >
        <div className="comments">
          {comments.map(c =>
            <Comment comment={c} key={c._id} />
          )}
        </div>
      </InfiniteScroll>
    );
  }
};

export default createContainer(({ search = {} }) => {
  const commentsHandle = Meteor.subscribe('comments.list', search, 5);
  return {
    comments: Comments.find({ ...search }, { sort: { createdAt: -1 } }).fetch() || [],
    loading: !commentsHandle.ready()
  };
}, List);