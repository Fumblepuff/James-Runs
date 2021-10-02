
import {
  createStyle,
  cls,
} from 'src/styles';

const styles = createStyle({
  container: {
    backgroundColor: cls.black08,
  },
  titleBl: {
    marginHorizontal: 10,
    marginBottom: 10,
  },
  line: {
    height: 1,
    width: '70%',
    backgroundColor: cls.white,
    marginTop: 5,
    marginBottom: 5,
  },
  input: {
    marginLeft: 0,
  },
  inputContainer: {
    backgroundColor: cls.black2,
    borderColor: cls.black2,
    marginBottom: 0,
  },
});

export default styles;
