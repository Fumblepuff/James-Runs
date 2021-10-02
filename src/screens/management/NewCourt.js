/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  View,
  Image,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import CameraRollPicker from 'react-native-camera-roll-picker';
import { Storage } from 'aws-amplify';
import {
  Container,
  Text,
  Button,
} from 'native-base';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import RNFetchBlob from 'rn-fetch-blob';

import ConfigUtils from 'src/utils/ConfigUtils';
import generalUtils from 'src/utils/generalUtils';

import {
  addToList,
  displayView,
  resetGroups,
  getRun,
  getLocation,
  getLocationDetails,
  gamesNewEventAddCourt,
} from 'src/reducers/games';

import BasicNav from 'src/components/BasicNav';

import {
  routeNames,
} from 'src/navigation';

import mainStyle from 'src/styles/Style';
import formStyle from 'src/styles/Form';

import background from 'src/assets/managementBackground.png';

const styles = mainStyle;

class NewCourt extends Component {
  constructor(props) {
    super(props);

    this.state = {
      placeID: null,
      showPhotos: false,
      loadingModal: false,
      courtDetail: false,
      courtDetailsData: {},
      awsPhotoName: null,
      photoLocal: null,
    };
  }

  handleChange(formField, value) {
    this.setState({ [formField]: value });
  }

  getImage(_images, current) {
    const { courtDetail, courtName, courtCity } = this.state;

    if (!courtDetail) {
      return;
    }

    this.setState({
      photoLocal: current.uri,
      awsPhotoName: `${courtName.replace(/\s/g, '')}-${courtCity}.png`,
    });
  }

