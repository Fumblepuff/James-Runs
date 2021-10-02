/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Card, Icon, Button } from 'native-base';
import geolib from 'geolib';
import { connect } from 'react-redux';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Storage } from 'aws-amplify';
import Moment from 'react-moment';
import 'moment-timezone';
import { withNavigation } from '@react-navigation/compat';


import gameUtils from 'src/utils/gameUtils';

import { addToList, displayView, getRun } from 'src/reducers/games';

class ReserveList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: 'https:\/\/s3.amazonaws.com\/awsjames-userfiles-mobilehub-258458471\/public\/james-full-logo.png',
      header: this.props.header,
      subText: this.props.subText,
      push: this.props.push,
      run: this.props.run,
      added: false,
      requested: false,
      checkin: false,
    };
  }

  componentDidMount() {
    this.showProfileImage();
    this.checkReserve();
    this.checkCheckIn();
  }

  distanceLocation() {
    var moment = require('moment');
    var now = moment();
    let geolib = require('geolib');

    var date = moment(this.props.date).format('LLL');
    var days = moment(now).to(this.props.date, true);

    var location = geolib.getDistance(
      { latitude: this.props.userLocation.latitude, longitude: this.props.userLocation.longitude },
      { latitude: this.props.run.latitude, longitude: this.props.run.longitude }
    );

    var distance = geolib.convertDistance(location, 'mi');

    this.locationItem(distance, days);
  }

  showProfileImage() {
    console.log(this.props.imageType);
    if (this.props.imageType === 'google') {
      this.setState({ image: this.props.image ? this.props.image : 'https:\/\/s3.amazonaws.com\/awsjames-userfiles-mobilehub-258458471\/public\/james-full-logo.png' });
    } else {
      this.setState({ image: this.props.image });
      // Storage.get(this.props.image)
      // .then(result => {

      //     this.setState({ image: result });

      // })
      // .catch(err => alert(err));
    }


    //return this.state.image;
  }

  checkCheckIn() {
    const run = {
      run: this.state.run.runId,
      user: this.props.baller,
    };

    this.props.getRun(run,'getSingleRunBaller')
      .then(result => {
        if (result) {
          this.setState({ checkin: result.checkIn == 1 ? true : false });
        }
      })
      .catch(err => alert(err));
  }

  checkReserve() {
    const run = {
      run: this.state.run.runId,
      user: this.props.baller,
    };

    this.props.getRun(run,'checkConfirm')
      .then(result => {
        this.setState({ reserved: result == 1 ? true : false });
      })
      .catch(err => alert(err));
  }

  reserveRun() {
    const run = {
      run: this.state.run.runId,
      user: this.props.baller,
      reserve: !this.state.reserved,
    };

    this.props.getRun(run,'ballerReserve')
      .then(result => {
        console.log(result);
        this.setState({ reserved: !this.state.reserved });
      })
      .catch(err => alert(err));
  }

  view(page) {
    this.props.displayView(this.props.data);
    this.state.push ? this.props.navigation.push(page) : this.props.navigation.navigate(page);
  }

  addDefaultSrc(ev) {
    return ev.target.src = 'https:\/\/s3.amazonaws.com\/awsjames-userfiles-mobilehub-258458471\/public\/james-full-logo.png';
  }

  ballerStatus(type) {
    if (this.state.reserved) {
      switch (type) {
        case 'ballerCheckin':
          this.setState({ checkin: !this.state.checkin });
          var status = {
            run: this.state.run.runId,
            user: this.props.baller,
            checkin: !this.state.checkin,
          };
          break;
        case 'ballerBench':
          this.setState({ bench: !this.state.bench });
          var status = {
            run: this.state.run.runId,
            user: this.props.baller,
            bench: !this.state.bench,
          };
          break;
      }

      this.props.getRun(status,type)
        .then(result => {
          console.log(result);
        })
        .catch(err => alert(err));
    } else {
      Alert.alert(
        'Baller Has Not Reserved',
        'Select An Option Below',
        [
          { text: 'Reserve Run', onPress: () => this.reserveRun() },
          { text: 'Close', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        ],
        { cancelable: true }
      );
    }
  }

  locationItem() {
    var moment = require('moment');
    var now = moment();
    let geolib = require('geolib');

    var before = moment(this.props.date).isBefore(now);
    var days = moment(now).to(this.props.date, true);

    if (before) {
      var date = days + ' ago';
    } else {
      var date = days;
    }

    var location = geolib.getDistance(
      { latitude: this.props.userLocation.latitude, longitude: this.props.userLocation.longitude },
      { latitude: this.props.run.latitude, longitude: this.props.run.longitude }
    );

    var distance = geolib.convertDistance(location, 'mi');

    return (
            <Grid style={styles.listContainer}>
                <Row>
                    <Col>
                        <View style={{ marginBottom: 10 }}><Text style={[styles.infoText]}>{this.props.header.toUpperCase()}</Text></View>
                    </Col>
                    <Col>
                        <View style={{ marginBottom: 10 }}><Text style={[styles.infoText, { backgroundColor: '#F29333' }]}>{date}</Text></View>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <View style={{ height: 100, marginRight: 10 }}>
                            <Image style={{ flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: 0.5 }} source={{ uri: this.state.image }} />
                        </View>
                    </Col>
                    <Col style={{ padding: 10, flexDirection: 'row' }}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Button full style={[ styles.startBtn, { backgroundColor: this.state.reserved ? '#52ce5e' : '#fd6464' } ]} onPress={() => this.reserveRun()}>
                                <Text style={styles.startBtnText}>{this.state.reserved ? 'RESERVED' : 'RESERVE SPOT'}</Text>
                            </Button>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Button full style={{ width: 70, height: 70, borderRadius: 70, alignSelf: 'center', backgroundColor: this.state.checkin ? '#478CBA' : '#fd6464' }} onPress={() => this.ballerStatus('ballerCheckin')}>
                                <Icon type="MaterialIcons" style={{ color: '#ffffff', fontSize: 30, textAlign: 'center', margin: 0 }} name="check-circle" />
                            </Button>
                            <Text style={[styles.subText, { fontSize: 16, textAlign: 'center' }]}>{this.state.checkin ? 'Check Out' : 'Check In'}</Text>
                        </View>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <View style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center' }}><Text style={[styles.infoText, { width: '100%' }]}>{gameUtils.isPickUpGame(this.props.run.type) ? 'Run' : 'Game'}</Text></View>
                    </Col>
                </Row>
            </Grid>

    );
  }

  render() {
    return (
            <View >

                {this.locationItem()}

            </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getRun: (runId, type) => dispatch(getRun(runId, type)),
    displayView: (view) => dispatch(displayView(view)),
    addToList: (list) => {
      dispatch(addToList(list));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    list: state.games.addToList,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(ReserveList));

const styles = {
  listContainer: {
    width: '100%',
    flex: 1,
    backgroundColor: 'rgba(53,53,53,.9)',
    padding: 10,
    marginBottom: 5,
  },
  selectBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: 0,
  },
  profileImageWrapper: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: 120,
    height: 120,
  },
  headerText: {
    flex: 1,
    color: 'white',
    fontFamily: 'BarlowCondensed-Bold',
    fontSize: 18,
  },
  startBtn: {
    width: 70,
    height: 70,
    alignSelf: 'center',
    backgroundColor: '#044571',
    flexDirection: 'row',
    borderRadius: 70 / 2,
    overflow: 'hidden',
  },
  startBtnText: {
    flex: 1,
    fontFamily: 'BarlowCondensed-Bold',
    fontSize: 15,
    color: '#ffffff',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  infoText: {
    color: 'white',
    fontFamily: 'BarlowCondensed-Medium',
    fontSize: 14,
    padding: 5,
    backgroundColor: '#000000',
    borderRadius: 3,
    textAlign: 'center',
    overflow: 'hidden',
  },
  subText: {
    color: 'white',
    fontFamily: 'BarlowCondensed-Medium',
    fontSize: 16,
  },
  iconActive: {
    opacity: 1,
    color: '#478cba',
    fontSize: 40,
    alignSelf: 'center',
    marginRight: 0,
    marginLeft: 0,
  },
  iconInActive: {
    opacity: 1,
    color: 'white',
    fontSize: 40,
    alignSelf: 'center',
    marginRight: 0,
    marginLeft: 0,
  },
};

