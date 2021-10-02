
import _ from 'lodash';

export default {
  formatOptions(data, keyName) {
    if (!Array.isArray(data)) {
      return data;
    }

    if (data.length < 1) {
      return data;
    }

    const isObject = (data.length > 0) && (_.isObject(data[0]));

    if (isObject) {
      const dataFormat = data.map((item) => ({ ...item, text: item[keyName] || 'nokey' }));
      return dataFormat;
    }

    return data;
  },
};
