/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  Platform,
  NativeModules,
} from 'react-native';
import { Container, Content, Icon, Text, Button } from 'native-base';
import { connect } from 'react-redux';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Modal from 'react-native-modal';
import _ from 'lodash';

import moment from 'src/common/moment';

import authUtils from 'src/utils/authUtils';
import gameUtils from 'src/utils/gameUtils';
import generalUtils from 'src/utils/generalUtils';
import momentUtils from 'src/utils/momentUtils';

import AuthNav from 'src/components/AuthNav';
import BasicNav from 'src/components/BasicNav';
import BallerList from 'src/components/BallerList';
import BallerStatList from 'src/components/BallerStatList';
import DisplayGames from 'src/components/DisplayGames';

import GameApi from 'src/api/GameApi';

import {
  setBallers,
  displayView,
  resetGroups,
  getRun,
  gamesViewDataSelector,
} from 'src/reducers/games';
import {
  squareTransaction,
  setPayment,
} from 'src/reducers/transaction';
import {
  authProfileSelector,
} from 'src/reducers/auth';

import SquarePaymentAndroid from 'src/nativeModules/SquarePayment';

import background from 'src/assets/Background.png';
import logo from 'src/assets/logo_basic.png';

import styles from './styles';

const { SquarePaymentiOS } = NativeModules;
const uuidv4 = require('uuid/v4');

