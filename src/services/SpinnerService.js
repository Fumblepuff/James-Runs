
import React, {
  Component,
  createRef,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Spinner from 'src/components/Spinner';

class SpinnerService extends Component {
  static spinnerRef = createRef();

  static spinnerModalRef = createRef();

  static getSpinnerRef() {
    return SpinnerService.spinnerModalRef.current || SpinnerService.spinnerRef.current;
  }

  static setSpinnerRef(ref, isModal) {
    if (isModal) {
      SpinnerService.spinnerModalRef.current = ref;
    } else {
      SpinnerService.spinnerRef.current = ref;
    }
  }

  static show = () => {
    const spinnerRef = SpinnerService.getSpinnerRef();
    if (!spinnerRef) {
      return;
    }

    spinnerRef.show();
  };

  static hide = (callback = () => null) => {
    const spinnerRef = SpinnerService.getSpinnerRef();
    if (!spinnerRef) {
      return;
    }

    spinnerRef.hide(callback);
  };

  render() {
    const { isApiRequest, isModal } = this.props;
    const visible = isApiRequest;

    return (
      <Spinner
        ref={(ref) => SpinnerService.setSpinnerRef(ref, isModal)}
        visible={visible}
      />
    );
  }
}

SpinnerService.propTypes = {
  isApiRequest: PropTypes.bool.isRequired,
  isModal: PropTypes.bool,
};

SpinnerService.defaultProps = {
  isModal: false,
};

const mapStateToProps = (state) => ({
  isApiRequest: state.network.isApiRequest,
});

export default connect(mapStateToProps)(SpinnerService);
