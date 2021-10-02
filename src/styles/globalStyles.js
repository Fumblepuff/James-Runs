
import {
  StyleSheet,
} from 'react-native';

import cls from './colors';
import fs from './fonts';
import cs from './constantStyles';
import {
  createStyle,
} from './utilsStyles';

const globalStyle = createStyle({
  flexGrowJCCenter: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  flexJCCenter: {
    flex: 1,
    justifyContent: 'center',
  },
  spaceBetweenFlex: {
    flex: 1,
    justifyContent: 'space-between',
  },
  center: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  aICenter: {
    alignItems: 'center',
  },
  aITop: {
    alignItems: 'flex-start',
  },
  aIStart: {
    alignItems: 'flex-start',
  },
  aIEnd: {
    alignItems: 'flex-end',
  },
  aIRight: {
    alignItems: 'flex-end',
  },
  aSCenter: {
    alignSelf: 'center',
  },
  aSTop: {
    alignSelf: 'flex-start',
  },
  aSStart: {
    alignSelf: 'flex-start',
  },
  aSEnd: {
    alignSelf: 'flex-end',
  },
  aSStretch: {
    alignSelf: 'stretch',
  },
  jCCenter: {
    justifyContent: 'center',
  },
  jCEnd: {
    justifyContent: 'flex-end',
  },
  jCStart: {
    justifyContent: 'flex-start',
  },
  jCSpaceBetween: {
    justifyContent: 'space-between',
  },
  oFHidden: {
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  textCenter: {
    textAlign: 'center',
  },
  textLeft: {
    textAlign: 'left',
  },
  m0: {
    margin: 0,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
  },
  m5: {
    margin: 5,
  },
  m10: {
    margin: 10,
  },
  m20: {
    margin: 20,
  },
  m30: {
    margin: 30,
  },
  mV0: {
    marginVertical: 0,
  },
  mV5: {
    marginVertical: 5,
  },
  mV10: {
    marginVertical: 10,
  },
  mV15: {
    marginVertical: 15,
  },
  mV20: {
    marginVertical: 20,
  },
  mV25: {
    marginVertical: 25,
  },
  mV30: {
    marginVertical: 30,
  },
  mV40: {
    marginVertical: 40,
  },
  mV50: {
    marginVertical: 50,
  },
  mV60: {
    marginVertical: 60,
  },
  mV70: {
    marginVertical: 70,
  },
  mV80: {
    marginVertical: 80,
  },
  mH5: {
    marginHorizontal: 5,
  },
  mH10: {
    marginHorizontal: 10,
  },
  mH15: {
    marginHorizontal: 15,
  },
  mH20: {
    marginHorizontal: 20,
  },
  mH25: {
    marginHorizontal: 25,
  },
  mH30: {
    marginHorizontal: 30,
  },
  mH35: {
    marginHorizontal: 35,
  },
  mH40: {
    marginHorizontal: 40,
  },
  mH45: {
    marginHorizontal: 45,
  },
  mB0: {
    marginBottom: 0,
  },
  mB2: {
    marginBottom: 2,
  },
  mB5: {
    marginBottom: 5,
  },
  mB10: {
    marginBottom: 10,
  },
  mB15: {
    marginBottom: 15,
  },
  mB20: {
    marginBottom: 20,
  },
  mB25: {
    marginBottom: 25,
  },
  mB30: {
    marginBottom: 30,
  },
  mB35: {
    marginBottom: 35,
  },
  mB40: {
    marginBottom: 40,
  },
  mB50: {
    marginBottom: 50,
  },
  mB55: {
    marginBottom: 55,
  },
  mB60: {
    marginBottom: 60,
  },
  mB80: {
    marginBottom: 80,
  },
  mT0: {
    marginTop: 0,
  },
  mT5: {
    marginTop: 5,
  },
  mT10: {
    marginTop: 10,
  },
  mT15: {
    marginTop: 15,
  },
  mT20: {
    marginTop: 20,
  },
  mT25: {
    marginTop: 25,
  },
  mT30: {
    marginTop: 30,
  },
  mT40: {
    marginTop: 40,
  },
  mT45: {
    marginTop: 45,
  },
  mT50: {
    marginTop: 50,
  },
  mT60: {
    marginTop: 60,
  },
  mT70: {
    marginTop: 70,
  },
  mT80: {
    marginTop: 80,
  },
  mT85: {
    marginTop: 85,
  },
  mT90: {
    marginTop: 90,
  },
  mT100: {
    marginTop: 100,
  },
  mL0: {
    marginLeft: 0,
  },
  mL5: {
    marginLeft: 5,
  },
  mL10: {
    marginLeft: 10,
  },
  mL15: {
    marginLeft: 15,
  },
  mL20: {
    marginLeft: 20,
  },
  mL25: {
    marginLeft: 25,
  },
  mL30: {
    marginLeft: 30,
  },
  mR0: {
    marginRight: 0,
  },
  mR5: {
    marginRight: 5,
  },
  mR10: {
    marginRight: 10,
  },
  mR15: {
    marginRight: 15,
  },
  mR20: {
    marginRight: 20,
  },
  mR30: {
    marginRight: 30,
  },
  mR70: {
    marginRight: 70,
  },
  pT0: {
    paddingTop: 0,
  },
  pT5: {
    paddingTop: 5,
  },
  pT10: {
    paddingTop: 10,
  },
  pT15: {
    paddingTop: 15,
  },
  pT20: {
    paddingTop: 20,
  },
  pT25: {
    paddingTop: 25,
  },
  pT30: {
    paddingTop: 30,
  },
  pB0: {
    paddingBottom: 0,
  },
  pB5: {
    paddingBottom: 5,
  },
  pB10: {
    paddingBottom: 10,
  },
  pB15: {
    paddingBottom: 15,
  },
  pB20: {
    paddingBottom: 20,
  },
  pB25: {
    paddingBottom: 25,
  },
  pB30: {
    paddingBottom: 30,
  },
  pB40: {
    paddingBottom: 40,
  },
  pB50: {
    paddingBottom: 50,
  },
  pB60: {
    paddingBottom: 60,
  },
  pB70: {
    paddingBottom: 70,
  },
  pB80: {
    paddingBottom: 80,
  },
  pB90: {
    paddingBottom: 90,
  },
  pB100: {
    paddingBottom: 100,
  },
  pB200: {
    paddingBottom: 200,
  },
  pB210: {
    paddingBottom: 210,
  },
  pB220: {
    paddingBottom: 220,
  },
  pB230: {
    paddingBottom: 230,
  },
  pB240: {
    paddingBottom: 240,
  },
  pB250: {
    paddingBottom: 250,
  },
  pL0: {
    paddingLeft: 0,
  },
  pL5: {
    paddingLeft: 5,
  },
  pL10: {
    paddingLeft: 10,
  },
  pL15: {
    paddingLeft: 15,
  },
  pL20: {
    paddingLeft: 20,
  },
  pL25: {
    paddingLeft: 25,
  },
  pL30: {
    paddingLeft: 30,
  },
  pR0: {
    paddingRight: 0,
  },
  pR5: {
    paddingRight: 5,
  },
  pR10: {
    paddingRight: 10,
  },
  pR15: {
    paddingRight: 15,
  },
  pR20: {
    paddingRight: 20,
  },
  pR25: {
    paddingRight: 25,
  },
  pR30: {
    paddingRight: 30,
  },
  pR35: {
    paddingRight: 35,
  },
  p0: {
    padding: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  p5: {
    padding: 5,
  },
  p10: {
    padding: 10,
  },
  p20: {
    padding: 20,
  },
  p30: {
    padding: 30,
  },
  pHContent: {
    paddingHorizontal: cs.contentPadding,
  },
  pH0: {
    paddingHorizontal: 0,
  },
  pH5: {
    paddingHorizontal: 5,
  },
  pH10: {
    paddingHorizontal: 10,
  },
  pH15: {
    paddingHorizontal: 15,
  },
  pH20: {
    paddingHorizontal: 20,
  },
  pH30: {
    paddingHorizontal: 30,
  },
  pVContent: {
    paddingVertical: cs.contentPadding,
  },
  pV5: {
    paddingVertical: 5,
  },
  pV10: {
    paddingVertical: 10,
  },
  pV20: {
    paddingVertical: 20,
  },
  pV30: {
    paddingVertical: 30,
  },
  size50: {
    width: 50,
    height: 50,
  },
  size80: {
    width: 80,
    height: 80,
  },
  widthUndef: {
    width: undefined,
  },
  width80p: {
    width: '80%',
  },
  width90p: {
    width: '90%',
  },
  width95p: {
    width: '95%',
  },
  width100p: {
    width: '100%',
  },
  width10: {
    width: 10,
  },
  width20: {
    width: 20,
  },
  width25: {
    width: 25,
  },
  width30: {
    width: 30,
  },
  width40: {
    width: 40,
  },
  width50: {
    width: 50,
  },
  width60: {
    width: 60,
  },
  width70: {
    width: 70,
  },
  width80: {
    width: 80,
  },
  width90: {
    width: 90,
  },
  width100: {
    width: 100,
  },
  width110: {
    width: 110,
  },
  width120: {
    width: 120,
  },
  width130: {
    width: 130,
  },
  width140: {
    width: 140,
  },
  width150: {
    width: 150,
  },
  width160: {
    width: 160,
  },
  width180: {
    width: 180,
  },
  width200: {
    width: 200,
  },
  width290: {
    width: 290,
  },
  width250: {
    width: 250,
  },
  width260: {
    width: 260,
  },
  width300: {
    width: 300,
  },
  heightNull: {
    height: undefined,
  },
  heightHair: {
    height: StyleSheet.hairlineWidth,
  },
  height100p: {
    height: '100%',
  },
  height10: {
    height: 10,
  },
  height18: {
    height: 18,
  },
  height20: {
    height: 20,
  },
  height25: {
    height: 25,
  },
  height28: {
    height: 28,
  },
  height30: {
    height: 30,
  },
  height35: {
    height: 35,
  },
  height40: {
    height: 40,
  },
  height45: {
    height: 45,
  },
  height50: {
    height: 50,
  },
  height60: {
    height: 60,
  },
  height80: {
    height: 80,
  },
  height160: {
    height: 160,
  },
  height170: {
    height: 170,
  },
  height180: {
    height: 180,
  },
  height190: {
    height: 190,
  },
  borderT: {
    borderWidth: 1,
    borderColor: 'white',
  },
  border: {
    borderWidth: 1,
  },
  border2: {
    borderWidth: 2,
  },
  noBorder: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  noBorderB: {
    borderBottomWidth: 0,
  },
  borderRight: {
    borderRightWidth: 1,
  },
  borderBottom: {
    borderBottomWidth: 1,
  },
  borderLRB: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
  borderTransp: {
    borderColor: 'transparent',
  },
  borderGray: {
    borderColor: cls.gray,
  },
  borderWhite: {
    borderColor: cls.white,
  },
  borderR3: {
    borderRadius: 3,
  },
  borderR5: {
    borderRadius: 5,
  },
  borderR7: {
    borderRadius: 7,
  },
  flexUndef: {
    flex: undefined,
  },
  flexNull: {
    flex: null,
  },
  flex: {
    flex: 1,
  },
  flex03: {
    flex: 0.3,
  },
  flex05: {
    flex: 0.5,
  },
  flex08: {
    flex: 0.8,
  },
  flex09: {
    flex: 0.9,
  },
  flexGrow: {
    flexGrow: 1,
  },
  flexGrow05: {
    flexGrow: 0.5,
  },
  flexGrowUndef: {
    flexGrow: undefined,
  },
  flexWrap: {
    flexWrap: 'wrap',
  },
  fontBold: {
    fontFamily: fs.bold,
  },
  fontBold2: {
    fontFamily: fs.bold2,
  },
  fontSemiBold: {
    // fontFamily: Constants.nunitoSansSemiBold,
  },
  fontMedium: {
    fontFamily: fs.medium,
  },
  fontLight: {
    // fontFamily: Constants.nunitoSansLight,
  },
  fontS400: {
    fontFamily: fs.s400,
  },
  fontS500: {
    fontFamily: fs.s500,
  },
  fontS600: {
    fontFamily: fs.s600,
  },
  fontS700: {
    fontFamily: fs.s700,
  },
  fontS800: {
    fontFamily: fs.s800,
  },
  fS8: {
    fontSize: 8,
  },
  fS9: {
    fontSize: 9,
  },
  fS10: {
    fontSize: 10,
  },
  fS11: {
    fontSize: 11,
  },
  fS12: {
    fontSize: 12,
  },
  fS13: {
    fontSize: 13,
  },
  fS14: {
    fontSize: 14,
  },
  fS15: {
    fontSize: 15,
  },
  fS16: {
    fontSize: 16,
  },
  fS17: {
    fontSize: 17,
  },
  fS18: {
    fontSize: 18,
  },
  fS20: {
    fontSize: 20,
  },
  fS21: {
    fontSize: 21,
  },
  fS22: {
    fontSize: 22,
  },
  fS23: {
    fontSize: 23,
  },
  fS24: {
    fontSize: 24,
  },
  fS25: {
    fontSize: 25,
  },
  fS26: {
    fontSize: 26,
  },
  fS27: {
    fontSize: 27,
  },
  fS28: {
    fontSize: 28,
  },
  fS29: {
    fontSize: 29,
  },
  fS30: {
    fontSize: 30,
  },
  fS32: {
    fontSize: 32,
  },
  fS35: {
    fontSize: 35,
    lineHeight: 35,
  },
  lH12: {
    lineHeight: 12,
  },
  lH13: {
    lineHeight: 13,
  },
  lH14: {
    lineHeight: 14,
  },
  lH15: {
    lineHeight: 15,
  },
  lH17: {
    lineHeight: 17,
  },
  lH18: {
    lineHeight: 18,
  },
  lH19: {
    lineHeight: 19,
  },
  lH20: {
    lineHeight: 20,
  },
  lH21: {
    lineHeight: 21,
  },
  lH22: {
    lineHeight: 22,
  },
  resizeModeContain: {
    resizeMode: 'contain',
  },
  resizeModeCover: {
    resizeMode: 'cover',
  },
  textUnderline: {
    textDecorationLine: 'underline',
  },
  textTransformNone: {
    textTransform: 'none',
  },
  textUpperCase: {
    textTransform: 'uppercase',
  },
  bgWhite: {
    backgroundColor: cls.white,
  },
  bgGray: {
    backgroundColor: cls.gray,
  },
  bgGray1A08: {
    backgroundColor: cls.gray1A08,
  },
  bgGray2A08: {
    backgroundColor: cls.gray2A08,
  },
  bgBlack: {
    backgroundColor: cls.black,
  },
  bgBlue: {
    backgroundColor: cls.blue,
  },
  bgBlue2: {
    backgroundColor: cls.blue2,
  },
  bgRed3: {
    backgroundColor: cls.red3,
  },
  bgTrans: {
    backgroundColor: cls.transparent,
  },
  colorWhite: {
    color: cls.white,
  },
  colorBlack: {
    color: cls.black,
  },
  colorBlack2: {
    color: cls.black2,
  },
  colorGray: {
    color: cls.gray,
  },
  colorBlue: {
    color: cls.blue,
  },
  colorBlue2: {
    color: cls.blue2,
  },
  absolute: {
    position: 'absolute',
  },
  absoluteFillObject: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  contentPaddingTop: {
  },
  noShadow: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
});

export default globalStyle;
