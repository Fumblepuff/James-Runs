
import _ from 'lodash';

export default {
  MEMBER_TYPES: {
    ADMIN: 1,
    FAN: 2,
    PLAYER: 3,
    STAFF: 4,
  },
  DEFAULT_SKILL_REGISTER: 3, // run organizing
  GENDER_TYPES: {
    MALE: 'Male',
    FEMALE: 'Female',
    OTHER: 'Other',
  },

  getGenders() {
    const res = _.map(this.GENDER_TYPES, (item) => item);

    return res;
  },

  isOrganizer(userInfo) {
    let res = false;

    if (!userInfo.profile) {
      return res;
    }

    res = (parseInt(userInfo.profile.skillId, 10) === this.DEFAULT_SKILL_REGISTER);

    return res;
  },

  isAdmin(userInfo) {
    let res = false;

    if (!userInfo.profile) {
      return res;
    }

    res = (parseInt(userInfo.profile.member_type, 10) === this.MEMBER_TYPES.ADMIN);

    return res;
  },
};
