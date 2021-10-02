/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  View,
  Image,
} from 'react-native';
import {
  Text,
  Button,
} from 'native-base';
import { connect } from 'react-redux';
import moment from 'moment';
import 'moment-timezone';

import league from 'src/assets/league.png';
import background from 'src/assets/managementBackground.png';

import {
  getRun,
  addToSchedule,
  resetSchedule,
  gamesNewEventSelector,
  gamesNewEventUpdateData,
} from 'src/reducers/games';
import {
  authUserIdSelector,
} from 'src/reducers/auth';

import gameUtils from 'src/utils/gameUtils';
import momentUtils from 'src/utils/momentUtils';
import Toast from 'src/utils/toastUtils';

import ReviewList from 'src/components/ReviewList';
import DateTimePicker from 'src/components/DateTimePicker';
import Content from 'src/components/Content';

import GameApi from 'src/api/GameApi';

import {
  routeNames,
} from 'src/navigation';

import formStyle from 'src/styles/Form';
import mainStyle from 'src/styles/Style';
import {
  gs,
} from 'src/styles';

import AddGameSkills from './Comps/AddGameSkills';

const styles = mainStyle;
const formStyles = formStyle;

class AddGame extends Component {
  constructor(props) {
    super(props);

    const date = new Date();

    this.state = {
      date,
      time: date,
      addSchedule: 'flex',
      showSchedule: 'none',
      type: false,
      selectFan: 'rgba(75,137,186,.5)',
      selectBaller: 'rgba(75,137,186,.5)',
    };

    this.addedSkills = {};
  }

  componentDidMount() {
    const {
      resetScheduleConnect,
      gameData,
      type: typeProps,
    } = this.props;

    resetScheduleConnect();

    if (gameData) {
      const { type, timeStamp } = gameData;
      const date = moment(timeStamp).toDate();

      this.selectUserType(type, () => {
        this.setState({
          date,
          time: date,
        });
      });
    } else {
      // eslint-disable-next-line no-lonely-if
      if (typeProps) {
        this.selectUserType(typeProps);
      }
    }
  }

  onAddGameRequest = async () => {
    const { navigation, gamesNewEventUpdateDataConnect, court } = this.props;

    if (!court) {
      Toast.showError('Please add a court first.');
      return;
    }

    const scheduleObj = this.getScheduleObj();
    if (!scheduleObj) {
      return;
    }

    const apiData = {
      eventTypeId: scheduleObj.type,
      courtId: parseInt(court.id, 10),
      eventDateTime: scheduleObj.runSchedule,
    };

    let eventInfo = {};

    try {
      eventInfo = await GameApi.addNewEvent(apiData);
    } catch (e) {
      Toast.showError(e);
      return;
    }

    const {
      eventRequest: {
        id: eventRequestId,
      },
      staffersExistInThisZone,
    } = eventInfo;

    if (!eventRequestId) {
      Toast.showError('error');
      return;
    }

    gamesNewEventUpdateDataConnect({
      eventRequestId,
    });

    if (staffersExistInThisZone !== 'Yes') {
      navigation.navigate(routeNames.ADD_GAME_NO_STAFF, {
        eventRequestId,
      });

      return;
    }

    try {
      const form1 = await GameApi.getEventForm1Data(eventRequestId);

      gamesNewEventUpdateDataConnect({
        form1,
      });

      navigation.navigate(routeNames.ADD_GAME_LIST);
    } catch (e) {
      Toast.showError(e);
    }
  }

  setDate = (date) => {
    this.setState({
      date,
    });
  }

  setTime = (time) => {
    this.setState({
      time,
    });
  }

  getScheduleObj() {
    const {
      type,
      date,
      time,
    } = this.state;

    if (!type) {
      Toast.showError('Select Either Game or Run to add to the schedule', 'Missing Game Type');

      return null;
    }

    const newDate = moment(date).format('YYYY-MM-DD');
    const newTime = moment(time).format('HH:mm:ss');
    const datetime = `${newDate} ${newTime}`;

    const skills = this.addedSkills;

    const res = {
      id: datetime,
      runSchedule: datetime,
      type,
      skills,
    };

    return res;
  }

