import axios from 'axios';

import ConfigUtils from 'src/utils/ConfigUtils';
import Api from 'src/utils/ApiUtils';
import SkillsApi from 'src/api/SkillsApi';

const SET_BALLERS = 'SET_BALLERS';

const LIST_SQUADS = 'LIST_SQUADS';

const LIST_COURTS = 'LIST_COURTS';

const ADD_TO_LIST = 'ADD_TO_LIST';

const RESET_LIST = 'RESET_LIST';

const ACTIVE_GAME = 'ACTIVE_GAME';

const RESET_SCHEDULE = 'RESET_SCHEDULE';

const ADD_TO_SCHEDULE = 'ADD_TO_SCHEDULE';

const VIEW = 'VIEW';

const VIEW_DATE = 'VIEW_DATE';

const GROUPS = 'GROUPS';

const GROUPS_ADD_DATA = 'GROUPS_ADD_DATA';

const RESET_GROUPS = 'RESET_GROUPS';

const LOAD_GROUPS = 'LOAD_GROUPS';

const GAMES_SKILLS_REQUEST = 'GAMES_SKILLS_REQUEST';

const GAMES_NEW_EVENT = 'GAMES_NEW_EVENT';

const GAMES_NEW_EVENT_ADD_COURT = 'GAMES_NEW_EVENT_ADD_COURT';

const GAMES_NEW_EVENT_UPDATE_DATA = 'GAMES_NEW_EVENT_UPDATE_DATA';

const INITIAL_STATE = {
  squads: [],
  ballers: [],
  courts: [],
  addToList: [],
  addToSchedule: [],
  groups: {},
  activeGame: {},
  skills: [],
  newEvent: {
    type: null,
    isAdminMenu: false,
    court: null,
    data: {},
  },
};

/* -------------- ACTION CREATORS -------------- */

export const runGroups = (groups) => ({ type: GROUPS, payload: groups });

export const runGroupsAddData = (payload) => ({ type: GROUPS_ADD_DATA, payload });

export const loadGroups = (groups) => ({ type: LOAD_GROUPS, payload: groups });

export const displayView = (view) => ({ type: VIEW, payload: view });

export const viewDate = (viewDateInp) => ({ type: VIEW_DATE, payload: viewDateInp });

export const activeGame = (payload) => ({ type: ACTIVE_GAME, payload });

export const addToList = (list) => ({ type: ADD_TO_LIST, payload: list });

export const addToSchedule = (date) => ({ type: ADD_TO_SCHEDULE, payload: date });

export const resetGroups = () => ({ type: RESET_GROUPS });

export const resetList = () => ({ type: RESET_LIST });

export const resetSchedule = () => ({ type: RESET_SCHEDULE });

export const setBallers = (ballers) => ({ type: SET_BALLERS, payload: ballers });

export const listSquads = (squads) => ({ type: LIST_SQUADS, payload: squads });

export const listCourts = (courts) => ({ type: LIST_COURTS, payload: courts });

export const gamesSkills = (payload) => ({ type: GAMES_SKILLS_REQUEST, payload });

export const gamesNewEventAddCourt = (payload) => ({ type: GAMES_NEW_EVENT_ADD_COURT, payload });

export const gamesNewEvent = (payload) => ({ type: GAMES_NEW_EVENT, payload });

export const gamesNewEventUpdateData = (payload) => ({ type: GAMES_NEW_EVENT_UPDATE_DATA, payload });

/* -------------- ASYNC ACTION CREATORS -------------- */

export const fetchGamesSkills = (useService) => (dispatch) => {
  SkillsApi.getSkills(useService).then((res) => {
    dispatch(gamesSkills(res));
  }).catch((_e) => {
    // empty
  });
};

export const getList = (list) => (dispatch) => {
  Api.post('james.php',
    { list })
    .then((res) => {
      switch (list) {
        case 'ballers':
          dispatch(setBallers(res.data));

          break;
        case 'squads':
          dispatch(listSquads(res.data));
          break;

        default:
          // statements_def
          break;
      }
    })
    .catch((error) => console.error(error));
};

export const getBaller = (baller) => (_dispatch) => new Promise((resolve, reject) => {
  try {
    Api.post('user.php',
      { data: baller })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => console.error(error));
  } catch (e) {
    reject(e);
  }
});

