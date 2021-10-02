
import {
  createStyle,
  cls,
} from 'src/styles';

const styles = createStyle({
  container: {
    alignItems: 'center',
    margin: 5,
  },
  button: {
    backgroundColor: cls.red2,
    borderRadius: 32.5,
    height: 65,
    width: 75,
  },
  buttonCheckin: {
    backgroundColor: cls.green,
  },
  icon: {
    fontSize: 30,
  },
  text: {
    color: cls.white,
    fontSize: 16,
  },
});

export default styles;
