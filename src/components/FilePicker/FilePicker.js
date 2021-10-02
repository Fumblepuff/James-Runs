
import ImagePicker from 'react-native-image-crop-picker';
import {
  ActionSheet,
} from 'native-base';

import Toast from 'src/utils/toastUtils';
import generalUtils from 'src/utils/generalUtils';

const FilePicker = ({
  onSelectFile,
}) => {
  const onTakefile = (filesInp) => {
    onSelectFile(filesInp);
  };

  const takeCameraImageFile = (camera = true) => {
    const type = camera ? 'openCamera' : 'openPicker';

    ImagePicker[type]({
      mediaType: 'photo',
      compressImageQuality: 0.2,
    }).then((data) => {
      const { path, mime } = data;
      const { name } = generalUtils.getFileInfo(path);

      const res = {
        uri: path,
        name,
        type: mime,
      };

      onTakefile(res);
    }).catch((e) => {
      if (e.code === 'E_PICKER_CANCELLED') {
        return;
      }

      Toast.showError(e.message);
    });
  };

  const showChooseList = () => {
    const buttons = [
      'Camera',
      'Photo library',
      'Cancel',
    ];

    ActionSheet.show(
      {
        options: buttons,
        cancelButtonIndex: 2,
      },
      (selectedIndex) => {
        if (selectedIndex === 0) {
          takeCameraImageFile();
        } else if (selectedIndex === 1) {
          takeCameraImageFile(false);
        }
      },
    );
  };

  return {
    showChooseList,
  };
};

export default FilePicker;