  setGoogleImage(reference) {
    const { googleApi } = ConfigUtils.get();
    const image = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${reference}&key=${googleApi}`;

    this.setState({
      courtImage: image,
      imageType: 'google',
      courtDetail: false,
      court: true,
    }, () => {
      // setTimeout(() => {
      //   this.setState({ addCourt: true });
      // }, 500);
    });
  }

  setImage() {
    const { photoLocal } = this.state;
    this.uploadPhoto();

    this.setState({ showPhotos: false }, () => {
      // setTimeout(() => {
      //   this.setState({ addCourt: true });
      // }, 800);
    });

    this.setState({
      courtImage: photoLocal,
      imageType: 'aws',
      courtDetail: false,
      court: true,
    });
  }

  selectPhotos() {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos',
    })
      .then((_r) => {
        // this.setState({
        //   photos: r.edges,
        //   addCourt: false,
        // }, () => {
        setTimeout(() => {
          this.setState({ showPhotos: true });
        }, 500);
        // });
      })
      .catch((err) => {
        alert(err);
      });
  }

  cancelPhotos() {
    this.setState({ showPhotos: false });
  }

  async uploadPhoto() {
    const { photoLocal, awsPhotoName } = this.state;

    if (!photoLocal || !awsPhotoName) {
      alert('no photos');

      return;
    }

    this.readFile(photoLocal).then((buffer) => {
      Storage.put(awsPhotoName, buffer, {
        contentType: 'image/png',
      }).then((_result) => {

      })
        .catch((err) => alert(err));
    }).catch((_e) => {
    });
  }

  readFile(filePath) {
    return RNFetchBlob.fs.readFile(filePath, 'base64').then((data) => new Buffer(data, 'base64'));
  }

  courtImage() {
    if (this.props.imageType == 'google') {
      this.setState({ courtImage: this.props.imageName });
    } else{
      Storage.get(this.props.imageName)
        .then((result) => {
          this.setState({ courtImage: result });
        })
        .catch((err) => alert(err));
    }
  }

  courtSelectImages() {
    if (this.state.courtDetail) {
      return (
        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <View>
            <Text style={[styles.textFull, { textAlign: 'center' }]}>SELECT A COURT IMAGE</Text>
          </View>
          <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            {this.listCourtImages()}
          </View>
          <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Button transparent style={{ backgroundColor: '#ffffff', width: '80%', borderRadius: 10, height: 50, margin: 10 }} onPress={() => this.selectPhotos()}>
              <Text style={[styles.listText, { textAlign: 'center' }]}>SELECT PHOTO FROM LIBRARY</Text>
            </Button>
          </View>
        </View>
      );
    }

    if (this.state.court) {
      return (
        <View style={styles.accountHeader}>
          <View style={[styles.profilePic, { width: 120 }]}>
            <TouchableOpacity style={styles.profileImage} onPress={ () => this.selectPhotos()}>
              <Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }} source={{ uri: this.state.courtImage }}/>
            </TouchableOpacity>
          </View>
          <View style={{ margin: 5, flex: 1 }}>
            <Text style={[styles.profileText, { fontFamily: 'BarlowCondensed-Bold' }]}>{this.state.courtName}</Text>
            <Text style={styles.profileText}>{this.state.courtAddress}</Text>
          </View>
        </View>
      );
    }
  }

  listCourtImages() {
    if (this.state.courtPhotos && this.state.courtPhotos.length > 0) {
      const { googleApi } = ConfigUtils.get();
      const ballersArr = Object.values(this.state.courtPhotos);

      return (
        <FlatList
          data={ballersArr}
          horizontal={false}
          numColumns={3}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity onPress={() => this.setGoogleImage(item.photo_reference)}>
                <Image
                  resizeMode="cover"
                  style={styles.courtImage}
                  source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photo_reference}&key=${googleApi}` }}
                />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.photo_reference}
        />
      );
    }

    return (
      <View style={{ alignContent: 'center', justifyContent: 'center' }}>
        <Text style={[styles.textFull, { textAlign: 'center', backgroundColor: 'transparent' }]}>No Available Images</Text>
        <Text style={[styles.textFull, { textAlign: 'center', backgroundColor: 'transparent' }]}>Upload an Image Below From Your Device for this Court</Text>
      </View>
    );
  }

  locationList() {
    const { locations } = this.state;

    if (locations) {
      const ListArr = Object.values(locations);

      return (
        <View>
          <FlatList
            data={ListArr}
            renderItem={({ item }) => (
              <Button
                full
                transparent
                style={{ backgroundColor: '#ffffff' }}
                onPress={() => {
                  this.selectLocation(item.place_id, item.terms);
                }}
              >
                <Text style={styles.listText}>{item.description}</Text>
              </Button>
            )}
            keyExtractor={(item) => item.place_id}
          />
        </View>
      );
    }

    return null;
  }

  selectLocation(id, name) {
    this.locationDetails(id, name);
  }

  locationDetails(id, name) {
    const { getLocationDetailsConnect } = this.props;

    getLocationDetailsConnect(id)
      .then((result) => {
        const location = result.result;
        const courtDetailsData = generalUtils.getAddressFromGoogleApi(result);

        this.setState({
          placeID: id,
          courtDetail: true,
          courtDetailsData,
          courtName: name[0].value,
          courtAddress: location.formatted_address,
          courtCity: name[2].value,
          courtPhotos: location.photos,
          locations: false,
        });
      })
      .catch((_err) => alert('Please Be Sure You are entering and selecting a Court Location name. Example, LA Fitness Roswell Rd Atlanta'));
  }

  checkLocation(formField, value) {
    const location = [];
    this.props.getLocation(value)
      .then((result) => {
        const predictions = result.predictions;
        this.setState({
          locations: predictions,
        });
      })
      .catch((err) => alert(err));
  }

  addCourt() {
    const {
      user,
      scheduleList,
      getRun,
      displayView,
      navigation,
      isAdmin,
      gamesNewEventAddCourtConnect,
    } = this.props;
    const {
      courtName,
      courtImage,
      courtDetailsData,
      placeID,
      awsPhotoName,
      imageType,
    } = this.state;

    const {
      address,
      city,
      state,
      zipcode,
      longitude,
      latitude,
    } = courtDetailsData;

    const CourtObj = {
      adminId: user.id,
      name: courtName,
      address,
      longitude,
      latitude,
      city,
      state,
      zipcode,
      imageType,
      imageName: imageType === 'aws' ? awsPhotoName : courtImage,
      placeId: placeID,
      active: 1,
    };

    const data = {
      court: CourtObj,
      schedule: scheduleList,
    };

    getRun(data, 'addNewCourt')
      .then((result) => {
        const court = { id: result };
        getRun(court, 'getCourt').then((courtData) => {
          const view = {
            data: courtData,
          };

          displayView(view);
          gamesNewEventAddCourtConnect(courtData);

          setTimeout(() => {
            if (isAdmin) {
              navigation.navigate(routeNames.EDIT_COURT);
            } else {
              navigation.navigate(routeNames.ADD_GAME);
            }
          }, 500);
        }).catch((err) => alert(err));
      })
      .catch((err) => alert(err));
  }

  errorStatus() {
    if (this.state.error) {
      return (
        <View style={{ borderRadius: 3, backgroundColor: '#000000', padding: 10 }}>
          <Text style={{ borderWidth: 0, alignItems: 'center', textAlign: 'center', color: '#FFFFFF', fontFamily: 'BarlowCondensed-Bold' }}>{this.state.message}</Text>
        </View>
      );
    }
  }

  loadingModal() {
    const logo = require('../../assets/logo_basic.png');

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

  addPhotoModal() {
    return (
      <Modal isVisible={this.state.showPhotos} backdropColor="#000000" backdropOpacity={0.95}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
          <CameraRollPicker
            style={{ borderRadius: 10 }}
            scrollRenderAheadDistance={500}
            initialListSize={1}
            removeClippedSubviews={false}
            groupTypes="SavedPhotos"
            maximum={1}
            selected={this.state.selected}
            assetType="Photos"
            imagesPerRow={3}
            containerWidth={335}
            backgroundColor="rgba(255,255,255,.8)"
                    callback={this.getImage.bind(this)}
          />

          <View style={{ flexDirection: 'row', width: '100%' }}>
            <Button full style={{ flex: 1, height: 80, backgroundColor: '#52ce5e' }} onPress={() => this.setImage()}>
              <Text style={{ color: '#ffffff', fontSize: 18 }}>UPLOAD PHOTO</Text>
            </Button>
            <Button full style={{ flex: 1, height: 80, backgroundColor: '#fd6464' }} onPress={() => this.cancelPhotos()}>
              <Text style={{ color: '#ffffff', fontSize: 18 }}>CANCEL UPLOAD</Text>
            </Button>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  render() {
    const { placeID } = this.state;

    return (
      <Container style={styles.container}>
        {this.addPhotoModal()}
        <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <Image style={{ flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: 0.2 }} source={background} />
        </View>

        <BasicNav
          drawer={false}
          back="New Member"
          button="Create A Run"
          modal="true"
        />

        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
          <KeyboardAvoidingView
            behavior="padding"
            style={{ width: '100%', flex: 1, flexDirection: 'row', flexWrap: 'wrap', margin: 'auto', justifyContent: 'center', alignItems: 'center' }}
          >
            <View style={{ width: '100%', flex: 1, flexDirection: 'row', flexWrap: 'wrap', margin: 'auto', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: '85%', margin: 10 }}>
                <Text style={styles.titleText}>ADD NEW COURT | SEARCH BELOW</Text>
              </View>
              <TextInput
                onChangeText={(courtName) => this.checkLocation('courtName', courtName)}
                style={[formStyle.textFull, { width: '85%' }]}
                autoCapitalize ="none"
                placeholderTextColor ="#000000"
                underlineColorAndroid="transparent"
                keyboardAppearance="dark"
                autoCorrect={false}
                placeholder="Example: LA Fitness Roswell Rd Atlanta"
              />

              <View style={{ width: '95%', position: 'relative' }}>
                <View style={{ width: '100%', position: 'absolute', top: 0 }}>
                  {this.locationList()}
                </View>
              </View>
              {this.courtSelectImages()}

            </View>
          </KeyboardAvoidingView>

        </SafeAreaView>
        <Button
          full
          style={[styles.addBtn, { height: 80 }]}
          onPress={() => this.addCourt()}
          disabled={_.isNil(placeID)}
        >
          <Text
            style={{ color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium' }}
          >
            ADD COURT
          </Text>
        </Button>
        {this.loadingModal()}
      </Container>

    );
  }
}

NewCourt.propTypes = {
  getLocationDetailsConnect: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool,
  gamesNewEventAddCourtConnect: PropTypes.func.isRequired,
};

NewCourt.defaultProps = {
  isAdmin: false,
};

const mapStateToProps = (state, ownProps) => ({
  user: state.auth.user.profile,
  isAdmin: _.get(ownProps.route, 'params.isAdmin', false),
});

const mapDispatchToProps = (dispatch) => ({
  getLocation: (location) => dispatch(getLocation(location)),
  getLocationDetailsConnect: (locationID) => dispatch(getLocationDetails(locationID)),
  getRun: (runId, type) => dispatch(getRun(runId, type)),
  displayView: (view) => dispatch(displayView(view)),
  resetGroups: () => dispatch(resetGroups()),
  addToList: (list) => dispatch(addToList(list)),
  gamesNewEventAddCourtConnect: (data) => dispatch(gamesNewEventAddCourt(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewCourt);
