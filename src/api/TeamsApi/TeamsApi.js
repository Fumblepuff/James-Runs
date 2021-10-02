
import ApiUtils from 'src/utils/ApiUtils';

class TeamsApi {
  static async searchTeams(searchText, cancelToken, loggedInUserId) {
    const res = await ApiUtils.postJames({
      type: ApiUtils.TYPES.SEARCH_TEAMS,
      search: searchText,
      limitOffset: 0,
      limitRowCount: 50,
      loggedInUserId,
    }, {
      cancelToken,
    });

    return res.data;
  }

  static async addTeam(name, shortName) {
    const resApi = await ApiUtils.postJamesService({
      type: ApiUtils.TYPES.ADD_NEW_TEAM,
      name,
      shortName,
    });

    const error = ApiUtils.hasError(resApi);

    if (error) {
      throw new Error(error);
    }

    return resApi.data;
  }
}

export default TeamsApi;
