
import React from 'react';
import PropTypes from 'prop-types';

import gameUtils from 'src/utils/gameUtils';

import EditBallerEvent from './EditBallerEvent';

const EditBallerRuns = ({
  ballerId,
}) => (
  <EditBallerEvent
    ballerId={ballerId}
    typeEvent={gameUtils.TYPES.PICKUP}
  />
);

EditBallerRuns.propTypes = {
  ballerId: PropTypes.number.isRequired,
};

export default EditBallerRuns;
