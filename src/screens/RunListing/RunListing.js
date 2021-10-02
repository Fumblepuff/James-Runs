/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  View,
  Image,
  TextInput,
  ActivityIndicator,
  FlatList,
  PermissionsAndroid,
  SafeAreaView,
  Platform,
  NativeModules,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Container,
  Icon,
  Text,
  Button,
} from 'native-base';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import {
  addToSchedule,
  addToList,
  squadApi,
  displayView,
  getRun,
  getLocation,
  getLocationDetails,
} from 'src/reducers/games';
import Geolocation from '@react-native-community/geolocation';
import 'moment-timezone';

import gameUtils from 'src/utils/gameUtils';

import BasicNav from 'src/components/BasicNav';
import RunList from 'src/components/RunList';
import ExhibitionList from 'src/components/ExhibitionList';
import {
  gamesListFormat,
} from 'src/api/GameApiFormatters';
import {
  authUserFormat,
} from 'src/api/AuthApi';
import {
  uploadFile,
  addEdit,
  setUser,
} from 'src/reducers/auth';
import {
  squareTransaction,
  setPayment,
} from 'src/reducers/transaction';

import SquarePaymentAndroid from 'src/nativeModules/SquarePayment';

import logo from 'src/assets/logo_basic.png';
import background from 'src/assets/Background.png';

import styles from './styles';

const { SquarePaymentiOS } = NativeModules;
const uuidv4 = require('uuid/v4');

// const iOSEvents = new NativeEventEmitter(NativeModules.SquarePaymentiOS);

class RunListing extends Component {
  static navigationOptions = {
    drawerLabel: 'My Profile',
  }

