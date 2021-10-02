
import React, {
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
} from 'react-native';

import {
  StyleType,
} from 'src/common/Types';

import {
  cls,
} from 'src/styles';

const SpinnerLocal = forwardRef(({
  visible: visibleProps,
  style,
}, ref) => {
  const [visible, setVisible] = useState(false);
  const isVisible = visible || visibleProps;

  useImperativeHandle(ref, () => ({
    show() {
      setVisible(true);
    },
    hide() {
      setVisible(false);
    },
  }));

  if (!isVisible) {
    return null;
  }

  return (
    <ActivityIndicator
      size="large"
      color={cls.blue}
      style={style}
    />
  );
});

SpinnerLocal.propTypes = {
  visible: PropTypes.bool,
  style: StyleType,
};

SpinnerLocal.defaultProps = {
  visible: false,
  style: {},
};

export default SpinnerLocal;
