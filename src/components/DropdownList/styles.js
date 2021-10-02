
import {
  StyleSheet,
} from 'react-native';

import {
  createStyle,
  cs,
  cls,
} from 'src/styles';

import DropdownListUtils from './DropdownListUtils';

const styles = createStyle({
  container: {
  },
  itemBtn: {
    paddingVertical: 10,
    paddingHorizontal: cs.itemInputPaddingLeft,
    height: DropdownListUtils.HEIGHT_ITEM,
    justifyContent: 'center',
  },
  itemText: {
    fontSize: cs.inputFontSize,
    lineHeight: cs.inputLineHeight,
    color: cs.inputColor,
    fontFamily: cs.inputFontFamily,
  },
  itemTextSeleted: {
    color: cls.gray,
  },
  renderItemOwn: {
    flexDirection: 'row',
  },
  separator: {
    height: 1,
    backgroundColor: cls.gray2,
  },
  dropdownBl: {
    position: 'absolute',
    maxHeight: (53 + StyleSheet.hairlineWidth) * 5,
    borderColor: 'lightgray',
    borderRadius: cs.itemRadius,
    backgroundColor: cls.gray2,
    justifyContent: 'center',
    zIndex: 10000,
  },
});

export const viewTwoStyles = createStyle({
  ...styles,
  dropdownBl: {
    ...styles.dropdownBl,
    backgroundColor: cls.white,
    maxHeight: undefined,
    ...cs.shadow,
  },
  itemBtn: {
    ...styles.itemBtn,
    alignItems: 'center',
    paddingVertical: 0,
    height: DropdownListUtils.HEIGHT_ITEM_VIEW_TWO,
  },
  itemText: {
    ...styles.itemText,
    color: cls.gray,
  },
  itemTextSeleted: {
    ...styles.itemTextSeleted,
    color: cls.gray2,
  },
  separator: {
    ...styles.separator,
    height: 0,
    backgroundColor: undefined,
  },
});

export default styles;
