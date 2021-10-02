
import _ from 'lodash';
import { createSelector } from 'reselect';

export const authProfileSelector = () => createSelector(
  [(state) => state.auth.user.profile],
  (resInp) => {
    if (!resInp) {
      return resInp;
    }

    const res = { ...resInp };

    res.id = parseInt(res.id, 10);
    res.member_type = parseInt(res.member_type, 10);

    return res;
  },
);

export const authUserIdSelector = () => createSelector(
  [(state) => _.get(state.auth, 'user.profile.id')],
  (a) => a && parseInt(a, 10),
);

export const authAppleLoginSelector = () => createSelector(
  [(state) => state.auth.appleLogin],
  (a) => a,
);

export const authMemberTypesSelector = () => createSelector(
  [(state) => state.auth.memberTypes.data],
  (a) => a,
);
