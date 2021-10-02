import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Picker,
  Keyboard,
  Platform,
  PermissionsAndroid,
  View, Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  SafeAreaView,
} from 'react-native';
import _ from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';
import CameraRoll from '@react-native-community/cameraroll';
import CameraRollPicker from 'react-native-camera-roll-picker';
import {
  Container, Icon, Text, Button,
} from 'native-base';
import { connect } from 'react-redux';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Modal from 'react-native-modal';
import { Storage } from 'aws-amplify';
import { Buffer } from 'buffer';
import DatePicker from 'react-native-datepicker';
import RNFetchBlob from 'rn-fetch-blob';
import MomentReact from 'react-moment';
import moment from 'moment';

import 'moment-timezone';

import validationUtils from 'src/utils/validationUtils';
import deviceUtils from 'src/utils/deviceUtils';

import AuthNav from 'src/components/AuthNav';
import ListSkillsCheckbox from 'src/components/ListSkillsCheckbox';

import {
  uploadFile,
  refreshUser,
  addEdit,
  setUser,
  authMemberTypesSelector,
} from 'src/reducers/auth';
import { getList, getRun } from 'src/reducers/games';

import {
  authUserFormat,
} from 'src/api/AuthApi';
import SkillsApi from 'src/api/SkillsApi';

import statsBackground from 'src/assets/statsBackground.png';
import background from 'src/assets/Background.png';

import styles from './styles';

class Profile extends Component {
  static navigationOptions = {
    drawerLabel: 'My Profile',
  }

  constructor(props) {
    super(props);

    this.state = {
      id: this.props.user ? this.props.user.id : this.props.id,
      showPhotos: false,
      showLoader: false,
      profilePic: 'https:\/\/s3.amazonaws.com\/awsjames-userfiles-mobilehub-258458471\/public\/james-full-logo.png',
      photoUri: '',
      photoName: '',
      firstName: this.props.user ? this.props.user.firstName : '',
      lastName: this.props.user ? this.props.user.lastName : '',
      city: this.props.user ? this.props.user.city : '',
      state: this.props.user ? this.props.user.state : '',
      zipcode: this.props.user ? this.props.user.zipcode : '',
      phone: this.props.user ? this.props.user.phone : '',
      email: this.props.user ? this.props.user.email : '',
      date: this.props.user ? this.props.user.createdDate : '',
      games: 0,
      wins: 0,
      losses: 0,
      streak: 0,
      winPercentage: 0,
      password: 'pass',
      pickerDisplay: 'none',
      select: '',
      selectItems: [],
      positions: ['1G', '2G', '3F', '4F', '5C'],
      experienceList: ['Recreational', 'High School', 'College', 'Semi-Pro', 'Professional'],
      isKeyboardShown: false,
      userSkills: [],
    };
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );

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

    this.loadLists();
    this.getUserPermissions();
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  handleChange(formField, value) {
    this.setState({ [formField]: value });
  }

  handleSelect(type, value) {
    // this.text.focus();
    Keyboard.dismiss();

    switch (type) {
      case 'positions':
        this.setState({
          pickerDisplay: 'none',
          position: value,
        });
        break;

      case 'highestLevelOfPlay':
        this.setState({
          pickerDisplay: 'none',
          highestLevelOfPlay: value,
        });
        break;
      default:
        break;
    }
  }

  async getUserPermissions() {
    const { user } = this.props;
    const userId = _.get(user, 'id');

    if (!userId) {
      return;
    }

    try {
      const { skillsId } = await SkillsApi.getUserPermissions(userId);

      this.setState({
        userSkills: skillsId,
      });
    } catch (e) {
      // empty
    }
  }

