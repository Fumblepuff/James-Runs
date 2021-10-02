import React, {
  Component,
  createRef,
} from 'react';
import PropTypes from 'prop-types';

import Toast from 'src/components/Toast';

class ToastService extends Component {
  static toastRef = createRef();

  static toastModalRef = createRef();

  static getToastRef() {
    return ToastService.toastModalRef.current || ToastService.toastRef.current;
  }

  static setToastRef(ref, isModal) {
    if (isModal) {
      ToastService.toastModalRef.current = ref;
    } else {
      ToastService.toastRef.current = ref;
    }
  }

  static show(message, title, options) {
    const toastRef = ToastService.getToastRef();

    if (!toastRef) {
      return;
    }

    toastRef.show(title, message, options);
  }

  render() {
    const { isModal, onModalClose } = this.props;

    return (
      <Toast
        ref={(ref) => ToastService.setToastRef(ref, isModal)}
        onTapCallback={onModalClose}
      />
    );
  }
}

ToastService.propTypes = {
  isModal: PropTypes.bool,
  onModalClose: PropTypes.func,
};

ToastService.defaultProps = {
  isModal: false,
  onModalClose: () => null,
};

export default ToastService;
