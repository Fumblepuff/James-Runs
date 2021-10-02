
import React from 'react';
import PropTypes from 'prop-types';

import TextInput from 'src/components/TextInput';

import generalUtils from 'src/utils/generalUtils';

import {
  gs,
} from 'src/styles';

const InputPhoneNumber = ({
  onChangeText,
  isFullWidth,
  ...restProps
}) => {
  const onSetPhone = (valueInp) => {
    const value = valueInp.replace(/[^0-9]/g, '');

    const formatPhoneNumber = generalUtils.formatPhoneNumber(value);

    onChangeText({
      ...formatPhoneNumber,
      value,
    });
  };

  return (
    <TextInput
      keyboardType="number-pad"
      placeholder="Phone Number including Area Code"
      {...restProps}
      styleContainer={isFullWidth ? {} : gs.width80p}
      isFullWidth={isFullWidth}
      iconLeftPlus
      onChangeText={(val) => onSetPhone(val)}
    />
  );
};

InputPhoneNumber.propTypes = {
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  isFullWidth: PropTypes.bool,
};

InputPhoneNumber.defaultProps = {
  value: '',
  onChangeText: () => null,
  isFullWidth: false,
};

export default InputPhoneNumber;