  getUser(user) {
    this.props.getRun(user, 'getUser')
      .then((resultInp) => {
        const result = authUserFormat(resultInp);

        if (!result.details) {
          result.details = {};
        }

        this.props.setUser(result);
        this.showProfileImage(result.profile.imageName);

        this.setState({
          firstName: result.profile.firstName,
          lastName: result.profile.lastName,
          city: result.profile.city,
          state: result.profile.state,
          zipcode: result.profile.zipcode,
          phone: result.profile.phone,
          email: result.profile.email,
          date: result.profile.createdDate,
          games: result.stats.gameCount,
          wins: result.stats.wins,
          losses: result.stats.losses,
          streak: result.stats.streak,
          winPercentage: result.stats.winPercentage,
          age: result.profile.age,
          ballerTag: result.details.ballerTag,
          jersey: result.details.jersey,
          position: result.details.position,
          occupation: result.details.occupation,
          highestLevelOfPlay: result.details.highestLevelOfPlay,
        });
      })
      .catch((err) => {
        alert(err);
      });
  }

  getImage(current) {
    this.setState({
      photoUri: current.uri,
      photoName: this.state.firstName + '-' + this.state.id + '.png',
    });
  }

  _keyboardDidShow = () => {
    this.setState({
      isKeyboardShown: true,
    });
  }

  _keyboardDidHide = () => {
    this.setState({
      isKeyboardShown: false,
    });
  }

  loadLists() {
    this.props.getList('ballers');
  }

