
import ApiUtils from 'src/utils/ApiUtils';

import {
  gamesListFormat,
} from './GameApiFormatters';

class GameApi {
  static async editRunGame(data) {
    try {
      await ApiUtils.postJamesService({
        type: ApiUtils.TYPES.EDIT_RUN_GAME,
        data,
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  static async deleteRunGame(runId) {
    try {
      await ApiUtils.postJamesService({
        type: ApiUtils.TYPES.DELETE_RUN_GAME,
        data: {
          runId,
        },
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  static async getRunDetail(runId) {
    try {
      const resApi = await ApiUtils.postJamesService({
        type: ApiUtils.TYPES.GET_RUN_DETAIL,
        data: {
          run: runId,
        },
      });

      return resApi.data;
    } catch (e) {
      throw new Error(e);
    }
  }

  static async getUpcomingEventData(type) {
    const resApi = await ApiUtils.postJames({
      type: ApiUtils.TYPES.GET_ALL_UPCOMING_RUNS,
      data: {
        type,
      },
    });

    return gamesListFormat(resApi.data);
  }

  static async ballerCheckin(data) {
    const resApi = await ApiUtils.postJamesService({
      type: ApiUtils.TYPES.BALLER_CHECKIN,
      data,
    });

    const error = ApiUtils.hasError(resApi);

    if (error) {
      throw new Error(error);
    }

    return resApi.data;
  }

  static async startRun(runId) {
    const resApi = await ApiUtils.postJamesService({
      type: ApiUtils.TYPES.START_RUN,
      data: {
        run: runId,
      },
    });

    const error = ApiUtils.hasError(resApi);

    if (error) {
      throw new Error(error);
    }

    return resApi.data;
  }

  static async addNewEvent(data) {
    const resApi = await ApiUtils.postJamesService({
      type: ApiUtils.TYPES.ADD_NEW_EVENT_REQUEST,
      ...data,
    });

    const error = ApiUtils.hasError(resApi);

    if (error) {
      throw new Error(error);
    }

    return resApi.data;
  }

  static async referStaffer(data) {
    const resApi = await ApiUtils.postJamesService({
      type: ApiUtils.TYPES.REFER_POTENTIAL_STAFFER,
      ...data,
    });

    const error = ApiUtils.hasError(resApi);

    if (error) {
      throw new Error(error);
    }

    return resApi.data;
  }

  static async getEventForm1Data(eventRequestId) {
    const resApi = await ApiUtils.postJamesService({
      type: ApiUtils.TYPES.GET_GAME_REQUEST_FORM1_DATA,
      eventRequestId,
    });

    const error = ApiUtils.hasError(resApi);

    if (error) {
      throw new Error(error);
    }

    return resApi.data;
  }

  static async setEventForm1Data(data) {
    const resApi = await ApiUtils.postJamesService({
      type: ApiUtils.TYPES.SET_GAME_REQUEST_FORM1_DATA,
      ...data,
    });

    const error = ApiUtils.hasError(resApi);

    if (error) {
      throw new Error(error);
    }

    return resApi.data.getGameRequestForm1Data;
  }

  static async getEventForm2Data(eventRequestId) {
    const resApi = await ApiUtils.postJamesService({
      type: ApiUtils.TYPES.GET_GAME_REQUEST_FORM2_DATA,
      eventRequestId,
    });

    const error = ApiUtils.hasError(resApi);

    if (error) {
      throw new Error(error);
    }

    return resApi.data;
  }

  static async setEventForm2Data(data) {
    const resApi = await ApiUtils.postJamesService({
      type: ApiUtils.TYPES.SET_GAME_REQUEST_FORM2_DATA,
      ...data,
    });

    const error = ApiUtils.hasError(resApi);

    if (error) {
      throw new Error(error);
    }

    return resApi.data.getGameRequestForm2Data;
  }

  static async getEventForm3Data(eventRequestId) {
    const resApi = await ApiUtils.postJamesService({
      type: ApiUtils.TYPES.GET_GAME_REQUEST_FORM3_DATA,
      eventRequestId,
    });

    const error = ApiUtils.hasError(resApi);

    if (error) {
      throw new Error(error);
    }

    return resApi.data;
  }

  static async setEventForm3Data(data) {
    const resApi = await ApiUtils.postJamesService({
      type: ApiUtils.TYPES.SET_GAME_REQUEST_FORM3_DATA,
      ...data,
    });

    const error = ApiUtils.hasError(resApi);

    if (error) {
      throw new Error(error);
    }

    return resApi.data.getGameRequestForm3Data;
  }

  static async eventRequestPaymentIntentHold(eventRequestId) {
    const resApi = await ApiUtils.postJamesService({
      type: ApiUtils.TYPES.EVENT_REQUEST_PAYMENT_INTENT_HOLD,
      eventRequestId,
    });

    const error = ApiUtils.hasError(resApi);

    if (error) {
      throw new Error(error);
    }

    return resApi.data;
  }
}

export default GameApi;
