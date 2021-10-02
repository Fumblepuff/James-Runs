
import React from 'react';
import PropTypes from 'prop-types';

import ReserveSpotButtonService from './ReserveSpotButtonService';
import ReserveSpotButtonOne from './ReserveSpotButtonOne';

const ReserveSpotButton = ({
  run,
  reserved,
  isManageStack,
  userId,
}) => (
  <ReserveSpotButtonService
    run={run}
    isManageStack={isManageStack}
    userId={userId}
  >
    {({
      onPress,
    }) => (
      <ReserveSpotButtonOne
        onPress={onPress}
        reserved={reserved}
      />
    )}
  </ReserveSpotButtonService>
);

ReserveSpotButton.propTypes = {
  run: PropTypes.object.isRequired,
  reserved: PropTypes.bool,
  isManageStack: PropTypes.bool,
  userId: PropTypes.number,
};

ReserveSpotButton.defaultProps = {
  reserved: false,
  isManageStack: false,
  userId: null,
};

export default ReserveSpotButton;