  showDateTime = (date, time) => {
    const showDate = moment(date).format('ll');
    const showTime = momentUtils.getTime(time);

    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text style={[styles.h1, { color: '#FFFFFF', textAlign: 'center' }]}>{`${showDate} ${showTime}`}</Text>
      </View>
    );
  }

  showAddSchedule = () => {
    this.setState({
      showSchedule: 'none',
      addSchedule: 'flex',
    });
  }

  submitSchedule = () => {
    const { navigation, isAdminMenu } = this.props;
    const {
      addSchedule,
    } = this.state;

    if (addSchedule === 'none') {
      this.showAddSchedule();
    } else {
      // eslint-disable-next-line no-lonely-if
      if (isAdminMenu) {
        this.addToSchedule((_scheduleObj) => {
          this.setState({
            showSchedule: 'flex',
            addSchedule: 'none',
          });
        });
      } else {
        navigation.navigate(routeNames.ADD_GAME_LIST);
      }
    }
  }

  addToSchedule(callback = () => null) {
    const { addToScheduleConnect } = this.props;

    const scheduleObj = this.getScheduleObj();
    if (!scheduleObj) {
      return;
    }

    addToScheduleConnect(scheduleObj);

    callback(scheduleObj);
  }

  scheduleListFormat(scheduleList) {
    const res = scheduleList.map((itemInp) => {
      const item = { ...itemInp };
      // const datetimeUtc = momentUtils.getUtcDateTime(item.runSchedule);
      // item.runSchedule = datetimeUtc;
      // item.id = datetimeUtc;

      return item;
    });

    return res;
  }

  listSchedule() {
    const { scheduleList } = this.props;
    const scheduleArr = Object.values(scheduleList);

    return scheduleArr.map((item, index) => {
      const { runSchedule } = item;
      const header = moment(runSchedule).format('dddd');
      const subtext = moment(runSchedule).format('MMMM Do YYYY');

      // eslint-disable-next-line react/no-array-index-key
      return <ReviewList header={header} subText={subtext} data={item} key={index} />;
    });
  }

  addNewRuns() {
    const {
      scheduleList,
      court,
      getRunConnect,
      navigation,
      userId,
    } = this.props;
    const { showSchedule } = this.state;

    if (scheduleList.length > 0 && showSchedule !== 'none') {
      if (!court) {
        Toast.showError('Add a court first');
        return;
      }

      const scheduleListFormat = this.scheduleListFormat(scheduleList);

      const data = {
        court: court.id,
        schedule: scheduleListFormat,
        userId,
      };

      getRunConnect(data, 'addNewRun')
        .then(() => {
          // this.setState({
          //   addRun: false,
          //   addGame: false,
          // }, ()=>{
          //   this.props.scheduleList.length = 0;
          // });

          // setTimeout(() => {
          //   this.setState({ showLoader: false });
          //   this.props.
          // }, 500);
          navigation.navigate('EditCourt');
        })
        .catch((err) => {
          Toast.showError(err);
        });
    } else if (scheduleList.length > 0 && showSchedule === 'none') {
      this.setState({
        showSchedule: 'flex',
        addSchedule: 'none',
      });
    } else {
      Toast.showError('Please add a date to the schedule before adding.', 'Missing Dates');
    }
  }

  updateRun() {
    const { gameData, navigation } = this.props;
    const runId = parseInt(gameData.runId, 10);
    const scheduleObj = this.getScheduleObj();

    if (!scheduleObj) {
      return;
    }

    const scheduleListFormat = this.scheduleListFormat([scheduleObj]);

    const dataApi = {
      runId,
      ...scheduleListFormat[0],
    };

    GameApi.editRunGame(dataApi).then(() => {
      navigation.goBack();
    }).catch((err) => {
      Toast.showError(err);
    });
  }

  selectUserType(typeInp, callback = () => null) {
    let selectFan = 'rgba(75,137,186,.5)';
    let selectBaller = 'rgba(75,137,186,.5)';
    let type = 5;

    switch (typeInp) {
      case 2:
        selectFan = 'rgba(75,137,186,.5)';
        selectBaller = '#478cba';
        type = typeInp;

        break;
      case 1:
        selectFan = '#478cba';
        selectBaller = 'rgba(75,137,186,.5)';
        type = typeInp;

        break;
      default:
        break;
    }

    this.setState({
      selectFan,
      selectBaller,
      type,
    }, callback);
  }

  renderDateTime() {
    const { date, time } = this.state;

    return (
      <>
        <DateTimePicker
          style={{ height: 100 }}
          value={date}
          title="Select the Date"
          isDate
          onChange={this.setDate}
        />
        <DateTimePicker
          style={{ height: 100 }}
          value={time}
          isTime
          title="Select the Time"
          onChange={this.setTime}
        />
        {this.showDateTime(date, time)}
      </>
    );
  }

  renderSkills() {
    const { gameData, isAdminMenu } = this.props;
    let skills = {};

    if (!isAdminMenu) {
      return null;
    }

    if (gameData) {
      skills = gameData.skills || {};
    }

    return (
      <AddGameSkills
        style={gs.mT10}
        addedSkills={skills}
        onUpdateSkill={(data) => {
          this.addedSkills = data;
        }}
      />
    );
  }

  renderAdminBottons() {
    const { scheduleList, gameData } = this.props;
    const {
      addSchedule,
    } = this.state;
    const buttons = [];
    let textSaveView = (addSchedule === 'none') ? 'SAVE SCHEDULE' : 'VIEW SCHEDULE';

    if (gameData) {
      textSaveView = 'SAVE GAME';
    }

    const btnAdd = (
      <Button
        key="add"
        full
        style={[
          styles.addBtn,
          gs.flex,
          gs.height80,
          gs.bgBlue,
        ]}
        onPress={() => this.submitSchedule()}
      >
        <Text style={styles.addBtnText}>{ addSchedule === 'none' ? 'Add Another Date' : 'ADD TO SCHEDULE' }</Text>
      </Button>
    );

    const btnSaveView = (
      <Button
        key="save"
        full
        style={[styles.addBtn, { flex: 1, backgroundColor: scheduleList.length > 0 ? '#47BA92' : '#BA4747', height: 80 }]}
        onPress={() => {
          if (gameData) {
            this.updateRun();
          } else {
            this.addNewRuns();
          }
        }}
      >
        <Text style={styles.addBtnText}>
          {textSaveView}
        </Text>
      </Button>
    );

    if (gameData) {
      buttons.push(btnSaveView);
    } else {
      buttons.push(btnAdd);
      buttons.push(btnSaveView);
    }

    return buttons;
  }

  renderContentFooter() {
    const { isAdminMenu } = this.props;

    if (!isAdminMenu) {
      return null;
    }

    const buttons = this.renderAdminBottons();

    return (
      <View style={{ flexDirection: 'row' }}>
        {buttons.map((item) => item)}
      </View>
    );
  }

  renderHeader = () => {
    const { court } = this.props;

    if (!court) {
      return null;
    }

    const { image, name, address } = court;

    return (
      <View style={styles.accountHeader}>
        <View style={[styles.profilePic, { width: 120 }]}>
          <View style={styles.profileImage}>
            <Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }} source={{ uri: image }} />
          </View>
        </View>
        <View style={{ margin: 5, flex: 1 }}>
          <Text style={[styles.profileText, { fontFamily: 'BarlowCondensed-Bold' }]}>{name}</Text>
          <Text style={[styles.profileText, { fontSize: 14 }]}>{address}</Text>
        </View>
      </View>
    );
  }

  renderTypes() {
    const { type } = this.props;
    const {
      selectFan,
      selectBaller,
    } = this.state;
    const buttons = [];

    const renderTypeButton = (typeInp, title, backgroundColor) => (
      <Button
        key={typeInp}
        transparent
        style={[formStyles.imageBtn, gs.row, { backgroundColor }]}
        onPress={() => this.selectUserType(typeInp)}
      >
        <Image
          style={[gs.size50, gs.mB0]}
          source={league}
        />
        <Text
          medium
          white
          style={[gs.textLeft]}
        >
          {title}
        </Text>
      </Button>
    );

    if (type === gameUtils.TYPES.GAME) {
      buttons.push(renderTypeButton(gameUtils.TYPES.GAME, 'Game', selectBaller)); // old selectFan
    } else if (type === gameUtils.TYPES.RUN) {
      buttons.push(renderTypeButton(gameUtils.TYPES.RUN, 'Run', selectFan)); // old selectBaller
    } else {
      buttons.push(renderTypeButton(gameUtils.TYPES.GAME, 'Game', selectBaller)); // old selectFan
      buttons.push(renderTypeButton(gameUtils.TYPES.RUN, 'Run', selectFan)); // old selectBaller
    }

    return (
      <View style={[formStyles.buttonGroup, { alignSelf: 'center' }]}>
        {buttons.map((item) => item)}
      </View>
    );
  }

  renderAddCourt() {
    const { court, navigation } = this.props;

    if (court) {
      return null;
    }

    return (
      <Button
        style={[gs.aSCenter, gs.mT10, gs.mB20]}
        onPress={() => {
          navigation.navigate(routeNames.COURTS);
        }}
      >
        <Text style={[gs.fontMedium, gs.fS21]}>Select the Court</Text>
      </Button>
    );
  }

  render() {
    const { navigation, isAdminMenu } = this.props;
    const {
      addSchedule,
      showSchedule,
    } = this.state;

    const useSafeAreaView = !isAdminMenu;
    let footerButtonProps;

    if (!isAdminMenu) {
      footerButtonProps = [
        {
          text: 'REQUEST',
          type: 'success',
          onPress: this.onAddGameRequest,
        },
        {
          text: 'CANCEL',
          type: 'danger',
          onPress: () => {
            navigation.goBack();
          },
        },
      ];
    }

    return (
      <Content
        basicNav={{
          // page: 'Court',
          title: 'Baller Management',
          link: 'Settings',
        }}
        useSafeAreaView={useSafeAreaView}
        safeAreaEdges={['bottom']}
        imageBg={background}
        header={this.renderHeader}
        footer={() => this.renderContentFooter()}
        footerButtonProps={footerButtonProps}
      >

        <View
          style={[styles.modalWrapper, { display: addSchedule }]}
        >
          {this.renderTypes()}

          {this.renderAddCourt()}

          {this.renderDateTime()}

          {this.renderSkills()}
        </View>

        <View style={[{ display: showSchedule }]}>
          {this.listSchedule()}
        </View>

      </Content>
    );
  }
}

