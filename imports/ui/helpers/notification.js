import Alert from 'react-s-alert';
import { t } from '/imports/ui/helpers/translate';

/**
 * Create a toastr notification
 * @param type
 * @param message
 * @param options
 */
const error = (message, options = {}) => {
  Alert.error(message.reason || message.message || message.error || message, ...options);
};


const success = (message, options = {}) => {
  Alert.success(message, ...options);
};

export default {
  error,
  success
};
