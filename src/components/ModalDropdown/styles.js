
import {
  createStyle,
  cs,
  cls,
} from 'src/styles';

export default createStyle({
  modal: {
    flexGrow: 1,
  },
  dropdownBlHide: {
    opacity: 0,
  },
  loading: {
    alignSelf: 'center',
  },
  list: {
  },
  inputSearchBl: {
    backgroundColor: cls.gray2,
    borderRadius: cs.itemRadius,
    padding: 10,
    paddingBottom: 0,
  },
  inputSearch: {
    backgroundColor: cls.white,
    borderWidth: 1,
    borderColor: cls.gray2,
    padding: 0,
    margin: 0,
    height: 30,
    fontSize: cs.inputFontSize,
    fontFamily: cs.inputFontFamily,
    lineHeight: cs.inputFontSize,
  },
  viewTwoTextBl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewTwoTextBlText: {
    color: cls.gray2,
  },
  viewTwoTextBlIcon: {
    color: cls.gray2,
    fontSize: 12,
    lineHeight: 15,
    alignSelf: 'flex-end',
  },
  get viewThreeTextBlIcon() {
    return {
      ...this.viewTwoTextBlIcon,
      marginRight: 5,
    };
  },
});
