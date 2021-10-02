/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  View, Image, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import CameraRoll from '@react-native-community/cameraroll';
import CameraRollPicker from 'react-native-camera-roll-picker';
import {
  Container,
  Icon,
  Text,
  Button,
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Modal from 'react-native-modal';
import { Storage } from 'aws-amplify';
import { Buffer } from 'buffer';
import RNFetchBlob from 'rn-fetch-blob';
import Moment from 'react-moment';
import 'moment-timezone';

import AuthNav from 'src/components/AuthNav';
import BasicNav from 'src/components/BasicNav';

import { uploadFile, refreshUser, addEdit } from 'src/reducers/auth';
import {
  getList,
  getBaller,
  getRun,
  displayView,
} from 'src/reducers/games';

import statsBackground from 'src/assets/statsBackground.png';
import background from 'src/assets/Background.png';

import styles from './styles';

class BallerProfile extends Component {
  static navigationOptions = {
    drawerLabel: 'My Profile',
  }

  constructor(props) {
    super(props);

    const {
      user,
      baller,
    } = this.props;

    this.state = {
      user,
      baller: baller.data,
      showPhotos: false,
      showLoader: false,
      profilePic: 'https:\/\/s3.amazonaws.com\/awsjames-userfiles-mobilehub-258458471\/public\/james-full-logo.png',
      photoUri: '',
      photoName: '',
      games: 0,
      wins: 0,
      losses: 0,
    };
  }

  componentDidMount() {
    this.checkExpires();
    this.loadBaller();
  }

  setUser() {
    let update = '';

    this.setState({ admin: !this.state.admin }, () => {
      if (this.state.admin) {
        update = 'userAdminRole';
      } else {
        update = 'userBallerRole';
      }

      const run = {
        id: this.state.baller.id,
      };

      this.props.getRun(run, update)
        .then(() => {
          this.props.addEdit(false);
        })
        .catch((err) => alert(err));
    });
  }

  getImage(current) {
    this.setState({
      photoUri: current.uri,
      photoName: `${this.state.baller.firstName}-${this.state.baller.id}.jpg`,
    });
  }

  checkExpires() {
    const { imageName } = this.state.baller;
    this.showProfileImage(imageName);
  }

  loadBaller() {
    const baller = {
      id: this.state.baller.id,
    };
    this.props.getBaller(baller)
      .then((results) => {
        const data = {
          data: results.profile,
          squads: results.squads,
          stats: results.stats,
        };

        this.setState({
          games: results.stats.gameCount,
          wins: results.stats.wins,
          losses: results.stats.losses,
          streak: results.stats.streak,
          winPercentage: results.stats.winPercentage,
          squads: results.squads,
        });

        this.props.displayView(data);
      })
      .catch((err) => alert(err));
  }

  selectPhotos() {
    switch (this.state.user.member_type) {
      case '1':
        // Full Admin
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

        break;
      case '2':
        // Full Admin
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

        break;
      case '3':
        // OG Admin
        if (this.state.user.id == this.state.squad.adminID) {
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
        break;
      default:
        break;
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
    Storage.get(this.state.photoName, { expires: 60 * 60 * 24 * 365 })
      .then((result) => {
        const update = {
          id: this.state.baller.id,
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
        contentType: 'image/jpeg',
      }).then((result) => {
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
    this.setState({ profilePic: this.state.baller.image });
  }

  userSettings() {
    this.props.addEdit(true);
  }

  cancelEdit() {
    this.props.addEdit(false);
  }

  toggleHeader() {
    if (parseInt(this.state.user.member_type, 10) === 1) {
      return <AuthNav navigation={this.props.navigation} page="Ballers" title="Baller Profile" button="Settings" link="Settings" />;
    }

    return <BasicNav navigation={this.props.navigation} page="Ballers" title="Baller Profile" button="Settings" link="Settings" />;
  }

  render() {
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

        {this.toggleHeader()}

        <Modal isVisible={this.props.edit}>

          <View style={styles.modalHeader}>
            <Button full transparent style={styles.close} onPress={() => this.cancelEdit()}><Icon style={styles.closeText} type="MaterialIcons" name="clear" /></Button>
          </View>
          <View style={styles.modalWrapper}>

            <Button full style={[styles.squadButtons, { backgroundColor: this.state.admin ? '#478cba' : '#4f4f4f' }]} onPress={() => this.setUser()}>
              <Text style={{
                color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%', fontFamily: 'BarlowCondensed-Medium',
              }}
              >
                {this.state.admin ? 'Change to Baller' : 'Change to Organizer'}
              </Text>
            </Button>

          </View>

        </Modal>

        <Modal isVisible={this.state.showPhotos} backdropColor="rgba(0,0,0,.6)" >
          <Button full style={styles.uploadButton} onPress={() => this.uploadPhoto()}>
            <Text style={{ color: '#ffffff', fontSize: 18 }}>UPLOAD PHOTO</Text>
          </Button>
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
                <Row style={styles.profile}><Text style={styles.profileText}>{this.state.baller.firstName} {this.state.baller.lastName}</Text></Row>
                <Row style={styles.profile}><Text style={styles.profileText}>{this.state.baller.city}, {this.state.baller.state}</Text></Row>
                <Row style={styles.profile}><Text style={styles.profileText}>Joined: <Moment style={styles.profileText} element={Text} format="MM/DD/YYYY">{this.props.baller.data.createdDate}</Moment></Text></Row>
                <Row style={styles.profile}><Text style={styles.profileText}>{this.state.baller.zipcode}</Text></Row>
              </View>
            </Col>
          </Row>
          <Row >
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View style={[styles.counter, { flexDirection: 'column' }]}>
                <Text style={[styles.counterStat, { fontSize: 25, flex: 1 }]}>{this.state.games}</Text>
                <Text style={styles.statsText}> Games </Text>
              </View>
              <View style={[styles.counter, { flexDirection: 'column' }]}>
                <Text style={[styles.counterStat, { fontSize: 25, flex: 1 }]}>{this.state.streak}</Text>
                <Text style={styles.statsText}> Winning Streak </Text>
              </View>
              <View style={[styles.counter, { flexDirection: 'column' }]}>
                <Text style={[styles.counterStat, { fontSize: 25, flex: 1 }]}>{this.state.winPercentage}%</Text>
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
            <View style={{ flex: 0.8 }} />
            <View style={{ flexDirection: 'row', flex: 0.4 }}>
              <View style={styles.stats}>
                <Text style={[styles.statsText, { fontSize: 32, flex: 0.6 }]}>{this.state.games}</Text>
                <Text style={styles.statsText}>Games</Text>
              </View>
              <View style={[styles.stats, { backgroundColor: '#52ce5e' }]}>
                <Text style={[styles.statsText, { fontSize: 32, flex: 0.6 }]}>{this.state.wins}</Text>
                <Text style={styles.statsText}>Wins</Text>
              </View>
              <View style={[styles.stats, { backgroundColor: '#fd6464' }]}>
                <Text style={[styles.statsText, { fontSize: 32, flex: 0.6 }]}>{this.state.losses}</Text>
                <Text style={[styles.statsText, { textAlign: 'left' }]}>Losses</Text>
              </View>
            </View>

          </Row>
        </Grid>
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  addEdit: (edit) => dispatch(addEdit(edit)),
  displayView: (view) => dispatch(displayView(view)),
  getBaller: (baller) => dispatch(getBaller(baller)),
  getRun: (runId, type) => dispatch(getRun(runId, type)),
  getList: (list) => dispatch(getList(list)),
  uploadFile: (update) => { dispatch(uploadFile(update)); },
  refreshUser: (user) => { dispatch(refreshUser(user)); },
});

const mapStateToProps = (state) => ({
  user: state.auth.user.profile,
  baller: state.games.view,
  edit: state.auth.edit,
});

export default connect(mapStateToProps, mapDispatchToProps)(BallerProfile);
