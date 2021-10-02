// @flow

import {
  cls,
  fs,
} from 'src/styles';

import variable from './../variables/platform';

export default (variables /* : * */ = variable) => {
  const textTheme = {
    fontSize: variables.DefaultFontSize,
    fontFamily: variables.fontFamily,
    color: variables.textColor,
    '.note': {
      color: '#a7a7a7',
      fontSize: variables.noteFontSize
    },
    '.white': {
      color: cls.white,
    },
    '.black': {
      color: cls.black,
    },
    '.bold': {
      fontFamily: fs.bold,
    },
    '.medium': {
      fontFamily: fs.medium,
    },
  };

  return textTheme;
};
