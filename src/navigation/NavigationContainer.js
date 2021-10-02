
import React, {
  useState,
  useEffect,
} from 'react';
import {
  Alert,
} from 'react-native';
import {
  NavigationContainer,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen';
import {
  useSelector,
  useDispatch,
} from 'react-redux';

import {
  getRun,
} from 'src/reducers/games';
import {
  setUser,
  authProfileSelector,
} from 'src/reducers/auth';
import {
  apiRequestBegin,
  apiRequestEnd,
} from 'src/reducers/network';

import ApiUtils from 'src/utils/ApiUtils';
import generalUtils from 'src/utils/generalUtils';

import {
  authUserFormat,
} from 'src/api/AuthApi';

import NavigationService from './NavigationService';
import {
  AppPreLaunchNavigator,
  AuthNavigator,
  StatNavigator,
} from './Navigators';
import routeNames from './routeNames';

export default () => {
  const dispatch = useDispatch();
  const profile = useSelector(authProfileSelector());
  const navigationRef = React.useRef(null);

  const [loadData, setLoadData] = useState({
    isLoaded: false,
    newVersion: false,
    error: false,
  });
  const {
    isLoaded,
    newVersion,
    error,
  } = loadData;

  const onSetLoadData = (dataInp) => {
    setLoadData({
      ...loadData,
      ...dataInp,
    });
  };

  useEffect(() => {
    if (isLoaded) {
      SplashScreen.hide();
    }
  }, [isLoaded]);

  useEffect(() => {
    async function checking() {
      try {
        const hasNewVersion = await generalUtils.hasNewAppVersion();

        if (hasNewVersion) {
          onSetLoadData({
            isLoaded: true,
            newVersion: true,
          });

          return;
        }
      } catch (e) {
        onSetLoadData({
          isLoaded: true,
          error: true,
        });

        return;
      }

      AsyncStorage.getItem('userId').then(async (token) => {
        const loadDataNew = {};
        dispatch(apiRequestBegin());

        if (token) {
          const user = { id: token };

          try {
            // I know it's terrible
            const resApi = await dispatch(getRun(user, ApiUtils.TYPES.GET_TYPES));
            const resApiFormat = (typeof res === 'string') ? resApi.trim() : authUserFormat(resApi);

            if (resApiFormat) {
              dispatch(setUser(resApiFormat));
            } else {
              loadDataNew.error = true;
            }
          } catch (e) {
            Alert.alert(e);

            loadDataNew.error = true;
          }
        }

        loadDataNew.isLoaded = true;
        onSetLoadData(loadDataNew);

        dispatch(apiRequestEnd());
      });
    }

    checking();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isLoaded) {
    return null;
  }

  const renderNavigators = () => {
    if (error) {
      return AppPreLaunchNavigator(routeNames.APP_ERROR);
    }

    if (newVersion) {
      return AppPreLaunchNavigator();
    }

    if (!profile) {
      return AuthNavigator();
    }

    return StatNavigator();
  };

  return (
    <NavigationContainer
      ref={(c) => {
        if (c) {
          navigationRef.current = c;
          NavigationService.setTopLevelNavigator(c);
        }
      }}
    >
      {renderNavigators()}
    </NavigationContainer>
  );
};