export const getRun = (run, type) => (_dispatch) => new Promise((resolve, reject) => {
  try {
    Api.post('james.php',
      { type, data: run })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => console.error(error));
  } catch (e) {
    reject(e);
  }
});

export const getLocation = (location) => (_dispatch) => new Promise((resolve, reject) => {
  const { googleApi } = ConfigUtils.get();

  try {
    axios.post(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${location}&key=${googleApi}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => console.error(error));
  } catch (e) {
    reject(e);
  }
});

export const getLocationDetails = (locationID) => (_dispatch) => new Promise((resolve, reject) => {
  const { googleApi } = ConfigUtils.get();

  try {
    axios.post(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${locationID}&key=${googleApi}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => console.error(error));
  } catch (e) {
    reject(e);
  }
});

export const squadApi = (userId, type, data) => (dispatch) => {
  Api.post('james.php',
    { id: userId, type, data })
    .then((res) => {
      switch (type) {
        case 'addSquad':

          const squad = res.data;
          dispatch(getList('squads'));
          dispatch(resetList());
          dispatch(resetSchedule());

          break;
        case 'updateSquad':

          const update = res.data;
          dispatch(resetList());
          dispatch(getList('squads'));

          break;
        case 'updateSquadRun':

          const updateRun = res.data;
          dispatch(resetSchedule());
          dispatch(getList('squads'));

          break;
        case 'runPoint':

          const point = res.data;

          break;
        case 'newRun':

          const run = res.data;
          dispatch(resetSchedule());
          dispatch(addToSchedule(run));

          break;
        case 'checkWinner':

          const winner = res.data;
          dispatch(resetList());
          dispatch(addToList(winner));

          break;

        case 'checkTeams':

          const groups = res.data;

          if (groups){
            dispatch(resetGroups());
            dispatch(loadGroups(groups));
          }

          break;

        case 'showRunGames':

          const games = res.data;

          if (games){
            dispatch(resetGroups());
            dispatch(loadGroups(games));
          }

          break;
        default:
          // statements_def
          break;
      }
    })
    .catch((error) => console.error(error));
};

export const getSquad = (userId, type, data) => (dispatch) => {
  Api.post('james.php',
    { id: userId, type, data })
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((error) => console.error(error));
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_TO_LIST:
      return { ...state, addToList: [...state.addToList, action.payload] };

    case GROUPS:
      return { ...state, groups: action.payload };

    case GROUPS_ADD_DATA:
      return {
        ...state,
        groups: {
          ...state.groups,
          ...action.payload,
        },
      };

    case LOAD_GROUPS:
      return { ...state, groups: action.payload };

    case RESET_GROUPS:
      return { ...state, groups: INITIAL_STATE.groups };

    case VIEW:
      return { ...state, view: action.payload };

    case ACTIVE_GAME:
      return { ...state, activeGame: action.payload };

    case VIEW_DATE:
      return { ...state, viewDate: action.payload };

    case ADD_TO_SCHEDULE:
      return { ...state, addToSchedule: [...state.addToSchedule, action.payload] };

    case RESET_SCHEDULE:
      return { ...state, addToSchedule: [] };

    case RESET_LIST:
      return { ...state, addToList: [] };

    case SET_BALLERS:
      return { ...state, ballers: action.payload };

    case LIST_SQUADS:
      return { ...state, squads: action.payload };

    case LIST_COURTS:
      return { ...state, courts: action.payload };

    case GAMES_SKILLS_REQUEST:
      return { ...state, skills: action.payload };

    case GAMES_NEW_EVENT_ADD_COURT:
      return {
        ...state,
        newEvent: {
          ...state.newEvent,
          court: action.payload,
        },
      };

    case GAMES_NEW_EVENT: {
      const { payload = {} } = action;
      const {
        court = INITIAL_STATE.newEvent.court,
        isAdminMenu = INITIAL_STATE.newEvent.isAdminMenu,
        type = INITIAL_STATE.newEvent.type,
      } = payload;

      return {
        ...state,
        newEvent: {
          ...INITIAL_STATE.newEvent,
          court,
          isAdminMenu,
          type,
        },
      };
    }

    case GAMES_NEW_EVENT_UPDATE_DATA: {
      const { payload = {} } = action;

      return {
        ...state,
        newEvent: {
          ...state.newEvent,
          data: {
            ...state.newEvent.data,
            ...payload,
          },
        },
      };
    }

    default:
      return state;
  }
};
