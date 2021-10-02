
import React from 'react';
import PropTypes from 'prop-types';

import TextInput from 'src/components/TextInput';
import FilePickerHook from 'src/components/FilePicker';

import {
  StyleType,
} from 'src/common/Types';

import FormItem from './FormItem';

const FilePicker = ({
  label,
  note,
  styleContainer,
  onSelectFile,
  ...restProps
}) => {
  const { showChooseList } = FilePickerHook({
    onSelectFile,
  });

  return (
    <FormItem
      label={label}
      note={note}
      style={styleContainer}
    >
      <TextInput
        isFullWidth
        iconRightCaret
        {...restProps}
        onPress={() => {
          showChooseList();
        }}
      />
    </FormItem>
  );
};

FilePicker.propTypes = {
  label: PropTypes.string,
  note: PropTypes.string,
  styleContainer: StyleType,
  onSelectFile: PropTypes.func,
};

FilePicker.defaultProps = {
  label: null,
  note: null,
  styleContainer: {},
  onSelectFile: () => null,
};

export default FilePicker;
