/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import _ from 'lodash';
import {
  View,
  ScrollView,
  TextInput,
  Text,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {
  Icon,
  Button,
} from 'native-base';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import Auth from '@aws-amplify/auth';

import { login, loginUser, checkLogin } from 'src/reducers/auth';
import { getRun } from 'src/reducers/games';

import devicesUtils from 'src/utils/deviceUtils';
import authUtils from 'src/utils/authUtils';

import FacebookLogin from 'src/components/FacebookLogin';
import GoogleLogin from 'src/components/GoogleLogin';
import AppleLogin from 'src/components/AppleLogin';

import {
  routeNames,
} from 'src/navigation';

import {
  gs,
} from 'src/styles';

import logo from 'src/assets/logo_basic.png';
import background from 'src/assets/Background.png';

import styles from './styles';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMounted: true,
      error: false,
      message: '',
      email: '',
      password: '',
      verifyModal: false,
      updateModal: false,
      resetModal: false,
      forgotModal: false,
      loadingModal: false,
      termsModal: false,
    };
  }

  componentWillUnmount() {
    this.setState({
      isMounted: false,
    });
  }

  handleChange(formField, valueInp) {
    let value = valueInp;

    if (
      (formField === 'email')
      && value
    ) {
      value = value.toLowerCase();
    }

    this.setState({
      [formField]: value,
      error: false,
    });
  }

  onError(error, hideSpinner = false) {
    if (hideSpinner) {
      this.setState({
        loadingModal: false,
      }, () => {
        alert(error);
      });
    } else {
      alert(error);
    }
  }

  loginWithSocialAccount = async (userInfo) => {
    const { loginUser } = this.props;
    const { email } = userInfo;
    const approved = {
      email,
      type: 'registration',
    };

    this.setState({
      loadingModal: true,
    });

    try {
      const result = await loginUser(approved);

      if (result) {
        return;
      }

      const regError = await this.registerWithSocialAccount(userInfo);

      if (regError) {
        this.onError(regError, false);
      } else {
        return;
      }
    } catch (error) {
      this.onError(error, false);
    }

    this.setState({
      loadingModal: false,
    });
  }

  registerWithSocialAccount = async (userInfo) => {
    const { loginUser, getRun } = this.props;
    const { email, givenName, familyName } = userInfo;
    const params = {
      firstName: givenName,
      lastName: familyName,
      email,
      password: '',
      city: 'empty',
      state: 'empty',
      zipcode: '000',
      phone: '000',
      gender: 'no',
      type: authUtils.MEMBER_TYPES.STAFF,
      skillId: authUtils.DEFAULT_SKILL_REGISTER,
    };
    const approved = {
      email,
      type: 'registration',
    };
    let res;

    try {
      const resReqister = await getRun(params, 'registerUser');

      if (resReqister === 'email') {
        return 'Email error';
      }

      if (!_.isInteger(parseInt(resReqister, 10))) {
        return 'Some error';
      }

      const resLogin = await loginUser(approved);

      if (resLogin === false) {
        return 'Error';
      }
    } catch (error) {
      return error;
    }

    return res;
  }

  phoneVerification(formField, value) {
    const numbers = /^[0-9]+$/;
    if (value.match(numbers)) {
      if (value.length < 10) {
        this.setState({
          [formField]: value,
          error: true,
          message: 'Be sure to include area code and phone number',
        });
      } else if (value.length > 10) {
        this.setState({
          [formField]: value,
          error: true,
          message: 'Too Many Numbers, Double Check that Phone Number',
        });
      } else if (value.length == 10) {
        this.setState({
          [formField]: value,
          error: false,
        });
      }
    } else {
      this.setState({
        error: true,
        message: 'Numbers only',
      });
    }
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
  }

  closeModal(modal) {
    this.setState({
      [modal]: false,
      error: false,
    });
  }

  showModal(modal) {
    this.setState({
      [modal]: true,
      error: false,
    });
  }

  async collectLogin() {
    const { email, password } = this.state;

    if (!email || !password) {
      alert('Specify email and password');
      return;
    }

    this.setState({ loadingModal: true });
    const auth = {
      email: this.state.email,
      password: this.state.password,
    };

    // const user = await Auth.signIn(auth.username, auth.password);
    Auth.signIn(this.state.email, this.state.password)
      .then((user) => {
        const approved = {
          email: this.state.email,
          type: 'registration',
        };

        this.props.loginUser(approved)
          .then((result) => {
            if (result) {
              if (this.state.isMounted) {
                this.setState({ loadingModal: false });
              }

              // this.props.navigation.navigate('RunListing');
            } else {
              this.setState({
                loadingModal: false,
                error: true,
                message: 'Email or Password is incorrect',
              });
            }
          })
          .catch((err) => alert(err));
      }).catch((err) => {
        console.log(err);
        if (err.code == 'UserNotConfirmedException') {
          Auth.resendSignUp(this.state.email).then(() => {
            this.setState({
              loadingModal: false,
              error: true,
              message: 'Your Account Needs Verification, We sent the code to the phone number listed your the account',
              verifyModal: true,
            });
          }).catch((e) => {
            console.log(e);
          });
        } else if (err.code == 'UserNotFoundException') {
          this.props.checkLogin(auth)
            .then((user) => {
              if (user) {
                this.setState({
                  loadingModal: false,
                  error: true,
                  message: 'Please your update account information',
                  user,
                }, () => {
                  setTimeout(() => {
                    this.setState({ updateModal: true });
                  }, 500);
                });
              } else {
                this.setState({
                  loadingModal: false,
                  error: true,
                  message: 'Email or Password Incorrect',
                });
              }
            }).catch((e) => {
              console.log(e);
            });
        } else if (err.code == 'NotAuthorizedException') {
          this.setState({
            loadingModal: false,
            error: true,
            message: err.message,
          });
        }
      });
  }

  resendVerification() {
    Auth.resendSignUp(this.state.email).then(() => {
      this.setState({
        error: true,
        message: 'Your Account Requires Verification',
      });
    }).catch((e) => {
      console.log(e);
    });
  }

  verify() {
    if (this.state.verification) {
      Auth.confirmSignUp(this.state.email, this.state.verification)
        .then((data) => {
          const auth = {
            email: this.state.email,
            type: 'registration',
          };

          this.props.loginUser(auth)
            .then((result) => {
              if (result) {
                this.setState({ verifyModal: false }, () => {
                  // setTimeout(() => {
                  //   this.props.navigation.navigate('RunListing');
                  // }, 500);
                });
              } else {
                alert('Password or Email is incorrect');
              }
            })
            .catch((err) => alert(err));
        })
        .catch((err) => console.log(err));
    }
  }

  forgot() {
    if (this.state.email) {
      Auth.forgotPassword(this.state.email)
        .then((data) => {
          this.setState({ forgotModal: false }, () => {
            setTimeout(() => {
              this.setState({ resetModal: true });
            }, 500);
          });
        })
        .catch((err) => {
          this.setState({
            error: true,
            message: err.message,
          });
        });
    }
  }

  resetPass() {
    if (this.state.password == this.state.confirmPassword) {
      Auth.forgotPasswordSubmit(this.state.email, this.state.verification, this.state.password)
        .then((data) => {
          console.log(data);
          this.setState({
            error: true,
            message: 'Password Reset! You can now Log In.',

          }, () => {
            setTimeout(() => {
              this.setState({ resetModal: false });
            }, 500);
          });
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            error: true,
            message: err.message,
          });
        });
    } else {
      this.setState({
        error: true,
        message: 'Passwords Do Not Match',
      });
    }
  }

  updateUser() {
    if (this.state.password == this.state.confirmPassword) {
      const update = {
        id: this.state.user.id,
        firstName: this.state.user.firstName,
        lastName: this.state.user.lastName,
        email: this.state.user.email,
        password: '',
        city: this.state.user.city,
        state: this.state.user.state,
        zipcode: this.state.user.zipcode,
        phone: `+1${this.state.phone}`,
      };

      const attr = {
        email: this.state.user.email,
        phone_number: `+1${this.state.phone}`,
      };

      const params = {
        username: this.state.user.email,
        password: this.state.password,
        attributes: attr,
      };

      Auth.signUp(params)
        .then((data) => {
          this.setState({ updateModal: false }, () => {
            this.props.getRun(update, 'updateUser')
              .then((result) => {
                setTimeout(() => {
                  this.setState({ verifyModal: true });
                }, 500);
              })
              .catch((err) => alert(err));
          });
        })
        .catch((err) => {
          const error = err.message.split(':');
          console.log(error);

          this.setState({
            error: true,
            message: err.message,
          });
        });
    } else {
      this.setState({
        error: true,
        message: 'Your Account Requires Verification',
      });
    }
  }

  updateModal() {
    const { updateModal } = this.state;

    return (
      <Modal
        style={{ flex: 1, width: '100%', margin: 0 }}
        isVisible={updateModal}
        useNativeDriver
        hideModalContentWhileAnimating
        backdropColor="#000000"
        backdropOpacity={1}
      >
        <SafeAreaView style={styles.registerBox}>
          <View style={styles.modalHeader}>
            <Button full transparent style={styles.close} onPress={() => this.closeModal('updateModal')}>
              <Icon style={styles.closeText} type="MaterialIcons" name="keyboard-backspace" />
              <Text style={{
                fontFamily: 'BarlowCondensed-Bold', textAlign: 'left', color: '#ffffff', marginLeft: 20, margin: 0,
              }}
              >
                CLOSE
              </Text>
            </Button>
          </View>
          <KeyboardAvoidingView behavior="padding">
            <View style={{
              flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            }}
            >
              {this.errorStatus()}
              <TextInput
                ref={this.textRef}
                onChangeText={(phone) => this.phoneVerification('phone', phone)}
                style={[styles.textInput, { textAlign: 'left' }]}
                autoCapitalize="none"
                keyboardAppearance="dark"
                placeholderTextColor="#ffffff"
                keyboardType="number-pad"
                autoFocus
                placeholder="Update Phone Number"
              />

              <TextInput
                onChangeText={(password) => this.handleChange('password', password)}
                secureTextEntry
                style={[styles.textInput, { textAlign: 'left' }]}
                autoCapitalize="none"
                keyboardAppearance="dark"
                placeholderTextColor="#ffffff"
                placeholder="Password"
              />

              <TextInput
                onChangeText={(confirmPassword) => this.handleChange('confirmPassword', confirmPassword)}
                secureTextEntry
                style={[styles.textInput, { textAlign: 'left' }]}
                autoCapitalize="none"
                keyboardAppearance="dark"
                placeholderTextColor="#ffffff"
                placeholder="Confirm Password"
              />

            </View>

            <Button full style={styles.nextButton} onPress={() => this.updateUser()}>
              <Text style={{
                color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%',
              }}
              >
                {' '}
                Update and Verify
              </Text>
            </Button>

          </KeyboardAvoidingView>

        </SafeAreaView>
      </Modal>

    );
  }

  verifyModal() {
    return (
      <Modal
        style={{ flex: 1, width: '100%', margin: 0 }}
        isVisible={this.state.verifyModal}
        useNativeDriver
        hideModalContentWhileAnimating
        backdropColor="#000000"
        backdropOpacity={1}
      >
        <SafeAreaView style={styles.registerBox}>
          <View style={styles.modalHeader}>
            <Button full transparent style={styles.close} onPress={() => this.closeModal('verifyModal')}>
              <Icon style={styles.closeText} type="MaterialIcons" name="keyboard-backspace" />
              <Text style={{
                fontFamily: 'BarlowCondensed-Bold', textAlign: 'left', color: '#ffffff', marginLeft: 20, margin: 0,
              }}
              >
                CLOSE
              </Text>
            </Button>
          </View>
          <KeyboardAvoidingView behavior="padding">
            <View style={{
              flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            }}
            >
              {this.errorStatus()}
              <TextInput
                onChangeText={(verification) => this.handleChange('verification', verification)}
                style={[styles.textInput, { textAlign: 'center' }]}
                autoCapitalize="none"
                placeholderTextColor="#ffffff"
                underlineColorAndroid="transparent"
                keyboardAppearance="dark"
                keyboardType="number-pad"
                autoFocus
                placeholder="Enter Verification Number"
              />
            </View>
            <Button full style={styles.resendBtn} onPress={() => this.resendVerification()}>
              <Text style={{
                color: '#ffffff', textAlign: 'center', fontFamily: 'BarlowCondensed-Bold', width: '95%',
              }}
              >
                RESEND CODE
              </Text>
            </Button>

            <Button full style={styles.nextButton} onPress={() => this.verify()}>
              <Text style={{
                color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%',
              }}
              >
                {' '}
                Verify
              </Text>
            </Button>

          </KeyboardAvoidingView>

        </SafeAreaView>
      </Modal>

    );
  }

  forgotModal() {
    return (
      <Modal
        style={{ flex: 1, width: '100%', margin: 0 }}
        isVisible={this.state.forgotModal}
        useNativeDriver
        hideModalContentWhileAnimating
        backdropColor="#000000"
        backdropOpacity={1}
      >
        <SafeAreaView style={styles.registerBox}>
          <View style={styles.modalHeader}>
            <Button full transparent style={styles.close} onPress={() => this.closeModal('forgotModal')}>
              <Icon style={styles.closeText} type="MaterialIcons" name="keyboard-backspace" />
              <Text style={{
                fontFamily: 'BarlowCondensed-Bold', textAlign: 'left', color: '#ffffff', marginLeft: 20, margin: 0,
              }}
              >
                CLOSE
              </Text>
            </Button>
          </View>
          <KeyboardAvoidingView behavior={devicesUtils.isIOS ? 'padding' : 'height'}>
            <View style={{
              flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            }}
            >
              {this.errorStatus()}
              <TextInput
                onChangeText={(email) => this.handleChange('email', email)}
                style={[styles.textInput, { textAlign: 'center' }]}
                autoCapitalize="none"
                placeholderTextColor="#ffffff"
                underlineColorAndroid="transparent"
                keyboardAppearance="dark"
                autoFocus
                placeholder="ENTER YOUR EMAIL ADDRESS"
              />
            </View>

            <Button full style={styles.nextButton} onPress={() => this.forgot()}>
              <Text style={{
                color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%',
              }}
              >
                {' '}
                Reset Password
              </Text>
            </Button>

          </KeyboardAvoidingView>

        </SafeAreaView>
      </Modal>

    );
  }

  resetModal() {
    return (
      <Modal
        style={{ flex: 1, width: '100%', margin: 0 }}
        isVisible={this.state.resetModal}
        useNativeDriver
        hideModalContentWhileAnimating
        backdropColor="#000000"
        backdropOpacity={1}
      >
        <SafeAreaView style={styles.registerBox}>
          <View style={styles.modalHeader}>
            <Button full transparent style={styles.close} onPress={() => this.closeModal('resetModal')}>
              <Icon style={styles.closeText} type="MaterialIcons" name="keyboard-backspace" />
              <Text style={{
                fontFamily: 'BarlowCondensed-Bold', textAlign: 'left', color: '#ffffff', marginLeft: 20, margin: 0,
              }}
              >
                CLOSE
              </Text>
            </Button>
          </View>
          <KeyboardAvoidingView behavior="padding">
            <View style={{
              flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            }}
            >
              {this.errorStatus()}
              <TextInput
                onChangeText={(verification) => this.handleChange('verification', verification)}
                style={[styles.textInput, { textAlign: 'center' }]}
                autoCapitalize="none"
                placeholderTextColor="#ffffff"
                underlineColorAndroid="transparent"
                keyboardAppearance="dark"
                keyboardType="number-pad"
                autoFocus
                placeholder="ENTER THE VERIFICATION CODE"
              />

              <TextInput
                onChangeText={(password) => this.handleChange('password', password)}
                secureTextEntry
                style={[styles.textInput, { textAlign: 'left' }]}
                autoCapitalize="none"
                keyboardAppearance="dark"
                placeholderTextColor="#ffffff"
                placeholder="Enter New Password"
              />

              <TextInput
                onChangeText={(confirmPassword) => this.handleChange('confirmPassword', confirmPassword)}
                secureTextEntry
                style={[styles.textInput, { textAlign: 'left' }]}
                autoCapitalize="none"
                keyboardAppearance="dark"
                placeholderTextColor="#ffffff"
                placeholder="Confirm New Password"
              />

            </View>

            <Button full style={styles.nextButton} onPress={() => this.resetPass()}>
              <Text style={{
                color: '#ffffff', textAlign: 'center', fontSize: 18, width: '100%',
              }}
              >
                {' '}
                SUBMIT
              </Text>
            </Button>

          </KeyboardAvoidingView>

        </SafeAreaView>
      </Modal>

    );
  }

  termsModal() {
    return (
      <Modal style={{ flex: 1, width: '100%', margin: 0 }} isVisible={this.state.termsModal} useNativeDriver hideModalContentWhileAnimating backdropColor="#000000" backdropOpacity={1}>
        <SafeAreaView style={styles.registerBox}>
          <View style={styles.modalHeader}>
            <Button full transparent style={styles.close} onPress={() => this.closeModal('termsModal')}>
              <Icon style={styles.closeText} type="MaterialIcons" name="close" />
              <Text style={{
                fontFamily: 'BarlowCondensed-Bold', paddingTop: 2, flex: 1, textAlign: 'left', color: '#ffffff', margin: 0,
              }}
              >
                CLOSE
              </Text>
            </Button>
          </View>
          <ScrollView contentContainerStyle={{ marginTop: 10, marginBottom: 20 }}>

            <Text style={{
              color: '#D9D9D9', textAlign: 'left', marginLeft: 20, marginRight: 20, marginTop: 10, fontWeight: '300', fontSize: 14,
            }}
            >
              I understand that there are certain risks of damages and injuries, including death, inherent in the practice and play of basketball, as well as in traveling in other related activities incidental to me, and I am willing to assume these risks. These risks include but are not limited to those hazards associated with weather conditions, travel, playing conditions, equipment and other participants.
            </Text>

            <Text style={{
              color: '#D9D9D9', textAlign: 'left', marginLeft: 20, marginRight: 20, marginTop: 10, fontWeight: '300', fontSize: 14,
            }}
            >
              I understand that the very nature of the game of basketball is hazardous and risky, including but not limited to, the acts of running, jumping, stretching, sliding, diving, and collisions with other players and with stationary objects, all of which can cause serious injury or death to me and to other players.
            </Text>

            <Text style={{
              color: '#D9D9D9', textAlign: 'left', marginLeft: 20, marginRight: 20, marginTop: 10, fontWeight: '300', fontSize: 14,
            }}
            >
              I certify that I am physically fit, have sufficiently trained for participation in this event, and have not been advised otherwise by a qualified medical person.
            </Text>

            <Text style={{
              color: '#D9D9D9', textAlign: 'left', marginLeft: 20, marginRight: 20, marginTop: 10, fontWeight: '300', fontSize: 14,
            }}
            >
              Further, I agree that in consideration for the right to allow me as a player and in consideration for permission to play at the sites arranged for by the organization:
            </Text>

            <Text style={{
              color: '#D9D9D9', textAlign: 'left', marginLeft: 20, marginRight: 20, marginTop: 5, fontWeight: '300', fontSize: 14,
            }}
            >
              1. I do voluntarily elect to accept and solely assume all risks of injury incurred or suffered (a) while playing as an attendee of the event so designated, (b) while serving in a non-playing capacity as an observer during play by other players, and (c) while on or upon the premises of any and all of the courts and locations arranged for by the organization for practice or play.
            </Text>

            <Text style={{
              color: '#D9D9D9', textAlign: 'left', marginLeft: 20, marginRight: 20, marginTop: 5, fontWeight: '300', fontSize: 14,
            }}
            >
              2. In addition to giving my full consent for participation, I do hereby waive, release, discharge and agree not to sue 1891 LLC, the owner or operator of any facilities or other entity designated below, elected officials, employees and volunteers or any person or entity connected with the location, for any claim, damages, costs including attorneys fees, or cause of action which I may have in the future as a result of damages, injuries, including death, sustained or incurred by my participation from whatever cause including but not limited to the negligence, breach of contract or wrongful conduct of the parties hereby released.
            </Text>

            <Text style={{
              color: '#D9D9D9', textAlign: 'left', marginLeft: 20, marginRight: 20, marginTop: 10, fontWeight: '300', fontSize: 14,
            }}
            >
              I hereby certify that I am fully capable of participating in the designated sport and that I am healthy and have no physical or mental disabilities or infirmities that would restrict full participation in these activities.
            </Text>

            <Text style={{
              color: '#D9D9D9', textAlign: 'left', marginLeft: 20, marginRight: 20, marginTop: 10, fontWeight: '300', fontSize: 14,
            }}
            >
              I further agree on behalf of myself listed below, that I shall hold harmless and fully indemnify the parties hereby released from any and all claims, damages, costs including attorney fees, and causes of action which may arise from any cause of action made by me , even if the damages, injuries or death are caused in whole or in part by any of the persons or entities hereby released.
            </Text>

            <Text style={{
              color: '#FFFFFF', textAlign: 'left', marginLeft: 20, marginRight: 20, marginTop: 10, fontWeight: '300', fontSize: 14,
            }}
            >
              I ACKNOWLEDGE THAT I HAVE READ AND THAT I UNDERSTAND EACH AND EVERY ONE OF THE ABOVE PROVISIONS IN THIS WAIVER, RELEASE OF LIABILITY AND INDEMNIFICATION AGREEMENT AND AGREE TO ABIDE BY THEM.
            </Text>

            <View style={{ height: 100 }} />

          </ScrollView>

        </SafeAreaView>
      </Modal>

    );
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

  renderSocialLogins() {
    return (
      <View style={[gs.row, gs.mT20, gs.width90p]}>
        <GoogleLogin
          onSuccess={(userInfo) => {
            this.loginWithSocialAccount(userInfo);
          }}
          onError={(error) => {
            alert(error);
          }}
        />

        <FacebookLogin
          onSuccess={(userInfo) => {
            this.loginWithSocialAccount(userInfo);
          }}
          onError={(error) => {
            alert(error);
          }}
          style={devicesUtils.isIOS ? gs.mH20 : gs.mL20}
        />

        {devicesUtils.isIOS && (
          <AppleLogin
            onSuccess={(userInfo) => {
              this.loginWithSocialAccount(userInfo);
            }}
            onError={(error) => {
              alert(error);
            }}
          />
        )}
      </View>
    );
  }

  render() {
    const { navigation } = this.props;

    return (
      <ScrollView
        contentContainerStyle={styles.container}
        bounces={false}
      >
        <View style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        }}
        >
          <Image
            style={{
              flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: 0.6,
            }}
            source={background}
          />
        </View>
        {this.errorStatus()}
        <View style={styles.loginBox}>

          <Image style={styles.logo} source={logo} />
          <View>
            <Text style={styles.header}>James, The Official Basketball Platform</Text>
          </View>
          <KeyboardAvoidingView
            style={{
              width: '100%', margin: 'auto', alignItems: 'center', justifyContent: 'center',
            }}
            behavior="padding"
          >

            <TextInput
              onChangeText={(email) => this.handleChange('email', email)}
              style={styles.textInput}
              autoCapitalize="none"
              placeholderTextColor="#ffffff"
              underlineColorAndroid="transparent"
              keyboardAppearance="dark"
              placeholder="email address"
            />
            <TextInput
              onChangeText={(password) => this.handleChange('password', password)}
              style={styles.textInput}
              secureTextEntry
              autoCapitalize="none"
              keyboardAppearance="dark"
              placeholderTextColor="#ffffff"
              placeholder="password"
              onSubmitEditing={() => this.collectLogin()}
            />

            <Button full transparent style={{ marginTop: 5 }} onPress={() => this.showModal('forgotModal')}>
              <Text style={{
                color: '#ffffff', textAlign: 'right', fontWeight: '700', fontSize: 16,
              }}
              >
                Forgot Password? Click Here
              </Text>
            </Button>

          </KeyboardAvoidingView>
          <Button full style={styles.loginButton} onPress={() => this.collectLogin()}>
            <Text style={{ color: '#ffffff', fontSize: 18 }}>LOGIN</Text>
          </Button>

        </View>

        {this.renderSocialLogins()}

        <View>
          <Button
            full
            transparent
            style={{ marginTop: 50 }}
            onPress={() => {
              navigation.navigate(routeNames.REGISTER);
            }}
          >
            <Text style={{
              color: '#FFCE00', textAlign: 'center', fontWeight: '700', fontSize: 18,
            }}
            >
              Dont Have an Account? Register Here
            </Text>
          </Button>

          <Text style={{
            color: '#D9D9D9', textAlign: 'center', marginLeft: 20, marginRight: 20, fontWeight: '700', fontSize: 12,
          }}
          >
            By using this platform, you are automatically accepting all the Terms & Conditions related to James by 1891.
          </Text>

          <Button full transparent style={{ marginTop: 10 }} onPress={() => this.showModal('termsModal')}>
            <Text style={{
              color: '#ffffff', textAlign: 'center', fontWeight: '700', fontSize: 16,
            }}
            >
              View Terms
            </Text>
          </Button>
        </View>

        {this.verifyModal()}
        {this.updateModal()}
        {this.forgotModal()}
        {this.resetModal()}
        {this.loadingModal()}
        {this.termsModal()}
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth,
  location: state.navigation,
});

const mapDispatchToProps = (dispatch) => ({
  login: (auth) => { dispatch(login(auth)); },
  loginUser: (auth) => dispatch(loginUser(auth)),
  checkLogin: (auth) => dispatch(checkLogin(auth)),
  getRun: (runId, type) => dispatch(getRun(runId, type)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
