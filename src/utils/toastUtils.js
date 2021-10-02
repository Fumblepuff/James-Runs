
import {
  toastConstants,
} from 'src/components/Toast';

import ApiUtils from 'src/utils/ApiUtils';

import {
  ToastService,
} from 'src/services';

const toastUtils = {
  show(message, title) {
    ToastService.show(message, title);
  },

  showError(messageInp, title) {
    const messageDef = 'unknown error';
    let message = messageDef;

    if (typeof messageInp === 'object') {
      const apiError = ApiUtils.hasError(messageInp);

      if (apiError) {
        message = apiError;
      } else if (messageInp.message) {
        message = messageInp.message;
      }
    } else if (typeof messageInp === 'string') {
      message = messageInp;
    }

    ToastService.show(message, title, {
      type: toastConstants.TYPES.ERROR,
    });
  },
};

export default toastUtils;
