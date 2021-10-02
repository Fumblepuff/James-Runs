/* eslint-disable camelcase */

import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  Col,
  Row,
  Button,
} from 'native-base';

import GridItem from 'src/components/GridItem';

import Toast from 'src/utils/toastUtils';

import SkillsApi from 'src/api/SkillsApi';

import {
  gs,
} from 'src/styles';

import styles from './styles';

const ReserveSpotSkillsItem = ({
  spotsInfo,
  skillInfo,
  runId,
  userId,
}) => {
  const { longName, id } = skillInfo;
  const { spots_needed, reserved = [] } = spotsInfo;
  const [reservedState, setReservedState] = React.useState(reserved);

  const reservedLength = reservedState.length;
  const isReserved = reservedState.find((item) => (parseInt(item, 10) === userId));
  const styleBtn = [styles.reserveBtn];

  const isDisabled = (spots_needed === reservedLength) && !isReserved;

  if (isReserved) {
    styleBtn.push(styles.reserveBtnReserved);
  } else if (isDisabled) {
    styleBtn.push(styles.reserveBtnDisabled);
  }

  const onReserveSpotItem = () => {
    SkillsApi.reserveSkillSpot(runId, id, userId).then((_res) => {
      setReservedState([
        ...reservedState,
        userId,
      ]);
    }).catch((e) => {
      Toast.showError(e);
    });
  };

  const onUnreserveSpotItem = () => {
    SkillsApi.removeSkillSpot(runId, id, userId).then((_res) => {
      const reservesStateNew = reservedState.filter((item) => parseInt(item, 10) !== userId);
      setReservedState([
        ...reservesStateNew,
      ]);
    }).catch((e) => {
      Toast.showError(e);
    });
  };

  return (
    <GridItem>
      <Row>
        <Col style={[gs.jCCenter]}>
          <Text white style={gs.fS20}>{longName}</Text>
        </Col>
        <Col style={[gs.jCCenter, gs.flexNull, gs.mH20]}>
          <Text white style={gs.fS20}>{spots_needed}</Text>
        </Col>
        <Col style={[gs.jCCenter, gs.flexNull, gs.mH20]}>
          <Text white style={gs.fS20}>{reservedLength}</Text>
        </Col>
        <Col style={[gs.flexNull]}>
          <Button
            full
            disabled={isDisabled}
            style={styleBtn}
            onPress={() => {
              if (isReserved) {
                onUnreserveSpotItem();
              } else {
                onReserveSpotItem();
              }
            }}
          >
            <Text style={styles.reserveBtnText} bold>
              {isReserved ? 'RESERVED' : 'RESERVE SPOT'}
            </Text>
          </Button>
        </Col>
      </Row>
    </GridItem>
  );
};

ReserveSpotSkillsItem.propTypes = {
  spotsInfo: PropTypes.object.isRequired,
  skillInfo: PropTypes.object.isRequired,
  runId: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
};

export default ReserveSpotSkillsItem;
