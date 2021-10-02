
import {
  createStyle,
  formStyles,
  cls,
} from 'src/styles';

const height = 50;

const styles = createStyle({
  container: {
    // flex: 1,
    flexDirection: 'row',
    borderRadius: 5,
    backgroundColor: cls.white,
    height,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: cls.white,
  },
  containerError: {
    borderWidth: 2,
    borderColor: cls.red,
  },
  textInput: {
    ...formStyles.textInput,
    marginBottom: 0,
    height,
  },
  iconRightBl: {
    justifyContent: 'center',
    backgroundColor: cls.white,
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  icon: {
    alignSelf: 'center',
    color: cls.black,
    fontSize: 20,
  },
  get iconPlus() {
    return {
      ...this.icon,
      fontSize: 13,
    };
  },
});

export default styles;
