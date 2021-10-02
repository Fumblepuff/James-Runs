import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  View,
  SafeAreaView,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import { Container, Text, Button } from 'native-base';
import { connect } from 'react-redux';
import { Row, Grid } from 'react-native-easy-grid';

import generalUtils from 'src/utils/generalUtils';
import ApiUtils from 'src/utils/ApiUtils';
import gameUtils from 'src/utils/gameUtils';

import Spinner from 'src/components/Spinner';

import {
  gamesRunGameFormat,
} from 'src/api/GameApiFormatters';

import UserImage from 'src/components/UserImage';

import {
  squadApi,
  displayView,
  resetGroups,
  getRun,
  gamesViewSelector,
} from 'src/reducers/games';

import {
  routeNames,
} from 'src/navigation';

import styles from './styles';

class Run extends Component {
  constructor(props) {
    super(props);

    this.state = {
      home: 0,
      guest: 0,
      winner: false,
      complete: 0,
      active: 0,
      isLoading: false,
    };
  }

  componentDidMount() {
    this.checkRun();
  }

  addPoint(teams, point) {
    const { squadApiConnect, gameId, user } = this.props;
    const { home, guest } = this.state;
    let teamPoint;

    switch (teams) {
      case 'Home':
        teamPoint = parseInt(home, 10) + point;

        this.setState({ home: teamPoint });
        break;
      case 'Guest':
        teamPoint = parseInt(guest, 10) + point;

        this.setState({ guest: teamPoint });
        break;
      default:
        break;
    }

    if (_.isNil(teamPoint)) {
      alert('no points');
      return;
    }

    const game = {
      team: teams,
      points: teamPoint,
      gameId,
    };

    squadApiConnect(user.id, 'runPoint', game);
  }

  reducePoint(teams) {
    const { squadApiConnect, gameId, user } = this.props;
    const { home, guest } = this.state;
    let point;

    switch (teams) {
      case 'Home':

        if (home > 0) {
          point = parseInt(home, 10) - 1;

          this.setState({ home: point });
        }

        break;
      case 'Guest':
        if (guest > 0) {
          point = parseInt(guest, 10) - 1;

          this.setState({ guest: point });
        }
        break;
      default:
        break;
    }

    if (!point) {
      alert('no point to reduce');
      return;
    }

    const dataApi = {
      team: teams,
      points: point,
      gameId,
    };

    squadApiConnect(user.id, 'runPoint', dataApi);
  }

  listBallers(team) {
    const { groups } = this.props;
    let ballers;

    switch (team) {
      case 'Home':
        ballers = groups.home;
        break;
      case 'Guest':
        ballers = groups.guest;
        break;
      default:
        break;
    }

    if (!ballers) {
      return null;
    }

    return (
      <FlatList
        data={ballers}
        horizontal={false}
        numColumns={5}
        renderItem={({ item }) => (
          <UserImage size={60} id={item.id} image={item.imageName} name="" />
        )}
        keyExtractor={(item) => item.id}
      />
    );
  }

  scoreCard(winner, team) {
    const { home, guest } = this.state;

    if (winner === team) {
      return (
        <View style={{
          backgroundColor: '#689f34', padding: 10, flexDirection: 'row', width: '100%',
        }}
        >
          <View style={styles.score}>
            <Text style={styles.scoreText}>{team === 'Home' ? home : guest}</Text>
          </View>
          <View style={styles.resultView}>
            <Text style={styles.pointText}>WINNER!</Text>
          </View>
        </View>

      );
    } if (winner === 'Tie') {
      return (
        <View style={{
          backgroundColor: '#478cba', padding: 10, flexDirection: 'row', width: '100%',
        }}
        >
          <View style={styles.score}>
            <Text style={styles.scoreText}>{team === 'Home' ? home : guest}</Text>
          </View>
          <View style={styles.resultView}>
            <Text style={styles.pointText}>TIE</Text>
          </View>
        </View>

      );
    } if (!winner) {
      return (
        <View style={{
          backgroundColor: '#000000', padding: 10, flexDirection: 'row', width: '100%',
        }}
        >
          <Grid>

            <Row size={55}>
              <View style={styles.score}>
                <Text style={styles.scoreText}>{team === 'Home' ? home : guest}</Text>
              </View>
            </Row>
            <Row size={25}>

              <Button style={styles.pointBtn} onPress={() => this.addPoint(team, 1)}>
                <Text style={styles.pointText}>+1</Text>
              </Button>

              <Button style={styles.pointBtn} onPress={() => this.addPoint(team, 2)}>
                <Text style={styles.pointText}>+2</Text>
              </Button>

              <Button style={styles.pointBtn} onPress={() => this.addPoint(team, 3)}>
                <Text style={styles.pointText}>+3</Text>
              </Button>

            </Row>
            <Row size={20}>
              <Button style={[styles.reduceBtn, { margin: 5 }]} onPress={() => this.reducePoint(team)}>
                <Text style={styles.pointText}>-1</Text>
              </Button>
            </Row>

          </Grid>

        </View>

      );
    }

    return (
      <View style={{
        backgroundColor: '#e44240', padding: 10, flexDirection: 'row', width: '100%',
      }}
      >
        <View style={styles.score}>
          <Text style={styles.scoreText}>{team === 'Home' ? home : guest}</Text>
        </View>
        <View style={styles.resultView}>
          <Text style={styles.pointText}>LOSER</Text>
        </View>
      </View>
    );
  }

