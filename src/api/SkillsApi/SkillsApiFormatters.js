/* eslint-disable import/prefer-default-export */

export const skillsFormat = (data) => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((itemInp) => {
    const item = itemInp;

    return {
      ...item,
      id: parseInt(item.id, 10),
      reserve: parseInt(item.reserve, 10),
    };
  });
};
