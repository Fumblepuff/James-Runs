/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  Header,
  Left,
  Right,
  Button,
  Icon,
  Text,
  View,
} from 'native-base';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import gameUtils from 'src/utils/gameUtils';
import authUtils from 'src/utils/authUtils';

import {
  NavigationService,
  routeNames,
} from 'src/navigation';

import {
  logoutUser,
  addEdit,
} from 'src/reducers/auth';
import {
  getRun,
  gamesNewEvent,
} from 'src/reducers/games';

import GameApi from 'src/api/GameApi';

import navStyle from 'src/styles/Navigation';
import {
  gs,
} from 'src/styles';

const styles = navStyle;

class BasicNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMounted: true,
      reserved: false,
    };
  }

  componentDidMount() {
    const { button } = this.props;

    if (button === 'Reserve') {
      this.checkReserve();
    }
  }

  componentWillUnmount() {
    this.setState({
      isMounted: false,
    });
  }

  async userLogOut() {
    const arr = Object.values(this.props.user);
    arr.length = await 0;
    this.props.logoutUserConnect();
  }

  displaySettings() {
    this.props.addEditConnect(true);
  }

  checkReserve() {
    const run = {
      run: this.props.run,
      user: this.props.user.profile.id,
    };

    this.props.getRunConnect(run,'checkConfirm')
      .then(result => {
        if (this.state.isMounted) {
          this.setState({ reserved: result === 1 ? true : false });
        }
      })
      .catch(err => alert(err));
  }

  reserveRun() {
    const run = {
      run: this.props.run,
      user: this.props.user.profile.id,
      reserve: !this.state.reserved,
    };

    this.props.getRunConnect(run,'ballerReserve')
      .then(() => {
        if (this.state.isMounted) {
          this.setState({ reserved: !this.state.reserved });
        }
      })
      .catch(err => alert(err));
  }

  renderCreateEvent = (type) => {
    const {
      gamesNewEventConnect,
      user,
    } = this.props;

    return null; // delete this line to show buttons

    const isOrganazer = authUtils.isOrganizer(user);
    const isAdmin = authUtils.isAdmin(user);

    if (!isOrganazer && !isAdmin) {
      return null;
    }

    return (
      <Button
        block
        small
        onPress={() => {
          gamesNewEventConnect({
            isAdminMenu: false,
            type,
          });

          NavigationService.navigate(routeNames.ADD_GAME);
          // NavigationService.navigate(routeNames.ADD_GAME_FINAL);
        }}
      >
        <Text style={[gs.pL10, gs.pR10]}>ADD EVENT</Text>
      </Button>
    );
  };

  toggleBtn() {
    const {
      button,
      rightButton,
    } = this.props;

    if (rightButton) {
      const { text, onPress, type } = rightButton;

      return (
        <Button
          block
          small
          onPress={onPress}
          style={gs.flex}
          success={type === 'success'}
          danger={type === 'danger'}
        >
          <Text style={[gs.pL10, gs.pR10]}>{text}</Text>
        </Button>
      );
    }

    switch (button) {
      case 'Reserve':
        const { gameData } = this.props;

        return (
          <Button
            full
            style={[styles.reserveBtn, { marginTop: 20, backgroundColor: this.state.reserved ? '#fd6464' : '#52ce5e' }]}
            onPress={() => {
              if (!gameData) {
                alert('no game data');
                return;
              }

              const runId = parseInt(gameData.runId, 10);

              GameApi.getRunDetail(runId).then((dataGameDetail) => {
                NavigationService.navigate(routeNames.RESERVE_SPOT, {
                  dataGame: gameData,
                  dataGameDetail,
                });
              }).catch((err) => {
                alert(err.message);
              });
            }}
          >
            <Text style={styles.reserveBtnText}>{this.state.reserved ? 'RESERVED' : 'RESERVE SPOT'}</Text>
          </Button>
        );
      case 'Page':
        return (
          <Button
            block
            info
            color="#ffffff"
            style={styles.backButton}
            onPress={() => this.backNav()}
          >
            <Text style={{ textAlign: 'left', fontFamily: 'ProximaNova-Bold', color: '#ffffff', width: 100 }}>BACK</Text>
          </Button>
        );
      case 'CreateRun': return this.renderCreateEvent(gameUtils.TYPES.RUN);
      case 'CreateGame': return this.renderCreateEvent(gameUtils.TYPES.GAME);
      default:
        // statements_def
        break;
    }

    return null;
  }

  backNav() {
    const { page } = this.props;

    if (page) {
      NavigationService.navigate(page);
    } else {
      NavigationService.goBack();
    }
  }

  navButton() {
    if (this.props.drawer) {
      return (
        <Button style={{ width: '100%', flex: 1 }} transparent onPress={() => NavigationService.toggleDrawer()}>
          <Icon name="menu" style={{ fontSize: 20, color: 'white' }}/>
          <Text style={styles.headerText} >{this.props.title}</Text>
        </Button>
      );
    }

    return (
      <Button
        block
        style={styles.backButton}
        onPress={() => this.backNav()}
      >
        <Text style={{ fontFamily: 'ProximaNova-Bold', color: '#ffffff' }}>BACK</Text>
      </Button>
    );
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        <Header style={styles.headerStyle}>
          <Left style={styles.menuView}>
            {this.navButton()}
          </Left>
          <Right style={styles.menuRightView}>
            {this.toggleBtn()}
          </Right>
        </Header>
      </View>
    );
  }
}

BasicNav.propTypes = {
  page: PropTypes.string,
  gameData: PropTypes.object,
  gamesNewEventConnect: PropTypes.func.isRequired,
  rightButton: PropTypes.shape({
    text: PropTypes.string,
    onPress: PropTypes.func,
    type: PropTypes.oneOf([
      'success',
      'danger',
    ]),
  }),
};

BasicNav.defaultProps = {
  page: null,
  gameData: null,
  rightButton: null,
};

const mapDispatchToProps = {
  getRunConnect: getRun,
  addEditConnect: addEdit,
  logoutUserConnect: logoutUser,
  gamesNewEventConnect: gamesNewEvent,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  view: state.games.view,
});

export default connect(mapStateToProps, mapDispatchToProps)(BasicNav);
