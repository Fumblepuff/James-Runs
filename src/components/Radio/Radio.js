
import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Radio as RadioNB,
} from 'native-base';

import {
  StyleType,
} from 'src/common/Types';

import {
  cls,
} from 'src/styles';

import styles from './styles';

const Radio = ({
  checked,
  style,
  onPress,
  text,
}) => {
  const styleContainer = [styles.container, style];

  return (
    <TouchableOpacity
      style={styleContainer}
      onPress={onPress}
    >
      <RadioNB
        color={cls.blue2}
        selectedColor={cls.blue2}
        selected={checked}
        standardStyle
        onPress={onPress}
      />
      {text && <Text style={styles.text} white>{text}</Text>}
    </TouchableOpacity>
  );
};

Radio.propTypes = {
  checked: PropTypes.bool,
  onPress: PropTypes.func,
  text: PropTypes.string,
  style: StyleType,
};

Radio.defaultProps = {
  checked: false,
  onPress: () => null,
  text: null,
  style: {},
};

export default Radio;
