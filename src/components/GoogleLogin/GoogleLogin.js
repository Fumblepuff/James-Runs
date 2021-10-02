
import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  Button,
} from 'native-base';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-community/google-signin';

import {
  gs,
} from 'src/styles';

const GoogleLogin = ({
  onSuccess,
  onError,
  onCanceled,
}) => {
  const [userInfo, setUserInfo] = React.useState();

  const onErrorInner = (error) => {
    onError(error);
  };

  const onSuccessInner = (userInfoInp) => {
    if (!userInfoInp) {
      return;
    }

    const { email, givenName, familyName } = userInfoInp;
    const res = {
      email,
      givenName,
      familyName,
    };

    onSuccess(res);
  };

  const onPressButton = async () => {
    if (userInfo) {
      onSuccessInner(userInfo);
      return;
    }

    try {
      const info = await GoogleSignin.signIn();

      setUserInfo(info.user);
      onSuccessInner(info.user);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        onCanceled();
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        onErrorInner(error);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        onErrorInner(error);
      } else {
        // some other error happened
        onErrorInner(error);
      }
    }
  };

  // eslint-disable-next-line no-unused-vars
  const logout = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      // empty
    }
  };

  const getCurrentUserInfo = async () => {
    try {
      const info = await GoogleSignin.signInSilently();

      setUserInfo(info.user);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // user has not signed in yet
      } else {
        // some other error
      }
    }
  };

  React.useEffect(() => {
    GoogleSignin.configure();

    // logout();
    getCurrentUserInfo();
  }, []);

  return (
    <Button
      style={[gs.bgRed3, gs.flex]}
      full
      onPress={onPressButton}
      rounded
    >
      <Icon
        type="FontAwesome"
        name="google"
      />
    </Button>
  );
};

GoogleLogin.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func,
  onCanceled: PropTypes.func,
};

GoogleLogin.defaultProps = {
  onError: () => null,
  onCanceled: () => null,
};

export default GoogleLogin;
