
import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  Button,
} from 'native-base';

import {
  gs,
} from 'src/styles';

const ReserveSpotButtonOne = ({
  reserved,
  onPress,
}) => {
  const style = { backgroundColor: reserved ? '#52ce5e' : '#20639B' };

  return (
    <Button
      full
      style={style}
      onPress={onPress}
    >
      <Text white bold style={gs.fS14}>{reserved ? 'RESERVED' : 'RESERVE SPOT'}</Text>
    </Button>
  );
};

ReserveSpotButtonOne.propTypes = {
  onPress: PropTypes.func.isRequired,
  reserved: PropTypes.bool,
};

ReserveSpotButtonOne.defaultProps = {
  reserved: false,
};

export default ReserveSpotButtonOne;
