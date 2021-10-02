
import * as types from './actionTypes';

const initialState = {
  isApiRequest: false,
};

const ACTION_HANDLERS = {
  [types.API_REQUEST_BEGIN]: (state) => ({
    ...state,
    isApiRequest: true,
  }),
  [types.API_REQUEST_END]: (state) => ({
    ...state,
    isApiRequest: false,
  }),
};

const NetworkReducer = (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};

export default NetworkReducer;