AddGame.propTypes = {
  court: PropTypes.object,
  isAdminMenu: PropTypes.bool.isRequired,
  type: PropTypes.number,
  scheduleList: PropTypes.array,
  getRunConnect: PropTypes.func.isRequired,
  addToScheduleConnect: PropTypes.func.isRequired,
  resetScheduleConnect: PropTypes.func.isRequired,
  gamesNewEventUpdateDataConnect: PropTypes.func.isRequired,
  gameData: PropTypes.object,
  userId: PropTypes.number,
};

AddGame.defaultProps = {
  court: null,
  type: null,
  scheduleList: [],
  gameData: null,
  userId: null,
};

const mapStateToProps = (state, ownProps) => {
  const { court, isAdminMenu, type } = gamesNewEventSelector(state);

  return {
    court,
    isAdminMenu,
    type,
    scheduleList: state.games.addToSchedule,
    gameData: _.get(ownProps.route, 'params.gameData'),
    userId: authUserIdSelector()(state),
  };
};

const mapDispatchToProps = (dispatch) => ({
  addToScheduleConnect: (schedule) => dispatch(addToSchedule(schedule)),
  getRunConnect: (runId, type) => dispatch(getRun(runId, type)),
  resetScheduleConnect: () => dispatch(resetSchedule()),
  gamesNewEventUpdateDataConnect: (data) => dispatch(gamesNewEventUpdateData(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddGame);
