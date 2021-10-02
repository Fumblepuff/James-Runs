import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Alert,
} from 'react-native';
import {
  Icon,
  Button,
} from 'native-base';
import { connect } from 'react-redux';
import { Col, Row, Grid } from 'react-native-easy-grid';

import gameUtils from 'src/utils/gameUtils';

import {
  displayView,
  getRun,
} from 'src/reducers/games';
import {
  authUserIdSelector,
} from 'src/reducers/auth';

import moment from 'src/common/moment';
import {
  NavigationService,
  routeNames,
} from 'src/navigation';
import GameApi from 'src/api/GameApi';

import {
  gs,
} from 'src/styles';

import styles from './styles';

class CourtRunList extends Component {
  constructor(props) {
    super(props);

    const { run } = props;

    this.state = {
      count: 0,
      active: run.active,
    };
  }

  componentDidMount() {
    this.getBallers();
  }

  onDeleteItem() {
    const { run, onDeleteRun } = this.props;
    const runId = parseInt(run.runId, 10);

    const deleteItem = () => {
      GameApi.deleteRunGame(runId).then(() => {
        onDeleteRun(runId);
      }).catch((err) => {
        alert(err);
      });
    };

    Alert.alert(
      'Are you sure?',
      'Game will be deleted.',
      [
        {
          text: 'OK',
          onPress: deleteItem,
        },
        {
          text: 'Cancel',
          onPress: () => {

          },
        },
      ],
      { cancelable: true },
    );
  }

  onEditItem() {
    const { run } = this.props;

    NavigationService.navigate(routeNames.ADD_GAME, {
      gameData: run,
    });
  }

  getBallers() {
    const { run, getRunConnect, userId } = this.props;

    const ballers = {
      run: run.runId,
      userId,
    };

    getRunConnect(ballers, 'getRunBallers')
      .then((result) => {
        this.setState({
          count: result.length,
        });
      })
      .catch((err) => alert(err));
  }

  toggleRun() {
    const { run, getRunConnect } = this.props;
    const { active } = this.state;

    const runApi = {
      run: run.runId,
      active: !active,
    };

    getRunConnect(runApi, 'disableRun')
      .then(() => {
        this.setState({ active: !active });
      })
      .catch((err) => alert(err));
  }

  view(page) {
    const { displayViewConnect, data } = this.props;

    displayViewConnect(data);
    NavigationService.navigate(page, { back: 'Management' });
  }

  renderEditDeleteBtns() {
    const { showEditDeleteBtns } = this.props;

    if (!showEditDeleteBtns) {
      return null;
    }

    return (
      <Row style={gs.mT10}>
        <Button
          small
          block
          style={gs.flex05}
          onPress={() => this.onEditItem()}
        >
          <Icon
            type="FontAwesome5"
            name="edit"
            style={gs.fS18}
          />
        </Button>
        <Button
          small
          danger
          block
          style={gs.flex05}
          onPress={() => this.onDeleteItem()}
        >
          <Icon
            type="FontAwesome"
            name="remove"
          />
        </Button>
      </Row>
    );
  }

  renderLocationItem() {
    const { run, page, date } = this.props;
    const { count, active } = this.state;

    const runMonth = moment(date).format('MMM');
    const runDay = moment(date).format('DD');

    return (
      <Grid style={styles.listContainer}>
        <Row>
          <Col>
            <View style={{ width: 90, flex: 1 }}>
              <Row size={1}>
                <View style={styles.month}>
                  <Text style={styles.monthText}>{runMonth}</Text>
                </View>
              </Row>
              <Row size={3}>
                <View style={styles.day}>
                  <Text style={styles.dayText}>{runDay}</Text>
                </View>
              </Row>
            </View>
          </Col>

          <Col style={{ width: 130, paddingLeft: 10, justifyContent: 'center' }}>
            <View>
              <Text style={styles.headerText}>
                {`${run.spotsReserved} RESERVATIONS`}
              </Text>
            </View>
            <View><Text style={styles.headerText}>{gameUtils.isPickUpGame(run.type) ? 'Run' : 'Game'}</Text></View>
          </Col>
          {/* <Col style={{ width: 70, justifyContent: 'center', alignContent: 'center' }}>
          </Col> */}

          <Col style={[gs.width120, gs.mV10, gs.mR10]}>
            <Row>
              <Button
                full
                style={[ styles.toggleBtn, { backgroundColor: active ? '#52ce5e' : '#fd6464' } ]}
                onPress={() => this.toggleRun()}
              >
                <Text style={styles.toggleBtnText}>{active ? 'ACTIVE' : 'INACTIVE'}</Text>
              </Button>

              <Button
                full
                transparent
                style={{ height: '100%' }}
                onPress={() => this.view(page)}
              >
                <Icon style={{ color: '#ffffff', margin: 0 }} name="arrow-forward" />
              </Button>
            </Row>

            {this.renderEditDeleteBtns()}

          </Col>

        </Row>
      </Grid>

    );
  }

  render() {
    return (
      <View>
        {this.renderLocationItem()}
      </View>
    );
  }
}

CourtRunList.propTypes = {
  run: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  page: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  showEditDeleteBtns: PropTypes.bool,
  getRunConnect: PropTypes.func.isRequired,
  displayViewConnect: PropTypes.func.isRequired,
  onDeleteRun: PropTypes.func,
  userId: PropTypes.number,
};

CourtRunList.defaultProps = {
  showEditDeleteBtns: false,
  onDeleteRun: () => null,
  userId: null,
};

const mapStateToProps = (state) => ({
  userId: authUserIdSelector()(state),
});

const mapDispatchToProps = (dispatch) => ({
  getRunConnect: (runId, type) => dispatch(getRun(runId, type)),
  displayViewConnect: (view) => dispatch(displayView(view)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CourtRunList);
