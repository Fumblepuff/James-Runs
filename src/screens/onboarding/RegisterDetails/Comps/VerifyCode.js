
import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
} from 'react-native';
import { Button } from 'native-base';
import { useDispatch } from 'react-redux';
import { Auth } from 'aws-amplify';

import Toast from 'src/utils/toastUtils';

import Modal from 'src/components/Modal';
import TextInput from 'src/components/TextInput';

import { authSetLoginUser } from 'src/reducers/auth';

import AuthApi from 'src/api/AuthApi';

import {
  SpinnerService,
} from 'src/services';

import {
  gs,
  formStyles,
} from 'src/styles';

const VerifyCode = ({
  visible,
  onClose,
  form,
}) => {
  const { email } = form;
  const dispatch = useDispatch();
  const [code, setCode] = React.useState();

  const onResendCode = () => {
    SpinnerService.show();

    Auth.resendSignUp(email).then(() => {
      Toast.show('Verification Code Resent!');
    }).catch((e) => {
      Toast.showError(e);
    }).finally(() => {
      SpinnerService.hide();
    });
  };

  const onVerify = async () => {
    let error;

    if (!code) {
      return;
    }

    SpinnerService.show();

    try {
      const apiRes = await Auth.confirmSignUp(email, code);

      if (apiRes !== 'SUCCESS') {
        error = 'Verification Incorrect';
      }
    } catch (e) {
      error = e;
    }

    if (error) {
      Toast.showError(error);
      SpinnerService.hide();
      return;
    }

    try {
      await AuthApi.registerUser(form);
    } catch (e) {
      Toast.showError(e);
      SpinnerService.hide();
      return;
    }

    try {
      const userInfo = await AuthApi.loginUser(email);

      dispatch(authSetLoginUser(userInfo));
    } catch (e) {
      Toast.showError(e);
      return;
    }

    SpinnerService.hide();
  };

  return (
    <Modal
      isVisible={visible}
      onClose={onClose}
      styleContent={gs.jCCenter}
    >
      <View style={gs.aICenter}>
        <TextInput
          onChangeText={setCode}
          style={gs.textCenter}
          keyboardType="number-pad"
          autoFocus
          placeholder="Enter Verification Number"
        />

        <Button
          full
          style={formStyles.resendBtn}
          onPress={onResendCode}
        >
          <Text style={[gs.fontBold, gs.colorWhite]}>RESEND CODE</Text>
        </Button>
        <Button
          full
          style={formStyles.nextButton}
          onPress={onVerify}
        >
          <Text style={[gs.colorWhite, gs.fS18, gs.textCenter]}>Verify</Text>
        </Button>

      </View>
    </Modal>
  );
};

VerifyCode.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
};

export default VerifyCode;
