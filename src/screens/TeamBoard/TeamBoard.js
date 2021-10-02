/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from 'react-native';
import _ from 'lodash';
import { Container, Text, Button } from 'native-base';
import { connect } from 'react-redux';
import { Row, Grid } from 'react-native-easy-grid';
import Modal from 'react-native-modal';

import logo from 'src/assets/logo_basic.png';
import background from 'src/assets/Background.png';

import {
  gamesBallersFormat,
} from 'src/api/GameApiFormatters';

import generalUtils from 'src/utils/generalUtils';
import gameUtils from 'src/utils/gameUtils';
import ApiUtils from 'src/utils/ApiUtils';

import BasicNav from 'src/components/BasicNav';
import BallerStatList from 'src/components/BallerStatList';
import BallerTeamList from 'src/components/BallerTeamList';

import {
  displayView,
  runGroups,
  resetGroups,
  getRun,
  gamesViewSelector,
} from 'src/reducers/games';
import {
  authProfileSelector,
} from 'src/reducers/auth';

import styles from './styles';

class TeamBoard extends Component {
  constructor(props) {
    super(props);

    const {
      user,
    } = this.props;

    this.state = {
      user,
      ballers: '',
      ballerTab: '#478cba',
      benchTab: '#305f80',
      nextTab: '#0e517d',
      activeTabApiType: ApiUtils.TYPES.GET_RUN_BALLERS,
      loadingModal: false,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;

    this.navigationListeners = [
      navigation.addListener('focus', this.onFocus),
    ];
  }

  componentWillUnmount() {
    if (this.navigationListeners) {
      this.navigationListeners.forEach((listener) => {
        listener();
      });
    }
  }

  onFocus = () => {
    const { resetGroupsConnect } = this.props;

    resetGroupsConnect();
    this.checkRun(true);
  }

  setNext() {
    const { getRunConnect, schedule, gameId } = this.props;

    const run = {
      run: schedule.id,
      game: gameId,
    };

    getRunConnect(run, 'setNextBallers')
      .then((_result) => {
        // this.setBench();
      })
      .catch((err) => alert(err));
  }

  setBench() {
    const { getRunConnect, schedule } = this.props;

    const run = {
      run: schedule.id,
    };

    getRunConnect(run, 'setBenchBallers')
      .then((_result) => {
        // empty
      })
      .catch((err) => alert(err));
  }

  async checkRun(getGameTeams = false) {
    const {
      getRunConnect,
      runGroupsConnect,
      schedule,
      gameId,
    } = this.props;
    const { activeTabApiType } = this.state;
    let error;

    if (getGameTeams) {
      this.setState({
        loadingModal: true,
      });
    }

    // Get Run Ballers
    const ballers = {
      run: schedule.id,
    };

    try {
      const apiRequests = [
        getRunConnect(ballers, activeTabApiType),
      ];

      if (getGameTeams) {
        // Get Game Teams
        const teams = {
          run: schedule.id,
          game: gameId,
        };

        apiRequests.push(getRunConnect(teams, 'getGameTeams'));
      }

      const [resBallers, resGameTeams] = await Promise.all(apiRequests);

      this.setState({
        ballers: gamesBallersFormat(resBallers),
      });

      if (resGameTeams) {
        runGroupsConnect(resGameTeams);
      }
    } catch (e) {
      error = 'Api error. Try again.';
    }

    if (getGameTeams) {
      this.setState({
        loadingModal: false,
      });
    }

    if (error) {
      setTimeout(() => {
        alert(error);
      }, 400);
    }
  }

  showHomeTeam() {
    const { groups } = this.props;

    return (
      <FlatList
        data={groups.home}
        renderItem={({ item }) => (
          <View style={styles.boardItem}>
            <Text style={styles.boardItemText}>
              {item.firstName}
              {' '}
              {item.lastName}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    );
  }

  showGuestTeam() {
    const { groups } = this.props;

    return (
      <FlatList
        data={groups.guest}
        renderItem={({ item }) => (
          <View style={styles.boardItem}>
            <Text style={styles.boardItemText}>
              {item.firstName}
              {' '}
              {item.lastName}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    );
  }

  showBallers() {
    const { schedule, gameId } = this.props;
    const {
      ballers,
      user,
    } = this.state;

    const BallersArr = Object.values(ballers);
    const run = schedule.id;

    return BallersArr.map((value) => {
      const { id, firstName, lastName } = value;
      const name = `${firstName} ${lastName ? lastName.charAt(0) : ''}.`;
      const image = value.imageName;
      const reserve = parseInt(value.reserve, 10) === 1 ? 'reserved' : 'not reserved';
      const checkin = parseInt(value.checkIn, 10) === 1;
      const bench = parseInt(value.bench, 10) === 1;
      const next = parseInt(value.next, 10) === 1;
      const active = parseInt(value.active, 10) === 1 ? 'playing' : reserve;

      const BallerTeamListR = (
        <BallerTeamList
          image={image}
          header={name}
          run={run}
          game={gameId}
          data={value}
          key={id}
          updateBallers={() => this.checkRun()}
        />
      );

      switch (user.member_type) {
        case 1:
          // Full Admin
          if (checkin) {
            return BallerTeamListR;
          }
          break;
        case 2:
          // Full Admin
          if (checkin) {
            return BallerTeamListR;
          }
          break;
        case 3:
          // OG Admin
          if (checkin) {
            // if (squad && (user.id === squad.adminID)) {
            //   return BallerTeamListR;
            // }

            return (
              <BallerStatList
                push
                image={image}
                header={name}
                title="SingleRun"
                checkin={checkin}
                bench={bench}
                next={next}
                subText={active}
                run={run}
                data={value}
                key={id}
              />
            );
          }
          break;
        default:
          // Baller
          if (checkin) {
            return (
              <BallerStatList
                push
                image={image}
                header={name}
                title="SingleRun"
                checkin={checkin}
                bench={bench}
                next={next}
                subText={active}
                run={run}
                data={value}
                key={id}
              />
            );
          }
          break;
      }

      return null;
    });
  }

  startRun() {
    const { displayViewConnect, data, navigation, groups } = this.props;
    const { complete } = this.state;
    const isNotComplete = (parseInt(complete, 10) !== 1);

    if (isNotComplete) {
      // this.setNext();
      const { home, guest } = groups;
      const homeLength = home.length;
      const guestLength = guest.length;

      if (homeLength < 5) {
        alert('Home team is not staffed');
        return;
      }

      if (guestLength < 5) {
        alert('Guest team is not staffed');
        return;
      }

      displayViewConnect(data);
      navigation.navigate('Run');
    }
  }

  confirmRun() {
    const { getRunConnect, schedule } = this.props;
    const { reserved, user } = this.state;

    if (!reserved) {
      const run = {
        run: schedule.id,
        user: user.id,
      };

      getRunConnect(run, 'ballerReserve')
        .then(() => {
          this.setState({ reserved: true });
        })
        .catch((err) => alert(err));
    }
  }

  filterDisplay(displayInp) {
    const getBallers = () => {
      this.checkRun();
    };

    switch (displayInp) {
      case gameUtils.GAME_TEAM_TAB_TYPES.BALLERS:
        this.setState({
          ballerTab: '#478cba',
          benchTab: '#305f80',
          nextTab: '#0e517d',
          activeTabApiType: ApiUtils.TYPES.GET_RUN_BALLERS,
        }, getBallers);
        break;
      case gameUtils.GAME_TEAM_TAB_TYPES.BENCH:
        this.setState({
          ballerTab: '#305f80',
          benchTab: '#478cba',
          nextTab: '#0e517d',
          activeTabApiType: ApiUtils.TYPES.GET_BENCH_BALLERS,
        }, getBallers);
        break;
      case gameUtils.GAME_TEAM_TAB_TYPES.NEXT:
        this.setState({
          ballerTab: '#0e517d',
          benchTab: '#305f80',
          nextTab: '#478cba',
          activeTabApiType: ApiUtils.TYPES.GET_NEXT_BALLERS,
        }, getBallers);
        break;
      default:
        break;
    }
  }

  toggleStartBtn() {
    const { data: { data }, groups: { game } } = this.props;
    const {
      user,
    } = this.state;

    if (!game) {
      return null;
    }

    const canUserStartRun = gameUtils.canUserStartRunBySkill(user, data);

    if (!canUserStartRun) {
      return null;
    }

    const isActive = gameUtils.isGameTeamActive(game);
    const isCompleted = gameUtils.isGameTeamCompleted(game);

    const continueStartGame = isActive ? 'CONTINUE GAME' : 'START GAME';

    return (
      <View style={{ flex: 1, flexWrap: 'wrap' }}>
        <Button
          full
          style={styles.startBtn}
          onPress={() => {
            if (isCompleted) {
              return;
            }

            this.startRun();
          }}
        >
          <Text style={styles.startBtnText}>{isCompleted ? '' : continueStartGame}</Text>
        </Button>
      </View>
    );
  }

  loadingModal() {
    const { loadingModal } = this.state;

    return (
      <Modal
        style={{ flex: 1, width: '100%', margin: 0 }}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={loadingModal}
        useNativeDriver
        hideModalContentWhileAnimating
        backdropColor="#000000"
        backdropOpacity={0.95}
      >
        <View style={{
          flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center',
        }}
        >

          <View style={{
            flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          }}
          >
            <Image
              style={{
                width: 80, height: 80, margin: 'auto', justifyContent: 'center', alignItems: 'center',
              }}
              source={logo}
            />
            <View>
              <Text style={{
                color: '#ffffff', fontFamily: 'BarlowCondensed-Bold', fontSize: 16, paddingTop: 10, paddingBottom: 30,
              }}
              >
                Loading...
              </Text>
            </View>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>

        </View>
      </Modal>

    );
  }

  renderScores() {
    const { groups: { home, guest } } = this.props;
    let homeScore = 0;
    let guestScore = 0;

    if (home && Array.isArray(home)) {
      homeScore = home.length;
    }

    if (guest && Array.isArray(guest)) {
      guestScore = guest.length;
    }

    return (
      <View style={{ flexDirection: 'row', position: 'relative', width: '100%' }}>
        <View style={styles.teamBoard}>
          <View>
            <Text style={styles.headerText}>
              HOME:
              {' '}
              {homeScore}
            </Text>
          </View>
          <View>{this.showHomeTeam()}</View>
        </View>
        <View style={styles.teamBoard}>
          <View>
            <Text style={styles.headerText}>
              GUEST:
              {' '}
              {guestScore}
            </Text>
          </View>
          <View>{this.showGuestTeam()}</View>
        </View>
      </View>
    );
  }

  render() {
    const { navigation, court } = this.props;
    const {
      ballerTab,
      benchTab,
      nextTab,
    } = this.state;
    const imageCourt = generalUtils.getItemImage(court.image);

    return (
      <Container style={styles.container}>
        <View style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        }}
        >
          <Image
            style={{
              flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: 0.5,
            }}
            source={background}
          />
        </View>
        <Grid>
          <Row style={{ flex: null }}>
            <BasicNav
              navigation={navigation}
              page="SingleRun"
              title={court}
              button="Settings"
              link="Settings"
            />
          </Row>
          <Row style={{ position: 'relative', backgroundColor: '#000000' }}>
            <View style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            }}
            >
              <Image
                style={{
                  flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: 0.4,
                }}
                source={{ uri: imageCourt }}
              />
            </View>

            {this.renderScores()}
          </Row>
          <Row style={{ flexDirection: 'row', width: '100%', height: 50 }}>

            <Button full style={[styles.filterBtn, { backgroundColor: ballerTab }]} onPress={() => this.filterDisplay(gameUtils.GAME_TEAM_TAB_TYPES.BALLERS)}>
              <Text style={styles.addBtnText}> Ballers </Text>
            </Button>

            <Button full style={[styles.filterBtn, { backgroundColor: benchTab }]} onPress={() => this.filterDisplay(gameUtils.GAME_TEAM_TAB_TYPES.BENCH)}>
              <Text style={styles.addBtnText}> Bench </Text>
            </Button>

            <Button full style={[styles.filterBtn, { backgroundColor: nextTab }]} onPress={() => this.filterDisplay(gameUtils.GAME_TEAM_TAB_TYPES.NEXT)}>
              <Text style={styles.addBtnText}> Next </Text>
            </Button>

          </Row>
          <Row>
            <ScrollView>
              <View style={{ width: '100%', borderWidth: 1 }}>
                {this.showBallers()}
              </View>
            </ScrollView>
          </Row>
          <Row style={{
            flexDirection: 'row', height: 55, backgroundColor: '#478cba', alignItems: 'center', marginBottom: 2,
          }}
          >
            {this.toggleStartBtn()}
          </Row>
        </Grid>
        {this.loadingModal()}
      </Container>
    );
  }
}

TeamBoard.propTypes = {
  getRunConnect: PropTypes.func.isRequired,
  runGroupsConnect: PropTypes.func.isRequired,
  resetGroupsConnect: PropTypes.func.isRequired,
  displayViewConnect: PropTypes.func.isRequired,
  data: PropTypes.shape({
    data: PropTypes.object.isRequired, // court info
    schedule: PropTypes.object.isRequired, // run info
    game: PropTypes.string.isRequired, // gameId
  }).isRequired,
  user: PropTypes.object.isRequired,
  schedule: PropTypes.object.isRequired,
  gameId: PropTypes.string.isRequired,
  court: PropTypes.object.isRequired,
  groups: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  let data = _.get(ownProps.route, 'params.data');

  if (!data) {
    data = gamesViewSelector(state);
  }

  return {
    data,
    user: authProfileSelector()(state),
    court: data.data,
    schedule: data.schedule,
    gameId: data.game,
    groups: state.games.groups,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getRunConnect: (runId, type) => dispatch(getRun(runId, type)),
  runGroupsConnect: (groups) => dispatch(runGroups(groups)),
  resetGroupsConnect: () => dispatch(resetGroups()),
  displayViewConnect: (view) => dispatch(displayView(view)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TeamBoard);
