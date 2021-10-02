
import {
  cls,
  createStyle,
} from 'src/styles';

const styles = createStyle({
  container: {
    alignSelf: 'center',
    width: '50%',
  },
  barBl: {
    backgroundColor: cls.white,
    flexDirection: 'row',
    height: 5,
  },
  barItemActive: {
    backgroundColor: cls.blue,
  },
});

export default styles;
