import { StyleSheet } from 'react-native';

import cls from './colors';

const formStyle = StyleSheet.create({
  registerBox: {
    position: 'relative',
    width: '100%',
    flex: 1,
    padding: 5,
    backgroundColor: 'rgba(60,60,60,.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerMenuButton: {
    width: 275,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  registerMenuText: {
    width: 275,
    color: '#ffffff',
    fontFamily: 'BarlowCondensed-Bold',
    textAlign: 'right',
  },
  registerMenu: {

  },
  textInputBl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    width: '80%',
    height: 50,
    marginBottom: 10,
  },
  textInputIcon: {
    color: '#000000',
    marginLeft: 5,
    fontSize: 13,
  },
  textInput: {
    color: '#000000',
    fontFamily: 'BarlowCondensed-Medium',
    fontSize: 18,
    // textTransform: 'uppercase',
    lineHeight: 20,
    backgroundColor: '#ffffff',
    marginBottom: 10,
    padding: 5,
    width: '80%',
    height: 50,
    textAlign: 'left',
    elevation: 0,
    borderRadius: 5,
  },
  get textInput100() {
    return {
      ...this.textInput,
      width: undefined,
    };
  },
  get textInputSub() {
    return {
      ...this.textInput,
      width: null,
      flex: 1,
      marginBottom: 0,
    };
  },
  textInputError: {
    borderWidth: 2,
    borderColor: cls.red,
  },
  textFull: {
    backgroundColor: '#ffffff',
    color: '#000000',
    fontFamily: 'BarlowCondensed-Light',
    fontSize: 20,
    lineHeight: 20,
    borderRadius: 10,
    borderBottomWidth: 0,
    borderBottomColor: '#ffffff',
    marginBottom: 10,
    padding: 10,
    width: '100%',
    margin: 5,
    height: 50,
    textAlign: 'left',
    elevation: 0,
  },
  registerText: {
    color: '#000000',
    fontFamily: 'BarlowCondensed-Medium',
    textTransform: 'uppercase',
    fontSize: 18,
    padding: 10,
  },
  nextButton: {
    backgroundColor: '#478cba',
    borderWidth: 0,
    borderColor: '#ffffff',
    marginTop: 15,
    padding: 15,
  },
  resendBtn: {
    width: '80%',
    height: 50,
    textAlign: 'center',
    alignSelf: 'center',
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    borderBottomColor: '#ffffff',
  },
  selectBtn: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: '#000000',
    fontFamily: 'BarlowCondensed-Medium',
    fontSize: 18,
    textTransform: 'uppercase',
    lineHeight: 20,
    backgroundColor: '#ffffff',
    marginBottom: 10,
    padding: 5,
    width: '80%',
    height: 50,
    textAlign: 'left',
    elevation: 0,
    borderRadius: 5,
  },
  imageBtn: {
    flex: 1,
    height: '80%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    margin: 3
  },
  buttonGroup: {
    width: '80%',
    display: 'flex',
    flexDirection: 'row',
  },
  blueText: {
    color: '#478cba',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
  thanksText: {
    fontSize: 18,
  },
});

export default formStyle;
