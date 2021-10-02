
import * as types from './actionTypes';

export const apiRequestBegin = () => ({
  type: types.API_REQUEST_BEGIN,
});

export const apiRequestEnd = () => ({
  type: types.API_REQUEST_END,
});