  checkRun() {
    const { getRunConnect, runDate, gameId } = this.props;

    const run = {
      run: runDate.id,
      game: gameId,
    };

    this.setState({
      isLoading: true,
    });

    getRunConnect(run, 'showRunGame')
      .then((resultInp) => {
        const result = gamesRunGameFormat(resultInp);

        // backend bug fix
        // for the first 'showRunGame' request the backend returns active = 0, but in the database it's active = 1
        const active = (result.complete === 0) ? 1 : result.active;

        this.setState({
          home: result.Home,
          guest: result.Guest,
          complete: result.complete,
          active,
          isLoading: false,
        }, () => {
          if (result.complete === 1) {
            this.completeRun();
          }
        });
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
        });

        setTimeout(() => {
          alert(err);
        }, 400);
      });
  }

  async completeRun() {
    const { getRunConnect, runDate, gameId } = this.props;

    const run = {
      run: runDate.id,
      game: gameId,
    };

    this.setState({
      isLoading: true,
    });

    try {
      await getRunConnect(run, 'setLastGamePlayed');
    } catch (e) {
      this.setState({
        isLoading: false,
      });

      setTimeout(() => {
        alert(e);
      }, 400);
      return;
    }

    try {
      const result = await getRunConnect(run, 'checkWinner');

      this.setState({
        winner: result.winner,
        isLoading: false,
      });
    } catch (e) {
      this.setState({
        isLoading: false,
      });

      setTimeout(() => {
        alert(e);
      }, 400);
    }
  }

  alertCloseRun() {
    Alert.alert(
      'Are you sure?',
      'You are going to close this run.',
      [
        {
          text: 'Yes',
          onPress: () => this.closeRun(),
        },
        {
          text: 'No',
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );
  }

  async closeRun() {
    const {
      navigation,
      squadApiConnect,
      // resetGroupsConnect,
      displayViewConnect,
      court,
      runDate,
      user,
    } = this.props;

    const view = {
      data: court,
      schedule: runDate,
    };

    const run = {
      id: runDate.id,
    };

    try {
      await squadApiConnect(user.id, 'endRun', run);
    } catch (e) {
      alert(e);
      return;
    }

    setTimeout(() => {
      // resetGroupsConnect();
      displayViewConnect(view);

      navigation.navigate(routeNames.SINGLE_RUN);
      // navigation.pop(2);
    }, 500);
  }

  closeGame() {
    const { navigation } = this.props;
    navigation.navigate('TeamBoard');
  }

  async updateTeamsPlaces(gameIdNew) {
    let gameInfo;
    const { getRunConnect, runDate } = this.props;
    const { winner } = this.state;
    const teams = {
      run: runDate.id,
      game: gameIdNew,
    };

    // const teamsNew = {
    //   run: runDate.id,
    //   game: gameIdNew,
    // };

    try {
      gameInfo = await getRunConnect(teams, 'getGameTeams');
    } catch (e) {
      // empty
    }

    if (!gameInfo) {
      return;
    }

    const { home, guest } = gameInfo;

    let arrayLooserTeam = [];
    let arrayWinnerTeam = [];

    if (winner === gameUtils.GAME_TEAMS.HOME) {
      arrayWinnerTeam = home;
      arrayLooserTeam = guest;
    } else if (winner === gameUtils.GAME_TEAMS.GUEST) {
      arrayWinnerTeam = guest;
      arrayLooserTeam = home;
    }

    // moving lossed team to bench
    const clearApiRequests = arrayLooserTeam.map(({ id }) => (
      getRunConnect({
        ...teams,
        user: id,
        team: gameUtils.GAME_TEAMS.CLEAR,
      }, ApiUtils.TYPES.ADD_USER_TEAM)
    ));

    // const benchApiRequests = guest.map(({ id }) => (
    //   getRunConnect({
    //     ...teams,
    //     bench: 1,
    //     user: id,
    //   }, ApiUtils.TYPES.BALLER_BENCH)
    // ));

    // moving winners to the next tab
    const nextApiRequests = arrayWinnerTeam.map(({ id }) => (
      getRunConnect({
        ...teams,
        user: id,
      }, ApiUtils.TYPES.BALLER_NEXT)
    ));

    try {
      await Promise.all([...clearApiRequests, ...nextApiRequests]);
    } catch (e) {
      // empty
    }
  }

  hideLoading(error = '') {
    this.setState({
      isLoading: false,
    }, () => {
      if (!error) {
        return;
      }

      setTimeout(() => {
        alert(error);
      }, 700);
    });
  }

  async newRun() {
    const {
      navigation,
      getRunConnect,
      displayViewConnect,
      runDate,
      gameId,
      court,
    } = this.props;
    const { winner } = this.state;

    const run = {
      winner,
      runId: runDate.id,
      game: gameId,
    };

    let gameIdNew;

    this.setState({
      isLoading: true,
    });

    try {
      gameIdNew = await getRunConnect(run, 'newRun');
    } catch (e) {
      // empty
    }

    if (!gameIdNew) {
      this.hideLoading('api error');
      return;
    }

    if (typeof gameIdNew !== 'number') {
      this.hideLoading('wrong api response');
      return;
    }

    gameIdNew = gameIdNew.toString();

    // await this.updateTeamsPlaces(gameIdNew);

    const view = {
      data: court,
      schedule: runDate,
      game: gameIdNew,
    };

    displayViewConnect(view);

    navigation.navigate('TeamBoard');
  }

  completeBtn() {
    const { winner, complete, active } = this.state;

    if (winner) {
      if (complete === 1) {
        return (
          <Button full style={[styles.runBtn, { backgroundColor: '#e44240' }]} onPress={() => this.closeGame()}>
            <Text style={{
              color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium',
            }}
            >
              CLOSE
            </Text>
          </Button>
        );
      }

      return (
        <View style={{ flexDirection: 'row', flex: 1, width: '100%' }}>
          <Button full style={[styles.runBtn, { backgroundColor: '#689f34' }]} onPress={() => this.newRun()}>
            <Text style={{
              color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium',
            }}
            >
              NEXT GAME
            </Text>
          </Button>
          <Button full style={[styles.runBtn, { backgroundColor: '#e44240' }]} onPress={() => this.alertCloseRun()}>
            <Text style={{
              color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium',
            }}
            >
              END RUN
            </Text>
          </Button>

        </View>
      );
    }

    if (active) {
      return (
        <View style={{ flexDirection: 'row', flex: 1, width: '100%' }}>
          <Button full style={[styles.runBtn, { backgroundColor: '#478cba' }]} onPress={() => this.completeRun()}>
            <Text style={{
              color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium',
            }}
            >
              COMPLETE GAME
            </Text>
          </Button>
          <Button full style={[styles.runBtn, { backgroundColor: '#305F80' }]} onPress={() => this.closeGame()}>
            <Text style={{
              color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium',
            }}
            >
              BACK TO TEAMS
            </Text>
          </Button>
        </View>
      );
    }

    return (
      <Button full style={[styles.runBtn, { backgroundColor: '#e44240' }]} onPress={() => this.closeGame()}>
        <Text style={{
          color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium',
        }}
        >
          CLOSE
        </Text>
      </Button>
    );
  }

  renderSpinner() {
    const { isLoading } = this.state;

    return <Spinner visible={isLoading} />;
  }

  render() {
    const { court } = this.props;
    const image = generalUtils.getItemImage(court.imageName);

    return (
      <Container style={styles.container}>
        <View style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        }}
        >
          <Image
            style={{
              flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: 0.4,
            }}
            source={{ uri: image }}
          />
        </View>
        <Grid>
          <Row size={90}>
            <SafeAreaView style={{ flex: 1 }}>
              <View style={styles.run}>
                <View style={styles.listContainer}>

                  <Grid>
                    <Row style={{ height: 40 }}>
                      <View style={{ width: '100%' }}>
                        <Text style={{
                          padding: 10, width: '100%', textAlign: 'center', backgroundColor: '#ffffff', color: '#000000', flexDirection: 'row',
                        }}
                        >
                          HOME
                        </Text>
                      </View>
                    </Row>

                    <Row>
                      {this.scoreCard(this.state.winner, 'Home')}
                    </Row>

                  </Grid>

                </View>
                <View style={styles.listContainer}>

                  <Grid>
                    <Row style={{ height: 40 }}>
                      <View style={{ width: '100%' }}>
                        <Text style={{
                          padding: 10, width: '100%', textAlign: 'center', backgroundColor: '#ffffff', color: '#000000', flexDirection: 'row',
                        }}
                        >
                          GUEST
                        </Text>
                      </View>
                    </Row>
                    <Row>
                      {this.scoreCard(this.state.winner, 'Guest')}
                    </Row>

                  </Grid>

                </View>
              </View>
            </SafeAreaView>
          </Row>

          <Row size={10}>
            {this.completeBtn()}
          </Row>
        </Grid>

        {this.renderSpinner()}
      </Container>
    );
  }
}

Run.propTypes = {
  getRunConnect: PropTypes.func.isRequired,
  squadApiConnect: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  resetGroupsConnect: PropTypes.func.isRequired,
  displayViewConnect: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  runDate: PropTypes.object.isRequired,
  court: PropTypes.object.isRequired,
  groups: PropTypes.object.isRequired,
  gameId: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const data = gamesViewSelector(state);

  return {
    user: state.auth.user.profile,
    court: data.data,
    runDate: data.schedule,
    gameId: data.game,
    groups: state.games.groups,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getRunConnect: (runId, type) => dispatch(getRun(runId, type)),
  resetGroupsConnect: () => dispatch(resetGroups()),
  squadApiConnect: (userId, type, data) => dispatch(squadApi(userId, type, data)),
  displayViewConnect: (view) => dispatch(displayView(view)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Run);
