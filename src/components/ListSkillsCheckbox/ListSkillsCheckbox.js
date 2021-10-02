/* eslint-disable no-alert */

import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import CheckBox from 'src/components/CheckBox';

import {
  gamesSkillsSelector,
} from 'src/reducers/games';

import {
  StyleType,
} from 'src/common/Types';

const ListCheckbox = ({
  dataSelected,
  dataMarkDisabled,
  onDataSelectedUpdate,
  onCheck,
  style,
  viewMode,
}) => {
  const skills = useSelector(gamesSkillsSelector());

  return (
    <View style={style}>
      {skills.map((item) => {
        const { id, longName, reserve } = item;
        const isItemChecked = dataSelected.includes(id);
        const isDefaultSkill = dataMarkDisabled.includes(id);
        const markDisabled = !reserve || isDefaultSkill;

        if (viewMode && !isItemChecked) {
          return null;
        }

        return (
          <CheckBox
            key={id}
            checked={isItemChecked}
            text={longName}
            markDisabled={markDisabled}
            onPress={async () => {
              let canContinue = false;

              if (!reserve) {
                alert('That skill is not reserved');
                return;
              }

              if (isDefaultSkill) {
                alert('You can\'t unset default skill');
                return;
              }

              try {
                canContinue = await onCheck(item, isItemChecked);
              } catch (e) {
                alert(e);
              }

              if (!canContinue) {
                return;
              }

              let dataSelectedNew = [...dataSelected];

              if (isItemChecked) {
                dataSelectedNew = dataSelected.filter((itemTmp) => itemTmp !== id);
              } else {
                dataSelectedNew.push(id);
              }

              onDataSelectedUpdate(dataSelectedNew);
            }}
          />
        );
      })}
    </View>
  );
};

ListCheckbox.propTypes = {
  dataSelected: PropTypes.array,
  dataMarkDisabled: PropTypes.array,
  onDataSelectedUpdate: PropTypes.func,
  onCheck: PropTypes.func,
  style: StyleType,
  viewMode: PropTypes.bool,
};

ListCheckbox.defaultProps = {
  dataSelected: [],
  dataMarkDisabled: [],
  onDataSelectedUpdate: () => null,
  onCheck: () => true,
  style: {},
  viewMode: false,
};

export default ListCheckbox;