class SingleRun extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: this.props.user,
      admin: this.props.admin,
      court: this.props.courtName,
      runDate: this.props.runDate,
      daysToRun: 0,
      run: this.props.run,
      runEnd: parseInt(this.props.runEnd, 10),
      groups: this.props.groups,
      ballerTab: '#478cba',
      benchTab: '#305f80',
      nextTab: '#0e517d',
      gameModal: false,
      loadingModal: true,
    };
  }

  componentDidMount() {
    const { navigation, setBallersConnect } = this.props;

    setBallersConnect([]);

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
    const { resetGroupsConnect } = this.props;

    resetGroupsConnect();
    this.daysToRun();
    this.checkRun();
    this.checkConfirm();
    this.checkActiveGame();
  }

  async getAndroidCard(customer) {
    try {
      const { detail } = await SquarePaymentAndroid.createCard();
      console.log(detail);
      if (detail) {
        const data = {
          customer: customer,
          cardNonce: detail,
          user: this.props.user.id,
        };

        this.props.squareTransaction('addCustomerCard', data)
          .then((result) => {
            console.log(result);
            const user = { id: this.props.user.id };
            this.getUser(user);
          });
      }
    } catch (e) {
      console.log(e);
    }
  }

  getiOSCard() {
    SquarePaymentiOS.loadCard();
  }

  daysToRun() {
    const now = moment();

    const before = moment(this.state.runDate).isBefore(now);

    if (before) {
      this.setState({ daysToRun: 'This Run Has Passed' });
    } else {
      const days = moment(this.state.runDate).to(now, true);
      this.setState({ daysToRun: `${days} until run` });
    }
  }

  removeLoader() {
    this.setState({ showLoader: false });
    setTimeout(() => {
      this.setState({ completeModal: true });
    }, 500);
  }

  closeModal(modal) {
    this.setState({ [modal]: false });
  }

  SelectValue(formField, value) {
    this.setState({ [formField]: value });
  }

  searchBaller(baller) {
    this.setState({ searchBaller: baller });
  }

  checkActiveGame() {
    const run = {
      run: this.state.run,
    };

    this.props.getRunConnect(run, 'checkActiveRunGame')
      .then((result) => {
        this.setState({ activeGame: result });
      })
      .catch((err) => alert(err));
  }

  checkRun() {
    const runDate = moment(this.state.runDate).format('LLL');
    this.setState({ dateLabel: runDate });

    const ballers = {
      run: this.props.run,
    };

    this.props.getRunConnect(ballers, 'getRunBallers')
      .then((result) => {
        this.props.setBallersConnect(result);
      })
      .catch((err) => alert(err));

    setTimeout(() => {
      this.setState({
        loadingModal: false,
        games: this.props.groups.length > 0 ? true : false,
        groups: this.props.groups.length > 0 ? this.props.groups : [],
        selectTeam: this.props.groups.length > 0 ? false : true,
      });
    }, 800);
  }

  showAllBallers() {
    const ballers = {
      run: this.props.run,
    };

    this.props.getRunConnect(ballers, 'getRunBallers')
      .then((result) => {
        this.props.setBallersConnect(result);
      })
      .catch((err) => alert(err));
  }

  showNext() {
    const ballers = {
      run: this.props.run,
    };

    this.props.getRunConnect(ballers, 'getNextBallers')
      .then((result) => {
        this.props.setBallersConnect(result);
      })
      .catch((err) => alert(err));
  }

  showBench() {
    const ballers = {
      run: this.props.run,
    };

    this.props.getRunConnect(ballers, 'getBenchBallers')
      .then((result) => {
        this.props.setBallersConnect(result);
      })
      .catch((err) => alert(err));
  }

  showReserve() {
    const ballers = {
      run: this.props.run,
    };

    this.props.getRunConnect(ballers, 'getReservations')
      .then((result) => {
        this.props.setBallersConnect(result);
      })
      .catch((err) => alert(err));
  }

  showCheckIn() {
    const ballers = {
      run: this.props.run,
    };

    this.props.getRunConnect(ballers, 'getChecked')
      .then((result) => {
        this.props.setBallersConnect(result);
      })
      .catch((err) => alert(err));
  }

  ballerStatList() {
    return (
      <FlatList
        data={this.props.ballers}
        renderItem={({ item }) => (
          <BallerStatList
            push
            image={item.imageName}
            header={item.ballerTag ? item.ballerTag : `${item.firstName} ${item.lastName}`}
            subText={`${item.city} ${item.state}`}
            data={item}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    );
  }

  ballerList() {
    return (
      <FlatList
        data={this.props.ballers}
        renderItem={({ item }) => {
          const lastName = item.lastName ? `${item.lastName.charAt(0)}.` : '';

          return (
            <BallerList
              push
              image={item.imageName}
              header={`${item.firstName} ${lastName}`}
              page="ExhibitionGame"
              run={this.props.run}
              data={item}
            />
          );
        }}
        keyExtractor={(item) => item.id}
      />
    );
  }

  showBallers() {
    switch (this.state.user.member_type) {
      case authUtils.MEMBER_TYPES.ADMIN:
        // Full Admin
        return this.ballerList();

      case authUtils.MEMBER_TYPES.STAFF:
        // Full Admin
        return this.ballerList();
      case authUtils.MEMBER_TYPES.PLAYER:
        // OG Admin
        if (this.state.user.id === this.props.admin) {
          return this.ballerList();
        }

        return this.ballerStatList();
      case '5':
        // Baller
        return this.ballerStatList();
      default:
        return null;
    }
  }

  showStart() {
    return (
      <Content style={{ width: '100%', height: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,.8)' }}>
        <Text style={styles.text}> Currently No Games Active </Text>
        <Button full style={styles.startBtn} onPress={() => this.startRun()}>
          <Text style={styles.startBtnText}>START GAME</Text>
        </Button>
      </Content>
    );
  }

  showGames() {
    const gamesArr = this.state.groups;

    return gamesArr.map((value, key) => {
      const subText = moment(value.date).format('LLL');
      const scoreA = parseInt(value.scoreA, 10);

      const scoreB = parseInt(value.scoreB, 10);

      let winner = 'Tie';
      let score = `${scoreA} - ${scoreB}`;

      if (scoreA > scoreB) {
        winner = 'Winner HOME';
        score = `${scoreA} - ${scoreB}`;
      } else if (scoreB > scoreA) {
        winner = 'Winner GUEST';
        score = `${scoreB} - ${scoreA}`;
      }

      const run = {
        data: this.props.squad,
        schedule: value.date,
        game: value.id,
      };

      return <DisplayGames score={score} header={winner} title="Run" subText={subText} data={run} key={key} />;
    });
  }

  startRun = async () => {
    const { run } = this.state;

    try {
      const resApi = await GameApi.startRun(run);

      setTimeout(() => {
        this.setState({
          gameList: resApi,
          gameModal: true,
        });
      }, 600);
    } catch (e) {
      setTimeout(() => {
        alert(e);
      }, 600);
    }
  }

  viewRun = () => {
    const { getRunConnect } = this.props;
    const { run } = this.state;
    const apiPayload = {
      run,
    };

    getRunConnect(apiPayload, 'getRunGame')
      .then((result) => {
        this.setState({
          gameList: result,
          gameModal: true,
        });
      })
      .catch((err) => alert(err));
  }

  goToGame(game) {
    const {
      navigation,
      displayViewConnect,
      data,
    } = this.props;
    const {
      run,
      runDate,
      runEnd,
    } = this.state;

    const schedule = {
      id: run,
      timeStamp: runDate,
      date: moment(runDate).format('L'),
      time: moment(runDate).format('LT'),
      runEnd,
    };

    const runData = {
      data, // court info
      schedule, // run info
      game, // gameId
    };

    this.setState({
      gameList: [],
      gameModal: false,
    }, () => {
      displayViewConnect(runData);

      navigation.navigate('TeamBoard');
    });
  }

  gameList() {
    return (
      <FlatList
        data={this.state.gameList}
        renderItem={({ item }) => (
          <View style={styles.boardItem}>
            <Grid>
              <Row>
                <Col>
                  <View><Text style={styles.gameDate}>{momentUtils.utcToEst(item.date)}</Text></View>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.gameScore}>{item.Home ? item.Home : 0}</Text>
                      <Text style={styles.gameTitle}>HOME</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.gameScore}>{item.Guest ? item.Guest : 0}</Text>
                      <Text style={styles.gameTitle}>GUEST</Text>
                    </View>
                  </View>
                </Col>
                <Col style={{ width: 90, alignContent: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <Button
                    full
                    style={{
                      height: 50,
                      width: 50,
                      borderRadius: 50,
                      backgroundColor: '#478CBA',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}
                    onPress={() => this.goToGame(item.id)}
                  >
                    <Icon type="MaterialIcons" style={{ color: '#ffffff', fontSize: 30, textAlign: 'center', marginLeft: 0, marginRight: 0 }} name="forward" />
                  </Button>

                  <Text
                    style={[styles.gameTitle, { color: item.active === 1 ? '#4fbf68' : item.complete === 1 ? '#fd6464' : '#ffffff' }]}
                  >
                    {item.active === 1 ? 'In Progress' : 'View Teams'}
                  </Text>
                </Col>
              </Row>
            </Grid>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    );
  }

  gameModal() {
    return (

      <Modal style={{ width: '100%', margin: 0, padding: 0 }} isVisible={this.state.gameModal} backdropOpacity={0.95} backdropColor="#3b3b3b"  >
        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
          <View style={[styles.modalHeader, { flex: 0.1 }]}>
            <Button full transparent style={styles.close} onPress={() => this.closeModal('gameModal')}><Icon style={styles.closeText} type="MaterialIcons" name="clear" /></Button>
          </View>
          <View style={{ flex: 1 }}>
            {this.gameList()}
          </View>
        </SafeAreaView>
      </Modal>

    );
  }

  checkConfirm() {
    const run = {
      run: this.state.run,
      user: this.state.user.id,
    };

    this.props.getRunConnect(run, 'checkConfirm')
      .then((result) => {
        this.setState({ reserved: result == 1 ? true : false });
      })
      .catch((err) => alert(err));
  }

  // confirmRun() {
  //   const run = {
  //     run: this.state.run,
  //     user: this.state.user.id,
  //     reserve: !this.state.reserved,
  //   };

  //   this.props.getRun(run, 'ballerReserve')
  //     .then((_result) => {
  //       this.setState({ reserved: !this.state.reserved });
  //     })
  //     .catch((err) => alert(err));
  // }

  filterDisplay(displayInp) {
    switch (displayInp) {
      case 'ballers':
        this.setState({
          ballerTab: '#478cba',
          benchTab: '#305f80',
          nextTab: '#0e517d',
        });
        this.showAllBallers();
        break;
      case 'bench':
        this.setState({
          ballerTab: '#305f80',
          benchTab: '#478cba',
          nextTab: '#0e517d',
        });
        this.showBench();
        break;
      case 'next':
        this.setState({
          ballerTab: '#0e517d',
          benchTab: '#305f80',
          nextTab: '#478cba',
        });
        this.showNext();
        break;
      default:
        break;
    }
  }

  toggleHeader() {
    switch (this.state.user.member_type) {
      case authUtils.MEMBER_TYPES.ADMIN:
        // Full Admin
        return <AuthNav navigation={this.props.navigation} back="RunListing" title={this.state.court} button="Settings" link="Settings" />;

      case authUtils.MEMBER_TYPES.PLAYER:
        // OG Admin
        if (this.state.user.id === this.state.admin) {
          return <AuthNav navigation={this.props.navigation} back="RunListing" title={this.state.court} button="Settings" link="Settings" />;
        }

        return <BasicNav navigation={this.props.navigation} back="RunListing" title={this.state.court} button="Settings" link="Settings" />;
      default:
        // Baller
        return <BasicNav navigation={this.props.navigation} back="RunListing" title={this.state.court} button="Settings" link="Settings" />;
    }
  }

  toggleStartRun() {
    const { data } = this.props;
    const {
      user,
      runEnd,
      activeGame,
    } = this.state;

    const canUserStartRun = gameUtils.canUserStartRunBySkill(user, data);

    if (canUserStartRun) {
      const isActiveGame = (parseInt(activeGame, 10) === 1);
      let viewStartText;
      let onPressBtn;

      if (runEnd) {
        viewStartText = 'VIEW GAMES';
        onPressBtn = this.viewRun;
      } else {
        // eslint-disable-next-line no-lonely-if
        if (isActiveGame) {
          viewStartText = 'CONTINUE GAME';
          onPressBtn = this.viewRun;
        } else {
          viewStartText = 'START RUN';
          onPressBtn = this.startRun;
        }
      }

      return (
        <Button
          full
          style={styles.startBtn}
          onPress={onPressBtn}
        >
          <Text style={styles.startBtnText}>{isActiveGame ? 'CONTINUE GAME' : viewStartText}</Text>
        </Button>
      );
    }

    return (
      <View style={{ flexDirection: 'row' }}>
        <Button full style={[styles.startBtn, { flex: 1, margin: 2 }]} onPress={() => this.viewRun()}>
          <Text style={styles.startBtnText}>VIEW RUN</Text>
        </Button>
      </View>
    );
  }

  closePayment() {
    this.props.setPayment(false);
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
    SquarePaymentiOS.getCardNonce((value) => {
      console.log(`Nonce is ${value}`);

      const data = {
        user: this.props.user.id,
        cardNonce: value,
        customer: this.props.account.customerID ? this.props.account.customerID : this.state.customer,
      };

      this.props.squareTransaction('addCustomerCard', data)
        .then((result) => {
          console.log(result);
          const user = { id: this.props.user.id };
          this.getUser(user);
          this.setState({ confirmiOS: false });
        });
    });
  }

  pay() {
    if (!this.props.account) {
      const data = {
        user: this.props.user,
      };

      this.props.squareTransaction('newCustomer', data)
        .then((result) => {
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
      const data = {
        user: Number(this.props.user.id),
        customer: this.props.account.customerID,
        card: this.props.account.customerCard,
        run: Number(this.props.payRun),
        key: uuidv4(),
      };

      this.props.squareTransaction('chargeCustomerCard', data)
        .then((result) => {
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

    this.props.getRunConnect(run, 'ballerReserve')
      .then(() => {
        this.setState({ reserved: true });
      })
      .catch((err) => alert(err));
  }

  paymentBtn(card) {
    if (Platform.OS === 'android') {
      //ANDROID BUTTON SETUP
      if (card) {
        return (
          <View>
            <Button full style={[styles.squadButtons, { backgroundColor: card ? '#478cba' : '#4f4f4f' }]} onPress={() => this.pay()}>
              <Text style={{ color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium' }}>PAY NOW WITH CARD ENDING IN {this.props.account.last4}</Text>
            </Button>

            <Button full style={[styles.squadButtons, { backgroundColor: this.state.ballersComplete ? '#478cba' : '#4f4f4f' }]} onPress={() => this.update()}>
              <Text style={{ color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium' }}>UPDATE CARD</Text>
            </Button>
          </View>
        );
      } else {
        return (
          <View>
            <Button full style={[styles.squadButtons, { backgroundColor: card ? '#478cba' : '#4f4f4f' }]} onPress={() => this.pay()}>
              <Text style={{ color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium' }}>ADD A DEBIT OR CREDIT CARD TO PAY</Text>
            </Button>

            <Button full style={[styles.squadButtons, { backgroundColor: this.state.ballersComplete ? '#478cba' : '#4f4f4f' }]} onPress={() => this.closePayment()}>
              <Text style={{ color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium' }}>CANCEL RESERVATION</Text>
            </Button>
          </View>
        );
      }
    } else {
      //IOS BUTTON SETUP
      if (card) {
        if (this.state.confirmiOS) {
          return (
            <View>
              <Button full style={[styles.squadButtons, { backgroundColor: card ? '#478cba' : '#4f4f4f' }]} onPress={() => this.updateiOSCard()}>
                <Text style={{ color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium' }}>CONFIRM UPDATE</Text>
              </Button>

              <Button full style={[styles.squadButtons, { backgroundColor: '#4f4f4f' }]} onPress={() => this.closeModal('payScreen')}>
                <Text style={{ color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium' }}>CANCEL UPDATE</Text>
              </Button>
            </View>
          );
        } else {
          return (
            <View>
              <Button full style={[styles.squadButtons, { backgroundColor: card ? '#478cba' : '#4f4f4f' }]} onPress={() => this.pay()}>
                <Text style={{ color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium' }}>PAY NOW WITH CARD ENDING IN {this.props.account.last4}</Text>
              </Button>

              <Button full style={[styles.squadButtons, { backgroundColor: this.state.ballersComplete ? '#478cba' : '#4f4f4f' }]} onPress={() => this.update()}>
                <Text style={{ color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium' }}>UPDATE CARD</Text>
              </Button>
            </View>
          );
        }
      } else {
        if (this.state.confirmiOS) {
          return (
            <View>
              <Button full style={[styles.squadButtons, { backgroundColor: card ? '#478cba' : '#52ce5e' }]} onPress={() => this.updateiOSCard()}>
                <Text style={{ color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium' }}>CONFIRM CARD</Text>
              </Button>

              <Button full style={[styles.squadButtons, { backgroundColor: '#4f4f4f' }]} onPress={() => this.closeModal('payScreen')}>
                <Text style={{ color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium' }}>CANCEL</Text>
              </Button>
            </View>
          );
        } else {
          return (
            <View>
              <Button full style={[styles.squadButtons, { backgroundColor: card ? '#478cba' : '#4f4f4f' }]} onPress={() => this.pay()}>
                <Text style={{ color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium' }}>ADD A DEBIT OR CREDIT CARD TO PAY</Text>
              </Button>

              <Button full style={[styles.squadButtons, { backgroundColor: this.state.ballersComplete ? '#478cba' : '#4f4f4f' }]} onPress={() => this.closePayment()}>
                <Text style={{ color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium' }}>CANCEL RESERVATION</Text>
              </Button>
            </View>
          );
        }
      }
    }
  }

  resetRuns() {
    this.setState({ runs: [] });
    const user = {
      user: this.state.user.id,
    };

    this.props.getRunConnect(user, 'getUpcomingRuns')
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
          <Text style={{ borderWidth: 0, alignItems: 'center', textAlign: 'center', color: '#000000', fontFamily: 'ProximaNova-Semibold' }}>{this.state.message}</Text>
        </View>
      );
    }
  }

  confirmModal() {
    return (
      <Modal style={{ width: '100%', margin: 0, padding: 0 }} isVisible={this.state.confirmPayment} backdropOpacity={0.95} backdropColor="#000000"  >
        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
          <View style={styles.modalHeader}>
            <Button full transparent style={styles.close} onPress={() => this.closeModal('confirmPayment')}><Icon style={styles.closeText} type="MaterialIcons" name="clear" /></Button>
          </View>
          <View style={styles.modalWrapper}>
            <Button full transparent style={styles.confirmBtn} onPress={() => this.resetRuns()}>
              <Text style={[styles.titleText, { fontSize: 32 }]}>PAYMENT CONFIRMED!</Text>
              <Text style={[styles.subTitleText, { marginBottom: 20 }]}>Your Spot is Reserved</Text>
            </Button>
          </View>

        </SafeAreaView>
      </Modal>
    );
  }

  paymentModal() {
    return (
      <Modal style={{ width: '100%', margin: 0, padding: 0 }} isVisible={this.props.payScreen} backdropOpacity={0.95} backdropColor="#000000"  >
        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
          <View style={styles.modalHeader}>
            <Button full transparent style={styles.close} onPress={() => this.closePayment()}><Icon style={styles.closeText} type="MaterialIcons" name="clear" /></Button>
          </View>
          <View style={styles.modalWrapper}>
            {this.errorStatus()}
            <Text style={[styles.titleText, { fontSize: 32 }]}>RESERVE YOUR SPOT TODAY!</Text>
            <View style={[styles.spotBtn, { marginBottom: 20 }]}>
              <Text style={[styles.subTitleText, { fontSize: 44, marginBottom: 0 }]}>$5</Text>
            </View>
            <Text style={[styles.subTitleText, { marginBottom: 20 }]}>to #BALLTILLYOUFALL</Text>

            {this.paymentBtn(this.props.account)}

          </View>

        </SafeAreaView>
      </Modal>
    );
  }

  loadingModal() {
    return (
      <Modal style={{ flex: 1, width: '100%', margin: 0 }} animationIn="fadeIn" animationOut="fadeOut" isVisible={this.state.loadingModal} useNativeDriver hideModalContentWhileAnimating backdropColor="#000000" backdropOpacity={0.95}>
        <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>

          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Image style={{ width: 80, height: 80, margin: 'auto', justifyContent: 'center', alignItems: 'center' }} source={logo} />
            <View>
              <Text style={{ color: '#ffffff', fontFamily: 'BarlowCondensed-Bold', fontSize: 16, paddingTop: 10, paddingBottom: 30 }}>Loading...</Text>
            </View>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>

        </View>
      </Modal>

    );
  }

  render() {
    const { back, data, imageName } = this.props;
    const image = generalUtils.getItemImage(imageName);

    return (
      <Container style={styles.container}>

        <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <Image style={{ flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: 0.5 }} source={background} />
        </View>
        {this.confirmModal()}
        {this.paymentModal()}
        {this.gameModal()}
        <Grid>
          <Row style={{ position: 'relative', height: 170, backgroundColor: '#000000' }}>
            <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
              <Image style={{ flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: 0.4 }} source={{ uri: image }} />
            </View>

            <BasicNav
              navigation={this.props.navigation}
              user={this.state.user}
              run={this.state.run}
              back={back}
              title={this.state.court}
              button="Reserve"
              link="Settings"
              gameData={data}
            />

            <View style={styles.runLocation}>
              <Text style={[styles.runLocationText, { fontSize: 24, marginRight: 110 }]} numberOfLines={1}>{this.props.courtName}</Text>
              <View style={{ height: 1, width: '70%', backgroundColor: '#ffffff', marginTop: 5, marginBottom: 5 }} />
              <Text style={[styles.runLocationText, { fontSize: 18 }]}>{this.props.courtAddress}</Text>
            </View>
          </Row>
          <Row style={{ height: 30 }}>
            <Text style={styles.message}>{this.state.daysToRun}</Text>
          </Row>
          <Row style={{ flexDirection: 'row', height: 55, backgroundColor: '#478cba', alignItems: 'center', marginBottom: 2 }}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.text, { padding: 10 }]}> {this.state.dateLabel} </Text>
            </View>
            <View style={{ flex: 1, flexWrap: 'wrap' }}>
              {this.toggleStartRun()}
            </View>
          </Row>
          <Row style={{ flexDirection: 'row', width: '100%', height: 50 }}>

            <Button full style={[styles.filterBtn, { backgroundColor: this.state.ballerTab }]} onPress={() => this.filterDisplay('ballers')}>
              <Text style={styles.addBtnText}> Ballers </Text>
            </Button>

            <Button full style={[styles.filterBtn, { backgroundColor: this.state.benchTab }]} onPress={() => this.filterDisplay('bench')}>
              <Text style={styles.addBtnText}> Bench </Text>
            </Button>

            <Button full style={[styles.filterBtn, { backgroundColor: this.state.nextTab }]} onPress={() => this.filterDisplay('next')}>
              <Text style={styles.addBtnText}> Next </Text>
            </Button>

          </Row>
          <Row>
            {this.showBallers()}
          </Row>
        </Grid>
        {this.loadingModal()}
      </Container>

    );
  }
}

SingleRun.propTypes = {
  data: PropTypes.object.isRequired,
  displayViewConnect: PropTypes.func.isRequired,
  resetGroupsConnect: PropTypes.func.isRequired,
  setBallersConnect: PropTypes.func.isRequired,
  getRunConnect: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  let gamesData = _.get(ownProps.route, 'params.data');
  const user = authProfileSelector()(state);

  if (!gamesData) {
    gamesData = gamesViewDataSelector(state);
  }

  return {
    account: state.auth.user.account,
    transactions: state.transactions.purchases,
    payScreen: state.transactions.payment,
    payRun: state.transactions.runItem,
    user,
    data: gamesData,
    ballers: state.games.ballers,
    courtName: gamesData.name,
    courtAddress: gamesData.address,
    imageName: gamesData.imageName,
    imageType: gamesData.imageType,
    longitude: gamesData.longitude,
    latitude: gamesData.latitude,
    admin: parseInt(gamesData.adminId, 10),
    groups: state.games.groups,
    run: gamesData.runId,
    runDate: gamesData.timeStamp,
    runEnd: gamesData.runEnd,
    active: gamesData.active,
    back: _.get(ownProps.route, 'params.back', 'RunListing'),
  };
};

const mapDispatchToProps = (dispatch) => ({
  squareTransaction: (type, data) => dispatch(squareTransaction(type, data)),
  setPayment: (payment) => { dispatch(setPayment(payment)); },
  getRunConnect: (runId, type) => dispatch(getRun(runId, type)),
  displayViewConnect: (view) => dispatch(displayView(view)),
  resetGroupsConnect: () => dispatch(resetGroups()),
  setBallersConnect: (ballers) => dispatch(setBallers(ballers)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleRun);
