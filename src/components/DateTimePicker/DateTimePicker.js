
import React from 'react';
import PropTypes from 'prop-types';
import DateTimePickerPK from '@react-native-community/datetimepicker';
import { useDarkMode } from 'react-native-dynamic';
import _ from 'lodash';
import {
  View,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
} from 'native-base';

import moment from 'src/common/moment';
import {
  StyleType,
} from 'src/common/Types';
import deviceUtils from 'src/utils/deviceUtils';
import mainStyles from 'src/styles/Style';

import styles from './styles';

const DateTimePicker = ({
  value,
  title,
  onChange,
  isDate,
  isTime,
  isInputStyle,
  formatDateSelected,
  style,
}) => {
  const [isDateVisible, setIsDateVisible] = React.useState(false);
  const isDarkMode = useDarkMode();
  const styleContainer = [{ backgroundColor: !isDarkMode ? '#ffffff' : '#303030' }];
  const isShowPicker = (deviceUtils.isIOS || isDateVisible);
  const Container = deviceUtils.isIOS ? View : TouchableOpacity;
  let mode;
  let valueDateType = value;

  if (_.isNil(value)) {
    valueDateType = moment().toDate();
  } else if (typeof value === 'string') {
    valueDateType = moment(value).toDate();
  } else if (typeof value === 'object') {
    valueDateType = value;
  }

  let dateFormat = moment(valueDateType);

  if (isDate) {
    mode = 'date';
    dateFormat = dateFormat.format('MMM DD, YYYY');
  } else if (isTime) {
    mode = 'time';
    dateFormat = dateFormat.format('h:mm A');
  } else {
    dateFormat = dateFormat.format('YYYY DD MM hh:mm A');
  }

  if (isInputStyle) {
    styleContainer.push(styles.containerInput);
  } else {
    styleContainer.push(mainStyles.dateTimePicker);
  }

  const renderTitle = () => {
    if (isInputStyle) {
      return null;
    }

    return (
      <View
        style={styles.titleContainer}
      >
        <Text style={mainStyles.h1}>{title}</Text>
      </View>
    );
  };

  return (
    <Container
      style={[styleContainer, style]}
      onPress={() => {
        setIsDateVisible(true);
      }}
    >
      {renderTitle()}

      {!deviceUtils.isIOS && (
        <View style={styles.dateTextBl}>
          <Text style={styles.dateText}>{dateFormat}</Text>
        </View>
      )}

      {isShowPicker && (
        <DateTimePickerPK
          value={valueDateType}
          mode={mode}
          // display="spinner"
          is24Hour={false}
          onChange={(_event, date) => {
            if (!deviceUtils.isIOS) {
              setIsDateVisible(false);
            }

            // if (type !== 'set') {
            //   return;
            // }

            if (!date) {
              return;
            }

            if (formatDateSelected) {
              const dateSelectedFormat = moment(date).format(formatDateSelected);
              onChange(dateSelectedFormat);
              return;
            }

            onChange(date);
          }}
        />
      )}
    </Container>
  );
};

DateTimePicker.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  title: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  isDate: PropTypes.bool,
  isTime: PropTypes.bool,
  isInputStyle: PropTypes.bool,
  formatDateSelected: PropTypes.string,
  style: StyleType,
};

DateTimePicker.defaultProps = {
  value: null,
  isDate: false,
  isTime: false,
  isInputStyle: false,
  formatDateSelected: null,
  style: {},
};

export default DateTimePicker;
