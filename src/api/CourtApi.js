
import ApiUtils from 'src/utils/ApiUtils';
import {
  courtsListFormat,
} from './CourtApiFormatters';

class GameApi {
  static async getCourts(data = {}, useSpinner = true) {
    try {
      const resApi = await ApiUtils.postJamesService({
        type: ApiUtils.TYPES.GET_COURTS,
        data,
      }, {
        useSpinner,
      });

      const res = courtsListFormat(resApi.data);

      return res;
    } catch (e) {
      throw new Error(e);
    }
  }

  static async searchCourts(data = {}, useSpinner = true) {
    try {
      const resApi = await ApiUtils.postJamesService({
        type: ApiUtils.TYPES.SEARCH_COURTS,
        data,
      }, {
        useSpinner,
      });

      const res = courtsListFormat(resApi.data);

      return res;
    } catch (e) {
      throw new Error(e);
    }
  }
}

export default GameApi;
