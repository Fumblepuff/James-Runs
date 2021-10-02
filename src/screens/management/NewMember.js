/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Content,
  Text,
  Button,
} from 'native-base';
import { connect } from 'react-redux';
import {
  Row,
  Grid,
} from 'react-native-easy-grid';
import Modal from 'react-native-modal';

import authUtils from 'src/utils/authUtils';
import Toast from 'src/utils/toastUtils';

import BasicNav from 'src/components/BasicNav';
import InputPhoneNumber from 'src/components/InputPhoneNumber';

import {
  addEdit,
  cacheData,
} from 'src/reducers/auth';
import {
  addToList,
  squadApi,
  displayView,
  resetGroups,
  getRun,
  getLocation,
  getLocationDetails,
} from 'src/reducers/games';

import mainStyle from 'src/styles/Style';
import formStyle from 'src/styles/Form';

import logo from 'src/assets/logo_basic.png';
import background from 'src/assets/managementBackground.png';

const styles = mainStyle;
const formStyles = formStyle;

class NewMember extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingModal: false,
      title: 'New Member',
      phoneFormat: '',
    };
  }

  handleChange(formField, value) {
    this.setState({ [formField]: value });
  }

  phoneVerification = (valueFormat) => {
    const { isValid, phoneNumberFormat, value } = valueFormat;

    const state = {
      phone: value,
      phoneFormat: phoneNumberFormat,
      error: false,
      message: '',
    };

    if (!isValid) {
      state.error = true;
      state.message = 'Phone number is not correct';
    }

    this.setState(state);
  }

  newUser() {
    const {
      navigation,
      getRunConnect,
      displayViewConnect,
    } = this.props;
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
    } = this.state;

    const register = {
      id: 0,
      firstName,
      lastName,
      email,
      password,
      phone,
      type: authUtils.MEMBER_TYPES.STAFF,
      skillId: authUtils.DEFAULT_SKILL_REGISTER,
    };

    this.setState({ loadingModal: true });

    const handleError = (error) => {
      this.setState({ loadingModal: false }, () => {
        Toast.showError(error);
      });
    };

    getRunConnect(register, 'registerUser')
      .then((result) => {
        if (result && result.error) {
          const errorMsg = (typeof result.error === 'string') ? result.error : 'unknown error';
          handleError(errorMsg);
          return;
        }

        if (result === 'email') {
          Alert.alert(
            'Email Already Registered',
            '',
            [
              { text: 'OK' },
            ],
            { cancelable: true },
          );
        } else {
          this.setState({ loadingModal: false });
          register.id = result;
          register.type = 3;

          const data = {
            data: register,
          };

          displayViewConnect(data);

          setTimeout(() => {
            navigation.navigate('EditBaller');
          }, 800);
        }
      })
      .catch((err) => handleError(err));
  }

  errorStatus() {
    if (this.state.error) {
      return (
        <View style={{ borderRadius: 3, backgroundColor: '#000000', padding: 10 }}>
          <Text style={{
            borderWidth: 0, alignItems: 'center', textAlign: 'center', color: '#FFFFFF', fontFamily: 'BarlowCondensed-Bold',
          }}
          >
            {this.state.message}
          </Text>
        </View>
      );
    }

    return null;
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
    const { phoneFormat } = this.state;
    return (
      <Content
        style={styles.container}
        bounces={false}
      >

        <View style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        }}
        >
          <Image
            style={{
              flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: 0.2,
            }}
            source={background}
          />
        </View>

        <Grid>
          <Row style={{ position: 'relative', height: 170, backgroundColor: 'rgba(0,0,0,.5)' }}>
            <BasicNav navigation={this.props.navigation} drawer={false} page="Management" back="New Member" button="Create A Run" modal="true" />

            <View style={styles.runLocation}>
              <Text style={[styles.runLocationText, { fontSize: 24 }]}>{this.state.title}</Text>
              <View style={{
                height: 1, width: '70%', backgroundColor: '#ffffff', marginTop: 5, marginBottom: 5,
              }}
              />
              <Text style={[styles.runLocationText, { fontSize: 18 }]}>{this.state.address}</Text>
            </View>
          </Row>
          <Row>
            <KeyboardAvoidingView
              behavior="padding"
              style={{
                width: '100%', flex: 1, margin: 'auto', justifyContent: 'flex-start', alignItems: 'center',
              }}
            >
              {this.errorStatus()}
              <TextInput
                onChangeText={(firstName) => this.handleChange('firstName', firstName)}
                style={formStyles.textInput}
                autoCapitalize="none"
                keyboardAppearance="dark"
                placeholderTextColor="#000000"
                autoFocus
                placeholder="First Name"
              />

              <TextInput
                onChangeText={(lastName) => this.handleChange('lastName', lastName)}
                style={formStyles.textInput}
                autoCapitalize="none"
                keyboardAppearance="dark"
                placeholderTextColor="#000000"
                placeholder="Last Name"
              />

              <TextInput
                onChangeText={(email) => this.handleChange('email', email)}
                style={formStyles.textInput}
                autoCapitalize="none"
                keyboardAppearance="dark"
                placeholderTextColor="#000000"
                placeholder="Email Address"
              />

              <InputPhoneNumber
                value={phoneFormat}
                onChangeText={this.phoneVerification}
              />

              <TextInput
                onChangeText={(password) => this.handleChange('password', password)}
                secureTextEntry
                style={formStyles.textInput}
                autoCapitalize="none"
                keyboardAppearance="dark"
                placeholderTextColor="#000000"
                placeholder="Password"
              />

              <TextInput
                onChangeText={(confirmPassword) => this.handleChange('confirmPassword', confirmPassword)}
                secureTextEntry
                style={formStyles.textInput}
                autoCapitalize="none"
                keyboardAppearance="dark"
                placeholderTextColor="#000000"
                placeholder="Confirm Password"
              />

              <Button style={{ alignSelf: 'center'}} onPress={() => this.newUser()}>
                <Text style={{
                  color: '#ffffff', textAlign: 'center', fontSize: 22, width: '80%', fontFamily: 'BarlowCondensed-Bold',
                }}
                >
                  {' '}
                  SAVE
                  {' '}
                </Text>
              </Button>
            </KeyboardAvoidingView>

          </Row>
        </Grid>
        {this.loadingModal()}
      </Content>

    );
  }
}

NewMember.propTypes = {
  getRunConnect: PropTypes.func.isRequired,
  displayViewConnect: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  cache: state.auth.cache,
  edit: state.auth.edit,
  user: state.auth.user.profile,
  data: state.games.view.data,
});

const mapDispatchToProps = (dispatch) => ({
  addEdit: (edit) => dispatch(addEdit(edit)),
  cacheData: (cache) => dispatch(cacheData(cache)),
  getLocation: (location) => dispatch(getLocation(location)),
  getLocationDetails: (locationID) => dispatch(getLocationDetails(locationID)),
  getRunConnect: (runId, type) => dispatch(getRun(runId, type)),
  displayViewConnect: (view) => dispatch(displayView(view)),
  resetGroups: () => dispatch(resetGroups()),
  addToList: (list) => dispatch(addToList(list)),
  squadApi: (userId, type, data) => dispatch(squadApi(userId, type, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewMember);
