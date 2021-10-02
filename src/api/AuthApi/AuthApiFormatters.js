
import _ from 'lodash';

export const memberTypesFormat = (data) => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((itemInp) => {
    const item = itemInp;

    return {
      ...item,
      id: parseInt(item.memberTypeId, 10),
    };
  });
};

export const authUserFormat = (dataInpt) => {
  if (!dataInpt) {
    return dataInpt;
  }

  const hasProfile = _.get(dataInpt, 'profile');

  if (!hasProfile) {
    return dataInpt;
  }

  const data = dataInpt;

  const profileType = _.get(data, 'profile.type');
  const profileMemberType = _.get(data, 'profile.member_type');
  if (profileType && !profileMemberType) {
    data.profile.member_type = profileType;
  }

  return data;
};
