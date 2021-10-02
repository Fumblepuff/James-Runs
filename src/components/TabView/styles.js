
import {
  createStyle,
  cls,
  fs,
} from 'src/styles';

const styles = createStyle({
  tabBarBl: {
    flexDirection: 'row',
  },
  tabBarBtn: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: cls.blue4,
  },
  tabBarBtnActive: {
    backgroundColor: cls.blue3,
  },
  tabBarText: {
    color: cls.white,
    fontFamily: fs.medium,
    fontSize: 18,
  },
});

export default styles;
