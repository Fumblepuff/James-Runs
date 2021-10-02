
import moment from 'src/common/moment';

export default {
  getTime(time) {
    const res = moment(time).format('hh:mm A');

    return res;
  },

  getTimeFromUtc(time) {
    const res = moment(time).format('hh:mm A');

    return res;
  },

  getUtcDateTime(datetime) {
    const res = moment(datetime).utc().format();

    return res;
  },

  utcToEst(datetime) {
    if (!datetime) {
      return datetime;
    }

    const res = moment.utc(datetime).tz('America/New_York').format('LLL');

    return res;
  },
};
