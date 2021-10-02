import {StyleSheet} from 'react-native';

const navStyle = StyleSheet.create({
  menuView: {
    flex: 1,
  },
  menuRightView: {
    flex: 0.5,
  },
  menuIconStyle: {
    paddingTop: 5,
    paddingLeft: 15,
    justifyContent: 'center',
  },
  reserveBtn: {
    width: 90,
    height: 90,
    backgroundColor: '#044571',
    borderRadius: 90 / 2,
    overflow: 'hidden',
  },
  reserveBtnText: {
    flex: 1,
    fontFamily: 'BarlowCondensed-Bold',
    fontSize: 15,
    color: '#ffffff',
    textAlign: 'center',
    flexWrap: 'wrap',
    paddingLeft: 0,
    paddingRight: 0,
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
    backgroundColor: 'rgba(0,0,0,.8)',
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
    flex: 1,
    textAlign: 'left',
  },
  titleTextView: {
    width: 100,
    justifyContent: 'center',
  },

});

export default navStyle;
