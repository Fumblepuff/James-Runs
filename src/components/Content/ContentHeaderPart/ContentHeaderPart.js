
import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';
import {
  Text,
  Button,
} from 'native-base';

import {
  gs,
} from 'src/styles';

import styles from './styles';

const ContentHeaderPart = ({
  textLeft,
  textRight,
  onPressRight,
}) => (
  <View style={styles.container}>
    <View style={gs.flex}>
      <Text style={[styles.textLeft]}>{textLeft}</Text>
    </View>
    <View style={gs.flex}>
      <Button
        full
        style={styles.button}
        onPress={onPressRight}
      >
        <Text style={styles.textBtn}>{textRight}</Text>
      </Button>
    </View>
  </View>
);

ContentHeaderPart.propTypes = {
  textLeft: PropTypes.string.isRequired,
  textRight: PropTypes.string.isRequired,
  onPressRight: PropTypes.func,
};

ContentHeaderPart.defaultProps = {
  onPressRight: () => null,
};

export default ContentHeaderPart;
