import { createStore } from 'redux';
import { filter } from 'lodash';

const openConversations = (state = [], action) => {
  switch (action.type) {
    case 'add':
      return { ...state, ...action.state };
    case 'remove':
      return filter(state, (conv => conv.conversationId !== action.state.conversationId));
    case 'minimize':
      return state;
    case 'maximize':
      return state;
    default:
      return state;
  }
};

export const openConversationsStore = createStore(openConversations);
