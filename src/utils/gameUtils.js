/* eslint-disable camelcase */

import _ from 'lodash';

import authUtils from 'src/utils/authUtils';

export default {
  TYPES: {
    LEAGUE: 2, // games
    PICKUP: 1, // runs
    GAME: 2, // games
    RUN: 1, // runs
  },

  SKILL_TYPES: {
    ORGANIZER: 3,
    STATKEEPER: 8,
    SCOREKEEPER: 32,
  },

  GAME_TEAM_STATUS: {
    ACTIVE: 1,
    COMPLETED: 1,
  },

  GAME_TEAM_TAB_TYPES: {
    BALLERS: 'ballers',
    BENCH: 'bench',
    NEXT: 'next',
  },

  GAME_TEAMS: {
    HOME: 'Home',
    GUEST: 'Guest',
    CLEAR: 'Clear',
  },

  isGameTeamActive(gameInfo) {
    const active = _.get(gameInfo, 'active', 0);
    const res = parseInt(active, 10) === this.GAME_TEAM_STATUS.ACTIVE;

    return res;
  },

  isGameTeamCompleted(gameInfo) {
    const complete = _.get(gameInfo, 'complete', 0);
    const res = parseInt(complete, 10) === this.GAME_TEAM_STATUS.COMPLETED;

    return res;
  },

  isPickUpGame(type) {
    const res = (parseInt(type, 10) === this.TYPES.PICKUP);

    return res;
  },

  getSkillsNeeded(skills) {
    const res = {};

    if (!skills) {
      return res;
    }

    _.forEach(skills, (item, key) => {
      res[key] = parseInt(item.n, 10);
    });

    return res;
  },

  getSpots(item) {
    const res = {
      spots: 0,
      spotsReserved: 0,
    };

    if (
      !item
      || (
        item
        && !item.skills
      )
    ) {
      return res;
    }

    _.forEach(item.skills, (itemTmp) => {
      const { n, spots_needed } = itemTmp;
      const a = _.get(itemTmp, 'a', 0);
      let spotsNeededFormat = 0;

      if (
        _.isNil(n)
        && !_.isNil(spots_needed)
      ) {
        spotsNeededFormat = spots_needed;
      }

      if (
        _.isNil(spots_needed)
        && !_.isNil(n)
      ) {
        spotsNeededFormat = n;
      }

      const availableSpots = parseInt(a, 10);
      const neededSpots = parseInt(spotsNeededFormat, 10);
      const reservedSpots = neededSpots - availableSpots;

      res.spots += availableSpots;
      res.spotsReserved += reservedSpots;
    });

    return res;
  },

  hasUserAnySkillReserved(item, userId) {
    let res = false;
    const userIdFormat = (typeof userId !== 'string') ? userId.toString() : userId;

    if (
      !item
      || (
        item
        && !item.skills
      )
    ) {
      return res;
    }

    _.forEach(item.skills, (itemTmp) => {
      const { reserved } = itemTmp;

      if (reserved && Array.isArray(reserved)) {
        if (reserved.includes(userIdFormat)) {
          res = true;

          return false;
        }
      }

      return true;
    });

    return res;
  },

  canUserStartRunBySkill(user, item) {
    let res = false;
    const { id, member_type } = user;
    const userIdString = id.toString();

    if ([
      authUtils.MEMBER_TYPES.ADMIN,
      authUtils.MEMBER_TYPES.STAFF,
    ].includes(member_type)) {
      return true;
    }

    if (
      !item
      || (
        item
        && !item.skills
      )
    ) {
      return res;
    }

    _.forEach(item.skills, (itemTmp, skillId) => {
      const { reserved } = itemTmp;
      const skillIdFormat = parseInt(skillId, 10);

      if (
        (skillIdFormat === this.SKILL_TYPES.ORGANIZER)
        || (skillIdFormat === this.SKILL_TYPES.STATKEEPER)
        || (skillIdFormat === this.SKILL_TYPES.SCOREKEEPER)
      ) {
        if (reserved && Array.isArray(reserved)) {
          if (reserved.includes(userIdString)) {
            res = true;

            return false;
          }
        }
      }

      return true;
    });

    return res;
  },
};
