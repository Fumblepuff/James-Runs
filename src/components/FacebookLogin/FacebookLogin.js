
import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  Button,
} from 'native-base';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

import deviceUtils from 'src/utils/deviceUtils';
import {
  StyleType,
} from 'src/common/Types';

import {
  gs,
} from 'src/styles';

const FacebookLogin = ({
  onSuccess,
  onError,
  onCanceled,
  style,
}) => {
  const onErrorInner = (error) => {
    onError(error);
  };

  // eslint-disable-next-line no-unused-vars
  const logout = (accessToken) => {
    const logoutReq = new GraphRequest(
      'me/permissions/',
      {
        accessToken,
        httpMethod: 'DELETE',
      },
      (error, _result) => {
        if (error) {
          // empty
        } else {
          LoginManager.logOut();
        }
      },
    );

    new GraphRequestManager().addRequest(logoutReq).start();
  };

  const responseInfoCallback = (error, result) => {
    if (error) {
      onErrorInner('Error request');
    } else {
      // eslint-disable-next-line camelcase
      const { email, first_name, last_name } = result;
      const userInfo = {
        email,
        givenName: first_name,
        familyName: last_name,
      };

      onSuccess(userInfo);
    }
  };

  const getFacebookUserInfo = async (accessToken) => {
    const profileRequestParams = {
      fields: {
        string: 'id, name, email, first_name, last_name, gender',
      },
    };
    const profileRequestConfig = {
      parameters: profileRequestParams,
      accessToken,
    };

    const infoRequest = new GraphRequest('/me', profileRequestConfig, responseInfoCallback);

    new GraphRequestManager().addRequest(infoRequest).start();
  };

  const getAccessToken = async () => {
    const data = await AccessToken.getCurrentAccessToken();
    const res = data ? data.accessToken : null;

    return res;
  };

  const onPressButton = async () => {
    if (!deviceUtils.isIOS) {
      LoginManager.setLoginBehavior('web_only');
    }

    const accessToken = await getAccessToken();

    if (accessToken) {
      // logout(accessToken);
      getFacebookUserInfo(accessToken);
    } else {
      try {
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
        if (result.isCancelled) {
          onCanceled();
        } else {
          const accessTokenTwo = await getAccessToken();
          getFacebookUserInfo(accessTokenTwo);
        }
      } catch (error) {
        onErrorInner('Login error');
      }
    }
  };

  return (
    <Button
      style={[gs.bgBlue2, gs.flex, style]}
      full
      onPress={onPressButton}
      rounded
    >
      <Icon
        type="FontAwesome"
        name="facebook"
      />
    </Button>
  );
};

FacebookLogin.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func,
  onCanceled: PropTypes.func,
  style: StyleType,
};

FacebookLogin.defaultProps = {
  onError: () => null,
  onCanceled: () => null,
  style: {},
};

export default FacebookLogin;
