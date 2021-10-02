
import React from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  Text,
  Button,
  Icon,
} from 'native-base';

import Toast from 'src/utils/toastUtils';

import GameApi from 'src/api/GameApi';

import styles from './styles';

const CheckInOut = ({
  run,
  data,
}) => {
  const checkinFromData = (parseInt(data.checkIn, 10) === 1);
  const [checkin, setCheckin] = React.useState(checkinFromData);
  const checkinText = checkin ? 'CHECKED IN' : 'CHECKED OUT';
  const styleBtn = [styles.button];

  if (checkin) {
    styleBtn.push(styles.buttonCheckin);
  }

  const onCheckInOut = async () => {
    const checkinSet = !checkin;

    const apiPayload = {
      run,
      user: data.id,
      checkin: checkinSet,
    };

    try {
      await GameApi.ballerCheckin(apiPayload);
    } catch (e) {
      Toast.showError(e);
      return;
    }

    setCheckin(checkinSet);
  };

  return (
    <View
      style={styles.container}
    >
      <Button
        full
        style={styleBtn}
        onPress={onCheckInOut}
      >
        <Icon
          type="MaterialIcons"
          style={styles.icon}
          name="check-circle"
        />
      </Button>
      <Text medium style={styles.text}>{checkinText}</Text>
    </View>
  );
};

CheckInOut.propTypes = {
  data: PropTypes.object.isRequired,
  run: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
};

export default CheckInOut;
