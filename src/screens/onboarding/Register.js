import React, { Component } from 'react';
import {
  View,
  TextInput,
  Image,
} from 'react-native';
import {
  Text,
} from 'native-base';

import Toast from 'src/utils/toastUtils';
import validationUtils from 'src/utils/validationUtils';

import InputPhoneNumber from 'src/components/InputPhoneNumber';
import Content from 'src/components/Content';

import AuthApi from 'src/api/AuthApi';

import {
  SpinnerService,
} from 'src/services';

import formStyle from 'src/styles/Form';
import {
  gs,
} from 'src/styles';

import logo from 'src/assets/baller.png';
import background from 'src/assets/Background.png';

const formStyles = formStyle;

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      phone: '',
      phoneFormat: '',
      isPhoneValid: false,
      email: '',
      password: '',
      confirmPassword: '',
      error: false,
    };
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

  phoneVerification = (valueFormat) => {
    const { isValid, phoneNumberFormat, value } = valueFormat;

    const state = {
      isPhoneValid: isValid,
      phoneFormat: phoneNumberFormat,
      phone: value,
      error: false,
      message: '',
    };

    if (!isValid) {
      state.error = true;
      state.message = 'Phone number is not correct';
    }

    this.setState(state);
  }

  async nextScreen() {
    const { navigation } = this.props;
    const {
      firstName,
      lastName,
      email,
      phone,
      isPhoneValid,
      password,
      confirmPassword,
    } = this.state;

    if (
      !firstName
      || !lastName
      || !email
      || !isPhoneValid
      || !password
      || !confirmPassword
    ) {
      Toast.showError('Please Be Sure All Fields are Filled', 'All Fields Are Required');

      return;
    }

    if (password !== confirmPassword) {
      Toast.showError('Passwords Do Not Match!', 'Check your Password');

      return;
    }

    const { length } = password;
    const hasUpperCase = (/[A-Z]/.test(password));
    const hasLowerCase = (/[a-z]/.test(password));

    if (
      (length < 8)
      || !validationUtils.hasNumber(password)
      || !hasUpperCase
      || !hasLowerCase
    ) {
      Toast.showError('Passwords Should be 8 characters minimum, 1 uppercase, 1 lowercase, 1 number!', 'Check your Password');

      return;
    }

    let error;

    SpinnerService.show();

    // checking user
    try {
      await AuthApi.checkUser(email, phone);
    } catch (e) {
      error = e;
    }

    SpinnerService.hide();

    if (error) {
      Toast.showError(error);
      return;
    }

    navigation.navigate('RegisterDetails', {
      form: {
        firstName,
        lastName,
        email,
        phone,
        password,
      },
    });
  }

  errorStatus() {
    const { error, message } = this.state;

    if (!error) {
      return null;
    }

    return (
      <View style={[gs.bgBlack, gs.p10, gs.borderR5]}>
        <Text bold style={[gs.colorWhite, gs.aICenter]}>
          {message}
        </Text>
      </View>
    );
  }

  render() {
    const { phoneFormat } = this.state;

    return (
      <Content
        style={gs.bgGray2A08}
        imageBg={background}
        useSafeAreaView
        registerNav={{
          title: 'Back to Login',
        }}
        footerButtonProps={[{
          text: 'NEXT',
          onPress: () => {
            this.nextScreen();
          },
        }]}
      >

        <View style={[gs.flex, gs.jCCenter, gs.aICenter]}>
          <Image
            style={[gs.size80, gs.mB20]}
            source={logo}
          />

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

        </View>

      </Content>
    );
  }
}

export default Register;
