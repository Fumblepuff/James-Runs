/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'native-base';
import { connect } from 'react-redux';
import { Col, Row, Grid } from 'react-native-easy-grid';
import 'moment-timezone';

import {
  addToList,
  displayView,
  getRun,
  setBallers,
} from 'src/reducers/games';
import {
  setPayment,
  setRunItem,
  setCost,
} from 'src/reducers/transaction';

import GameApi from 'src/api/GameApi';
import momentUtils from 'src/utils/momentUtils';
import {
  NavigationService,
  routeNames,
} from 'src/navigation';

import styles from './styles';

class ExhibitionList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      run: this.props.data.data,
      image: 'https:\/\/s3.amazonaws.com\/awsjames-userfiles-mobilehub-258458471\/public\/james-full-logo.png',
      reserved: false,
      spots: 0,
    };
  }

  componentDidMount() {
    this.showProfileImage();
    this.getRunDetail();
    // this.checkReserve();
  }

  getRunDetail() {
    const ballers = {
      run: this.state.run.runId,
    };

    this.props.getRunConnect(ballers, 'getRunDetail')
      .then(result => {
        if (result) {
          this.getBallers(result.ballerLimit);
        }
      })
      .catch(err => alert(err));
  }

  getBallers(limit) {
    const ballers = {
      run: this.state.run.runId,
    };

    this.props.getRunConnect(ballers, 'getRunBallers')
      .then(result => {
        const left = limit - result.length;

        this.setState({
          spots: left,
        });
      })
      .catch(err => alert(err));
  }

  checkReserve() {
    const run = {
      run: this.state.run.runId,
      user: this.props.baller,
    };

    this.props.getRunConnect(run, 'checkConfirm')
      .then(result => {
        this.setState({ reserved: result == 1 ? true : false });
      })
      .catch(err => alert(err));
  }

  paymentInit() {
    if (this.props.cost > 0) {
      const cost = this.props.cost / 100;

      if (this.state.reserved) {
        this.reserveRun();
      } else {
        this.props.setPayment(true);
        this.props.setRunItem(this.state.run.runId);
        this.props.setCost(cost);
      }
    } else {
      this.reserveRun();
    }
  }

  reserveRun() {
    const run = {
      run: this.state.run.runId,
      user: this.props.baller,
      reserve: !this.state.reserved,
    };

    this.props.getRunConnect(run, 'ballerReserve')
      .then(() => {
        this.setState({ reserved: !this.state.reserved });
        this.getRunDetail();
      })
      .catch(err => alert(err));
  }

  distanceLocation() {
    const moment = require('moment');
    const now = moment();
    const geolib = require('geolib');

    const days = moment(now).to(this.props.date, true);

    const location = geolib.getDistance(
      { latitude: this.props.userLocation.latitude, longitude: this.props.userLocation.longitude },
      { latitude: this.props.run.latitude, longitude: this.props.run.longitude },
    );

    const distance = geolib.convertDistance(location, 'mi');

    this.locationItem(distance, days);
  }

  showProfileImage() {
    if (this.props.imageType === 'google') {
      this.setState({ image: this.props.image ? this.props.image : 'https:\/\/s3.amazonaws.com\/awsjames-userfiles-mobilehub-258458471\/public\/james-full-logo.png' });
    } else {
      if (this.props.image) {
        this.setState({ image: this.props.image });
      }
    }
  }

  register() {
    console.log('register');
  }

  // view(page) {
  //   const ballers = {
  //     run: this.props.data.data.runId,
  //   };

  //   this.props.getRunConnect(ballers, 'getRunBallers')
  //     .then(result => {
  //       this.props.setBallersConnect(result);
  //     })
  //     .catch(err => alert(err));

  //   this.props.displayViewConnect(this.props.data);
  //   NavigationService.navigate(page);
  // }

  view(page) {
    const {
      data,
      getRunConnect,
      setBallersConnect,
      displayViewConnect,
    } = this.props;

    const ballers = {
      run: data.data.runId,
    };

    getRunConnect(ballers, 'getRunBallers')
      .then((result) => {
        setBallersConnect(result);
      })
      .catch((err) => alert(err));

    displayViewConnect(data);

    NavigationService.navigate(page, {
      data: data.data,
    });
  }

  addDefaultSrc(ev) {
    return ev.target.src = 'https:\/\/s3.amazonaws.com\/awsjames-userfiles-mobilehub-258458471\/public\/james-full-logo.png';
  }

  reserveBtn() {
    const { run, showReserveSpot } = this.props;
    const { spots, reserved } = this.state;
    const { runEnd, runId } = run;

    if (!showReserveSpot) {
      return null;
    }

    if (spots > 0 && runEnd === 0) {
      return (
        <Col style={{
          flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        }}
        >
          <Button
            full
            style={[styles.startBtn, { alignSelf: 'center', backgroundColor: reserved ? '#fd6464' : '#52ce5e' }]}
            onPress={() => {
              GameApi.getRunDetail(runId).then((data) => {
                NavigationService.navigate(routeNames.RESERVE_SPOT, {
                  dataGame: run,
                  dataGameDetail: data,
                });
              }).catch((err) => {
                alert(err.message);
              });
            }}
          >
            <Text style={styles.startBtnText}>
              {reserved ? 'RESERVED' : 'RESERVE SPOT'}
            </Text>
          </Button>
        </Col>

      );
    }

    return null;
  }

  locationItem() {
    const { run } = this.props;
    const moment = require('moment');
    // const now = moment();
    const geolib = require('geolib');

    // const afterToday = moment(this.props.date).isBefore(now);
    // const days = moment(now).to(this.props.date, true);
    const schedule = moment(this.props.date).format('dddd MMMM Do');
    const time = momentUtils.getTimeFromUtc(this.props.date);

    // if (afterToday){
    // } else {
    // }

    const location = geolib.getDistance(
      { latitude: this.props.userLocation.latitude, longitude: this.props.userLocation.longitude },
      { latitude: this.props.run.latitude, longitude: this.props.run.longitude },
    );

    const distance = geolib.convertDistance(location, 'mi');

    if (this.props.miles && distance <= this.props.miles) {
      return (
        <Grid style={styles.listContainer}>
          <Row style={{ borderBottomWidth: 2, borderBottomColor: '#478cba' }}>
            <Col style={{ flexDirection: 'row' }}>
              <View style={{ marginBottom: 10 }}><Text style={[styles.infoText, { borderRadius: 0 }]}>{schedule}</Text></View>
            </Col>
            <Col>
              <View style={{
                marginBottom: 10, width: '60%', alignSelf: 'flex-end', display: this.props.date ? 'flex' : 'none',
              }}
              >
                <Text
                  style={[styles.infoText, { backgroundColor: '#ffffff', color: '#000000' }]}
                >
                    {this.state.run.runEnd == 0 ? run.spots + ' Spots Left' : 'Closed'}
                </Text>
              </View>
            </Col>
          </Row>
          <Row>
            <Col style={{ width: 100 }}>
              <View style={{ width: 100, height: 100 }}>
                <Image
                  style={{
                    flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: 0.5,
                  }}
                  source={{ uri: run.image }}
                />
              </View>
            </Col>
            <Col style={{ flex: 1.5, paddingLeft: 10, justifyContent: 'center' }}>
              <View><Text style={styles.headerText}>{this.props.header.toUpperCase()}</Text></View>
              <View><Text style={styles.subText}>{this.props.run.addressFormat}</Text></View>
            </Col>
            {this.reserveBtn()}
          </Row>
        </Grid>

      );
    }

    if (this.props.miles == 0 || !this.props.miles) {
      return (
        <Grid style={styles.listContainer}>
          <Row style={{ borderBottomWidth: 2, borderBottomColor: '#262626', marginBottom: 10 }}>
            <Col style={{ flexDirection: 'row' }}>
              <View style={{ marginBottom: 0 }}><Text style={[styles.infoText, { borderRadius: 0 }]}>{schedule}</Text></View>
            </Col>
            <Col>
              <View style={{
                marginBottom: 10, width: '60%', alignSelf: 'flex-start', flexDirection: 'row', display: this.props.date ? 'flex' : 'none',
              }}
              >
                <Text style={[styles.infoText, { backgroundColor: '#305f80', color: '#ffffff' }]}>{time}</Text>
                <Text style={[styles.infoText, { backgroundColor: '#ffffff', marginLeft: 10, color: '#000000' }]}>
                  {this.state.run.runEnd == 0 ? run.spots + ' Spots Left' : 'Closed'}
                </Text>
              </View>
            </Col>
          </Row>
          <Row>
            <Col style={{ width: 100 }}>
              <View style={{ width: 100, height: 100, position: 'relative' }}>
                <Image
                  style={{
                    flex: 1, resizeMode: 'cover', position: 'absolute', width: '100%', height: '100%', opacity: 0.5,
                  }}
                  source={{ uri: run.image }}
                />
              </View>
            </Col>
            <Col style={{ flex: 1.5, paddingLeft: 10, justifyContent: 'center' }}>
              <View><Text style={styles.headerText}>{this.props.header.toUpperCase()}</Text></View>
              <View><Text style={styles.subText}>{this.props.run.addressFormat}</Text></View>
            </Col>
            {this.reserveBtn()}
          </Row>
        </Grid>

      );
    }
  }

  render() {
    const { page } = this.props;

    return (
      <TouchableOpacity
        onPress={() => this.view(page)}
      >
        {this.locationItem()}
      </TouchableOpacity>
    );
  }
}

ExhibitionList.propTypes = {
  getRunConnect: PropTypes.func.isRequired,
  displayViewConnect: PropTypes.func.isRequired,
  setBallersConnect: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showReserveSpot: PropTypes.bool,
};

ExhibitionList.defaultProps = {
  showReserveSpot: false,
};

const mapDispatchToProps = (dispatch) => {
  return {
    getRunConnect: (runId, type) => dispatch(getRun(runId, type)),
    displayViewConnect: (view) => dispatch(displayView(view)),
    addToList: (list) => { dispatch(addToList(list)); },
    setBallersConnect: (ballers) => { dispatch(setBallers(ballers)); },
    setRunItem: (runItem) => { dispatch(setRunItem(runItem)); },
    setPayment: (payment) => { dispatch(setPayment(payment)); },
    setCost: (cost) => { dispatch(setCost(cost)); },
  };
};

const mapStateToProps = (state) => {
  return {
    list: state.games.addToList,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExhibitionList);
