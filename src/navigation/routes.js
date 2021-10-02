
import AppUpdate from 'src/screens/AppUpdate';
import AppError from 'src/screens/AppError';
import Login from 'src/screens/onboarding/Login';
import Register from 'src/screens/onboarding/Register';
import RegisterDetails from 'src/screens/onboarding/RegisterDetails';
import GameListing from 'src/screens/GameListing';
import RunListing from 'src/screens/RunListing';
import Ballers from 'src/screens/Ballers';
import BallerProfile from 'src/screens/BallerProfile';
import SingleRun from 'src/screens/SingleRun';
import ExhibitionGame from 'src/screens/ExhibitionGame';
import TeamBoard from 'src/screens/TeamBoard';
import Run from 'src/screens/Run';
import ReserveSpot from 'src/screens/ReserveSpot';
import Courts from 'src/screens/Courts';

import EditBaller from 'src/screens/management/EditBaller';
import AddGame, {
  AddGameList,
  AddGameTeams,
  AddGameFinal,
  AddGameNoStaff,
} from 'src/screens/management/AddGame';
import EditCourt from 'src/screens/management/EditCourt';
import NewMember from 'src/screens/management/NewMember';
import NewCourt from 'src/screens/management/NewCourt';
import Profile from 'src/screens/Profile';
import Management from 'src/screens/management/Management';
import ManageCourts from 'src/screens/management/ManageCourts';

import routeNames from './routeNames';

const appPreLaunchRoutes = [
  {
    name: routeNames.APP_UPDATE,
    component: AppUpdate,
  },
  {
    name: routeNames.APP_ERROR,
    component: AppError,
  },
];

const authRoutes = [
  {
    name: routeNames.LOGIN,
    component: Login,
    options: {
      title: '',
    },
  },
  {
    name: routeNames.REGISTER,
    component: Register,
    options: {
      title: '',
    },
  },
  {
    name: routeNames.REGISTER_DETAILS,
    component: RegisterDetails,
    options: {
      title: '',
    },
  },
];

const managementTabRoutes = [
  {
    name: routeNames.BALLER,
    component: Management,
  },
  {
    name: routeNames.COURT,
    component: ManageCourts,
  },
  {
    name: routeNames.TEAM,
    component: Management,
  },
  {
    name: routeNames.LEAGUE,
    component: Management,
  },
];

const statRoutes = [
  {
    name: routeNames.GAME_LISTING,
    component: GameListing,
  },
  {
    name: routeNames.RUN_LISTING,
    component: RunListing,
  },
  {
    name: routeNames.PROFILE,
    component: Profile,
  },
  {
    name: routeNames.NEW_MEMBER,
    component: NewMember,
  },
  {
    name: routeNames.BALLER_PROFILE,
    component: BallerProfile,
  },
  {
    name: routeNames.BALLERS,
    component: Ballers,
  },
];

const managementScreensRoutes = [
  {
    name: routeNames.EDIT_COURT,
    component: EditCourt,
  },
  {
    name: routeNames.EDIT_BALLER,
    component: EditBaller,
    options: {
      // headerShown: true,
    },
  },
  {
    name: routeNames.RESERVE_SPOT_MANAGER,
    component: ReserveSpot,
  },
];

const commonScreensRoutes = [
  {
    name: routeNames.EXHIBITION_GAME,
    component: ExhibitionGame,
  },
  {
    name: routeNames.SINGLE_RUN,
    component: SingleRun,
  },
  {
    name: routeNames.TEAM_BOARD,
    component: TeamBoard,
  },
  {
    name: routeNames.RUN,
    component: Run,
  },
  {
    name: routeNames.RESERVE_SPOT,
    component: ReserveSpot,
  },
  {
    name: routeNames.ADD_GAME,
    component: AddGame,
  },
  {
    name: routeNames.ADD_GAME_LIST,
    component: AddGameList,
  },
  {
    name: routeNames.ADD_GAME_TEAMS,
    component: AddGameTeams,
  },
  {
    name: routeNames.ADD_GAME_FINAL,
    component: AddGameFinal,
  },
  {
    name: routeNames.ADD_GAME_NO_STAFF,
    component: AddGameNoStaff,
  },
  {
    name: routeNames.COURTS,
    component: Courts,
  },
  {
    name: routeNames.NEW_COURT,
    component: NewCourt,
  },
];

const routes = {
  appPreLaunchRoutes,
  authRoutes,
  statRoutes,
  managementTabRoutes,
  managementScreensRoutes,
  commonScreensRoutes,
};

export default routes;
