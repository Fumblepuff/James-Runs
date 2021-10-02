
import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';
import {
  Text,
  Button,
  Icon,
} from 'native-base';

import {
  StyleType,
} from 'src/common/Types';

import styles from './styles';

const Counter = ({
  style,
  value,
  onChange,
}) => {
  const modifyValue = (plusSkill = true) => {
    let count = value;

    if (plusSkill) {
      count += 1;
    } else {
      count -= 1;
    }

    if (count < 0) {
      return;
    }

    onChange(count);
  };

  return (
    <View style={[styles.container, style]}>
      <Button
        primary
        onPress={() => modifyValue()}
      >
        <Icon
          name="add"
        />
      </Button>

      <Text white style={styles.text}>{value}</Text>

      <Button
        primary
        onPress={() => modifyValue(false)}
      >
        <Icon name="ios-remove" />
      </Button>
    </View>
  );
};

Counter.propTypes = {
  style: StyleType,
  value: PropTypes.number,
  onChange: PropTypes.func,
};

Counter.defaultProps = {
  style: {},
  value: 0,
  onChange: () => null,
};

export default Counter;
