
import {
  createStyle,
  cls,
  fs,
} from 'src/styles';

const styles = createStyle({
  container: {
    flexDirection: 'row',
    height: 55,
    backgroundColor: cls.blue3,
    alignItems: 'center',
    marginBottom: 2,
  },
  textLeft: {
    color: cls.white,
    fontFamily: fs.light,
    fontSize: 18,
    lineHeight: 24,
    paddingLeft: 10,
  },
  button: {
    height: '100%',
    backgroundColor: cls.blue4,
  },
  textBtn: {
    fontFamily: fs.bold,
  },
});

export default styles;
