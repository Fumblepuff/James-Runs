
import _ from 'lodash';

export default {
  toMilliseconds(date) {
    let d;
    if (_.isNil(date) === false && _.isDate(date)) {
      d = date;
    } else {
      d = new Date();
    }

    return d.getTime();
  },

};
