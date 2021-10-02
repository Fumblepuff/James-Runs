import React, { Component } from 'react';
import { View, Image, TextInput, TouchableOpacity, ActivityIndicator, CameraRoll, Alert, ScrollView, FlatList } from 'react-native';
import { Container, Content, Icon, Card, CardItem, Text, Button } from 'native-base';
import { connect } from 'react-redux';
import { Col, Row, Grid } from 'react-native-easy-grid';
import AuthNav from '../components/AuthNav';
import BasicNav from '../components/BasicNav';
import SelectList from '../components/SelectList';
import ReviewList from '../components/ReviewList';
import UserImage from '../components/UserImage';
import BasicList from '../components/BasicList';
import Modal from 'react-native-modal';
import CameraRollPicker from 'react-native-camera-roll-picker';
import { uploadFile, addEdit } from '../reducers/auth';
import { addToSchedule, squadApi, viewDate, getRun, displayView, resetList, resetSchedule } from '../reducers/games';
import { Storage } from 'aws-amplify';
import { Buffer } from 'buffer';
import RNFetchBlob from 'rn-fetch-blob';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Moment from 'react-moment';
import SearchInput, { createFilter } from 'react-native-search-filter';
import 'moment-timezone';

const KEYS_TO_FILTERS = ['firstName', 'lastName', 'email'];

