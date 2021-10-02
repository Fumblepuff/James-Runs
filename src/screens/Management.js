/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
import React, { Component } from 'react';
import { View, Image, TextInput, TouchableOpacity, CameraRoll, Alert, SafeAreaView, FlatList, PermissionsAndroid, Platform, KeyboardAvoidingView } from 'react-native';
import { Container, Icon, Text, Button } from 'native-base';
import { connect } from 'react-redux';
import { Col, Row, Grid } from 'react-native-easy-grid';
import AuthNav from '../components/AuthNav';
import BasicList from '../components/BasicList';
import Modal from 'react-native-modal';
import CameraRollPicker from 'react-native-camera-roll-picker';
import { addEdit, cacheData } from '../reducers/auth';
import { addToList, squadApi, displayView, resetGroups, getRun, getLocation, getLocationDetails } from '../reducers/games';
import { Storage } from 'aws-amplify';
import { Buffer } from 'buffer';
import RNFetchBlob from 'rn-fetch-blob';

import Geolocation from '@react-native-community/geolocation';

import ConfigUtils from 'src/utils/ConfigUtils';

const BALLER_FILTER = ['firstName', 'lastName', 'email'];
const COURT_FILTER = ['name', 'city', 'state', 'address'];

class Management extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: this.props.user,
      showPhotos: false,
      showLoader: false,
      baller: false,
      court: false,
      title: 'Management',
      header: '',
      admin: this.props.admin,
      searchBaller: '',
      searchCourts: '',
      miles: 0,
      locations: [],
      profilePic: 'https:\/\/s3.amazonaws.com\/awsjames-userfiles-mobilehub-258458471\/public\/james-full-logo.png',
      courtImage: 'https:\/\/s3.amazonaws.com\/awsjames-userfiles-mobilehub-258458471\/public\/james-court.jpg',
      photoUri: '',
      photoName: '',
      memberDate: '',
      ballerSearch: false,
      courtSearch: false,
      getBallers: 'getBallers',
      getCourts: 'getCourts',
      squadName: '',
      court: false,
      courtDetail: false,
      courtName: '',
      courtAddress: '',
      courtCity: '',
      courtState: '',
      courtZipcode: '',
      courtTags: [],
      runDates: [],
      runRecurring: false,
      runRecurringDay: '',
      squadBallers: [],
      completeModal: false,
      addEdit: false,
      addCourt: false,
      addRun: false,
      addBaller: false,
      dateTimePicker: false,
      setRunSchedule: this.props.scheduleList,
      page: 0,
    };
  }

  componentDidMount() {
    this.getLocation();
    if (this.props.cache) {
      this.toggleManagement(this.props.cache);
    } else {
      setTimeout(() => {
        this.props.addEdit(true);
      }, 500);
    }
  }

  getAllCourts() {
    const courts = {
      page: 0,
    };

    this.props.getRun(courts,'getCourts')
      .then((result) => {
        this.setState({ courts: '' }, ()=>{
          this.setState({ courts: result });
        });
      })
      .catch((err) => alert(err));
  }

  getMoreCourts() {
    // const courts = {
    //     page: this.state.courts.length,
    // };

    const courts = {
      search: this.state.courtSearch ? this.state.courtSearch: '',
      page: this.state.courts.length,
    };

    this.props.getRun(courts, this.state.getCourts)
      .then((result) => {
        if (result) {
          const update = [ ...this.state.courts, ...result ];
          this.setState({ courts: update });
        }
      })
      .catch((err) => alert(err));
  }

  getAllBallers() {
    const ballers = {
      page: 0,
    };

    this.props.getRun(ballers,'getBallers')
      .then((result) => {
        this.setState({ ballers: '' }, ()=>{
          this.setState({ ballers: result });
        });
      })
      .catch((err) => alert(err));
  }

  getMoreBallers() {
    this.setState({ page: this.state.page + 10 }, ()=>{
      this.setState({ more: true });
      const ballers = {
        search: this.state.ballerSearch ? this.state.ballerSearch: '',
        page: this.state.page,
      };

      this.props.getRun(ballers, this.state.getBallers)
        .then((result) => {
          // console.log(result);
          if (result) {
            const update = [ ...this.state.ballers, ...result ];
            this.setState({ ballers: update });
          }
        })
        .catch((err) => alert(err));
    });
  }

  getLocation() {
    if (Platform.OS === 'android') {
      this.requestLocationPermission();
    } else {
      this.userLocation();
    }
  }

  toggleManagement(type) {
    switch (type) {
      case 'ballers':
        this.getAllBallers();
        this.setState({
          baller: true,
          court: false,
          title: 'Baller Management',
          header: 'BALLERS',
        });

        setTimeout(() => {
          this.props.addEdit(false);
          this.props.cacheData('ballers');
        }, 800);

        break;
      case 'courts':
        this.getAllCourts();
        this.setState({
          baller: false,
          court: true,
          title: 'Court Management',
          header: 'COURTS',
        });

        setTimeout(() => {
          this.props.addEdit(false);
          this.props.cacheData('courts');
        }, 800);

        break;
      default:
        this.setState({
          baller: true,
          court: false,
          title: 'Baller Management',
          header: 'BALLERS',
        });
        this.getAllBallers();
        break;
    }
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
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          userLocation: position.coords,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  removeLoader(result) {
    this.setState({ showLoader: false });
    setTimeout(() => {
      this.setState({ completeModal: true });
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

  selectPhotos() {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos',
    })
      .then((r) => {
        this.setState({
          photos: r.edges,
          addCourt: false,
        }, ()=>{
          setTimeout(() => {
            this.setState({ showPhotos: true });
          }, 500);
        });
      })
      .catch((err) => {
        alert(err);
      });
  }

  setImage() {
    this.uploadPhoto();

    this.setState({ showPhotos: false }, ()=>{
      setTimeout(() => {
        this.setState({ addCourt: true });
      }, 800);
    });

    this.setState({
      courtImage: this.state.photoLocal,
      imageType: 'aws',
      courtDetail: false,
      court: true,
    });
  }

  async uploadPhoto() {
    this.readFile(this.state.photoLocal).then((buffer) => {
      Storage.put(this.state.awsPhotoName, buffer, {
        contentType: 'image/png',
      }).then(result => {

      })
        .catch((err) => alert(err));
    }).catch((e) => {
      console.log(e);
    });
  }

  readFile(filePath) {
    return RNFetchBlob.fs.readFile(filePath, 'base64').then((data) => new Buffer(data, 'base64'));
  }

  getImage(images, current) {
    const now = Date.now();

    this.setState({
      photoLocal: current.uri,
      awsPhotoName: `${this.state.courtName.replace(/\s/g, '')}-${this.state.courtCity}.png`,
    });
  }

  setGoogleImage(reference) {
    const { googleApi } = ConfigUtils.get();

    const image = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${reference}&key=${googleApi}`;

    this.setState({
      courtImage: image,
      imageType: 'google',
      imageReference: reference,
      courtDetail: false,
      court: true,

    }, () => {
      setTimeout(() => {
        this.setState({ addCourt: true });
      }, 500);
    });
  }

  courtImage() {
    if (this.props.imageType == 'google') {
      this.setState({ courtImage: this.props.imageName });
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

  openModal(modal) {
    console.log(modal);
    this.setState({ [modal]: true });
  }

  SelectValue(formField, value) {
    this.setState({ [formField]: value } );
  }

  handleChange(formField, value) {
    this.setState({ [formField]: value });
  }

  filterDistance(distance) {
    this.setState({ miles: distance });
  }

  searchList(list) {
    if (this.state.baller) {
      this.searchBallers(list);
    }else {
      this.searchCourts(list);
    }
  }

  searchBallers(search) {
    const ballers = {
      search: search,
      page: 0,
    };

    this.props.getRun(ballers,'searchBallers')
      .then((result) => {
        if (result) {
          this.setState({
            ballers: result,
            ballerSearch: search,
            getBallers: 'searchBallers',
            page: 0,
          });
        } else {
          this.getAllBallers();
          this.setState({
            ballerSearch: false,
          });
        }
      })
      .catch((err) => alert(err));
  }

  searchCourts(search) {
    const courts = {
      search: search,
      page: 0,
    };

    this.props.getRun(courts,'searchCourts')
      .then((result) => {
        if (result) {
          this.setState({
            courts: result,
            courtSearch: search,
            getCourts: 'searchCourts',
            page: 0,
          });
        }
      })
      .catch((err) => alert(err));
  }

  listBallers() {
    if (this.state.ballers) {
      const ballersArr = Object.values(this.state.ballers);
      return (
        <View style={{ width: '100%', flex: 1 }}>
          <FlatList
            data={ballersArr}
            renderItem={({ item }) => <BasicList image={item.imageName} header={`${item.firstName} ${item.lastName}`} page="EditBaller" subText={`${item.city} ${item.state}`} data={({ data: item })} />}
            keyExtractor={(item) => item.id}
            onEndReached={() => this.getMoreBallers()}
            initialNumToRender={5}
            onEndReachedThreshold={0.5}
          />
        </View>
      );
    }
  }

  listCourts() {
    if (this.state.courts && this.state.userLocation) {
      const courtsArr = Object.values(this.state.courts);

      return (
        <View style={{ width: '100%', flex: 1 }}>
          <FlatList
            data={courtsArr}
            renderItem={({ item }) => <BasicList {...this.props} image={item.imageName} imageType={item.imageType} header={item.name} page="EditCourt" subText="" data={({ data: item })} />}
            keyExtractor={(item) => item.id}
            onEndReached={() => this.getMoreCourts()}
            initialNumToRender={10}
            maxToRenderPerBatch={2}
            onEndReachedThreshold={0}
          />
        </View>
      );
    }

    return null;
  }

  addCourt() {
    const CourtObj = {
      adminId: this.props.user.id,
      name: this.state.courtName,
      address: this.state.courtAddress,
      longitude: this.state.courtLogitude,
      latitude: this.state.courtLatitude,
      imageType: this.state.imageType,
      imageName: this.state.imageType == 'aws' ? this.state.awsPhotoName: this.state.courtImage,
      placeId: this.state.placeID,
      active: 1,
    };

    const data = {
      court: CourtObj,
      schedule: this.props.scheduleList,
    };

    this.props.getRun(data,'addNewCourt')
      .then(result => {
        this.getAllCourts();
        setTimeout(() => {
          this.setState({ addCourt: false });
        }, 500);
      })
      .catch((err) => alert(err));
  }

  newUser() {
    const register = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
      city: this.state.city,
      state: this.state.state,
      zipcode: this.state.zipcode,
      phone: this.state.phone,
      gender: this.state.gender,
      id: 0,
    };

    this.props.getRun(register,'registerUser')
      .then((result) => {
        if (result == 'email') {
          Alert.alert(
            'Email Already Registered',
            '',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: true }
          );
        } else {
          register.id = result;
          const data = {
            data: register,
          };
          this.closeModal('addBaller');
          this.props.displayView(data);

          setTimeout(() => {
            this.props.navigation.navigate('EditBaller');
          }, 800);
        }
      })
      .catch((err) => alert(err));
  }

  reloadBallers() {

  }

  listCourtImages() {
    if (this.state.courtPhotos && this.state.courtPhotos.length > 0) {
      const { googleApi } = ConfigUtils.get();
      const ballersArr = Object.values(this.state.courtPhotos);

      return (
        <View>
          <FlatList
            data={ballersArr}
            horizontal={false}
            numColumns={3}
            renderItem={({ item }) => (
              <View style={{ width: '33%', height: 'auto' }}>
                <TouchableOpacity onPress={() => this.setGoogleImage(item.photo_reference)}>
                  <Image
                    resizeMode="cover"
                    style={styles.profileImage}
                    source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photo_reference}&key=${googleApi}` }}
                  />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.photo_reference}
          />
        </View>
      );
    }

    return (
      <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
        <Text style={[styles.textFull, { textAlign: 'center', backgroundColor: 'transparent' }]}>No Available Images</Text>
        <Text style={[styles.textFull, { textAlign: 'center', backgroundColor: 'transparent' }]}>Upload an Image Below From Your Device for this Court</Text>
      </View>
    );
  }

  locationList() {
    if (this.state.locations) {
      const ListArr = Object.values(this.state.locations);
      return (
        <View>
          <FlatList
            data={ListArr}
            renderItem={({ item }) => <Button full transparent style={{ backgroundColor: '#ffffff', margin: 2 }} onPress={() => this.selectLocation(item.place_id, item.terms)}>
              <Text style={styles.listText}>{item.description}</Text>
            </Button>}
            keyExtractor={(item) => item.place_id}
          />
        </View>
      );
    }
  }

  courtSelectImages() {
    if (this.state.courtDetail) {
      return (
        <View>
          <View>
            <Text style={[styles.textFull, { textAlign: 'center' }]}>SELECT A COURT IMAGE</Text>
          </View>
          <View style={{ width: '100%', height: 200 }}>
            {this.listCourtImages()}
          </View>
          <View>
            <Text style={[styles.textFull, { textAlign: 'center' }]}>OR</Text>
            <Button full transparent style={{ backgroundColor: '#ffffff', margin: 2 }} onPress={() => this.selectPhotos()}>
              <Text style={styles.listText}>UPLOAD A PHOTO</Text>
            </Button>
          </View>
        </View>
      );
    }

    if (this.state.court) {
      return (
        <View style={{ width: '80%', height: 200 }}>
          <Grid>
            <Row>
              <Col>
                <Image resizeMode="cover" style={styles.profileImage} source={{ uri: this.state.courtImage }} />
              </Col>
              <Col>
                <Text style={[styles.courtText, { textAlign: 'left' }]}>{this.state.courtName}</Text>
              </Col>
            </Row>
          </Grid>
        </View>
      );
    }
  }

  selectLocation(id, name) {
    this.locationDetails(id, name);
  }

  locationDetails(id, name) {
    this.props.getLocationDetails(id)
      .then((result) => {
        const location = result.result;

        this.setState({
          placeID: id,
          courtDetail: true,
          courtName: name[0].value,
          courtAddress: location.formatted_address,
          courtCity: name[2].value,
          courtState: name[3].value,
          courtLogitude: location.geometry.location.lng,
          courtLatitude: location.geometry.location.lat,
          courtPhotos: location.photos,
          locations: false,
        });
      })
      .catch(err => alert('Please Be Sure You are entering and selecting a Court Location name. Example, LA Fitness Roswell Rd Atlanta'));
  }

  checkLocation(formField, value) {
    const location = [];
    this.props.getLocation(value)
      .then((result) => {
        const predictions = result.predictions;
        console.log(predictions);
        this.setState({
          locations: predictions,
        });
      })
      .catch((err) => alert(err));
  }

  addPhotoModal() {
    return (
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
            <Button full style={{ flex: 1, backgroundColor: '#52ce5e' }} onPress={() => this.setImage()}>
              <Text style={{ color: '#ffffff', fontSize: 18 }}>UPLOAD PHOTO</Text>
            </Button>
            <Button full style={{ flex: 1, backgroundColor: '#fd6464' }} onPress={() => this.cancelPhotos()}>
              <Text style={{ color: '#ffffff', fontSize: 18 }}>CANCEL UPLOAD</Text>
            </Button>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  manageModal() {
    const court = require('../assets/courtManagement.png');
    const baller = require('../assets/ballerManagement.png');

    return (
      <Modal style={{ width: '100%', flexDirection: 'column', margin: 0, padding: 0 }} isVisible={this.props.edit} backdropOpacity={0.95} backdropColor="#3b3b3b"  >
        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
          <Grid>
            <Row style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                <Image style={{ flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: 1 }} source={baller} />
              </View>
              <Button full transparent style={styles.manageBtn} onPress={() => this.toggleManagement('ballers')}>
                <View style={{ height: 1, width: '70%', backgroundColor: '#ffffff', marginTop: 5, marginBottom: 5 }} />
                <Text style={[styles.manageBtnText, { fontSize: 24 }]}>BALLER MANAGEMENT</Text>
              </Button>
            </Row>
            <Row style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                <Image style={{ flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: 1 }} source={court} />
              </View>
              <Button full transparent style={styles.manageBtn} onPress={() => this.toggleManagement('courts')}>
                <View style={{ height: 1, width: '70%', backgroundColor: '#ffffff', marginTop: 5, marginBottom: 5 }} />
                <Text style={[styles.manageBtnText, { fontSize: 24 }]}>COURT MANAGEMENT</Text>
              </Button>
            </Row>
          </Grid>
        </SafeAreaView>
      </Modal>
    );
  }

  addCourtModal() {
    return (
      <Modal style={{ width: '100%', flexDirection: 'column', margin: 0, padding: 0 }} isVisible={this.state.addCourt} backdropOpacity={0.95} backdropColor="#3b3b3b"  >
        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
          <View style={[styles.modalHeader, { flex: 0.1 }]}>
            <Button full transparent style={styles.close} onPress={() => this.closeModal('addCourt')}><Icon style={styles.closeText} type="MaterialIcons" name="clear" /></Button>
          </View>
          <KeyboardAvoidingView behavior="padding" style={{ width: '100%', flex: 1, flexDirection: 'row', flexWrap: 'wrap', margin: 'auto', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '80%', flex: 1, flexDirection: 'row', flexWrap: 'wrap', margin: 'auto', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: '85%', margin: 'auto' }}>
                <Text style={styles.titleText}>SEARCH LOCATIONS</Text>
              </View>
              <TextInput
                onChangeText={(courtName) => this.checkLocation('courtName', courtName)}
                style={[styles.textFull, { width: '85%' }]}
                autoCapitalize="none"
                placeholderTextColor="#ffffff"
                underlineColorAndroid="transparent"
                keyboardAppearance="dark"
                autoCorrect={false}
                placeholder="Example: LA Fitness Roswell Rd Atlanta"
              />

              <View style={{ width: '85%', height: 1, position: 'relative', zIndex: 9, elevation: 1 }}>
                <View style={{ width: '100%', position: 'absolute', top: 0, elevation: 1 }}>
                  {this.locationList()}
                </View>
              </View>
              {this.courtSelectImages()}

            </View>
          </KeyboardAvoidingView>
          <Button full style={styles.addBtn} onPress={() => this.addCourt()}>
            <Text style={{ color: '#ffffff',textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium' }}> ADD COURT </Text>
          </Button>
        </SafeAreaView>
      </Modal>
    );
  }

  addBallerModal() {
    return (
      <Modal isVisible={this.state.addBaller} backdropColor="#3c3c3c" backdropOpacity={0.95}>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
          <View style={styles.modalHeader}>
            <Button full transparent style={styles.close} onPress={() => this.closeModal('addBaller')}><Text style={{ fontSize: 28, fontFamily: 'BarlowCondensed-Bold', width: '100%', color: '#ffffff', flex: 1 }}>New Baller</Text><Icon style={styles.closeText} type="MaterialIcons" name="clear" /></Button>
          </View>
          <KeyboardAvoidingView behavior="padding" style={{ width: '100%', flex: 0.75, margin: 'auto', justifyContent: 'center', alignItems: 'center' }}>
            <Grid style={{ width: '100%' }}>
              <Row>
                <Col>
                  <Text style={styles.textLabel}>First Name</Text>
                  <TextInput
                    onChangeText={(firstName) => this.handleChange('firstName', firstName)}
                    style={styles.textInput}
                    autoCapitalize="none"
                    keyboardAppearance="dark"
                    placeholderTextColor="#ffffff"
                    placeholder=""
                  />
                </Col>
                <Col>
                  <Text style={styles.textLabel}>Last Name</Text>
                  <TextInput
                    onChangeText={(lastName) => this.handleChange('lastName', lastName)}
                    style={styles.textInput}
                    autoCapitalize="none"
                    keyboardAppearance="dark"
                    placeholderTextColor="#ffffff"
                    placeholder=""
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Text style={styles.textLabel}>Email Address</Text>
                  <TextInput
                    onChangeText={(email) => this.handleChange('email', email)}
                    style={styles.textInput}
                    autoCapitalize="none"
                    keyboardAppearance="dark"
                    placeholderTextColor="#ffffff"
                    placeholder=""
                  />
                </Col>
                <Col>
                  <Text style={styles.textLabel}>Phone Number</Text>
                  <TextInput
                    onChangeText={(phone) => this.handleChange('phone', phone)}
                    style={styles.textInput}
                    autoCapitalize="none"
                    keyboardAppearance="dark"
                    placeholderTextColor="#ffffff"
                    placeholder=""
                  />
                </Col>
              </Row>
              <Row style={{ flexDirection: 'column' }}>
                <Col>
                  <Text style={styles.textLabel}>City</Text>
                  <TextInput
                    onChangeText={(city) => this.handleChange('city', city)}
                    style={[styles.textInput]}
                    autoCapitalize="none"
                    placeholderTextColor="#ffffff"
                    underlineColorAndroid="transparent"
                    keyboardAppearance="dark"
                    placeholder=""
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Text style={styles.textLabel}>State</Text>
                  <TextInput
                    onChangeText={(state) => this.handleChange('state', state)}
                    style={styles.textInput}
                    autoCapitalize="none"
                    keyboardAppearance="dark"
                    placeholderTextColor="#ffffff"
                    placeholder=""
                  />
                </Col>
                <Col>
                  <Text style={styles.textLabel}>Zipcode</Text>
                  <TextInput
                    onChangeText={(zipcode) => this.handleChange('zipcode', zipcode)}
                    style={styles.textInput}
                    autoCapitalize="none"
                    keyboardAppearance="dark"
                    placeholderTextColor="#ffffff"
                    placeholder=""
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Text style={styles.textLabel}>Password</Text>
                  <TextInput
                    onChangeText={(password) => this.handleChange('password', password)}
                    secureTextEntry
                    style={styles.textInput}
                    autoCapitalize="none"
                    keyboardAppearance="dark"
                    placeholderTextColor="#ffffff"
                    placeholder="Password"
                  />
                </Col>
                <Col>
                  <Text style={styles.textLabel}>Confirm Password</Text>
                  <TextInput
                    onChangeText={(confirmPassword) => this.handleChange('confirmPassword', confirmPassword)}
                    secureTextEntry
                    style={styles.textInput}
                    autoCapitalize="none"
                    keyboardAppearance="dark"
                    placeholderTextColor="#ffffff"
                    placeholder="Confirm Password"
                  />
                </Col>
              </Row>
              <Row>
                <Button full style={styles.updateButton} onPress={() => this.newUser()}>
                  <Text style={{ color: '#ffffff',textAlign: 'center', fontSize: 22, width: '100%', fontFamily: 'BarlowCondensed-Bold' }}> SAVE </Text>
                </Button>
              </Row>
            </Grid>

          </KeyboardAvoidingView>

        </SafeAreaView>
      </Modal>
    );
  }

  toggleLists() {
    if (this.state.baller) {
      return this.listBallers();
    } else if (this.state.court) {
      return this.listCourts();
    } else {
      return this.listBallers();
    }
  }

  toggleAddButton() {
    if (this.state.baller) {
      return (
        <Button full style={styles.addBtn} onPress={() => this.openModal('addBaller')}>
          <Text style={{ color: '#ffffff',textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium' }}> ADD NEW BALLER </Text>
        </Button>
      );
    } else if (this.state.court) {
      return (
        <Button full style={styles.addBtn} onPress={() => this.openModal('addCourt')}>
          <Text style={{ color: '#ffffff',textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium' }}> ADD NEW COURT </Text>
        </Button>
      );
    } else {
      return (
        <Button full style={styles.addBtn} onPress={() => this.openModal('addBaller')}>
          <Text style={{ color: '#ffffff',textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium' }}> ADD NEW BALLER </Text>
        </Button>
      );
    }
  }

  render() {
    const background = require('../assets/Background.png');
    const poster = require('../assets/ballerManagement.png');

    return (
      <Container style={styles.container}>

        <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <Image style={{ flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: .5 }} source={background} />
        </View>
        {this.manageModal()}
        {this.addBallerModal()}
        {this.addPhotoModal()}
        {this.addCourtModal()}
        <Grid>
          <Row style={{ position: 'relative', height: 170, backgroundColor: '#000000' }}>
            <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
              <Image style={{ flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: 0.4 }} source={poster} />
            </View>

            <AuthNav navigation={this.props.navigation} drawer={true} page="" button="Manage" link="Settings" />

            <View style={styles.runLocation}>
              <Text style={[styles.runLocationText, { fontSize: 24 }]}>{this.state.title}</Text>
              <View style={{ height: 1, width: '70%', backgroundColor: '#ffffff', marginTop: 5, marginBottom: 5 }} />
              <Text style={[styles.runLocationText, { fontSize: 18 }]}>{this.state.address}</Text>
            </View>
          </Row>
          <Row style={{ flexDirection: 'row', height: 55, backgroundColor: '#478cba', alignItems: 'center', marginBottom: 2 }}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.text, { padding: 10 }]}>{this.state.header}</Text>
            </View>
            <View style={{ flex: 1, flexWrap: 'wrap' }}>
              {this.toggleAddButton()}
            </View>
          </Row>
          <Row style={{ flexDirection: 'row', width: '100%', height: 50 }}>

            <TextInput
              onChangeText={(search) => this.searchList(search)}
              style={styles.textInput}
              autoCapitalize="none"
              placeholderTextColor="#ffffff"
              underlineColorAndroid="transparent"
              keyboardAppearance="dark"
              placeholder={this.state.baller ? 'SEARCH BALLERS': 'SEARCH COURTS'}
            />

          </Row>
          <Row>
            <View style={{ width: '100%',flex: 1, flexDirection: 'column', flexWrap: 'wrap' }}>
              {this.toggleLists()}
            </View>
          </Row>
        </Grid>

      </Container>

    );
  }
}

const mapStateToProps = (state) => {
  return {
    cache: state.auth.cache,
    edit: state.auth.edit,
    user: state.auth.user.profile,
    data: state.games.view.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addEdit: (edit) => dispatch(addEdit(edit)),
    cacheData: (cache) => dispatch(cacheData(cache)),
    getLocation: (location) => dispatch(getLocation(location)),
    getLocationDetails: (locationID) => dispatch(getLocationDetails(locationID)),
    getRun: (runId, type) => dispatch(getRun(runId, type)),
    displayView: (view) => dispatch(displayView(view)),
    resetGroups: () => dispatch(resetGroups()),
    addToList: (list) => dispatch(addToList(list)),
    squadApi: (userId,type,data) => dispatch(squadApi(userId,type,data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Management);

const styles = {
  modalHeader: {
    backgroundColor: '#000000',
    top: 0,
    width: '100%',
    height: 50,
    marginBottom: 10,
  },
  manageBtn: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.6)',
    flexDirection: 'column',
  },
  manageBtnText: {
    color: '#ffffff',
    fontFamily: 'BarlowCondensed-Bold',
    flexWrap: 'wrap',
    fontSize: 18,
  },
  close: {
    height: 50,
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
  textFull: {
    backgroundColor: '#000000',
    color: '#ffffff',
    fontFamily: 'BarlowCondensed-Light',
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
  titleText: {
    color: '#ffffff',
    fontFamily: 'BarlowCondensed-Medium',
    fontSize: 20,
    lineHeight: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    padding: 3,
    textAlign: 'center',
  },
  textLabel: {
    color: '#ffffff',
    fontFamily: 'BarlowCondensed-Medium',
    fontSize: 14,
    padding: 5,
    textAlign: 'left',
    flex: 0.5,
    elevation: 0,
  },
  textInput: {
    color: '#ffffff',
    backgroundColor: '#000000',
    fontFamily: 'BarlowCondensed-Bold',
    fontSize: 16,
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: 'left',
    flex: 1,
    height: '100%',
    elevation: 0,
  },
  gameDate: {
    fontFamily: 'BarlowCondensed-Light',
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
  },
  gameScore: {
    fontFamily: 'BarlowCondensed-Bold',
    color: '#ffffff',
    fontSize: 26,
    textAlign: 'center',
  },
  gameTitle: {
    fontFamily: 'BarlowCondensed-Bold',
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
  },
  container: {
    backgroundColor: '#000000',
  },
  boardItem: {
    backgroundColor: '#000000',
    marginBottom: 10,
    padding: 10,
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 5,
  },
  message: {
    backgroundColor: '#000000',
    fontFamily: 'BarlowCondensed-Bold',
    color: '#ffffff',
    padding: 5,
    fontSize: 14,
    textAlign: 'center',
    width: '100%',
  },
  filterBtn: {
    flex: 1,
  },
  runLocation: {
    position: 'absolute',
    width: '100%',
    left: 10,
    bottom: 10,
  },
  runLocationText: {
    color: '#ffffff',
    fontFamily: 'BarlowCondensed-Light',
    fontSize: 18,
  },
  startBtn: {
    width: '100%',
    height: '100%',
    backgroundColor: '#044571',
    flexDirection: 'row',
  },
  startBtnText: {
    flex: 1,
    fontFamily: 'BarlowCondensed-Bold',
    fontSize: 15,
    color: '#ffffff',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  text: {
    fontFamily: 'BarlowCondensed-Light',
    fontSize: 18,
    color: '#ffffff',
    lineHeight: 24,
  },
};
