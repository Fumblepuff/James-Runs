
import AuthReducer from './auth';
import gamesReducer from './games';
import transactionReducer from './transaction';
import networkReducer from './network';

export default {
  auth: AuthReducer,
  games: gamesReducer,
  transactions: transactionReducer,
  network: networkReducer,
};
