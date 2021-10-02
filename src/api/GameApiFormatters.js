/* eslint-disable camelcase */

import _ from 'lodash';

import generalUtils from 'src/utils/generalUtils';
import gameUtils from 'src/utils/gameUtils';

const gamesListSkillsFormat = (item) => {
  const res = item;

  if (
    !item
    || (
      item
      && !item.skills
    )
  ) {
    return res;
  }

  _.forEach(item.skills, (itemTmp, key) => {
    const itemNew = { ...itemTmp };
    const { n, spots_needed } = itemNew;

    if (
      _.isNil(n)
      && !_.isNil(spots_needed)
    ) {
      itemNew.n = spots_needed;
    }

    if (
      _.isNil(spots_needed)
      && !_.isNil(n)
    ) {
      itemNew.spots_needed = n;
    }

    res.skills[key] = itemNew;
  });

  return res;
};

export const gamesListFormat = (data) => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((itemInp) => {
    const item = itemInp;
    const {
      skills,
    } = item;
    const image = generalUtils.getItemImage(item.imageName);
    const addressFormat = generalUtils.getAddressFormat(item);

    let res = {
      ...item,
      image,
      addressFormat,
      active: parseInt(item.active, 10),
      runEnd: parseInt(item.runEnd, 10),
      type: parseInt(item.type, 10),
    };

    if (skills) {
      if (
        Array.isArray(skills)
        && (skills.length < 1)
      ) {
        res.skills = {};
      }
    }

    res = gamesListSkillsFormat(res);

    const spots = gameUtils.getSpots(res);
    res.spots = spots.spots;
    res.spotsReserved = spots.spotsReserved;

    return res;
  });
};

export const gamesBallersFormat = (data) => {
  if (!Array.isArray(data)) {
    return [];
  }

  const res = _.orderBy(data, ['checkInDate'], ['asc']);

  return res;
};

export const gamesRunGameFormat = (data) => {
  if (!data) {
    return data;
  }

  if (!_.isObject(data)) {
    return data;
  }

  return {
    ...data,
    Home: data.Home ? parseInt(data.Home, 10) : 0,
    Guest: data.Guest ? parseInt(data.Guest, 10) : 0,
    active: data.active ? parseInt(data.active, 10) : 0,
    complete: data.complete ? parseInt(data.complete, 10) : 0,
  };
};
