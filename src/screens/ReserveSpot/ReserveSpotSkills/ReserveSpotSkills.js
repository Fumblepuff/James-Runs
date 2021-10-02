
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  useSelector,
  useDispatch,
} from 'react-redux';
import {
  Text,
} from 'native-base';

import {
  gamesSkillsSelector,
  fetchGamesSkills,
} from 'src/reducers/games';
import {
  authUserIdSelector,
} from 'src/reducers/auth';

import {
  gs,
} from 'src/styles';

import ReserveSpotSkillsItem from './ReserveSpotSkillsItem';

const ReserveSpotSkills = ({ data, userId }) => {
  const { skills, id } = data;
  const runId = parseInt(id, 10);
  const dispatch = useDispatch();
  const skillsList = useSelector(gamesSkillsSelector());
  const userIdCurrent = useSelector(authUserIdSelector());
  const userIdRequest = userId || userIdCurrent;

  React.useEffect(() => {
    if (skillsList.length < 1) {
      dispatch(fetchGamesSkills(true));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillsList]);

  const renderSkills = () => {
    if (skillsList.length < 1) {
      return (
        <Text white style={[gs.textCenter, gs.mT20, gs.fS20]}>Skills are not loaded. Try again.</Text>
      );
    }

    return _.map(skills, (item, skillId) => {
      const skillInfo = skillsList.find(({ id: idTmp }) => (idTmp === parseInt(skillId, 10))) || {};

      return (
        <ReserveSpotSkillsItem
          key={skillId}
          spotsInfo={item}
          skillInfo={skillInfo}
          runId={runId}
          userId={userIdRequest}
        />
      );
    });
  };

  return (
    <>
      {renderSkills()}
    </>
  );
};

ReserveSpotSkills.propTypes = {
  data: PropTypes.object,
  userId: PropTypes.number,
};

ReserveSpotSkills.defaultProps = {
  data: {},
  userId: null,
};

export default ReserveSpotSkills;
