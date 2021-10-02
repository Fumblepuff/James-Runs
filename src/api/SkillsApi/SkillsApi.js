
import _ from 'lodash';

import ApiUtils from 'src/utils/ApiUtils';
import {
  skillsFormat,
} from './SkillsApiFormatters';

class SkillsApi {
  static async getSkills(useService = false) {
    try {
      const typeApi = useService ? 'postJamesService' : 'postJames';
      const resApi = await ApiUtils[typeApi]({
        type: ApiUtils.TYPES.GET_MEMBER_SKILLS,
      });

      return skillsFormat(resApi.data);
    } catch (e) {
      throw new Error(e);
    }
  }

  static async reserveSkillSpot(runId, skillId, userId) {
    try {
      const data = {
        runId,
        skillId,
      };

      if (userId) {
        data.userId = userId;
      }

      const resApi = await ApiUtils.postJamesService({
        type: ApiUtils.TYPES.RESERVE_SPOT,
        data,
      });

      const error = ApiUtils.hasError(resApi);

      if (error) {
        throw new Error(error);
      }

      if (!resApi.data.success) {
        throw new Error(`Coudn't ${ApiUtils.TYPES.RESERVE_SPOT}`);
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  static async removeSkillSpot(runId, skillId, userId) {
    try {
      const data = {
        runId,
        skillId,
      };

      if (userId) {
        data.userId = userId;
      }

      const resApi = await ApiUtils.postJamesService({
        type: ApiUtils.TYPES.REMOVE_SPOT,
        data,
      });

      const error = ApiUtils.hasError(resApi);

      if (error) {
        throw new Error(error);
      }

      if (!resApi.data.success) {
        throw new Error(`Coudn't ${ApiUtils.TYPES.REMOVE_SPOT}`);
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  static async getUserPermissions(userId = null, useService = true) {
    try {
      const typeApi = useService ? 'postJamesService' : 'postJames';

      const resApi = await ApiUtils[typeApi]({
        type: ApiUtils.TYPES.LIST_USER_PERMISSIONS,
        data: {
          userId,
        },
      });

      const error = ApiUtils.hasError(resApi);

      if (error) {
        throw new Error(error);
      }

      const { data } = resApi;
      const skillsId = [];
      const skillsIdDefault = [];

      _.forEach(data, (item, key) => {
        const skillId = parseInt(key, 10);
        const isDefaultSkill = (parseInt(item, 10) === 1);

        skillsId.push(skillId);

        if (isDefaultSkill) {
          skillsIdDefault.push(skillId);
        }
      });

      const res = {
        skillsId,
        skillsIdDefault,
      };

      return res;
    } catch (e) {
      throw new Error(e);
    }
  }

  static async updateUserPermissions(userId, permissions, isSet = true) {
    let typeSet = 'set';

    if (!isSet) {
      typeSet = 'unset';
    }

    try {
      const resApi = await ApiUtils.postJames({
        type: ApiUtils.TYPES.UPDATE_USER_PERMISSIONS,
        data: {
          [typeSet]: userId,
          permissions,
        },
      });

      const error = ApiUtils.hasError(resApi);

      if (error) {
        throw new Error(error);
      }
    } catch (e) {
      throw new Error(e);
    }
  }
}

export default SkillsApi;
