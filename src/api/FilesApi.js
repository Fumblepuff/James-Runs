
import ApiUtils from 'src/utils/ApiUtils';
import generalUtils from 'src/utils/generalUtils';

class FilesApi {
  static async uploadFile(fileInfo, uploadType = ApiUtils.TYPES.TEAM_SCORE_BOOK) {
    const resApi = await ApiUtils.postService(
      'upload/file.php',
      {
        uploadType,
        file: fileInfo,
      }, {}, {
        isFormData: true,
      },
    );

    const error = ApiUtils.hasError(resApi);

    if (error) {
      throw new Error(error);
    }

    const { data: { file } } = resApi;

    file.label = generalUtils.getFileInfo(file.url).name;

    return file;
  }
}

export default FilesApi;
