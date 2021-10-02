
import React from 'react';
import PropTypes from 'prop-types';

import gameUtils from 'src/utils/gameUtils';

import EditBallerEvent from './EditBallerEvent';

const EditBallerGames = ({
  ballerId,
}) => (
  <EditBallerEvent
    ballerId={ballerId}
    typeEvent={gameUtils.TYPES.LEAGUE}
  />
);

EditBallerGames.propTypes = {
  ballerId: PropTypes.number.isRequired,
};

export default EditBallerGames;
