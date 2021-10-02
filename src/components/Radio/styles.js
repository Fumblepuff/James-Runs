
import deviceUtils from 'src/utils/deviceUtils';

import {
  createStyle,
} from 'src/styles';

const styles = createStyle({
  container: {
    alignItems: deviceUtils.isIOS ? 'center' : undefined,
    flexDirection: 'row',
    marginLeft: 5,
    marginBottom: 10,
  },
  text: {
    marginLeft: 15,
  },
});

export default styles;
