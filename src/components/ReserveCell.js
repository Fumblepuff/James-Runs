/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  Alert,
} from 'react-native';
import { Icon, Button } from 'native-base';
import { connect } from 'react-redux';
import { withNavigation } from '@react-navigation/compat';

import moment from 'src/common/moment';

import gameUtils from 'src/utils/gameUtils';
import generalUtils from 'src/utils/generalUtils';

import ReserveSpotButton from 'src/components/ReserveSpotButton';

import GameApi from 'src/api/GameApi';

import { getRun } from 'src/reducers/games';

import cellStyle from 'src/styles/Cell';

const styles = cellStyle;

class ReserveCell extends Component {
  constructor(props) {
    super(props);

    const {
      run,
      baller,
    } = this.props;

    this.state = {
      reserved: gameUtils.hasUserAnySkillReserved(run, baller),
      checkin: false,
    };
  }

  componentDidMount() {
    this.checkCheckIn();
  }

  componentDidUpdate(prevProps) {
    const { run } = this.props;

    const runCompare = JSON.stringify(run);
    const runPrevCompare = JSON.stringify(prevProps.run);

    if (runCompare !== runPrevCompare) {
      this.checkCheckIn();
      this.setData();
    }
  }

  setData() {
    const { run, baller } = this.props;

    this.setState({
      reserved: gameUtils.hasUserAnySkillReserved(run, baller),
    });
  }

  checkCheckIn() {
    const { getRunConnect, baller, run } = this.props;

    const apiPayload = {
      run: run.runId,
      user: baller,
    };

    getRunConnect(apiPayload, 'getSingleRunBaller')
      .then((result) => {
        if (result) {
          this.setState({ checkin: (parseInt(result.checkIn, 10) === 1) });
        }
      })
      .catch((err) => alert(err));
  }

  async ballerStatus() {
    const { baller, run } = this.props;
    const {
      reserved,
      checkin,
    } = this.state;

    if (!reserved) {
      Alert.alert(
        'Baller Has Not Reserved',
        'Select An Option Below',
        [
          { text: 'Close', onPress: () => null, style: 'cancel' },
        ],
        { cancelable: true },
      );

      return;
    }

    const checkinNew = !checkin;

    try {
      await GameApi.ballerCheckin({
        run: run.runId,
        user: baller,
        checkin: checkinNew,
      });
    } catch (e) {
      alert(e);
      return;
    }

    this.setState({
      checkin: checkinNew,
    });
  }

  locationItem() {
    const { run, baller } = this.props;
    const {
      reserved,
      checkin,
    } = this.state;

    const {
      name,
      timeStamp,
      imageName,
    } = run;

    const imageFormat = generalUtils.getItemImage(imageName);
    const now = moment();
    const before = moment(timeStamp).isBefore(now);
    const days = moment(now).to(timeStamp, true)
      .replace('a year', '1 year')
      .replace('a month', '1 month')
      .replace('a week', '1 week')
      .replace('a day', '1 day')
      .replace('an hour', '1 hour')
      .replace('a minute', '1 minute');
    let daysAgo = days;

    if (before) {
      daysAgo = `${days} ago`;
    } else {
      daysAgo = `in ${days}`;
    }

    return (
      <View style={[styles.listContainer, { padding: 0, alignItems: 'center' }]}>

        <View style={styles.courtDetail}>
          <View style={[styles.imageContainer, { borderColor: '#20639B' }]}>
            <Image
              style={{
                flex: 1, resizeMode: 'cover', width: '100%', height: '100%',
              }}
              source={{ uri: imageFormat }}
            />
          </View>
          <View style={{ padding: 20, flex: 1.5 }}>
            <Text style={[styles.headerText, { color: '#3C3C3C' }]}>{name.toUpperCase()}</Text>
            <Text style={[styles.subText, { color: '#3C3C3C' }]}>
              {gameUtils.isPickUpGame(run.type) ? 'Run' : 'Game'}
              {' '}
              {daysAgo}
            </Text>
          </View>
        </View>
        <View style={styles.memberCheckin}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
            <ReserveSpotButton
              run={run}
              reserved={reserved}
              isManageStack
              userId={parseInt(baller, 10)}
            />
          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
            <Button full style={{ backgroundColor: checkin ? '#478CBA' : '#0C3D65', flex: 1 }} onPress={() => this.ballerStatus()}>
              <Icon
                type="MaterialIcons"
                style={{
                  color: '#ffffff', fontSize: 30, textAlign: 'center', margin: 0,
                }}
                name="check-circle"
              />
              <Text style={[styles.cellText, { fontSize: 16, textAlign: 'center' }]}>{checkin ? 'Check Out' : 'Check In'}</Text>
            </Button>

          </View>
        </View>

      </View>
    );
  }

  render() {
    return (
      <View>
        {this.locationItem()}
      </View>
    );
  }
}

ReserveCell.propTypes = {
  baller: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  run: PropTypes.object.isRequired,
  getRunConnect: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  getRunConnect: (runId, type) => dispatch(getRun(runId, type)),
});

export default connect(null, mapDispatchToProps)(withNavigation(ReserveCell));
