import React, {
  useImperativeHandle,
  forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';
import {
  Text,
} from 'native-base';
import DropdownAlert from 'react-native-dropdownalert';

import {
  gs,
  cls,
} from 'src/styles';

import toastConstants from './toastConstants';

const Toast = forwardRef(({
  onTapCallback,
}, ref) => {
  const alertRef = React.useRef(null);

  useImperativeHandle(ref, () => ({
    show(text, message, options = {}) {
      const {
        type = toastConstants.TYPES.INFO,
        ...restOptions
      } = options;

      alertRef.current.alertWithType(type, text, message, restOptions, toastConstants.CLOSE_INTERVAL);
    },
  }));

  const renderTitle = (state) => {
    const { title } = state;

    if (!title) {
      return null;
    }

    return (
      <Text style={gs.fontBold}>{title}</Text>
    );
  };

  const renderMessage = (state) => {
    const { message } = state;

    return (
      <View>
        <Text>
          {message}
        </Text>
      </View>
    );
  };

  const renderContainer = (_propsINp, state) => (
    <View style={[gs.mH10, gs.mB10, gs.mT5]}>
      {renderTitle(state)}
      {renderMessage(state)}
    </View>
  );

  return (
    <DropdownAlert
      ref={alertRef}
      zIndex={1000000}
      useNativeDriver
      panResponderEnabled={false}
      updateStatusBar={false}
      renderImage={() => null}
      renderTitle={() => null}
      renderMessage={renderContainer}
      defaultContainer={{}}
      defaultTextContainer={gs.flex}
      errorColor={cls.red2}
      onTap={onTapCallback}
    />
  );
});

Toast.propTypes = {
  onTapCallback: PropTypes.func,
};

Toast.defaultProps = {
  onTapCallback: () => null,
};

export default Toast;