class SingleSquad extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: this.props.user,
      squad: this.props.squad,
      showPhotos: false,
      showLoader: false,
      ballers: this.props.ballers,
      allBallers: this.props.allBallers,
      runs: this.props.runs,
      searchBaller: '',
      addRun: false,
      addBallers: false,
      dateTimePicker: false,
      past: false,
      upcoming: true,
      court: this.props.court,
      courtImage: 'https:\/\/s3.amazonaws.com\/awsjames-userfiles-mobilehub-258458471\/public\/james-court.jpg',
      runImage: this.props.court[0].imageName
    };
  }

  componentDidMount() {
    this.getSquad();
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.newBallers();
    this.courtImage();
  }

  getSquad() {
    const data = {
      squad: this.props.squad.id,
    };

    this.props.getRun(data,'squadBallers')
      .then(result => {
        console.log(result);
        this.setState({
          ballers: result['ballers'],
          runs: result['runs']
        });
      })
      .catch(err => alert(err));
  }

  removeLoader(result) {
    this.setState({ showLoader: false });
    setTimeout(() => {
      this.setState({ completeModal: true });
    }, 500);
  }

  cancelPhotos() {
    this.setState({ showPhotos: false });
  }

  removeLoader(result) {
    this.setState({ showLoader: false });
    Storage.get(this.state.photoName, { expires: 60 * 60 * 24 * 365 })
      .then(result => {
        const data = {
          court: this.props.court[0].id,
          image: result,
          imageName: this.state.photoName,
          imageLocal: this.state.photoUri
        };

        this.setState({
          courtImage: result,
          runImage: this.state.photoName
        });

        this.props.getRun(data,'updateCourtImage')
          .then(court => {
            console.log(result);
            this.setState({  court: court });
          })
          .catch(err => alert(err));
      })
      .catch(err => console.log(err));
  }

  async uploadPhoto() {
    this.setState({ showPhotos: false });
    setTimeout(() => {
      this.setState({ showLoader: true });
    }, 500);

    this.readFile(this.state.photoUri).then(buffer => {
      Storage.put(this.state.photoName, buffer, {
        contentType: 'image/png'
      }).then (result => {
        this.removeLoader(result);
      })
        .catch(err => alert(err));
    }).catch(e => {
      console.log(e);
    });
  }

  readFile(filePath) {
    return RNFetchBlob.fs.readFile(filePath, 'base64').then(data => new Buffer(data, 'base64'));
  }

  getImage(images, current) {
    this.setState({
      photoUri: current.uri,
      photoName: this.props.squad.name.replace(/\s/g, '')+'-'+this.props.court[0].id+'.png',
    });
  }

  selectPhotos() {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos',
    })
      .then(r => {
        this.props.addEdit(false);
        setTimeout(() => {
          this.setState({
            photos: r.edges,
            showPhotos: true
          });
        }, 500);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  courtImage() {
    if (this.props.court[0].imageName) {
      Storage.get(this.props.court[0].imageName)
        .then(result => {
          this.setState({ courtImage: result });
        })
        .catch(err => alert(err));
    }
  }

  cancelModal(modal) {
    this.setState({ [modal]: false });
  }

  closeModal() {
    this.props.addEdit(false);
  }

  SelectValue(formField, value) {
    this.setState({ [formField]: value } );
  }

  searchBaller(baller) {
    this.props.getRun(baller,'searchBallers')
      .then(result => {
        this.setState({ allBallers: result });
      })
      .catch(err => alert(err));
  }

  newBallers() {
    const data = {
      squad: this.props.squad.id,
    };

    this.props.getRun(data,'newBallers')
      .then(result => {
        this.setState({ allBallers: result });
      })
      .catch(err => alert(err));
  }

  removeBaller(id) {
    const data = {
      squad: this.props.squad.id,
      baller: id
    };

    this.props.getRun(data,'removeBaller')
      .then(result => {
        this.setState({ ballers: result });
      })
      .catch(err => alert(err));
  }

  editBaller(id, ballerData) {
    switch (this.state.user.member_type) {
      case '1':
        // Full Admin

        Alert.alert(
          'Edit '+ballerData.firstName+' '+ballerData.lastName,
          'Select An Option Below',
          [
            { text: 'View Profile', onPress: () => this.viewBallerProfile(ballerData) },
            { text: 'Delete Baller', onPress: () => this.removeBaller(id) },
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' }
          ],
          { cancelable: true }
        );
        break;
      case '2':
        // OG Admin
        if (this.state.user.id == this.state.squad.adminID) {
          Alert.alert(
            'Edit '+ballerData.firstName+' '+ballerData.lastName,
            'Select An Option Below',
            [
              { text: 'View Profile', onPress: () => this.viewBallerProfile(ballerData) },
              { text: 'Delete Baller', onPress: () => this.removeBaller(id) },
              { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' }
            ],
            { cancelable: true }
          );
        }else {
          Alert.alert(
            ballerData.firstName+' '+ballerData.lastName,
            'Select An Option Below',
            [
              { text: 'View Profile', onPress: () => this.viewBallerProfile(ballerData) },
              { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' }
            ],
            { cancelable: true }
          );
        }
        break;
      case '3':
        // Baller
        Alert.alert(
          ballerData.firstName+' '+ballerData.lastName,
          'Select An Option Below',
          [
            { text: 'View Profile', onPress: () => this.viewBallerProfile(ballerData) },
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' }
          ],
          { cancelable: true }
        );
        break;
      default:
        // Baller
        Alert.alert(
          ballerData.firstName+' '+ballerData.lastName,
          'Select An Option Below',
          [
            { text: 'View Profile', onPress: () => this.viewBallerProfile(ballerData) },
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' }
          ],
          { cancelable: true }
        );
        break;
    }
  }

  viewBallerProfile(ballerData) {
    var baller = {
      city: ballerData.city,
      date: ballerData.date,
      email: ballerData.email,
      firstName: ballerData.firstName,
      id: ballerData.userId,
      image: ballerData.image,
      imageLocal: ballerData.imageLocal,
      imageName: ballerData.imageName,
      lastName: ballerData.lastName,
      password: ballerData.password,
      phone: ballerData.phone,
      state: ballerData.state,
      type: ballerData.type,
      zipcode: ballerData.zipcode,
    };

    var data = { data: baller };
    this.props.displayView(data);
    this.props.navigation.navigate('BallerProfile');
  }

  showBallers() {
    const BallersArr = Object.values(this.state.ballers);
    BallersArr.sort(function(a, b) {
      var nameA=a.firstName.toLowerCase(), nameB=b.firstName.toLowerCase();
      if (nameA < nameB) //sort string ascending
        return -1;
      if (nameA > nameB)
        return 1;
      return 0; //default return value (no sorting)
    });

    return (
      <FlatList
        data={BallersArr}
        horizontal={false}
        numColumns={3}
        renderItem={({ item }) =>
          <TouchableOpacity onPress={() => this.editBaller(item.userId, item)}>
            <UserImage size={125} id={item.id} image={item.imageName} name={item.firstName+' '+item.lastName.charAt(0)+'.'} />
          </TouchableOpacity>
                }
        keyExtractor={item => item.id}
      />
    );
  }

  checkBallers(id) {
    const arr = Object.values(this.state.ballers);
    arr.map((data, key) => {
      if (data.id == id) {
        return true;
      }else {
        return false;
      }
    });
  }

  allBallers() {
    const ballersArr = Object.values(this.state.allBallers);
    ballersArr.sort(function(a, b) {
      var nameA=a.firstName.toLowerCase(), nameB=b.firstName.toLowerCase();
      if (nameA < nameB) //sort string ascending
        return -1;
      if (nameA > nameB)
        return 1;
      return 0; //default return value (no sorting)
    });
    const filteredBallers = ballersArr.filter(createFilter(this.state.searchBaller, KEYS_TO_FILTERS));

    return (
      <FlatList
        data={filteredBallers}
        renderItem={({ item }) =>
          <SelectList image={item.imageName} header={item.firstName+' '+item.lastName} subText={item.city+' '+item.state} data={item} />
                }
        keyExtractor={item => item.id}
      />
    );
  }

  updateSquad() {
    let addBallers = this.props.addList;

    if (addBallers.length > 0) {
      const data = {
        squad: this.props.squad.id,
        ballers: this.props.addList,
      };

      this.setState({ updateSquad: this.props.addList }, () => {
        let update = [ ...this.state.ballers, ...this.props.addList];
        this.setState({ ballers: update });
      });

      this.props.getRun(data,'updateSquad')
        .then(result => {
          this.setState({ runs: result });
          this.setState({ addRun: false });
        })
        .catch(err => alert(err));

      this.cancelModal('addBallers');
    }else {
      Alert.alert(
        'No Ballers Added',
        'Select a Baller and try again',
        [
          { text: 'OK', onPress: () => console.log('Cancel Pressed'), style: 'cancel' }
        ],
        { cancelable: true }
      );
    }
  }

  addDate() {
    this.setState({ dateTimePicker: true });
  }

  addSquadRun() {
    const data = {
      squad: this.props.squad.id,
      court: this.props.court[0].id,
      schedule: this.props.scheduleList
    };

    this.props.getRun(data,'updateSquadRun')
      .then(result => {
        this.setState({ runs: result });
        this.setState({ addRun: false });
      })
      .catch(err => alert(err));
  }

  listSchedule() {
    const scheduleArr = Object.values(this.props.scheduleList);
    const moment = require('moment');
    const now = moment();

    return scheduleArr.map((value, key) => {
      var header = moment(value.runSchedule).format('dddd');
      var subtext = moment(value.runSchedule).format('MMMM Do YYYY');

      return <ReviewList header={header} subText={subtext} data={value} key={key} />;
    } );
  }

  filterRuns(type) {
    switch (type) {
      case 'past':
        this.setState({
          past: true,
          upcoming: false
        });
        break;
      case 'upcoming':
        this.setState({
          past: false,
          upcoming: true
        });
        break;
      default:
        this.setState({
          past: false,
          upcoming: true
        });
        break;
    }
  }

    _confirmDateTime = (datetime) =>{
      var schedule = new Date(datetime);
      var moment = require('moment');

      const scheduleObj = {

        id: datetime,
        runSchedule: moment(schedule).format('YYYY-MM-DD HH:mm:ss'),

      };

      const data = {
        squad: this.props.squad.id,
        schedule: scheduleObj.runSchedule
      };

      this.props.getRun(data,'checkAddRun')
        .then(result => {
          console.log(result);
          if (result > 0) {
            Alert.alert(
              'Cannot Add Date',
              'There is already a run scheduled for this squad on this date and time',
              [
                { text: 'OK' },
              ],
              { cancelable: true }
            );
          }else {
            this.setState({ dateTimePicker: false });
            this.props.addToSchedule(scheduleObj);
          }
        })
        .catch(err => alert(err));

      // this.setState({dateTimePicker: false});
      // this.props.addToSchedule(scheduleObj);
    }

    cancelDateTime() {
      this.setState({ dateTimePicker: false });
    }

    addARun() {
      this.props.resetSchedule();
      this.setState({ addRun: true });
    }

    addBallers() {
      this.props.resetList();
      this.props.addEdit(false);
      setTimeout(() => {
        this.setState({ addBallers: true });
      }, 400);
    }

    settingsModal() {
      return (
        <Modal isVisible={this.props.edit} backdropOpacity={0.95}>

          <View style={styles.modalHeader}>
            <Button full transparent style={styles.close} onPress={() => this.closeModal()}><Icon style={styles.closeText} type="MaterialIcons" name="clear" /></Button>
          </View>

          <View style={{ width: '100%', height: 150, }}>
            <Image style={{ flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: .5 }} source={{ uri: this.state.courtImage }} />
          </View>

          <View style={{ flexDirection: 'row' }}>

            <Button full style={[styles.addBtn, { flex: 1.2, height: 50, margin: 10 }]} onPress={() => this.selectPhotos()}>
              <Text style={styles.addBtnText}> ADD COURT IMAGE </Text>
            </Button>

            <Button full style={[styles.addBtn, { flex: 1, height: 50, margin: 10 }]} onPress={() => this.addBallers()}>
              <Text style={styles.addBtnText}> ADD BALLERS </Text>
            </Button>

          </View>

        </Modal>
      );
    }

    imageModal() {
      return (
        <View>
          <Modal isVisible={this.state.showPhotos} backdropColor="rgba(0,0,0,.6)">

            <CameraRollPicker
              scrollRenderAheadDistance={500}
              initialListSize={1}
              removeClippedSubviews={false}
              groupTypes='SavedPhotos'
              maximum={1}
              selected={this.state.selected}
              assetType='Photos'
              imagesPerRow={2}
              containerWidth={335}
              backgroundColor='rgba(255,255,255,.8)'
              callback={this.getImage.bind(this)}
            />

            <View style={{ flexDirection: 'row', width: '100%', height: 50 }}>
              <Button full style={{ flex: 1, backgroundColor: '#52ce5e' }} onPress={() => this.uploadPhoto()}>
                <Text style={{ color: '#ffffff', fontSize: 18 }}>UPLOAD PHOTO</Text>
              </Button>
              <Button full style={{ flex: 1, backgroundColor: '#fd6464' }} onPress={() => this.cancelPhotos()}>
                <Text style={{ color: '#ffffff', fontSize: 18 }}>CANCEL UPLOAD</Text>
              </Button>
            </View>

          </Modal>

          <Modal isVisible={this.state.showLoader} backdropColor="rgba(0,0,0,.6)">
            <View style={styles.loadView}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          </Modal>
        </View>
      );
    }

    addRunModal() {
      return (
        <Modal style={{ width: '100%', margin: 0, padding: 0 }} isVisible={this.state.addRun} backdropOpacity={0.95} backdropColor="#3b3b3b">

          <View style={styles.modalHeader}>
            <Button full transparent style={styles.close} onPress={() => this.cancelModal('addRun')}><Icon style={styles.closeText} type="MaterialIcons" name="clear" /></Button>
          </View>
          <View style={styles.modalWrapper}>
            <DateTimePicker
              mode="datetime"
              is24Hour={false}
              isVisible={this.state.dateTimePicker}
              onConfirm={this._confirmDateTime}
              onCancel={() => this.cancelDateTime()}
            />
            <ScrollView style={{ width: '100%', height: 300 }}>
              {this.listSchedule()}
            </ScrollView>
            <Text style={styles.titleText}>ADD DATE AND TIME</Text>

            <Button full style={[styles.squadButtons, { backgroundColor: this.state.courtComplete? '#478cba' : '#4f4f4f' }]} onPress={() => this.addDate()}>
              <Text style={{ color: '#ffffff',textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium' }}>ADD NEW RUN</Text>
            </Button>

            <Button full style={{ backgroundColor: '#305f80' }} onPress={() => this.addSquadRun()}>
              <Text style={styles.addBtnText}>SUBMIT</Text>
            </Button>

          </View>

        </Modal>
      );
    }

    addBallersModal() {
      return (
        <Modal style={{ width: '100%', margin: 0, padding: 0 }} isVisible={this.state.addBallers} backdropOpacity={0.95} backdropColor="#3b3b3b">
          <View style={styles.modalHeader}>
            <Button full transparent style={styles.close} onPress={() => this.cancelModal('addBallers')}><Icon style={styles.closeText} type="MaterialIcons" name="clear" /></Button>
          </View>

          <View style={styles.modalWrapper}>

            <TextInput
              onChangeText={(searchBaller) => this.searchBaller(searchBaller)}
              style={styles.textInput}
              autoCapitalize = "none"
              placeholderTextColor = "#ffffff"
              underlineColorAndroid="transparent"
              keyboardAppearance="dark"
              placeholder="SEARCH BALLERS"
            />

            <Text style={styles.titleText}>SELECT BALLERS</Text>

          </View>
          <ScrollView style={{ width: '100%', height: 200 }}>
            { this.allBallers() }
          </ScrollView>

          <Button full style={styles.addBtn} onPress={() => this.updateSquad()}>
            <Text style={styles.addBtnText}> ADD TO SQUAD </Text>
          </Button>
        </Modal>
      );
    }

    showRuns() {
      var moment = require('moment');

      const RunsArr = Object.values(this.state.runs);
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      if (this.state.past) {
        RunsArr.sort(function(a, b) {
          var nameA=a.runSchedule, nameB=b.runSchedule;
          if (nameA > nameB) //sort string ascending
            return -1;
          if (nameA < nameB)
            return 1;
          return 0; //default return value (no sorting)
        });
      } else {
        RunsArr.sort(function(a, b) {
          var nameA=a.runSchedule, nameB=b.runSchedule;
          if (nameA < nameB) //sort string ascending
            return -1;
          if (nameA > nameB)
            return 1;
          return 0; //default return value (no sorting)
        });
      }


      return RunsArr.map((value, key) => {
        var schedule = new Date(value.runSchedule);
        var image = this.state.runImage;
        var now = moment();
        var date = moment(value.runSchedule);
        var before = moment(value.runSchedule).isBefore(now);
        var upcoming = moment(value.runSchedule).isSameOrAfter(now);

        var sendDate = {
          id: value.id,
          timeStamp: value.runSchedule,
          date: moment(value.runSchedule).format('L'),
          time: moment(value.runSchedule).format('LT'),
          runEnd: value.runEnd
        };

        const data = {
          ballers: this.props.ballers,
          city: this.state.court.city,
          state: this.state.court.state,
          zipcode: this.state.court.zipcode,
          court: this.state.court,
          id: this.props.squad.id,
          name: this.props.squad.name,
          schedule: this.props.squad.schedule,
        };

        var squad = {
          data: data,
          schedule: sendDate
        };

        var dow = moment(value.runSchedule).format('dddd');
        var subText = moment(value.runSchedule).format('LLL');

        if (this.state.past && before) {
          return <BasicList image={image} header={dow} page="SingleRun" subText={subText} data={squad} key={key} />;
        } else if (this.state.upcoming && upcoming) {
          return <BasicList image={image} header={dow} page="SingleRun" subText={subText} data={squad} key={key} />;
        }
      });
    }

    toggleHeader() {
      switch (this.state.user.member_type) {
        case '1':
          // Full Admin
          return <AuthNav navigation={this.props.navigation} back="Squad" page={this.state.squad.name} button="Settings" link="Settings" />;
          break;
        case '2':
          // OG Admin
          if (this.state.user.id == this.state.squad.adminID) {
            return <AuthNav navigation={this.props.navigation} back="Squad" page={this.state.squad.name} button="Settings" link="Settings" />;
          }else {
            return <BasicNav navigation={this.props.navigation} back="Squad" page={this.state.squad.name} button="Add Ballers" link="Settings" />;
          }
          break;
        case '3':
          // Baller
          return <BasicNav navigation={this.props.navigation} back="Squad" page={this.state.squad.name} button="Add Ballers" link="Settings" />;
          break;
        default:
          // Other
          return <BasicNav navigation={this.props.navigation} back="Squad" page={this.state.squad.name} button="Add Ballers" link="Settings" />;
          break;
      }
    }

    toggleAddRun() {
      switch (this.state.user.member_type) {
        case '1':
          // Full Admin
          return (
            <Button full style={styles.addBtn} onPress={() => this.addARun()}>
              <Text style={styles.addBtnText}> ADD A RUN </Text>
            </Button>
          );
          break;
        case '2':
          // OG Admin
          if (this.state.user.id == this.state.squad.adminID) {
            return (
              <Button full style={styles.addBtn} onPress={() => this.addARun()}>
                <Text style={styles.addBtnText}> ADD A RUN </Text>
              </Button>
            );
          }
        default:
          // Other
          break;
      }
    }

    render() {
      const background = require ('../assets/Background.png');
      const logo = require ('../assets/james-full-logo.png');

      return (
        <Container style={styles.container}>
          <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', }}>
            <Image style={{ flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: .5 }} source={background} />
          </View>

          {this.toggleHeader()}
          {this.settingsModal()}
          {this.addBallersModal()}
          {this.addRunModal()}
          {this.imageModal()}

          <Grid>
            <Row style={{ backgroundColor: 'transparent' }}>
              <ScrollView>
                <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap' }}>
                      {this.showBallers()}
                    </View>
              </ScrollView>
            </Row>
            <Row style={{ height: 75, backgroundColor: '#478cba', alignItems: 'center', padding: 10, marginBottom: 2 }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ justifyContent: 'center', flex: 1 }}>
                      <Text style={styles.text}>{this.props.squad.name} Runs</Text>
                    </View>
                {this.toggleAddRun()}
              </View>
            </Row>
            <Row style={{ flexDirection: 'row', width: '100%', height: 50 }}>
              <Button full style={[styles.filterBtn, { backgroundColor: '#305f80', }]} onPress={() => this.filterRuns('past')}>
                <Text style={styles.addBtnText}> Past Runs </Text>
              </Button>
              <Button full style={[styles.filterBtn, { backgroundColor: '#478cba', }]} onPress={() => this.filterRuns('upcoming')}>
                <Text style={styles.addBtnText}> Upcoming Runs </Text>
              </Button>
            </Row>
            <Row>
              <ScrollView>

                {this.showRuns()}

              </ScrollView>
            </Row>
          </Grid>

        </Container>
      );
    }
}

const mapStateToProps = (state) => {
  return {
    edit: state.auth.edit,
    user: state.auth.user.profile,
    ballers: state.games.view.data.ballers,
    allBallers: state.games.ballers,
    addList: state.games.addToList,
    scheduleList: state.games.addToSchedule,
    runs: state.games.view.data.schedule,
    court: state.games.view.data.court,
    squad: state.games.view.data
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    displayView: (view) => dispatch(displayView(view)),
    getRun: (runId, type) => dispatch(getRun(runId, type)),
    addToSchedule: (schedule) => dispatch(addToSchedule(schedule)),
    squadApi: (id, type, data) => dispatch(squadApi(id, type, data)),
    addEdit: (edit) => dispatch(addEdit(edit)),
    viewDate: (date) => dispatch(viewDate(date)),
    resetList: () => dispatch(resetList()),
    resetSchedule: () => dispatch(resetSchedule())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleSquad);

const styles = {
  container: {
    backgroundColor: '#000000',
  },
  filterBtn: {
    flex: 1
  },
  photoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'BarlowCondensed-Bold',
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 10
  },
  text: {
    fontFamily: 'BarlowCondensed-Medium',
    fontSize: 22,
    color: '#ffffff',
    lineHeight: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    color: '#ffffff',
    backgroundColor: '#000000',
    fontFamily: 'BarlowCondensed-Bold',
    fontSize: 16,
    marginBottom: '5%',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '5%',
    width: '100%',
    textAlign: 'left',
    elevation: 0
  },
  profileImage: {
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    width: 125,
    height: 125,
    borderColor: '#ffffff',
    borderWidth: 1
  },
  profilePic: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profile: {
    height: 30
  },
  profileText: {
    color: '#ffffff',
    fontFamily: 'BarlowCondensed-Medium',
    fontSize: 20
  },
  photos: {
    margin: 5,
    width: 150,
    height: 150,
  },
  courtImageWrapper: {
    position: 'absolute',
    top: 75,
    left: 0,
    width: '100%',
    height: 190,
    borderBottomWidth: 2,
    borderColor: '#222222'
  },
  courtImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    opacity: .5,

  },
  modalHeader: {
    backgroundColor: '#000000',
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 75,
  },
  modalWrapper: {
    marginTop: 80,
    padding: 20
  },
  close: {
    height: 75,
    width: 100,
    position: 'absolute',
    right: 0,
  },
  closeText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 28,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'ProximaNova-Light'
  },
  squadButtons: {
    marginBottom: 15
  },
  addBtn: {
    backgroundColor: '#305f80',
    justifyContent: 'center',
    alignItems: 'center',
    flex: .5,
    height: 70
  },
  addBtnText: {
    textAlign: 'center',
    color: '#ffffff',
    fontFamily: 'BarlowCondensed-Bold',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
  },
  courtBtnText: {
    color: '#ffffff',
    fontFamily: 'BarlowCondensed-Medium',
  },
  addImageBtn: {
    backgroundColor: '#478cba',
    position: 'absolute',
    bottom: 100,
    right: 20
  },
  uploadButton: {
    backgroundColor: '#478cba',
    borderWidth: 0,
    borderColor: '#fff',
    marginBottom: 0,
    padding: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9
  },
  viewList: {
    backgroundColor: 'transparent',
    height: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  }
};