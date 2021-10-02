
import React from 'react';
import PropTypes from 'prop-types';
import {
  ActionSheet as ActionSheetNB,
} from 'native-base';
import _ from 'lodash';

import TextInput from 'src/components/TextInput';

import FormItem from '../FormItem';

const ActionSheet = ({
  label,
  note,
  value,
  list,
  onSelected,
}) => (
  <FormItem
    label={label}
    note={note}
  >
    <TextInput
      isFullWidth
      iconRightCaret
      value={value}
      onPress={() => {
        let optionCancel = 'Cancel';

        if (
          (list.length > 0)
          && (_.isObject(list[0]))
        ) {
          optionCancel = {
            text: 'Cancel',
          };
        }

        const options = [
          ...list,
          optionCancel,
        ];

        ActionSheetNB.show(
          {
            options,
            cancelButtonIndex: (options.length - 1),
            title: label,
          },
          (selectedIndex) => {
            const itemInfo = list.find((_item, indexTmp) => (indexTmp === selectedIndex));

            if (itemInfo) {
              onSelected(itemInfo, selectedIndex);
            }
          },
        );
      }}
    />
  </FormItem>
);

ActionSheet.propTypes = {
  label: PropTypes.string,
  note: PropTypes.string,
  value: PropTypes.string,
  list: PropTypes.array,
  onSelected: PropTypes.func,
};

ActionSheet.defaultProps = {
  label: null,
  note: null,
  value: '',
  list: [],
  onSelected: () => null,
};

export default ActionSheet;