  constructor(props) {
    super(props);

    this.state = {
      user: this.props.user,
      upcomingTab: '#478cba',
      pastTab: '#305f80',
      myTab: '#305f80',
      miles: 0,
      confirmiOS: false,
      confirmPayment: false,
      loadingModal: true,
      typeTab: 'upcoming',
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

  handleChange(formField, value) {
    this.setState({ [formField]: value });
  }

  onFocus = () => {
    if (this.props.user) {
      const user = { id: this.props.user.id };
      this.getUser(user);
    } else {
      AsyncStorage.getItem('userId').then((token) => {
        this.setState({ id: token });
        const user = { id: token };
        this.getUser(user);
      });
    }

    this.reload();
  };

  getRuns() {
    const { user } = this.state;
    const userId = user.id || null;

    const dataApi = {
      user: userId,
      userId,
    };

    this.props.getRun(dataApi, 'getRuns')
      .then((result) => {
        this.setState({ runs: result });
      })
      .catch((err) => alert(err));
  }

  getPastRuns() {
    const { user } = this.state;
    const userId = user.id || null;

    const dataApi = {
      type: gameUtils.TYPES.PICKUP,
      user: userId,
      userId,
    };

    this.props.getRun(dataApi, 'getPastRuns')
      .then((result) => {
        this.setState({
          runs: gamesListFormat(result),
          loadingModal: false,
        });
      })
      .catch((err) => alert(err));
  }

  getUpcomingRuns() {
    this.props.getRun({
      type: gameUtils.TYPES.PICKUP,
    }, 'getUpcomingRuns')
      .then((result) => {
        this.setState({
          typeTab: 'upcoming',
          runs: gamesListFormat(result),
          loadingModal: false,
        });
      })
      .catch((err) => alert(err));
  }

  getMyRuns() {
    const { user } = this.state;
    const userId = user.id || null;

    const dataApi = {
      type: gameUtils.TYPES.PICKUP,
      user: userId,
      userId,
    };

    this.props.getRun(dataApi, 'getMyRuns')
      .then((result) => {
        this.setState({
          runs: gamesListFormat(result),
          loadingModal: false,
        });
      })
      .catch((err) => alert(err));
  }

  getUser(user) {
    this.props.getRun(user, 'getUser')
      .then((resultInp) => {
        const result = authUserFormat(resultInp);
        this.props.setUser(result);
        this.setState({
          user: result.profile,
        });

        this.getUpcomingRuns();
      })
      .catch((err) => alert(err));
  }

  getiOSCard(result) {
    SquarePaymentiOS.loadCard();
  }

  async getAndroidCard(customer) {
    try {
      let { detail } = await SquarePaymentAndroid.createCard();
      console.log(detail);
      if (detail) {
        const data = {
          customer: customer,
          cardNonce: detail,
          user: this.props.user.id,
        };

        this.props.squareTransaction('addCustomerCard', data)
          .then( (result) => {
            console.log(result);
            const user = { id: this.props.user.id };
            this.getUser(user);
          });
      }
    } catch (e) {
      console.log(e);
    }
  }

  getLocation() {
    if (Platform.OS === 'android') {
      this.requestLocationPermission();
    } else {
      this.userLocation();
    }
  }

  reload() {
    const data = [];
    this.props.displayView(data);
    this.getLocation();
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
        console.log('Location denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  userLocation() {
    Geolocation.getCurrentPosition(
      (position) => {
        if (position) {
          this.setState({
            userLocation: position.coords,
            error: null,
          });
        }
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  closePayment() {
    this.props.setPayment(false);
  }

  closeModal(modal) {
    this.setState({ [modal]: false });
  }

  toggleListing() {
    switch (this.state.user.member_type) {
      case '1':
        // Full Admin
        return this.listRuns();
      case '2':
        // Full Admin
        return this.listRuns();

      case '3':
        // OG Admin
        return this.listRuns();

      case '8':
        // Stat Keeper
        return this.runReserve();

      default:
        // Baller

        return this.listRuns();
    }
  }

  listRuns() {
    const {
      runs,
      userLocation,
      typeTab,
      miles,
      user,
    } = this.state;

    if (runs && userLocation) {
      const RunArr = Object.values(runs);

      return (
        <View style={{ width: '100%', flex: 1, marginTop: 10 }}>
          <FlatList
            data={RunArr}
            renderItem={({ item }) => (
              <RunList
                baller={user.id}
                userLocation={userLocation}
                image={item.imageName}
                cost={item.runCost}
                miles={miles}
                imageType={item.imageType}
                date={item.timeStamp}
                header={item.name}
                page="SingleRun"
                run={item}
                data={({ data: item })}
                showReserveSpot={(typeTab === 'upcoming')}
              />
            )}
            keyExtractor={(item) => item.runId}
          />
        </View>
      );
    }

    return null;
  }

  runReserve() {
    if (this.state.runs && this.state.userLocation) {
      const RunArr = Object.values(this.state.runs);
      return (
        <View style={{ width: '100%', flex: 1, marginTop: 10 }}>
          <FlatList
            data={RunArr}
            renderItem={({ item }) => (
              <ExhibitionList
                baller={this.state.user.id}
                userLocation={this.state.userLocation}
                image={item.imageName}
                cost={item.runCost}
                miles={this.state.miles}
                imageType={item.imageType}
                date={item.timeStamp}
                header={item.name}
                page="ExhibitionGame"
                run={item}
                data={({ data: item })}
              />
            )}
            keyExtractor={(item) => item.runId}
          />
        </View>
      );
    }

    return null;
  }

  filterDistance(distance) {
    this.setState({ miles: distance });
  }

  filterRuns(type) {
    switch (type) {
      case 'past':

        this.setState({
          typeTab: type,
          pastTab: '#478cba',
          upcomingTab: '#214660',
          myTab: '#305f80',
          loadingModal: true,
        }, () => {
          this.getPastRuns();
        });

        break;
      case 'upcoming':

        this.setState({
          typeTab: type,
          pastTab: '#305f80',
          upcomingTab: '#478cba',
          myTab: '#305f80',
          loadingModal: true,
        }, () => {
          this.getUpcomingRuns();
        });

        break;
      case 'myRuns':

        this.setState({
          typeTab: type,
          pastTab: '#305f80',
          upcomingTab: '#214660',
          myTab: '#478cba',
          loadingModal: true,
        }, () => {
          this.getMyRuns();
        });

        break;
      default:

        this.setState({
          typeTab: 'upcoming',
          pastTab: '#305f80',
          upcomingTab: '#478cba',
          myTab: '#305f80',
          loadingModal: true,
        }, () => {
          this.getUpcomingRuns();
        });
        break;
    }
  }

  checkUser(user) {
    this.props.getRun(user, 'checkUserAccout')
      .then((result) => {
        this.props.setUser(result);
        this.setState({
          user: result.profile,
          squads: result.squads,
        });
      })
      .catch((err) => alert(err));
  }

  update() {
    this.setState({ error: false });
    if (Platform.OS === 'android') {
      this.getAndroidCard(this.props.account.customerID);
    } else {
      this.getiOSCard();
      setTimeout(() => {
        this.setState({ confirmiOS: true });
      }, 500);
    }
  }

  updateiOSCard() {
    SquarePaymentiOS.getCardNonce( (value) => {
      console.log('Nonce is ' + value);
      if (value) {
        const data = {
          user: this.props.user.id,
          cardNonce: value,
          customer: this.props.account.customerID ? this.props.account.customerID : this.state.customer,
        };

        this.props.squareTransaction('addCustomerCard', data)
          .then( (result) => {
            console.log(result);
            const user = { id: this.props.user.id };
            this.getUser(user);
            this.setState({ confirmiOS: false });
          });
      } else {
        this.setState({ confirmiOS: false });
      }
    });
  }

  pay() {
    if (!this.props.account) {
      const data = {
        user: this.props.user,
      };

      this.props.squareTransaction('newCustomer', data)
        .then( (result) => {
          console.log(result);

          if (Platform.OS === 'android') {
            this.getAndroidCard(result);
          } else {
            this.getiOSCard();
            setTimeout(() => {
              this.setState({
                confirmiOS: true,
                customer: result,
              });
            }, 500);
          }
        });
    } else {
      const cost = this.props.runCost * 100;
      const data = {
        user: Number(this.props.user.id),
        customer: this.props.account.customerID,
        cost: cost,
        card: this.props.account.customerCard,
        run: Number(this.props.payRun),
        key: uuidv4(),
      };

      this.props.squareTransaction('chargeCustomerCard', data)
        .then( (result) => {
          if (result.error) {
            this.setState({
              error: true,
              message: 'Invalid Card: Try updating you card',
            });
          } else {
            this.reserveRun();
            this.closePayment();
            setTimeout(() => {
              this.setState({ confirmPayment: true });
            }, 500);
          }
          console.log(result);
        });
    }
  }

  reserveRun() {
    const run = {
      run: this.props.payRun,
      user: this.props.user.id,
      reserve: true,
    };

    this.props.getRun(run, 'ballerReserve')
      .then(result => {
        this.getUpcomingRuns();
      })
      .catch((err) => alert(err));
  }

  paymentBtn(card) {
    if (Platform.OS === 'android') {
      // ANDROID BUTTON SETUP
      if (card) {
        return (
          <View>
            <Button full style={[styles.squadButtons, { backgroundColor: card ? '#478cba' : '#4f4f4f' }]} onPress={() => this.pay()}>
              <Text style={{
                color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium',
              }}
              >
                PAY NOW WITH CARD ENDING IN
                {' '}
                {this.props.account.last4}
              </Text>
            </Button>

            <Button full style={[styles.squadButtons, { backgroundColor: this.state.ballersComplete ? '#478cba' : '#4f4f4f' }]} onPress={() => this.update()}>
              <Text style={{
                color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium',
              }}
              >
                UPDATE CARD
              </Text>
            </Button>
          </View>
        );
      }

      return (
        <View>
          <Button full style={[styles.squadButtons, { backgroundColor: card ? '#478cba' : '#4f4f4f' }]} onPress={() => this.pay()}>
            <Text style={{
              color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium',
            }}
            >
              ADD A DEBIT OR CREDIT CARD TO PAY
            </Text>
          </Button>

          <Button full style={[styles.squadButtons, { backgroundColor: this.state.ballersComplete ? '#478cba' : '#4f4f4f' }]} onPress={() => this.closePayment()}>
            <Text style={{
              color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium',
            }}
            >
              CANCEL RESERVATION
            </Text>
          </Button>
        </View>
      );
    }

    // IOS BUTTON SETUP
    if (card) {
      if (this.state.confirmiOS) {
        return (
          <View>
            <Button full style={[styles.squadButtons, { backgroundColor: card ? '#478cba' : '#4f4f4f' }]} onPress={() => this.updateiOSCard()}>
              <Text style={{
                color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium',
              }}
              >
                CONFIRM UPDATE
              </Text>
            </Button>

            <Button full style={[styles.squadButtons, { backgroundColor: '#4f4f4f' }]} onPress={() => this.closeModal('payScreen')}>
              <Text style={{
                color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium',
              }}
              >
                CANCEL UPDATE
              </Text>
            </Button>
          </View>
        );
      }

      return (
        <View>
          <Button full style={[styles.squadButtons, { backgroundColor: card ? '#478cba' : '#4f4f4f' }]} onPress={() => this.pay()}>
            <Text style={{
              color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium',
            }}
            >
              PAY NOW WITH CARD ENDING IN
              {' '}
              {this.props.account.last4}
            </Text>
          </Button>

          <Button full style={[styles.squadButtons, { backgroundColor: this.state.ballersComplete ? '#478cba' : '#4f4f4f' }]} onPress={() => this.update()}>
            <Text style={{
              color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium',
            }}
            >
              UPDATE CARD
            </Text>
          </Button>
        </View>
      );
    }

    if (this.state.confirmiOS) {
      return (
        <View>
          <Button full style={[styles.squadButtons, { backgroundColor: card ? '#478cba' : '#52ce5e' }]} onPress={() => this.updateiOSCard()}>
            <Text style={{
              color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium',
            }}
            >
              CONFIRM CARD
            </Text>
          </Button>

          <Button full style={[styles.squadButtons, { backgroundColor: '#4f4f4f' }]} onPress={() => this.closeModal('payScreen')}>
            <Text style={{
              color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium',
            }}
            >
              CANCEL
            </Text>
          </Button>
        </View>
      );
    }

    return (
      <View>
        <Button full style={[styles.squadButtons, { backgroundColor: card ? '#478cba' : '#4f4f4f' }]} onPress={() => this.pay()}>
          <Text style={{
            color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium',
          }}
          >
            ADD A DEBIT OR CREDIT CARD TO PAY
          </Text>
        </Button>

        <Button full style={[styles.squadButtons, { backgroundColor: this.state.ballersComplete ? '#478cba' : '#4f4f4f' }]} onPress={() => this.closePayment()}>
          <Text style={{
            color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium',
          }}
          >
            CANCEL RESERVATION
          </Text>
        </Button>
      </View>
    );
  }

  resetRuns() {
    this.setState({ runs: [] });
    const user = {
      user: this.state.user.id,
      type: gameUtils.TYPES.PICKUP,
    };

    this.props.getRun(user, 'getUpcomingRuns')
      .then((result) => {
        this.setState({
          runs: result,
          confirmPayment: false,
        });
      })
      .catch((err) => alert(err));
  }

  errorStatus() {
    if (this.state.error) {
      return (
        <View style={{ backgroundColor: '#FF6265', padding: 10 }}>
          <Text style={{
            borderWidth: 0, alignItems: 'center', textAlign: 'center', color: '#000000', fontFamily: 'ProximaNova-Semibold',
          }}
          >
            {this.state.message}
          </Text>
        </View>
      );
    }

    return null;
  }

  confirmModal() {
    return (
      <Modal
        style={{ width: '100%', margin: 0, padding: 0 }}
        isVisible={this.state.confirmPayment}
        useNativeDriver
        hideModalContentWhileAnimating
        backdropOpacity={0.95}
        backdropColor="#000000"
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
          <View style={styles.modalHeader}>
            <Button
              full
              transparent
              style={styles.close}
              onPress={() => this.closeModal('confirmPayment')}
            >
              <Icon style={styles.closeText} type="MaterialIcons" name="clear" />
            </Button>
          </View>
          <View style={styles.modalWrapper}>
            <Button full transparent style={styles.confirmBtn} onPress={() => this.resetRuns()}>
              <Text style={[styles.titleText, { fontSize: 32 }]}>PAYMENT CONFIRMED!</Text>
              <Text style={[styles.subTitleText, { marginBottom: 20 }]}>Your Spot is Reserved</Text>
              <Text style={[styles.subTitleText, { marginBottom: 20 }]}>Press To Continue</Text>
            </Button>
          </View>

        </SafeAreaView>
      </Modal>
    );
  }

  paymentModal() {
    return (
      <Modal
        style={{ width: '100%', margin: 0, padding: 0 }}
        isVisible={this.props.payScreen}
        useNativeDriver
        hideModalContentWhileAnimating
        backdropOpacity={0.95}
        backdropColor="#000000"
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
          <View style={styles.modalHeader}>
            <Button full transparent style={styles.close} onPress={() => this.closePayment()}><Icon style={styles.closeText} type="MaterialIcons" name="clear" /></Button>
          </View>
          <View style={styles.modalWrapper}>
            {this.errorStatus()}
            <Text style={[styles.titleText, { fontSize: 32 }]}>RESERVE YOUR SPOT TODAY!</Text>
            <View style={[styles.spotBtn, { marginBottom: 20 }]}>
              <Text style={[styles.subTitleText, { fontSize: 44, marginBottom: 0 }]}>
                $
                      {this.props.runCost}
              </Text>
            </View>
            <Text style={[styles.subTitleText, { marginBottom: 20 }]}>to #BALLOUT</Text>

            {this.paymentBtn(this.props.account)}

          </View>

        </SafeAreaView>
      </Modal>
    );
  }

  loadingModal() {
    return (
      <Modal
        style={{ flex: 1, width: '100%', margin: 0 }}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={this.state.loadingModal}
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

  render() {
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

        <BasicNav
          navigation={this.props.navigation}
          drawer
          title="Runs"
          button="CreateRun"
          modal="true"
        />

        {this.paymentModal()}
        {this.confirmModal()}

        <View style={{ flexDirection: 'row', width: '100%', height: 50 }}>
          <Button full style={[styles.filterBtn, { backgroundColor: this.state.pastTab }]} onPress={() => this.filterRuns('past')}>
            <Text style={styles.runTab}>Past Runs</Text>
          </Button>
          <Button full style={[styles.filterBtn, { backgroundColor: this.state.upcomingTab }]} onPress={() => this.filterRuns('upcoming')}>
            <Text style={styles.runTab}>Upcoming Runs</Text>
          </Button>
          <Button full style={[styles.filterBtn, { backgroundColor: this.state.myTab }]} onPress={() => this.filterRuns('myRuns')}>
            <Text style={styles.runTab}>My Runs</Text>
          </Button>
        </View>
        <View style={{
          flexDirection: 'row', width: '100%', height: 40, padding: 5, backgroundColor: '#000000',
        }}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.titleText, { fontSize: 16 }]}>Find a Location Closest to You:</Text>
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              onChangeText={(distance) => this.filterDistance(distance)}
              style={styles.searchInput}
              autoCapitalize ="none"
              placeholderTextColor ="#ffffff"
              underlineColorAndroid="transparent"
              keyboardAppearance="dark"
              keyboardType="number-pad"
              placeholder="Enter Mile Range"
            />
          </View>
        </View>
        {this.toggleListing()}
        {this.loadingModal()}

      </Container>

    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  squareTransaction: (type, data) => dispatch(squareTransaction(type, data)),
  setUser: (user) => { dispatch(setUser(user)); },
  getLocation: (location) => dispatch(getLocation(location)),
  getLocationDetails: (locationID) => dispatch(getLocationDetails(locationID)),
  getRun: (runId, type) => dispatch(getRun(runId, type)),
  displayView: (view) => dispatch(displayView(view)),
  addToSchedule: (schedule) => dispatch(addToSchedule(schedule)),
  addToList: (list) => dispatch(addToList(list)),
  addEdit: (edit) => dispatch(addEdit(edit)),
  squadApi: (id, type, data) => dispatch(squadApi(id, type, data)),
  uploadFile: (update) => { dispatch(uploadFile(update)); },
  setPayment: (payment) => { dispatch(setPayment(payment)); },
});

const mapStateToProps = (state) => ({
  transactions: state.transactions.purchases,
  payScreen: state.transactions.payment,
  payRun: state.transactions.runItem,
  runCost: state.transactions.cost,
  edit: state.auth.edit,
  user: state.auth.user.profile,
  account: state.auth.user.account,
  userSquad: state.auth.user.squads,
  squads: state.games.squads,
  ballers: state.games.ballers,
  squadList: state.games.addToList,
  scheduleList: state.games.addToSchedule,
  view: state.games.view,
});

export default connect(mapStateToProps, mapDispatchToProps)(RunListing);
