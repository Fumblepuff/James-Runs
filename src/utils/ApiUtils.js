
import _ from 'lodash';

import {
  HttpService,
} from 'src/services';
import ConfigUtils from 'src/utils/ConfigUtils';
import HttpUtils from 'src/utils/HttpUtils';

class ApiUtils {
  static TYPES = {
    GET_TYPES: 'getUser',
    ADD_NEW_RUN: 'addNewRun',
    EDIT_RUN_GAME: 'editRunGame',
    DELETE_RUN_GAME: 'deleteRunGame',
    GET_RUN_DETAIL: 'getRunDetail',
    GET_COURTS: 'getCourts',
    SEARCH_COURTS: 'searchCourts',
    GET_MEMBER_TYPES: 'getMemberTypes',
    GET_MEMBER_SKILLS: 'getMemberSkills',
    RESERVE_SPOT: 'reserveSpot',
    REMOVE_SPOT: 'removeSpot',
    GET_RUN_BALLERS: 'getRunBallers',
    GET_NEXT_BALLERS: 'getNextBallers',
    GET_BENCH_BALLERS: 'getBenchBallers',
    GET_GAME_TEAMS: 'getGameTeams',
    ADD_USER_TEAM: 'addUserTeam',
    BALLER_BENCH: 'ballerBench',
    BALLER_NEXT: 'ballerNext',
    LIST_USER_PERMISSIONS: 'listUserPermissions',
    UPDATE_USER_PERMISSIONS: 'updateUserPermissions',
    GET_USER: 'getUser',
    UPDATE_USER: 'updateUser',
    GET_ALL_UPCOMING_RUNS: 'getAllUpcomingRuns',
    BALLER_CHECKIN: 'ballerCheckin',
    START_RUN: 'startRun',
    CHECK_USER: 'checkUser',
    REGISTER_USER: 'registerUser',
    ADD_NEW_EVENT_REQUEST: 'addNewEventRequest',
    REFER_POTENTIAL_STAFFER: 'referPotentialStaffer',
    SEARCH_TEAMS: 'searchTeams',
    ADD_NEW_TEAM: 'addNewTeam',
    GET_GAME_REQUEST_FORM1_DATA: 'getGameRequestForm1Data',
    SET_GAME_REQUEST_FORM1_DATA: 'setGameRequestForm1Data',
    GET_GAME_REQUEST_FORM2_DATA: 'getGameRequestForm2Data',
    SET_GAME_REQUEST_FORM2_DATA: 'setGameRequestForm2Data',
    GET_GAME_REQUEST_FORM3_DATA: 'getGameRequestForm3Data',
    SET_GAME_REQUEST_FORM3_DATA: 'setGameRequestForm3Data',
    TEAM_SCORE_BOOK: 'teamScoreBook',
    EVENT_REQUEST_PAYMENT_INTENT_HOLD: 'eventRequestPaymentIntentHold',
  }

  static headers() {
    const res = {
      'Content-Type': 'application/json',
    };

    return res;
  }

  static getUrl(urlInp) {
    const { apiUrl } = ConfigUtils.get();
    const res = `${apiUrl}${urlInp}`;

    return res;
  }

  static postLoginJames(data) {
    return this.post('login.php', data);
  }

  static userJames(data) {
    return this.post('user.php', data);
  }

  static postJames(data, options) {
    return this.post('james.php', data, options);
  }

  static post(url, data, options) {
    return this.proc('POST', url, data, false, undefined, options);
  }

  static postJamesService(data, optionsService, options) {
    return this.postService('james.php', data, optionsService, options);
  }

  static postService(url, data, optionsService, options) {
    return this.proc('POST', url, data, true, optionsService, options);
  }

  static proc(method, urlInp, data = {}, useHttpService = false, optionsService, optionsInp = {}) {
    const url = this.getUrl(urlInp);
    const headers = { ...ApiUtils.headers() };

    const options = {
      headers,
      ...optionsInp,
    };

    if (useHttpService) {
      return HttpService.proc(method, url, data, options, optionsService);
    }

    return HttpUtils.proc(method, url, data, options);
  }

  static hasError(data) {
    let res = null;

    if (_.isObject(data)) {
      if (
        (typeof data.data === 'string')
        && ([
          '<b>Fatal error</b>',
        ].some((v) => data.data.includes(v)))
      ) {
        res = 'wrong response data';

        if (__DEV__) {
          res = `${res}: ${data.data}`;
        }
      } else {
        res = _.get(data.data, 'error');
      }
    }

    return res;
  }

  static hasErrorNoData(result) {
    return this.hasError({ data: result });
  }
}

export default ApiUtils;
