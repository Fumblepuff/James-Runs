import React, { Component } from 'react';
import {
  View,
  Image,
  TextInput,
  ActivityIndicator,
  CameraRoll,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';
import {
  Container,
  Icon,
  Text,
  Button,
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import CameraRollPicker from 'react-native-camera-roll-picker';
import { Storage } from 'aws-amplify';
import { Buffer } from 'buffer';
import RNFetchBlob from 'rn-fetch-blob';
import DateTimePicker from 'react-native-modal-datetime-picker';

import moment from 'src/common/moment';

import AuthNav from 'src/components/AuthNav';
import BasicNav from 'src/components/BasicNav';
import SelectList from 'src/components/SelectList';
import ReviewList from 'src/components/ReviewList';
import BasicList from 'src/components/BasicList';

import {
  authUserFormat,
} from 'src/api/AuthApi';

import { uploadFile, addEdit, setUser } from 'src/reducers/auth';
import { getList, addToSchedule, addToList, squadApi, displayView, getRun } from 'src/reducers/games';

class Squad extends Component {
  static navigationOptions = {
    drawerLabel: 'My Profile',
  }

  constructor(props) {
    super(props);

    this.state = {
      user: this.props.user,
      squads: this.props.userSquad,
      ballers: this.props.ballers,
      showPhotos: false,
      showLoader: false,
      courtImage: 'https:\/\/s3.amazonaws.com\/awsjames-userfiles-mobilehub-258458471\/public\/james-court.jpg',
      squadName: '',
      courtName: '',
      courtAddress: '',
      courtCity: '',
      courtState: '',
      courtZipcode: '',
      courtTags: [],
      completeModal: false,
      completeMessage: 'SQUAD ADDED!',
      addCourt: false,
      addBallers: false,
      addRun: false,
      courtComplete: false,
      ballersComplete: false,
      runComplete: false,
      squadAdded: false,
      dateTimePicker: false,
      uniqueName: false,
    };
  }

  componentDidMount() {
    const userToken = AsyncStorage.getItem('userId');

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
  }

  handleChange(formField, value) {
    this.setState({ [formField]: value });
  }

  getUser(user) {
    this.props.getRun(user, 'getUser')
      .then((resultInp) => {
        const result = authUserFormat(resultInp);

        this.props.setUser(result);

        this.setState({
          user: result.profile,
          squads: result.squads,
        });
      })
      .catch((err) => alert(err));
  }

  _confirmDateTime = (datetime) => {
    const schedule = new Date(datetime);

    const scheduleObj = {

      id: datetime,
      runSchedule: moment(schedule).format('YYYY-MM-DD HH:mm:ss'),

    };

    this.setState({ dateTimePicker: false });
    this.props.addToSchedule(scheduleObj);
  }

  reload() {
    const data = [];
    this.props.getList('ballers');
    this.props.getList('squads');
    this.props.displayView(data);
    this.props.squadList.length = 0;
  }

  nextScreen(screen) {
    switch (screen) {
      case 'squad':

        if ( this.state.squadName && this.state.uniqueName ) {
          this.setState({ edit: false });
          setTimeout(() => {
            this.setState({ addCourt: !this.state.addCourt });
          }, 500);
        } else {
          Alert.alert(
            'Squad Name',
            'Select A Unique Squad Name',
            [
              { text: 'OK' },
            ],
            { cancelable: true },
          );
        }


        break;
      case 'court':

        if ( this.state.courtName && this.state.courtAddress && this.state.courtImage && this.state.courtZipcode ) {
          const now = Date.now();
          this.setState({ addCourt: !this.state.addCourt });

          setTimeout(() => {
            this.props.addEdit(true);
            this.setState({
              photoName: `${this.state.courtName}-${now}.png`,
              courtComplete: true,
            });
          }, 500);
        } else {
          Alert.alert(
            'All Fields Are Required',
            '',
            [
              { text: 'OK' },
            ],
            { cancelable: true },
          );
        }

        break;

      case 'ballers':

        if ( this.props.squadList.length > 0) {
          this.setState({ addBallers: !this.state.addBallers });

          setTimeout(() => {
            this.props.addEdit(true);
            this.setState({
              ballersComplete: !this.state.ballersComplete,
            });
          }, 500);
        } else {
          Alert.alert(
            'Add Ballers to this Squad',
            '',
            [
              { text: 'OK' },
            ],
            { cancelable: true },
          );
        }

        break;

      case 'run':

        if ( this.props.scheduleList.length > 0 ) {
          this.setState({ addRun: !this.state.addRun });
          setTimeout(() => {
            this.props.addEdit(true);
            this.setState({
              squadAdded: !this.state.squadAdded,
              runComplete: true,
            });
          }, 500);
        } else {
          Alert.alert(
            'To add a Run please add a date to the schedule',
            '',
            [
              { text: 'OK' },
            ],
            { cancelable: true },
          );
        }

        break;
      default:
        break;
    }
  }

  addDetail(screen) {
    switch (screen) {
      case 'court':

        if ( this.state.squadName && this.state.uniqueName ) {
          this.props.addEdit(false);
          setTimeout(() => {
            this.setState({ addCourt: !this.state.addCourt });
          }, 500);
        } else {
          Alert.alert(
            'Select A Squad Name',
            'Please be sure to use a Unique Squad Name',
            [
              { text: 'OK' },
            ],
            { cancelable: true },
          );
        }


        break;
      case 'ballers':

        if ( this.state.squadName ) {
          this.props.addEdit(false);
          setTimeout(() => {
            this.setState({ addBallers: !this.state.addBallers });
          }, 500);
        } else {
          Alert.alert(
            'Select A Squad Name',
            '',
            [
              { text: 'OK' },
            ],
            { cancelable: true },
          );
        }

        break;

      case 'run':

        if ( this.state.squadName ) {
          this.props.addEdit(false);
          setTimeout(() => {
            this.setState({ addRun: !this.state.addRun });
          }, 500);
        } else {
          Alert.alert(
            'Select A Squad Name',
            '',
            [
              { text: 'OK' },
            ],
            { cancelable: true },
          );
        }

        break;

      default:
        break;
    }
  }

  selectPhotos() {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos',
    })
      .then((r) => {
        this.setState({
          photos: r.edges,
          addCourt: false,
        });

        setTimeout(() => {
          this.setState({ showPhotos: true });
        }, 500);
      })
      .catch((err) => {
        alert(err);
      });
  }

  checkSquadName(formField, value) {
    const array = this.props.squads;
    if (array) {
      const obj = array.find((x) => x.name === value);

      if (obj) {
        this.setState({ uniqueName: false });
      } else {
        this.setState({
          [formField]: value,
          uniqueName: true,
        });
      }
    } else {
      this.setState({
        [formField]: value,
        uniqueName: true,
      });
    }
  }

  setImage(result) {
    this.setState({ showPhotos: false });
    this.setState({ courtImage: this.state.photoLocal });

    setTimeout(() => {
      this.setState({ addCourt: true });
    }, 500);
  }

  async showProfileImage(image) {
    const profile = await image;
    Storage.get(profile)
      .then((result) => {
        return result;
      })
      .catch((err) => alert(err));
  }

  removeLoader(data) {
    this.setState({ showLoader: false }, () => {
      this.setState({ completeModal: true });
      this.props.squadApi(this.props.user.id, 'addSquad', data);
    });
  }

  readFile(filePath) {
    return RNFetchBlob.fs.readFile(filePath, 'base64').then((data) => new Buffer(data, 'base64'));
  }

  getImage(images, current) {
    const now = Date.now();

    this.setState({
      photoLocal: current.uri,
    });
  }

  // addSquad() {
  //   this.setState({ createSquad: true });
  // }

  cancelCreate() {
    this.props.addEdit(false);
  }

  cancelModal(modal) {
    this.setState({ [modal]: false });
  }

  closeModal(modal) {
    this.setState({ [modal]: false });
  }

  updateSquads() {
    this.setState({ completeModal: false });
  }

  SelectValue(formField, value) {
    this.setState({ [formField]: value } );
  }

  searchBaller(baller) {
    // this.setState({ searchBaller: baller })
    this.props.getRun(baller, 'searchBallers')
      .then((result) => {
        this.setState({ ballers: result });
      })
      .catch((err) => alert(err));
  }

  listBallers() {
    const ballersArr = Object.values(this.state.ballers);

    return (
      <View>
        <FlatList
          data={ballersArr}
          renderItem={({ item }) => (
            <SelectList image={item.imageName} header={`${item.firstName} ${item.lastName}`} page="BallerProfile" subText={`${item.city} ${item.state}`} data={item} />
          )}
          keyExtractor={(item) => item.email}
        />
      </View>
    );
  }

  listSquads() {
    if (this.state.squads) {
      const SquadsArr = Object.values(this.state.squads);
      return (
        <View>
          <FlatList
            data={SquadsArr}
            renderItem={({ item }) => (
              <BasicList
                image={item.court[0].imageName}
                imageURL={item.courtURL}
                header={item.name}
                page="SingleSquad"
                subText={`${item.city} ${item.state}`}
                data={({ data: item })}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      );
    }

    return null;
  }

  listSchedule() {
    const scheduleArr = Object.values(this.props.scheduleList);

    return scheduleArr.map((value, key) => {
      const header = moment(value.runSchedule).format('dddd');
      const subtext = moment(value.runSchedule).format('MMMM Do YYYY');

      return <ReviewList header={header} subText={subtext} data={value} key={key} />;
    } );
  }

  filterSquads(filter) {
    switch (filter) {
      case true:
        this.setState({ squads: '' }, () => {
          this.setState({ squads: this.props.userSquad });
        });
        break;
      case false:
        this.setState({ squads: '' }, () => {
          this.setState({ squads: this.props.squads });
        });
        break;
      default:
        this.setState({ squads: this.state.userSquad });
        break;
    }
  }

  addDate() {
    this.setState({ dateTimePicker: true });
  }

  cancelDateTime() {
    this.setState({ dateTimePicker: false });
  }

  cancelPhotos() {
    this.setState({ showPhotos: false });
  }

  addSquad() {
    this.setState({ showLoader: true });

    const SquadObj ={
      name: this.state.squadName,
      city: this.state.courtCity,
      state: this.state.courtState,
      zipcode: this.state.courtZipcode,
    };

    const CourtObj ={
      name: this.state.courtName,
      address: this.state.courtAddress,
      state: this.state.courtState,
      city: this.state.courtCity,
      zipcode: this.state.courtZipcode,
      tags: this.state.courtTags,
    };

    const data = {
      squad: SquadObj,
      court: CourtObj,
      ballers: this.props.squadList,
      schedule: this.props.scheduleList,
      admin: this.props.user.id,
    };

    const newSquad = {
      id: 0,
      courtURL: this.state.courtImage,
      name: this.state.squadName,
      ballers: this.props.squadList,
      court: [CourtObj],
      state: this.state.courtState,
      city: this.state.courtCity,
      zipcode: this.state.courtZipcode,
      schedule: this.props.scheduleList,
    };
    if (this.state.squads) {
      this.props.addEdit(false);

      this.props.getRun(data, 'addSquad')
        .then((result) => {
          const update = [ ...this.state.squads, result ];
          this.setState({
            squads: update,
            showLoader: false,
          }, () => {
            this.setState({ completeModal: true });
          });
        })
        .catch((err) => alert(err));
    } else {
      this.props.addEdit(false);

      this.props.getRun(data, 'addSquad')
        .then((result) => {
          const update = [result];
          this.setState({
            squads: update,
            showLoader: false,
          }, () => {
            this.setState({ completeModal: true });
          });
        })
        .catch((err) => alert(err));
    }
  }

  addSquadBtn() {
    if (this.state.runComplete && this.state.ballersComplete && this.state.courtComplete) {
      return (
        <Button full style={styles.addBtn} onPress={() => this.addSquad()}>
          <Text style={styles.addBtnText}> SAVE NEW RUN</Text>
        </Button>
      );
    }

    return null;
  }

  toggleHeader() {
    if (this.state.user && this.state.user.member_type == 1) {
      return <AuthNav navigation={this.props.navigation} drawer={true} page="Squads" button="Create A Squad" modal="true" />;
    } else {
      return <BasicNav navigation={this.props.navigation} drawer={true} page="Squads" button="Create A Squad" modal="true" />;
    }

    switch (this.state.user.member_type) {
      case '1':
        // Full Admin
        return <AuthNav navigation={this.props.navigation} drawer={true} page="Squads" button="Create A Squad" modal="true" />;
        break;
      case '2':
        // OG Admin
        if (this.state.user.id == this.state.squad.adminID) {
          return <AuthNav navigation={this.props.navigation} drawer={true} page="Squads" button="Create A Squad" modal="true" />;
        } else {
          return <BasicNav navigation={this.props.navigation} drawer={true} page="Squads" button="Create A Squad" modal="true" />;
        }
      default:
        // Baller
        return <BasicNav navigation={this.props.navigation} drawer={true} page="Squads" button="Create A Squad" modal="true" />;
        break;
    }
  }

  render() {
    const background = require ('../assets/Background.png');
    const logo = require ('../assets/james-full-logo.png');

    return (
      <Container style={styles.container} >
        <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <Image style={{ flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: .5 }} source={background} />
        </View>
        {this.toggleHeader()}
        <View style={{ flexDirection: 'row', width: '100%', height: 50 }}>
          <Button full style={[styles.filterBtn, { backgroundColor: '#305f80' }]} onPress={() => this.filterSquads(false)}>
            <Text style={styles.addBtnText}>All SQUADS</Text>
          </Button>
          <Button full style={[styles.filterBtn, { backgroundColor: '#478cba' }]} onPress={() => this.filterSquads(true)}>
            <Text style={styles.addBtnText}>MY SQUADS</Text>
          </Button>
        </View>
        <ScrollView style={{ width: '100%', height: '100%', marginTop: 10 }}>
          {this.listSquads()}
        </ScrollView>
        <Modal isVisible={this.state.showPhotos} backdropColor="rgba(0,0,0,.6)" >
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
            <Button full style={{ flex: 1, backgroundColor: '#52ce5e' }} onPress={() => this.setImage()}>
              <Text style={{ color: '#ffffff', fontSize: 18 }}>UPLOAD PHOTO</Text>
            </Button>
            <Button full style={{ flex: 1, backgroundColor: '#fd6464' }} onPress={() => this.cancelPhotos()}>
              <Text style={{ color: '#ffffff', fontSize: 18 }}>CANCEL UPLOAD</Text>
            </Button>
          </View>
        </Modal>
        <Modal style={{ width: '100%', margin: 0, padding: 0 }} isVisible={this.props.edit} backdropOpacity={0.95} backdropColor="#3b3b3b"  >
          <View style={styles.modalHeader}>
            <Button full transparent style={styles.close} onPress={() => this.cancelCreate()}><Icon style={styles.closeText} type="MaterialIcons" name="clear" /></Button>
          </View>
          <View style={styles.modalWrapper}>
            <Text style={styles.titleText}>CREATE NEW SQUAD</Text>
            <Text style={styles.text}>Create a Unique Name for your Squad</Text>
            <TextInput
              onChangeText={(squadName) => this.checkSquadName('squadName', squadName)}
              style={[styles.textFull, { backgroundColor: this.state.uniqueName? '#52ce5e': '#fd6464' }]}
              autoCapitalize ="none"
              placeholderTextColor ="#ffffff"
              underlineColorAndroid="transparent"
              keyboardAppearance="dark"
              placeholder={this.state.squadName? this.state.squadName : 'Squad Name'}
            />
            <Button full style={[styles.squadButtons, { backgroundColor: this.state.courtComplete? '#478cba' : '#4f4f4f' }]} onPress={() => this.addDetail('court')}>
              <Text style={{ color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium' }}>ADD A COURT</Text>
            </Button>
            <Button full style={[styles.squadButtons, { backgroundColor: this.state.ballersComplete? '#478cba' : '#4f4f4f' }]} onPress={() => this.addDetail('ballers')}>
              <Text style={{ color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium' }}>SELECT BALLERS</Text>
            </Button>
            <Button full style={[styles.squadButtons, { backgroundColor: this.state.runComplete? '#478cba' : '#4f4f4f' }]} onPress={() => this.addDetail('run')}>
              <Text style={{ color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium' }}>CREATE A RUN</Text>
            </Button>
          </View>
          {this.addSquadBtn()}
        </Modal>

        <Modal style={{ width: '100%', flexDirection: 'column', margin: 0, padding: 0 }} isVisible={this.state.addCourt} backdropOpacity={0.95} backdropColor="#3b3b3b"  >
          <View style={[styles.modalHeader, { flex: .1 }]}>
            <Button full transparent style={styles.close} onPress={() => this.cancelModal('addCourt')}><Icon style={styles.closeText} type="MaterialIcons" name="clear" /></Button>
          </View>
          <KeyboardAvoidingView behavior="padding" style={{ width: '100%', flex: 1, flexDirection: 'row', flexWrap: 'wrap', margin: 'auto', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '80%', flex: 1, flexDirection: 'row', flexWrap: 'wrap', margin: 'auto', justifyContent: 'center', alignItems: 'center' }}>
              <TextInput
                onChangeText={(courtName) => this.handleChange('courtName', courtName)}
                style={[styles.textFull, { width: '85%' }]}
                autoCapitalize ="none"
                placeholderTextColor ="#ffffff"
                underlineColorAndroid="transparent"
                keyboardAppearance="dark"
                autoCorrect={false}
                placeholder={this.state.courtName? this.state.courtName : 'Court Name'}
              />
              <TextInput
                onChangeText={(courtAddress) => this.handleChange('courtAddress', courtAddress)}
                style={styles.textInput}
                autoCapitalize ="none"
                placeholderTextColor ="#ffffff"
                underlineColorAndroid="transparent"
                keyboardAppearance="dark"
                autoCorrect={false}
                placeholder={this.state.courtAddress? this.state.courtAddress : 'Court Address'}
              />
              <TextInput
                onChangeText={(courtCity) => this.handleChange('courtCity', courtCity)}
                style={styles.textInput}
                autoCapitalize ="none"
                placeholderTextColor ="#ffffff"
                underlineColorAndroid="transparent"
                keyboardAppearance="dark"
                autoCorrect={false}
                placeholder={this.state.courtCity? this.state.courtCity : 'Court City'}
              />
              <TextInput
                onChangeText={(courtState) => this.handleChange('courtState', courtState)}
                style={styles.textInput}
                autoCapitalize ="none"
                placeholderTextColor ="#ffffff"
                underlineColorAndroid="transparent"
                keyboardAppearance="dark"
                autoCorrect={false}
                placeholder={this.state.courtState? this.state.courtState : 'Court State'}
              />
              <TextInput
                onChangeText={(courtZipcode) => this.handleChange('courtZipcode', courtZipcode)}
                style={styles.textInput}
                autoCapitalize ="none"
                placeholderTextColor ="#ffffff"
                underlineColorAndroid="transparent"
                keyboardAppearance="dark"
                keyboardType ="number-pad"
                returnKeyType ="done"
                autoCorrect={false}
                placeholder={this.state.courtZipcode? this.state.courtZipcode : 'Court Zip Code'}
              />
            </View>
          </KeyboardAvoidingView>
          <Button full style={styles.addBtn} onPress={() => this.nextScreen('court')}>
            <Text style={{ color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium' }}> ADD COURT </Text>
          </Button>

        </Modal>

        <Modal style={{ width: '100%', margin: 0, padding: 0 }} isVisible={this.state.addBallers} backdropOpacity={0.95} backdropColor="#3b3b3b">
          <View style={styles.modalHeader}>
            <Button full transparent style={styles.close} onPress={() => this.cancelModal('addBallers')}><Icon style={styles.closeText} type="MaterialIcons" name="clear" /></Button>
          </View>
          <View style={styles.modalWrapper}>
            <TextInput
              onChangeText={(searchBaller) => this.searchBaller(searchBaller)}
              style={styles.textInput}
              autoCapitalize ="none"
              placeholderTextColor ="#ffffff"
              underlineColorAndroid="transparent"
              keyboardAppearance="dark"
              placeholder="SEARCH BALLERS"
            />
            <Text style={styles.titleText}>SELECT BALLERS</Text>
            <ScrollView style={{ width: '100%', height: 200 }}>
              {this.listBallers()}
            </ScrollView>
          </View>
          <Button full style={styles.addBtn} onPress={() => this.nextScreen('ballers')}>
            <Text style={styles.addBtnText}>ADD TO SQUAD</Text>
          </Button>
        </Modal>
        <Modal style={{ width: '100%', margin: 0, position: 'relative', padding: 0 }} isVisible={this.state.addRun} backdropOpacity={0.95} backdropColor="#3b3b3b"  >
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
            <ScrollView style={{ width: '100%', flex: 1 }}>
              {this.listSchedule()}
            </ScrollView>
            <Text style={styles.titleText}>ADD DATE AND TIME</Text>
            <Button full style={[styles.squadButtons, { backgroundColor: this.state.courtComplete? '#478cba' : '#4f4f4f' }]} onPress={() => this.addDate()}>
              <Text style={{ color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium' }}>ADD DATE TO SCHEDULE</Text>
            </Button>
          </View>
          <Button full style={styles.addBtn} onPress={() => this.nextScreen('run')}>
            <Text style={styles.addBtnText}>ADD SCHEDULE</Text>
          </Button>
        </Modal>

        <Modal style={styles.modal}  isVisible={this.state.completeModal} backdropOpacity={0.95} backdropColor="#3b3b3b">
          <View style={{ width: '80%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', alignSelf: 'center', padding: 15 }}>
            <Text style={styles.blueText}>{ this.state.completeMessage }</Text>
          </View>
          <Button full style={{ backgroundColor: '#478cba', width: '80%', marginTop: 10, alignSelf: 'center' }} onPress={() => this.updateSquads()}>
            <Text style={styles.addBtnText}>VIEW SQUADS</Text>
          </Button>
        </Modal>

        <Modal isVisible={this.state.showLoader} backdropOpacity={0.95} backdropColor="#3b3b3b">
          <View style={styles.loadView}>
            <ActivityIndicator size="large" color="#478cba" />
          </View>
        </Modal>

      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => { dispatch(setUser(user)); },
    getRun: (runId, type) => dispatch(getRun(runId, type)),
    displayView: (view) => dispatch(displayView(view)),
    addToSchedule: (schedule) => dispatch(addToSchedule(schedule)),
    addToList: (list) => dispatch(addToList(list)),
    addEdit: (edit) => dispatch(addEdit(edit)),
    getList: (list) => dispatch(getList(list)),
    squadApi: (id, type, data) => dispatch(squadApi(id, type, data)),
    uploadFile: (update) => { dispatch(uploadFile(update)); },
  };
};

const mapStateToProps = (state) => {
  return {
    edit: state.auth.edit,
    user: state.auth.user.profile,
    userSquad: state.auth.user.squads,
    squads: state.games.squads,
    ballers: state.games.ballers,
    squadList: state.games.addToList,
    scheduleList: state.games.addToSchedule,
    view: state.games.view,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Squad);

const styles = {
  container: {
    backgroundColor: '#000000',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'scroll',
  },
  filterBtn: {
    flex: 1,
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
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 10,
    width: '100%',
    textAlign: 'left',
  },
  text: {
    fontFamily: 'BarlowCondensed-Medium',
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 15,
  },
  textFull: {
    backgroundColor: '#000000',
    color: '#ffffff',
    fontFamily: 'BarlowCondensed-Bold',
    fontSize: 20,
    lineHeight: 20,
    borderBottomWidth: 0,
    borderBottomColor: '#fff',
    marginBottom: 10,
    padding: 10,
    width: '100%',
    margin: 5,
    height: 50,
    textAlign: 'left',
    elevation: 0,
  },
  textInput: {
    backgroundColor: '#000000',
    color: '#ffffff',
    fontFamily: 'BarlowCondensed-Bold',
    fontSize: 20,
    lineHeight: 20,
    borderBottomWidth: 0,
    borderBottomColor: '#fff',
    marginBottom: 10,
    padding: 10,
    flexWrap: 'wrap',
    width: 150,
    margin: 5,
    height: 50,
    textAlign: 'left',
    elevation: 0,
  },
  profileImage: {
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    width: 125,
    height: 125,
    borderColor: '#ffffff',
    borderWidth: 1,
  },
  profilePic: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profile: {
    height: 30,
  },
  profileText: {
    color: '#ffffff',
    fontFamily: 'BarlowCondensed-Medium',
    fontSize: 20,
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
    borderColor: '#222222',
  },
  courtImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    opacity: .5,

  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    backgroundColor: '#000000',
    top: 0,
    width: '100%',
    height: 50,
  },
  modalWrapper: {
    flex: 1,
    width: '100%',
    padding: 20,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  close: {
    height: 50,
    width: 100,
    right: 0,
  },
  closeText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 22,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'BarlowCondensed-Bold',
  },
  squadButtons: {
    marginBottom: 15,
  },
  addBtn: {
    backgroundColor: '#478cba',
    height: 70,
    width: '100%',
    bottom: 0,
  },
  addBtnText: {
    textAlign: 'center',
    color: '#ffffff',
    fontFamily: 'BarlowCondensed-Bold',
    fontSize: 20,
  },
  courtBtnText: {
    color: '#ffffff',
    fontFamily: 'BarlowCondensed-Medium',
  },
  addImageBtn: {
    position: 'absolute',
    right: 10,
    backgroundColor: '#478cba',
    width: 100,
    height: '100%',
    zIndex: 9,
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
    zIndex: 9,
  },
  viewList: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
};