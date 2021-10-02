
import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Icon,
} from 'native-base';

import {
  StyleType,
} from 'src/common/Types';

import styles from './styles';

const CheckBox = (props) => {
  const {
    checked,
    onPress,
    text,
    style,
    disabled,
    markDisabled,
    ...restProps
  } = props;
  const styleCheckboxBl = [styles.checkboxBl];
  const styleCheckbox = [styles.checkbox];
  const styleText = [styles.text];

  if (disabled || markDisabled) {
    styleCheckboxBl.push(styles.checkboxBlDisabled);
  }

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      {...restProps}
      disabled={disabled}
      onPress={onPress}
    >
      <View style={styleCheckboxBl}>
        {checked && (
          <Icon
            type="MaterialCommunityIcons"
            name="check-bold"
            style={styleCheckbox}
          />
        )}
      </View>
      {text && <Text style={styleText} white>{text}</Text>}
    </TouchableOpacity>
  );
};

CheckBox.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  markDisabled: PropTypes.bool,
  onPress: PropTypes.func,
  text: PropTypes.string,
  style: StyleType,
};

CheckBox.defaultProps = {
  checked: false,
  disabled: false,
  markDisabled: false,
  onPress: () => null,
  text: null,
  style: {},
};

export default CheckBox;
