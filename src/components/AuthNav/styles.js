
import {
  createStyle,
  cls,
} from 'src/styles';

const styles = createStyle({
  menuView: {

  },
  menuIconStyle: {
    paddingTop: 5,
    paddingLeft: 15,
    justifyContent: 'center',
  },
  titleStyle: {
    fontWeight: '900',
    fontSize: 20,
  },
  backButton: {
    width: 100,
    backgroundColor: 'transparent',
  },
  headerStyle: {
    width: '100%',
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    borderBottomColor: '#ffffff',
    borderColor: 'transparent',
    elevation: 0,
  },
  containerStyle: {
    width: '100%',
    marginTop: 0,
    // paddingBottom: 20,
    backgroundColor: cls.black08,
  },
  editButton: {
    fontFamily: 'BarlowCondensed-SemiBold',
    fontSize: 20,
  },
  headerText: {
    fontSize: 22,
    lineHeight: 34,
    alignContent: 'center',
    color: '#ffffff',
    fontFamily: 'BarlowCondensed-SemiBold',
    textAlign: 'left',
  },
  titleTextView: {
    width: 100,
    justifyContent: 'center',
  },
});

export default styles;
