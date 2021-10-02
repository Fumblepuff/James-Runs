
import deviceUtils from 'src/utils/deviceUtils';

import {
  createStyle,
  cls,
} from 'src/styles';

export default createStyle({
  container: {
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: deviceUtils.isIOS ? 'center' : undefined,
    marginBottom: 10,
  },
  checkboxBl: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cls.blue2,
    borderRadius: 5,
    width: 20,
    height: 20,
  },
  checkboxBlDisabled: {
    backgroundColor: cls.gray,
  },
  checkbox: {
    color: cls.white,
    fontSize: 16,
    marginLeft: 2,
  },
  text: {
    flex: 1,
    marginLeft: 15,
  },
});
