
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';

import Content from 'src/components/Content';
import GameInfoHeader from 'src/components/GameInfoHeader';

import background from 'src/assets/managementBackground.png';

import ReserveSpotSkills from './ReserveSpotSkills';

const ReserveSpot = ({ dataGame, dataGameDetail, userId }) => (
  <Content
    basicNav={{
      // page: 'Court',
      title: 'Baller Management',
      link: 'Settings',
    }}
    header={(
      <GameInfoHeader
        data={dataGame}
      />
    )}
    imageBg={background}
  >
    <ReserveSpotSkills
      data={dataGameDetail}
      userId={userId}
    />
  </Content>
);

ReserveSpot.propTypes = {
  dataGame: PropTypes.object.isRequired,
  dataGameDetail: PropTypes.object.isRequired,
  userId: PropTypes.number,
};

ReserveSpot.defaultProps = {
  userId: null,
};

const mapProps = (_state, ownProps) => ({
  dataGame: _.get(ownProps.route, 'params.dataGame'),
  dataGameDetail: _.get(ownProps.route, 'params.dataGameDetail'),
  userId: _.get(ownProps.route, 'params.userId'),
});

export default connect(mapProps)(ReserveSpot);