  async requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'James Access Photo Permission',
          message: 'James App needs to access your photos' + 'to set your profile picture.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        CameraRoll.getPhotos({
          first: 20,
          assetType: 'Photos',
        })
          .then((r) => {
            this.setState({
              photos: r.edges,
              showPhotos: true,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log('Permission Denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  selectPhotos() {
    if (Platform.OS === 'android') {
      this.requestCameraPermission();
    } else {
      CameraRoll.getPhotos({
        first: 20,
        assetType: 'Photos',
      })
        .then((r) => {
          this.setState({
            photos: r.edges,
            showPhotos: true,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  showProfileImage(image) {
    Storage.get(image)
      .then((result) => {
        this.setState({ profilePic: result });
      })
      .catch((err) => console.log(err));
  }

  removeLoader() {
    this.setState({ showLoader: false });
    Storage.get(this.state.photoName)
      .then((result) => {
        const update = {
          id: this.state.id,
          image: result,
          imageName: this.state.photoName,
          imageLocal: this.state.photoUri,
        };

        this.setState({ profilePic: result });
        this.props.uploadFile(update);
      })
      .catch((err) => console.log(err));
  }

  async uploadPhoto() {
    this.setState({ showPhotos: false });
    setTimeout(() => {
      this.setState({ showLoader: true });
    }, 500);

    this.readFile(this.state.photoUri).then((buffer) => {
      Storage.put(this.state.photoName, buffer, {
        contentType: 'image/png',
      }).then(result => {
        this.removeLoader();
      })
        .catch((err) => alert(err));
    }).catch((e) => {
      console.log(e);
    });
  }

  readFile(filePath) {
    return RNFetchBlob.fs.readFile(filePath, 'base64').then((data) => new Buffer(data, 'base64'));
  }

  profileImage() {
    this.setState({ profilePic: this.props.user.image });
  }

  cancelPhotos() {
    this.setState({ showPhotos: false });
  }

  updateUser() {
    const {
      email,
      age,
    } = this.state;

    if (!email || !validationUtils.isEmail(email)) {
      alert('Specify correct email');
      return;
    }

    const update = {
      id: this.state.id,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
      city: this.state.city,
      state: this.state.state,
      zipcode: this.state.zipcode,
      phone: this.state.phone,
      age,
      ballerTag: this.state.ballerTag,
      jersey: this.state.jersey,
      position: this.state.position,
      occupation: this.state.occupation,
      highestLevelOfPlay: this.state.highestLevelOfPlay,
    };

    this.props.getRun(update, 'updateUser')
      .then(() => {
        const user = {
          id: this.state.id,
        };
        this.props.refreshUser(user);
        this.props.addEdit(false);
      })
      .catch((err) => alert(err));
  }

  cancelSettings() {
    this.props.addEdit(false);
  }

  closeSelect() {
    Keyboard.dismiss();

    this.setState({
      pickerDisplay: 'none',
    });
  }

  selectItem(type) {
    Keyboard.dismiss();

    switch (type) {
      case 'positions':
        this.setState({
          pickerDisplay: 'flex',
          selectType: 'positions',
          select: this.state.position,
          selectItems: this.state.positions,
        });
        break;

      case 'highestLevelOfPlay':
        this.setState({
          pickerDisplay: 'flex',
          selectType: 'highestLevelOfPlay',
          select: this.state.highestLevelOfPlay,
          selectItems: this.state.experienceList,
        });
        break;
      default:
        break;
    }
  }

  showOptions() {
    return this.state.selectItems.map((value, key) => {
      return (
        <Picker.Item
          label={value}
          value={value}
          key={key}
        />
      );
    });
  }

  // eslint-disable-next-line react/sort-comp
  renderSkills() {
    const { userSkills } = this.state;
    const hasSkills = (userSkills.length > 0)

    return (
      <View style={{ flexGrow: 1, marginLeft: 10 }}>
        <Text white style={{ marginBottom: 10 }}>Skills</Text>

        {!hasSkills && <Text white>You have no skills assigned</Text>}

        {hasSkills && (
          <ListSkillsCheckbox
            dataSelected={userSkills}
            style={{ flex: 1 }}
            viewMode
          />
        )}
      </View>
    );
  }

  renderMemberType() {
    const { memberTypes, user } = this.props;
    const userMemberTypeId = parseInt(user.member_type, 10);

    let name = 'unknow type';

    const memberType = memberTypes.find(({ id }) => id === userMemberTypeId);
    if (memberType) {
      name = memberType.name;
    }

    return (
      <Button full style={[styles.textInput, { width: '95%' }]} disabled>
        <Text style={{ color: '#ffffff', textAlign: 'left', fontFamily: 'BarlowCondensed-Bold' }}>{name}</Text>
      </Button>
    );
  }

  renderBirthday() {
    const { age } = this.state;
    let value = ' Birthdate ';
    const minDate = moment().subtract(5, 'years').toDate();

    if (
      age
      && age !== '0000-00-00 00:00:00'
    ) {
      value = moment(age).format('LL');
    }

    return (
      <DatePicker
        style={{
          width: '95%', backgroundColor: '#000000', borderColor: 'transparent', marginBottom: 10, marginTop: 10,
        }}
        placeholder={value}
        mode="date"
        format="YYYY-MM-DD"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        showIcon={false}
        customStyles={{
          placeholderText: {
            fontFamily: 'BarlowCondensed-Bold',
            color: '#ffffff',
            fontSize: 16,
          },
          dateInput: {
            borderWidth: 0,
          },
        }}
        maxDate={minDate}
        onDateChange={(datetime) => {
          this.setState({ age: datetime });
        }}
      />
    );
  }

  profileSettings() {
    return (
      <Modal isVisible={this.props.edit} backdropColor="#3c3c3c" backdropOpacity={0.95}>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
          <View style={styles.modalHeader}>
            <Button full transparent style={styles.close} onPress={() => this.cancelSettings()}>
              <Text style={{
                fontSize: 28, fontFamily: 'BarlowCondensed-Bold', width: '100%', color: '#ffffff', flex: 1,
              }}
              >
                SETTINGS
              </Text>
              <Icon style={styles.closeText} type="MaterialIcons" name="clear" />
            </Button>
          </View>

          <KeyboardAvoidingView
            behavior="padding"
            // behavior="position"
            style={{
              flex: 1,
              width: '100%',
              // paddingBottom: 50,
            }}
          >
            <ScrollView style={{ flex: 1, width: '100%' }}>
              <View style={{
                flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',
              }}
              >
                <TextInput
                  onChangeText={(firstName) => this.handleChange('firstName', firstName)}
                  style={styles.textInput}
                  autoCapitalize="none"
                  keyboardAppearance="dark"
                  placeholderTextColor="#ffffff"
                  placeholder="First Name"
                  value={this.state.firstName}
                />

                <TextInput
                  onChangeText={(lastName) => this.handleChange('lastName', lastName)}
                  style={styles.textInput}
                  autoCapitalize="none"
                  keyboardAppearance="dark"
                  placeholderTextColor="#ffffff"
                  placeholder="Last Name"
                  value={this.state.lastName}
                />

                <TextInput
                  onChangeText={(ballerTag) => this.handleChange('ballerTag', ballerTag)}
                  style={styles.textInput}
                  autoCapitalize="none"
                  keyboardAppearance="dark"
                  placeholderTextColor="#ffffff"
                  placeholder="Baller Tag"
                  value={this.state.ballerTag}
                />

                <TextInput
                  onChangeText={(jersey) => this.handleChange('jersey', jersey)}
                  style={styles.textInput}
                  autoCapitalize="none"
                  keyboardAppearance="dark"
                  placeholderTextColor="#ffffff"
                  keyboardType="number-pad"
                  placeholder="Jersey Number"
                  value={this.state.jersey}
                />

                <TextInput
                  onChangeText={(email) => this.handleChange('email', email)}
                  style={styles.textInput}
                  autoCapitalize="none"
                  keyboardAppearance="dark"
                  placeholderTextColor="#ffffff"
                  placeholder="Email Address"
                  value={this.state.email}
                />

                <TextInput
                  onChangeText={(city) => this.handleChange('city', city)}
                  style={[styles.textInput]}
                  autoCapitalize="none"
                  placeholderTextColor="#ffffff"
                  underlineColorAndroid="transparent"
                  keyboardAppearance="dark"
                  placeholder="City"
                  value={this.state.city}
                />
                <TextInput
                  onChangeText={(state) => this.handleChange('state', state)}
                  style={styles.textInput}
                  autoCapitalize="none"
                  keyboardAppearance="dark"
                  placeholderTextColor="#ffffff"
                  placeholder="State"
                  value={this.state.state}
                />

                <TextInput
                  onChangeText={(zipcode) => this.handleChange('zipcode', zipcode)}
                  style={styles.textInput}
                  autoCapitalize="none"
                  keyboardAppearance="dark"
                  placeholderTextColor="#ffffff"
                  placeholder="Zip Code"
                  value={this.state.zipcode}
                />

                <TextInput
                  onChangeText={(phone) => this.handleChange('phone', phone)}
                  style={[styles.textInput, { width: '90%' }]}
                  autoCapitalize="none"
                  keyboardAppearance="dark"
                  placeholderTextColor="#ffffff"
                  placeholder="Phone"
                  value={this.state.phone}
                />

                <TextInput
                  onChangeText={(password) => this.handleChange('password', password)}
                  secureTextEntry
                  style={styles.textInput}
                  autoCapitalize="none"
                  keyboardAppearance="dark"
                  placeholderTextColor="#ffffff"
                  placeholder="Password"
                />

                <TextInput
                  onChangeText={(confirmPassword) => this.handleChange('confirmPassword', confirmPassword)}
                  secureTextEntry
                  style={styles.textInput}
                  autoCapitalize="none"
                  keyboardAppearance="dark"
                  placeholderTextColor="#ffffff"
                  placeholder="Confirm Password"
                />

                {this.renderBirthday()}

                <Button full style={[styles.textInput, { width: '95%' }]} onPress={() => this.selectItem('highestLevelOfPlay')}>
                  <Text style={{ color: '#ffffff', textAlign: 'left', fontFamily: 'BarlowCondensed-Bold' }}>{this.state.highestLevelOfPlay ? this.state.highestLevelOfPlay : 'Highest Level of Play'}</Text>
                </Button>

                <Button full style={[styles.textInput, { width: '95%' }]} onPress={() => this.selectItem('positions')}>
                  <Text style={{ color: '#ffffff', textAlign: 'left', fontFamily: 'BarlowCondensed-Bold' }}>{this.state.position ? this.state.position : 'Ideal Position'}</Text>
                </Button>

                {this.renderMemberType()}

                {this.renderSkills()}
              </View>
            </ScrollView>

            {this.renderSubmitButtonIOS()}
          </KeyboardAvoidingView>

          {this.renderSubmitButtonAndroid()}

          {this.state.pickerDisplay !== 'none' && (
            <View style={{
              backgroundColor: 'white',
              justifyContent: 'space-between',
            }}>
              <Picker
                selectedValue={this.state.select}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 5,
                  display: this.state.pickerDisplay,
                  height: deviceUtils.isIOS ? undefined : 30,
                }}
                onValueChange={(value) => this.handleSelect(this.state.selectType, value)}
              >
                {this.showOptions()}
              </Picker>

              <Button full style={[styles.updateButton, { display: this.state.pickerDisplay }]} onPress={() => this.closeSelect()}>
                <Text style={{
                  color: '#ffffff', textAlign: 'center', fontSize: 22, width: '100%', fontFamily: 'BarlowCondensed-Bold',
                }}
                >
                  {' '}
                  Cancel
                  {' '}
                </Text>
              </Button>
            </View>
          )}

        </SafeAreaView>
      </Modal>
    );
  }

  renderSubmitButtonIOS() {
    const { isIOS } = deviceUtils;

    if (!isIOS) {
      return null;
    }

    return this.renderSubmitButton(isIOS);
  }

  renderSubmitButtonAndroid() {
    const { isIOS } = deviceUtils;

    if (isIOS) {
      return null;
    }

    return this.renderSubmitButton(isIOS);
  }

  renderSubmitButton(isIOS) {
    const { isKeyboardShown } = this.state;
    let marginBottom = undefined;

    if (isKeyboardShown && isIOS) {
      marginBottom = 20;
    }

    return (
      <Button
        full
        style={[
          styles.updateButton,
          {
            marginBottom,
          },
        ]}
        onPress={() => this.updateUser()}
      >
        <Text style={{
          color: '#ffffff',
          textAlign: 'center',
          fontSize: 22,
          width: '100%',
          fontFamily: 'BarlowCondensed-Bold',
        }}
        >
          {' '}
          SAVE
          {' '}
        </Text>
      </Button>
    );
  }

  render() {
    const { addEdit } = this.props;

    return (
      <Container style={styles.container} >

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

        <AuthNav
          navigation={this.props.navigation}
          drawer
          page="Profile"
          title="Profile"
          button="Settings"
          link="Settings"
          onPressButton={() => {
            addEdit(true);
          }}
        />

        {this.profileSettings()}

        <Modal isVisible={this.state.showPhotos} backdropColor="rgba(0,0,0,.6)" >
          <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
            <CameraRollPicker
              scrollRenderAheadDistance={500}
              initialListSize={1}
              removeClippedSubviews={false}
              groupTypes="SavedPhotos"
              maximum={1}
              selected={this.state.selected}
              assetType="Photos"
              imagesPerRow={2}
              containerWidth={335}
              backgroundColor="rgba(255,255,255,.8)"
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
          </SafeAreaView>
        </Modal>

        <Modal isVisible={this.state.showLoader} backdropColor="rgba(0,0,0,.6)" >
          <View style={styles.loadView}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </Modal>

        <Grid>
          <Row style={{ width: '100%' }} size={1}>
            <Col style={styles.profilePic}>
              <Row style={{ justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                <TouchableOpacity style={styles.profileImage}  onPress={ () => this.selectPhotos()}>
                  <Image style={{ width: 200, height: 200, resizeMode: 'contain' }} source={{ uri: this.state.profilePic }}/>
                </TouchableOpacity>
              </Row>
            </Col>

            <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View style={styles.info}>
                <Row style={styles.profile}>
                  <Text style={styles.profileText}>
                    {this.state.firstName}
                    {' '}
                    {this.state.lastName}
                  </Text>
                </Row>
                <Row style={styles.profile}>
                  <Text style={styles.profileText}>
                    {this.state.city}
                    ,
                    {' '}
                    {this.state.state}
                  </Text>
                </Row>
                <Row style={styles.profile}>
                  <Text style={styles.profileText}>
                    Joined:
                    {' '}
                    <MomentReact style={styles.profileText} element={Text} format="MM/DD/YYYY">{this.state.date}</MomentReact>
                  </Text>
                </Row>
                <Row style={styles.profile}><Text style={styles.profileText}>{this.state.zipcode}</Text></Row>
              </View>
            </Col>
          </Row>
          <Row >
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View style={[styles.counter, { flexDirection: 'column' }]}>
                <Text style={[styles.counterStat, { fontSize: 22, flex: 1 }]}>
                  {this.state.games}
                  {' '}
                </Text>
                <Text style={styles.statsText}> Games </Text>
              </View>
              <View style={[styles.counter, { flexDirection: 'column' }]}>
                <Text style={[styles.counterStat, { fontSize: 22, flex: 1 }]}>
                  {this.state.streak}
                  {' '}
                </Text>
                <Text style={styles.statsText}> Winning Streak </Text>
              </View>
              <View style={[styles.counter, { flexDirection: 'column' }]}>
                <Text style={[styles.counterStat, { fontSize: 22, flex: 1 }]}>
                  {' '}
                  {this.state.winPercentage}
                  %
                  {' '}
                </Text>
                <Text style={styles.statsText}> Win % </Text>
              </View>

            </View>
          </Row>
          <Row style={{ flex: 1, flexDirection: 'column', position: 'relative' }} size={0.6}>
            <Image
              style={{
                position: 'absolute', bottom: 0, width: '100%', overflow: 'visible', resizeMode: 'cover',
              }}
              source={statsBackground}
            />
            <View style={{ flex: 0.6 }} />
            <View style={{ flexDirection: 'row', flex: 0.5 }}>
              <View style={styles.stats}>
                <Text style={[styles.statsText, { fontSize: 32, flex: 0.6 }]}>
                  {' '}
                  {this.state.games}
                  {' '}
                </Text>
                <Text style={styles.statsText}> Games </Text>
              </View>
              <View style={[styles.stats, { backgroundColor: '#52ce5e' }]}>
                <Text style={[styles.statsText, { fontSize: 32, flex: 0.6 }]}>
                  {' '}
                  {this.state.wins}
                  {' '}
                </Text>
                <Text style={styles.statsText}> Wins </Text>
              </View>
              <View style={[styles.stats, { backgroundColor: '#fd6464' }]}>
                <Text style={[styles.statsText, { fontSize: 32, flex: 0.6 }]}>
                  {' '}
                  {this.state.losses}
                  {' '}
                </Text>
                <Text style={[styles.statsText, { textAlign: 'left' }]}> Losses </Text>
              </View>
            </View>

          </Row>
        </Grid>
      </Container>
    );
  }
}

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  memberTypes: PropTypes.array.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  addEdit: (edit) => dispatch(addEdit(edit)),
  getList: (list) => dispatch(getList(list)),
  getRun: (runId, type) => dispatch(getRun(runId, type)),
  uploadFile: (update) => { dispatch(uploadFile(update)); },
  refreshUser: (user) => { dispatch(refreshUser(user)); },
  setUser: (user) => { dispatch(setUser(user)); },
});

const mapStateToProps = (state) => ({
  edit: state.auth.edit,
  userSquads: state.auth.user.squads,
  user: state.auth.user.profile,
  ballers: state.games.ballers,
  stats: state.auth.user.stats,
  memberTypes: authMemberTypesSelector()(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
