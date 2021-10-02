
import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';
import {
  Text,
} from 'native-base';

import {
  Children,
  StyleType,
} from 'src/common/Types';

import styles from 'src/styles/Style';

import {
  gs,
} from 'src/styles';

const FormItem = ({
  children,
  label,
  note,
  style,
}) => {
  const renderLabel = () => {
    if (!label) {
      return null;
    }

    return (
      <Text
        style={[
          styles.textLabel,
          (note ? gs.pB5 : {}),
        ]}
      >
        {label}
      </Text>
    );
  };

  const renderNote = () => {
    if (!note) {
      return null;
    }

    return (
      <Text style={[styles.textNote]}>{note}</Text>
    );
  };

  return (
    <View style={[styles.inputContainer, style]}>
      {renderLabel()}
      {renderNote()}
      <View>
        {children}
      </View>
    </View>
  );
};

FormItem.propTypes = {
  children: Children.isRequired,
  label: PropTypes.string,
  note: PropTypes.string,
  style: StyleType,
};

FormItem.defaultProps = {
  label: null,
  note: null,
  style: {},
};

export default FormItem;
