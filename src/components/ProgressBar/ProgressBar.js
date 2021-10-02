
import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';

import styles from './styles';

const ProgressBar = ({
  steps,
  currentStep,
}) => {
  const stepWidth = 1 / 3;

  return (
    <View style={styles.container}>
      <View style={styles.barBl}>
        {Array.from(Array(steps).keys()).map((item) => {
          const styleBar = (currentStep === (item + 1)) ? styles.barItemActive : {};

          return <View key={item} style={[styleBar, { flex: stepWidth }]} />;
        })}
      </View>
    </View>
  );
};

ProgressBar.propTypes = {
  steps: PropTypes.number,
  currentStep: PropTypes.number,
};

ProgressBar.defaultProps = {
  steps: 3,
  currentStep: 1,
};

export default ProgressBar;
