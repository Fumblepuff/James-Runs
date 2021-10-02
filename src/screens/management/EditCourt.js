/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View, Image, TouchableOpacity, PermissionsAndroid, SafeAreaView, FlatList, Platform,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import { Container, Text, Button } from 'native-base';
import { connect } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import 'moment-timezone';

import BasicNav from 'src/components/BasicNav';
import CourtRunList from 'src/components/CourtRunList';
import {
  getRun,
  gamesViewDataSelector,
} from 'src/reducers/games';
import {
  authUserIdSelector,
} from 'src/reducers/auth';
import {
  gamesListFormat,
} from 'src/api/GameApiFormatters';

import mainStyle from 'src/styles/Style';

import background from 'src/assets/managementBackground.png';

const styles = mainStyle;

class EditCourt extends Component {
  constructor(props) {
    super(props);

    this.state = {
      upcomingTab: '#478cba',
      pastTab: '#305f80',
      isPastGame: false,
      runs: [],
      deletedRuns: [],
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
    this.getUpcomingRuns();
    this.getLocation();
  }

  onDeleteRun = (runId) => {
    const { deletedRuns } = this.state;

    deletedRuns.push(runId);

    this.setState({
      deletedRuns,
    });
  }

  getLocation() {
    if (Platform.OS === 'android') {
      this.requestLocationPermission();
    } else {
      this.userLocation();
    }
  }

  getUpcomingRuns() {
    const { court, getRunConnect, userId } = this.props;
    const user = {
      court: court.id,
      userId,
    };

    getRunConnect(user, 'getUpcomingCourtRuns')
      .then((result) => {
        this.setState({
          runs: gamesListFormat(result),
          isPastGame: false,
        });
      })
      .catch((err) => alert(err));
  }

  getPastRuns() {
    const { court, getRunConnect, userId } = this.props;

    const user = {
      court: court.id,
      userId,
    };

    getRunConnect(user, 'getPastCourtRuns')
      .then((result) => {
        this.setState({
          runs: gamesListFormat(result),
          isPastGame: true,
        });
      })
      .catch((err) => alert(err));
  }

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Get My Location',
          message: 'James App needs your location'
                    + 'to find Runs near you.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.userLocation();
      } else {
        // console.log('Location denied');
      }
    } catch (err) {
      // console.warn(err);
    }
  }

  userLocation() {
    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          userLocation: position.coords,
        });
      },
      (error) => {
        alert(`EditCourt: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  listRuns() {
    const { navigation } = this.props;
    const {
      runs,
      userLocation,
      isPastGame,
      deletedRuns,
    } = this.state;

    if (runs && userLocation) {
      let RunArr = Object.values(runs);

      if (deletedRuns.length > 0) {
        RunArr = RunArr.filter((item) => {
          const runId = parseInt(item.runId, 10);
          return !deletedRuns.includes(runId);
        });
      }

      return (
        <FlatList
          data={RunArr}
          renderItem={({ item }) => (
            <CourtRunList
              date={item.timeStamp}
              navigation={navigation}
              header="test"
              page="SingleRun"
              run={item}
              data={({ data: item })}
              showEditDeleteBtns={!isPastGame}
              onDeleteRun={this.onDeleteRun}
            />
          )}
          keyExtractor={(item) => item.runId}
        />
      );
    }

    return null;
  }

  selectPhotos() {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos',
      groupTypes: 'All',
    })
      .then((_r) => {
        // this.setState({
        //   photos: r.edges,
        //   showPhotos: true,
        // });
      })
      .catch((_err) => {
        // console.log(err);
      });
  }

  filterListing(type) {
    switch (type) {
      case 'past':

        this.setState({
          pastTab: '#478cba',
          upcomingTab: '#214660',
        }, () => {
          this.getPastRuns();
        });

        break;
      case 'upcoming':

        this.setState({
          pastTab: '#305f80',
          upcomingTab: '#478cba',
        }, () => {
          this.getUpcomingRuns();
        });

        break;
        // case 'myRuns':

        //   this.setState({
        //     pastTab: '#305f80',
        //     upcomingTab: '#214660',
        //   }, () => {
        //     this.getMyRuns();
        //   });

      //   break;
      default:

        this.setState({
          pastTab: '#305f80',
          upcomingTab: '#478cba',
        }, () => {
          this.getUpcomingRuns();
        });
        break;
    }
  }

  editCourt() {
    const { navigation } = this.props;

    navigation.navigate('AddGame');
  }

  renderTabs() {
    const { pastTab, upcomingTab } = this.state;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <View style={{
          flexDirection: 'row', flex: 0.1, padding: 0, alignItems: 'center', justifyContent: 'center', marginBottom: 0,
        }}
        >

          <Button full style={[styles.filterBtn, { backgroundColor: pastTab }]} onPress={() => this.filterListing('past')}>
            <Text style={styles.runTab}>Past Games</Text>
          </Button>
          <Button full style={[styles.filterBtn, { backgroundColor: upcomingTab }]} onPress={() => this.filterListing('upcoming')}>
            <Text style={styles.runTab}>Upcoming Games</Text>
          </Button>

        </View>
        <View style={{ flex: 1 }}>
          {this.listRuns()}
        </View>
      </SafeAreaView>
    );
  }

  render() {
    const { court, navigation } = this.props;
    const { name, address, image } = court;

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

        <BasicNav navigation={navigation} page="Court" title="Baller Management" link="Settings" />
        <View style={styles.accountHeader}>
          <View style={[styles.profilePic, { width: 120 }]}>
            <TouchableOpacity style={styles.profileImage} onPress={() => this.selectPhotos()}>
              <Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }} source={{ uri: image }}/>
            </TouchableOpacity>
          </View>
          <View style={{ margin: 5, flex: 1 }}>
            <Text style={[styles.profileText, { fontFamily: 'BarlowCondensed-Bold' }]}>{name}</Text>
            <Text style={styles.profileText}>{address}</Text>
          </View>
          <Button
            full
            style={[styles.addBtn, {
              backgroundColor: '#478cba', borderRadius: 30, width: 60, height: 60,
            }]}
            onPress={() => this.editCourt()}
          >
            <Text
              style={[styles.addBtnText, {
                flex: 1, fontSize: 12, textAlign: 'center', flexWrap: 'nowrap',
              }]}
            >
              edit
            </Text>
          </Button>
        </View>

        {this.renderTabs()}
        <View style={{ flexDirection: 'row' }}>
          <Button full style={[styles.addBtn, { flex: 1, backgroundColor: '#478cba', height: 80 }]} onPress={() => this.editCourt()}>
            <Text style={styles.addBtnText}>ADD EVENT</Text>
          </Button>
        </View>

      </Container>

    );
  }
}

EditCourt.propTypes = {
  getRunConnect: PropTypes.func.isRequired,
  court: PropTypes.object.isRequired,
  userId: PropTypes.number,
};

EditCourt.defaultProps = {
  userId: null,
};

const mapStateToProps = (state) => ({
  court: gamesViewDataSelector(state),
  userId: authUserIdSelector()(state),
});

const mapDispatchToProps = (dispatch) => ({
  getRunConnect: (runId, type) => dispatch(getRun(runId, type)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditCourt);
