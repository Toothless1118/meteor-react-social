import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { ChatMessages } from '../chatMessages';

export const getUnreadChatMessagesCount = new ValidatedMethod({
  name: 'chatMessages.getUnreadChatMessagesCount',
  validate: null,
  run({ lastViewed }) {
    return ChatMessages.find({ createdAt: { $gt: lastViewed } }, { limit: 100 }).count();
  }
});
