
import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  Button,
} from 'native-base';
import {
  appleAuth,
} from '@invertase/react-native-apple-authentication';
import {
  useDispatch,
  useSelector,
} from 'react-redux';

import deviceUtils from 'src/utils/deviceUtils';

import {
  authAppleLoginSet,
  authAppleLoginSelector,
} from 'src/reducers/auth';

import {
  gs,
} from 'src/styles';

const AppleLogin = ({
  onSuccess,
  onError,
  onCanceled,
}) => {
  const dispatch = useDispatch();
  const userInfo = useSelector(authAppleLoginSelector());

  const onErrorInner = (error) => {
    onError(error);
  };

  const onSuccessInner = (userInfoInp) => {
    const { email, fullName: { givenName, familyName } } = userInfoInp;
    const res = {
      email,
      givenName,
      familyName,
    };

    onSuccess(res);
  };

  const procIOS = async () => {
    let appleAuthRequestResponse;
    let credentialState;

    try {
      appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
    } catch (e) {
      onErrorInner(e);
      return;
    }

    try {
      credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
    } catch (e) {
      onErrorInner(e);
      return;
    }

    if (credentialState === appleAuth.State.AUTHORIZED) {
      const { email } = appleAuthRequestResponse;

      if (!email) {
        if (userInfo) {
          onSuccessInner(userInfo);
          return;
        }

        onErrorInner('No email provided');

        return;
      }

      onSuccessInner(appleAuthRequestResponse);
      dispatch(authAppleLoginSet(appleAuthRequestResponse));
    } else {
      onCanceled();
    }
  };

  const onPressButton = async () => {

    if (deviceUtils.isIOS) {
      procIOS();
    }
  };

  return (
    <Button
      style={[gs.bgGray, gs.flex]}
      full
      onPress={onPressButton}
      rounded
    >
      <Icon
        type="FontAwesome"
        name="apple"
      />
    </Button>
  );
};

AppleLogin.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func,
  onCanceled: PropTypes.func,
};

AppleLogin.defaultProps = {
  onError: () => null,
  onCanceled: () => null,
};

export default AppleLogin;
