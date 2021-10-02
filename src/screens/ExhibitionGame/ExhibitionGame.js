import React, { Component } from 'react';
import {
  View, Image, ActivityIndicator, FlatList,
} from 'react-native';
import { Container, Text, Button } from 'native-base';
import { connect } from 'react-redux';
import { Row, Grid } from 'react-native-easy-grid';
import Modal from 'react-native-modal';
import _ from 'lodash';
import { Storage } from 'aws-amplify';
import 'moment-timezone';

import background from 'src/assets/Background.png';
import logo from 'src/assets/logo_basic.png';

import BasicNav from 'src/components/BasicNav';
import BallerList from 'src/components/BallerList';
import BallerStatList from 'src/components/BallerStatList';
import {
  addToList,
  squadApi,
  displayView,
  resetGroups,
  getRun,
  setBallers,
  gamesViewDataSelector,
} from 'src/reducers/games';
import { squareTransaction, setPayment } from 'src/reducers/transaction';

const moment = require('moment');

import styles from './styles';

class ExhibitionGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: this.props.user,
      courtImage: 'https:\/\/s3.amazonaws.com\/awsjames-userfiles-mobilehub-258458471\/public\/james-court.jpg',
      daysToRun: 0,
      run: this.props.run,
      loadingModal: true,
    };
  }

  componentDidMount() {
    this.courtImage();
    this.props.resetGroups();
    this.daysToRun();
    this.checkRun();
    this.checkConfirm();
  }

  handleChange(formField, value) {
    this.setState({ [formField]: value });
  }

  formatDate(date) {
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const schedule = new Date(date);
    const month = months[schedule.getMonth()];
    const day = schedule.getDate();
    const year = schedule.getFullYear();

    const runDate = `${month}/${day}/${year}`;

    return runDate;
  }

  daysToRun() {
    let moment = require('moment');
    const now = moment();

    const before = moment(this.props.runDate).isBefore(now);

    if (before) {
      this.setState({ daysToRun: 'This Run Has Passed' });
    } else {
      const days = moment(this.props.runDate).to(now, true);
      this.setState({ daysToRun: `${days} until run` });
    }
  }

  removeLoader() {
    this.setState({ showLoader: false });
    setTimeout(() => {
      this.setState({ completeModal: true });
    }, 500);
  }

  courtImage() {
    if (this.props.imageType == 'google') {
      this.setState({ courtImage: this.props.imageName });

      console.log(this.state.courtImage);
    } else {
      Storage.get(this.props.imageName)
        .then((result) => {
          this.setState({ courtImage: result });
        })
        .catch((err) => alert(err));
    }
  }

  closeModal(modal) {
    this.setState({ [modal]: false });
  }

  SelectValue(formField, value) {
    this.setState({ [formField]: value } );
  }

  searchBaller(baller) {
    this.setState({ searchBaller: baller });
  }

  gameDate() {
    const runDate = moment( this.props.runDate ).format('LLL');
    return runDate;
  }

  checkRun() {
    const runDate = moment( this.props.runDate ).format('LLL');
    this.setState({ dateLabel: runDate });

    const ballers = {
      run: this.props.run,
    };

    this.props.getRun(ballers, 'getRunBallers')
      .then((result) => {
        this.props.setBallers(result);
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

    this.props.getRun(ballers, 'getRunBallers')
      .then((result) => {
        this.props.setBallers(result);
      })
      .catch((err) => alert(err));
  }

  ballerStatList() {
    const ballersArr = Object.values(this.props.ballers);
    return (
      <FlatList
        data={ballersArr}
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
    const ballersArr = Object.values(this.props.ballers);
    return (
      <FlatList
        data={ballersArr}
        renderItem={({ item }) => (
          <BallerList
            push
            image={item.imageName}
            header={`${item.firstName} ${item.lastName}`}
            page="ExhibitionGame"
            run={this.props.run}
            data={item}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    );
  }

  showBallers() {
    switch (this.state.user.member_type) {
      case '1':
        // Full Admin
        return this.ballerList();
      case '2':
        // Full Admin
        return this.ballerList();
      case '3':
        // OG Admin
        return this.ballerList();
      case '5':
        // Baller
        return this.ballerStatList();
      default:
        return this.ballerStatList();
    }
  }

  startRun() {

    // const run = {
    //     run: this.state.run
    // }

    // this.props.getRun(run,"getRunGame")
    // .then(result => {

    //     this.setState({
    //         gameList: result,
    //         gameModal: true
    //     });

    // })
    // .catch(err => alert(err));

  }

  checkConfirm() {
    const run = {
      run: this.state.run,
      user: this.state.user.id,
    };

    this.props.getRun(run, 'checkConfirm')
      .then((result) => {
        this.setState({ reserved: result == 1 ? true : false });
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
          >{this.state.message}</Text>
        </View>
      );
    }

    return null;
  }

  loadingModal() {
    return (
      <Modal style={{ flex: 1, width: '100%', margin: 0 }} animationIn="fadeIn" animationOut="fadeOut" isVisible={this.state.loadingModal} useNativeDriver hideModalContentWhileAnimating backdropColor="#000000" backdropOpacity={0.95}>
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
              <Text
                style={{
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
    const { back, data } = this.props;

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
          <Row style={{ position: 'relative', height: 170, backgroundColor: '#000000' }}>
            <View style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            }}
            >
              <Image
                style={{
                  flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: 0.4,
                }}
                source={{ uri: this.state.courtImage }}
              />
            </View>

            <BasicNav
              navigation={this.props.navigation}
              user={this.state.user}
              run={this.props.run}
              page={back}
              title={this.props.courtName}
              button="Reserve"
              link="Settings"
              gameData={data}
            />

            <View style={styles.runLocation}>
              {/* <Text style={[styles.runLocationText, { fontSize: 24 }]}>{this.props.courtName}</Text> */}
              <Text style={[styles.runLocationText, { fontSize: 24, marginRight: 110 }]} numberOfLines={1}>{this.props.courtName}</Text>
              <View style={{
                height: 1, width: '70%', backgroundColor: '#ffffff', marginTop: 5, marginBottom: 5,
              }}
              />
              <Text style={[styles.runLocationText, { fontSize: 18 }]}>{this.props.courtAddress}</Text>
            </View>
          </Row>
          <Row style={{ height: 30 }}>
            <Text style={styles.message}>{this.state.daysToRun}</Text>
          </Row>
          <Row style={{
            flexDirection: 'row', height: 55, backgroundColor: '#478cba', alignItems: 'center', marginBottom: 2,
          }}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.text, { padding: 10 }]}> {this.gameDate()} </Text>
            </View>
            <View style={{ flex: 1, flexWrap: 'wrap' }}>
              <Button full style={ styles.startBtn } onPress={() => this.startRun()}>
                <Text style={styles.startBtnText}>SHOW STATS</Text>
              </Button>
            </View>
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

const mapStateToProps = (state, ownProps) => {
  const gamesData = gamesViewDataSelector(state);

  return {
    account: state.auth.user.account,
    transactions: state.transactions.purchases,
    payScreen: state.transactions.payment,
    payRun: state.transactions.runItem,
    user: state.auth.user.profile,
    data: gamesData,
    ballers: state.games.ballers,
    courtName: gamesData.name,
    courtAddress: gamesData.address,
    imageName: gamesData.imageName,
    imageType: gamesData.imageType,
    longitude: gamesData.longitude,
    latitude: gamesData.latitude,
    admin: gamesData.adminId,
    groups: state.games.groups,
    run: gamesData.runId,
    runDate: gamesData.timeStamp,
    runEnd: gamesData.runEnd,
    active: gamesData.active,
    back: _.get(ownProps.route, 'params.back', 'GameListing'),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    squareTransaction: (type, data) => dispatch(squareTransaction(type, data)),
    setPayment: (payment) => { dispatch(setPayment(payment)); },
    getRun: (runId, type) => dispatch(getRun(runId, type)),
    displayView: (view) => dispatch(displayView(view)),
    resetGroups: () => dispatch(resetGroups()),
    addToList: (list) => dispatch(addToList(list)),
    squadApi: (userId, type, data) => dispatch(squadApi(userId, type, data)),
    setBallers: (ballers) => dispatch(setBallers(ballers)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExhibitionGame);
