import { REHYDRATE } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import Api from 'src/utils/ApiUtils';

import AuthApi from 'src/api/AuthApi';

const INITIAL_STATE = {
  loggedIn: false,
  user: {},
  register: [],
  appleLogin: null,
  memberTypes: {
    isLoading: false,
    data: [],
  },
};

/* --------------- ACTION TYPES --------------- */

const REGISTER = 'REGISTER';
const SET_USER = 'SET_USER';
const LOG_OUT = 'LOG_OUT';
const REFRESH = 'REFRESH';
const EDIT = 'EDIT';
const CACHE = 'CACHE';
const AUTH_APPLE_LOGIN_SET = 'AUTH_APPLE_LOGIN_SET';

const AUTH_MEMBER_TYPES_REQUEST = 'AUTH_MEMBER_TYPES_REQUEST';
const AUTH_MEMBER_TYPES_REQUEST_SUCCESS = 'AUTH_MEMBER_TYPES_REQUEST_SUCCESS';
const AUTH_MEMBER_TYPES_REQUEST_FAILED = 'AUTH_MEMBER_TYPES_REQUEST_FAILED';

/* -------------- ACTION CREATORS -------------- */

export const register = (registerInp) => ({ type: REGISTER, payload: registerInp });
export const setUser = (user) => ({ type: SET_USER, payload: user });
export const refresh = (refreshInp) => ({ type: REFRESH, payload: refreshInp });
export const addEdit = (edit) => ({ type: EDIT, payload: edit });
export const cacheData = (cache) => ({ type: CACHE, payload: cache });
export const logout = () => ({ type: LOG_OUT });
export const authAppleLoginSet = (payload) => (dispatch) => (dispatch({ type: AUTH_APPLE_LOGIN_SET, payload }));

const authMemberTypesRequest = () => ({ type: AUTH_MEMBER_TYPES_REQUEST });
const authMemberTypesRequestSuccess = (payload) => ({ type: AUTH_MEMBER_TYPES_REQUEST_SUCCESS, payload });
const authMemberTypesRequestFailed = () => ({ type: AUTH_MEMBER_TYPES_REQUEST_FAILED });

/* -------------- ASYNC ACTION CREATORS -------------- */

export const authMemberTypes = () => (dispatch) => {
  dispatch(authMemberTypesRequest());

  AuthApi.getMemberTypes().then((res) => {
    dispatch(authMemberTypesRequestSuccess(res));
  }).catch((_e) => {
    dispatch(authMemberTypesRequestFailed());
  });
};

export const login = (loginInp) => (_dispatch) => new Promise((resolve, reject) => {
  try {
    Api.post('login.php',
      { login: loginInp })
      .then((res) => {
        resolve(res.data);
        // if (res.status == 200) {
        //   const user = res.data;
        //   if(user.profile){

        //     AsyncStorage.setItem('userId',  user.profile.id);
        //     dispatch(setUser(user));
        //     dispatch({ type:"LOGIN" });
        //     resolve(user);

        //   }else{

        //     alert('Password or Email is incorrect');

        //   }

        // } else if (res.data.message) {
        //   alert(res.data.message);
        // }
      })
      .catch((error) => console.error(error));
  } catch (e) {
    reject(e);
  }
});

export const loginUser = (auth) => (dispatch) => new Promise((resolve, reject) => {
  try {
    Api.post('login.php',
      { login: auth })
      .then((res) => {
        if (res.status == 200) {
          const user = res.data;
          if (user.profile) {
            AsyncStorage.setItem('userId',  user.profile.id);
            dispatch(setUser(user));
            dispatch({ type: 'LOGIN' });
            resolve(user);
          } else {
            resolve(false);
          }
        } else if (res.data.message) {
          console.log(res.data.message);
        }
      })
      .catch((error) => console.error(error));
  } catch (e) {
    reject(e);
  }
});

export const authSetLoginUser = (user) => (dispatch) => {
  AsyncStorage.setItem('userId', user.profile.id);
  dispatch(setUser(user));
  dispatch({ type: 'LOGIN' });
};

export const checkLogin = (auth) => (_dispatch) => new Promise((resolve, reject) => {
  try {
    Api.post('login.php',
      { login: auth })
      .then((res) => {
        if (res.status == 200) {
          const user = res.data;
          if (user.profile) {
            resolve(user.profile);
          } else {
            resolve(false);
          }
        } else if (res.data.message) {
          console.log(res.data.message);
        }
      })
      .catch((error) => console.error(error));
  } catch (e) {
    reject(e);
  }
});

export const refreshUser = (user) => (dispatch) => {
  Api.post('user.php',
    { data: user })
    .then((res) => {
      if (res.status == 200) {
        const user = res.data;
        dispatch(refresh(user));
        console.log(user);
      } else if (res.data.message) {
        alert(res.data.message);
      }
    })
    .catch((error) => console.error(error));
};


export const uploadFile = (update) => (dispatch) => {
  Api.post('update.php',
    { userUpdate: update })
    .then((res) => {
      const user = res.data;
      dispatch(register(user));
    })
    .catch((error) => console.error(error));
};

export const registerUser = (userRegister) => (dispatch) => {
  Api.post('registration.php',
    { register: userRegister })
    .then((res) => {
      const user = res.data;
      dispatch(register(user));
      // dispatch(setDashboard(res.data));
    })
    .catch((error) => console.error(error));
};

export const logoutUser = () => (dispatch) => {
  AsyncStorage.removeItem('userId');
  dispatch({ type: 'LOGOUT' });
  dispatch(logout());
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REHYDRATE:
      const incoming = action.payload;

      if (incoming) {
        return { ...state };
      }
      return state;
    case EDIT:
      return { ...state, edit: action.payload };
    case CACHE:
      return { ...state, cache: action.payload };
    case REGISTER:
      return { ...state, register: action.payload };
    case REFRESH:
      return { ...state, user: action.payload };
    case SET_USER:
      return { ...state, loggedIn: true, user: action.payload };
    case LOG_OUT:
      return { ...state, loggedIn: false, user: [] };
    case AUTH_APPLE_LOGIN_SET:
      return { ...state, appleLogin: action.payload };

    case AUTH_MEMBER_TYPES_REQUEST:
      return {
        ...state,
        memberTypes: {
          ...state.memberTypes,
          isLoading: true,
        },
      };
    case AUTH_MEMBER_TYPES_REQUEST_SUCCESS:
      return {
        ...state,
        memberTypes: {
          data: action.payload,
          isLoading: false,
        },
      };
    case AUTH_MEMBER_TYPES_REQUEST_FAILED:
      return {
        ...state,
        memberTypes: {
          ...state.memberTypes,
          isLoading: false,
        },
      };

    default:
      return state;
  }
};
