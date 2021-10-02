
import React from 'react';
import PropTypes from 'prop-types';

import TextInputOrig from 'src/components/TextInput';
import InputPhoneNumber from 'src/components/InputPhoneNumber';

import {
  StyleType,
} from 'src/common/Types';

import FormItem from './FormItem';

const TextInput = ({
  label,
  note,
  styleContainer,
  isPhoneNumber,
  ...restProps
}) => (
  <FormItem
    label={label}
    note={note}
    style={styleContainer}
  >
    {isPhoneNumber ? (
      <InputPhoneNumber
        {...restProps}
      />
    ) : (
      <TextInputOrig
        {...restProps}
      />
    )}
  </FormItem>
);

TextInput.propTypes = {
  label: PropTypes.string,
  note: PropTypes.string,
  styleContainer: StyleType,
  isPhoneNumber: PropTypes.bool,
};

TextInput.defaultProps = {
  label: null,
  note: null,
  styleContainer: {},
  isPhoneNumber: false,
};

export default TextInput;
