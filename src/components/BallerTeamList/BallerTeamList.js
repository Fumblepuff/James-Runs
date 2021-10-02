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
import { Col, Row, Grid } from 'react-native-easy-grid';
import { withNavigation } from '@react-navigation/compat';

import generalUtils from 'src/utils/generalUtils';

import {
  getRun,
  runGroupsAddData,
  resetGroups,
} from 'src/reducers/games';

import styles from './styles';

class BallerTeamList extends Component {
  constructor(props) {
    super(props);

    const { groups: { home, guest } } = this.props;

    this.state = {
      home,
      guest,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;

    this.navigationListeners = [
      navigation.addListener('focus', this.onFocus),
    ];

    this.onFocus();
  }

  componentWillUnmount() {
    if (this.navigationListeners) {
      this.navigationListeners.forEach((listener) => {
        listener();
      });
    }
  }

  onFocus = () => {
    this.ballerStats();
    this.getBallerTeam();
  }

  getBallerTeam() {
    const {
      getRunConnect,
      run,
      data,
      game,
    } = this.props;

    const team = {
      run,
      user: data.id,
      game,
    };

    getRunConnect(team, 'getUserTeam')
      .then((result) => {
        this.setState({
          home: result.team === 'Home',
          guest: result.team === 'Guest',
        });
      })
      .catch((err) => alert(err));
  }

  checkTeam(team) {
    const { groups } = this.props;

    switch (team) {
      case 'Home':
        if (groups.home.length >= 5) {
          Alert.alert(
            'Check Team',
            'Only 5 ballers can be added to a team',
            [
              { text: 'OK' },
            ],
            { cancelable: true },
          );
        } else {
          this.ballerTeam('Home');
        }
        break;
      case 'Guest':
        if (groups.guest.length >= 5) {
          Alert.alert(
            'Check Team',
            'Only 5 ballers can be added to a team',
            [
              { text: 'OK' },
            ],
            { cancelable: true },
          );
        } else {
          this.ballerTeam('Guest', true);
        }
        break;
      default:
        break;
    }
  }

  ballerTeam(type, doUpdateBallers = false) {
    const {
      getRunConnect,
      runGroupsAddDataConnect,
      run,
      data,
      game,
      updateBallers,
    } = this.props;
    const { home, guest } = this.state;

    switch (type) {
      case 'Home':
        this.setState({
          home: !home,
          guest: home,
        });
        break;
      case 'Guest':
        this.setState({
          guest: !guest,
          home: guest,
        });
        break;
      case 'Clear':
        this.setState({
          guest: false,
          home: false,
        });
        break;
      default:
        break;
    }

    const team = {
      run,
      user: data.id,
      game,
      team: type,
    };

    getRunConnect(team, 'addUserTeam')
      .then((result) => {
        runGroupsAddDataConnect(result);

        if (doUpdateBallers) {
          updateBallers();
        }
      })
      .catch((err) => alert(err));
  }

  ballerStats() {
    const { getRunConnect, data } = this.props;

    const user = {
      user: data.id,
    };

    getRunConnect(user, 'getUserStats')
      .then((result) => {
        this.setState({
          wins: result.wins ? result.wins : 0,
          losses: result.losses ? result.losses : 0,
        });
      })
      .catch((err) => alert(err));
  }

  render() {
    const { image, header } = this.props;
    const imageFormat = generalUtils.getItemImage(image);

    return (
      <View style={styles.listContainer}>

        <Grid>
          <Row>
            <Col style={{ width: 70, justifyContent: 'center' }}>
              <View style={{ width: '100%', height: 70, borderRadius: 70, overflow: 'hidden' }}>
                <Image style={{ flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: .5 }} source={{ uri: imageFormat }} />
              </View>
              <View><Text style={styles.headerText}>{header.toUpperCase()}</Text></View>
            </Col>
            <Col style={{ marginLeft: 5, marginRight: 5, justifyContent: 'center' }}>
              <View style={{ width: '100%', flexDirection: 'row' }}>
                <View style={{ height: '100%', flex: 1, margin: 2, alignContent: 'center', justifyContent: 'center' }}>
                  <Text style={[styles.subText, { fontSize: 16, textAlign: 'center' }]}> {this.state.wins} </Text>
                  <Text style={[styles.subText, { fontSize: 14, textAlign: 'center' }]}> WINS </Text>
                </View>
                <View style={{ height: '100%', flex: 1, margin: 2, alignContent: 'center', justifyContent: 'center' }}>
                  <Text style={[styles.subText, { fontSize: 16, textAlign: 'center' }]}> {this.state.losses} </Text>
                  <Text style={[styles.subText, { fontSize: 14, textAlign: 'center' }]}> LOSSES </Text>
                </View>

              </View>
            </Col>
            <Col style={{ width: 180, flexDirection: 'row' }}>
              <View style={{ height: '100%', flex: 1, margin: 5, alignContent: 'center', justifyContent: 'center' }}>
                <Button full style={{ height: 50, borderRadius: 50, backgroundColor: this.state.home ? '#478CBA' : '#fd6464' }} onPress={() => this.checkTeam('Home')}>
                  <Icon type="MaterialIcons" style={{ color: '#ffffff', fontSize: 30, textAlign: 'center', marginLeft: 0, marginRight: 0 }} name="account-circle" />
                </Button>
                <Text style={[styles.subText, { fontSize: 16, textAlign: 'center' }]}>HOME</Text>
              </View>

              <View style={{ height: '100%', flex: 1, margin: 5, alignContent: 'center', justifyContent: 'center' }}>
                <Button full style={{ height: 50, borderRadius: 50, backgroundColor: this.state.guest ? '#478CBA' : '#fd6464' }} onPress={() => this.checkTeam('Guest')}>
                  <Icon type="MaterialIcons" style={{ color: '#ffffff', fontSize: 30, textAlign: 'center', marginLeft: 0, marginRight: 0 }} name="supervisor-account" />
                </Button>
                <Text style={[styles.subText, { fontSize: 16, textAlign: 'center' }]}>GUEST</Text>
              </View>

              <View style={{ height: '100%', flex: 1, margin: 5, alignContent: 'center', justifyContent: 'center' }}>
                <Button full style={{ height: 50, borderRadius: 50, backgroundColor: '#8D8D8E' }} onPress={() => this.ballerTeam('Clear')}>
                  <Icon type="MaterialIcons" style={{ color: '#ffffff', fontSize: 30, textAlign: 'center', marginLeft: 0, marginRight: 0 }} name="cancel" />
                </Button>
                <Text style={[styles.subText, { fontSize: 16, textAlign: 'center' }]}>Clear</Text>
              </View>
            </Col>
          </Row>
        </Grid>

      </View>
    );
  }
}

BallerTeamList.propTypes = {
  getRunConnect: PropTypes.func.isRequired,
  runGroupsAddDataConnect: PropTypes.func.isRequired,
  groups: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  image: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  run: PropTypes.string.isRequired,
  game: PropTypes.string.isRequired,
  updateBallers: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  getRunConnect: (runId, type) => dispatch(getRun(runId, type)),
  runGroupsAddDataConnect: (groups) => dispatch(runGroupsAddData(groups)),
  resetGroupsConnect: () => dispatch(resetGroups()),
});

const mapStateToProps = (state) => ({
  groups: state.games.groups,
});

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(BallerTeamList));
