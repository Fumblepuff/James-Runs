
import ApiUtils from 'src/utils/ApiUtils';
import authUtils from 'src/utils/authUtils';

import {
  memberTypesFormat,
  authUserFormat,
} from './AuthApiFormatters';

class AuthApi {
  static async getMemberTypes() {
    try {
      const resApi = await ApiUtils.postJames({
        type: ApiUtils.TYPES.GET_MEMBER_TYPES,
      });

      return memberTypesFormat(resApi.data);
    } catch (e) {
      throw new Error(e);
    }
  }

  static async getUser(userId) {
    try {
      const resApi = await ApiUtils.postJames({
        type: ApiUtils.TYPES.GET_USER,
        data: {
          id: userId,
        },
      });

      return authUserFormat(resApi.data);
    } catch (e) {
      throw new Error(e);
    }
  }

  static async updateUser(data) {
    try {
      await ApiUtils.postJames({
        type: ApiUtils.TYPES.UPDATE_USER,
        data,
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  static async getUserByUser(userId) {
    try {
      const resApi = await ApiUtils.userJames({
        data: {
          id: userId,
        },
      });

      return authUserFormat(resApi.data);
    } catch (e) {
      throw new Error(e);
    }
  }

  static async checkUser(email, phoneNumber) {
    const resApi = await ApiUtils.postJames({
      type: ApiUtils.TYPES.CHECK_USER,
      data: {
        email,
        phone_number: `+${phoneNumber}`,
      },
    });

    const error = ApiUtils.hasError(resApi);

    if (error) {
      throw new Error(error);
    }

    if (resApi.data.length > 0) {
      throw new Error('Email Already Registered');
    }

    return resApi.data;
  }

  static async registerUser(dataInp) {
    const data = {
      ...dataInp,
      type: authUtils.MEMBER_TYPES.STAFF,
      skillId: authUtils.DEFAULT_SKILL_REGISTER,
    };

    const resApi = await ApiUtils.postJames({
      type: ApiUtils.TYPES.REGISTER_USER,
      data,
    });

    const error = ApiUtils.hasError(resApi);

    if (error) {
      throw new Error(error);
    }

    const resApiData = resApi.data;

    if (resApiData && resApiData.error) {
      const errorMsg = (typeof resApiData.error === 'string') ? resApiData.error : 'unknown error';

      throw new Error(errorMsg);
    }

    return resApiData;
  }

  static async loginUser(email) {
    const login = {
      email,
      type: 'registration',
    };

    const resApi = await ApiUtils.postLoginJames({ login });

    const error = ApiUtils.hasError(resApi);

    if (error) {
      throw new Error(error);
    }

    const { data } = resApi;

    if (!data) {
      throw new Error('loginUser: no data');
    }

    if (!data.profile) {
      throw new Error('loginUser: no profile');
    }

    return data;
  }
}

export default AuthApi;
