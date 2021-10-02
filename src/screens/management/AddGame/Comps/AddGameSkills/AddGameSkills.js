
import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';
import {
  Text,
  Button,
  Icon,
} from 'native-base';
import {
  useSelector,
  useDispatch,
} from 'react-redux';

import gameUtils from 'src/utils/gameUtils';
import {
  gamesSkillsSelector,
  fetchGamesSkills,
} from 'src/reducers/games';
import {
  StyleType,
} from 'src/common/Types';
import {
  gs,
} from 'src/styles';

const AddGameSkills = ({ style, onUpdateSkill, addedSkills }) => {
  const dispatch = useDispatch();
  const skillsList = useSelector(gamesSkillsSelector());
  const skillsNeeded = gameUtils.getSkillsNeeded(addedSkills);
  const [skillsData, setSkillsData] = React.useState(skillsNeeded);

  React.useEffect(() => {
    if (skillsList.length < 1) {
      dispatch(fetchGamesSkills(true));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillsList]);

  const modifySkill = (id, plusSkill = true) => {
    let count = skillsData[id] || 0;

    if (plusSkill) {
      count += 1;
    } else {
      count -= 1;
    }

    if (count < 0) {
      return;
    }

    const skillsDataModified = {
      ...skillsData,
      [id]: count,
    };

    // if (count < 1) {
    //   delete skillsDataModified[id];
    // }

    setSkillsData(skillsDataModified);
    onUpdateSkill(skillsDataModified);
  };

  const styleRow = [gs.flex, gs.row, gs.jCSpaceBetween, gs.mB10];
  const styleCol1 = [gs.jCCenter];
  const styleCol2 = [gs.row, gs.aICenter, gs.mL20, gs.jCEnd, gs.width160];

  return (
    <View
      style={[gs.flex, style]}
    >
      <View
        style={[styleRow, gs.mB20]}
      >
        <View style={[styleCol1, gs.flexGrow]}>
          <Text white style={[gs.textCenter, gs.fS25]}>Skills</Text>
        </View>
        <View style={[styleCol2, gs.jCCenter]}>
          <Text white style={gs.fS25}>Spots</Text>
        </View>
      </View>

      {skillsList.map(({ id, longName }) => (
        <View
          key={id}
          style={styleRow}
        >

          <View
            style={styleCol1}
          >
            <Text white style={gs.fS20}>{longName}</Text>
          </View>

          <View style={styleCol2}>
            <Button
              primary
              onPress={() => modifySkill(id)}
            >
              <Icon name="add" />
            </Button>

            <Text white style={[gs.fS20, gs.textCenter, gs.width30]}>{skillsData[id] || 0}</Text>

            <Button
              primary
              onPress={() => modifySkill(id, false)}
            >
              <Icon name="ios-remove" />
            </Button>
          </View>

        </View>
      ))}
    </View>
  );
};

AddGameSkills.propTypes = {
  style: StyleType,
  onUpdateSkill: PropTypes.func,
  addedSkills: PropTypes.object,
};

AddGameSkills.defaultProps = {
  style: {},
  onUpdateSkill: () => null,
  addedSkills: {},
};

export default AddGameSkills;
