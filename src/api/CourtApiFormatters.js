/* eslint-disable import/prefer-default-export */

import generalUtils from 'src/utils/generalUtils';

export const courtsListFormat = (data) => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((itemInp) => {
    const item = itemInp;
    const image = generalUtils.getItemImage(item.imageName);
    const addressFormat = generalUtils.getAddressFormat(item);

    return {
      ...item,
      image,
      addressFormat,
    };
  });
};
