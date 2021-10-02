
import React from 'react';
import PropTypes from 'prop-types';

import {
  StyleType,
} from 'src/common/Types';

import CounterOrig from 'src/components/Counter';

import {
  gs,
} from 'src/styles';

import FormItem from './FormItem';

const Counter = ({
  label,
  note,
  styleContainer,
  ...restProps
}) => (
  <FormItem
    label={label}
    note={note}
    style={styleContainer}
  >
    <CounterOrig
      {...restProps}
      style={gs.width180}
    />
  </FormItem>
);

Counter.propTypes = {
  label: PropTypes.string,
  note: PropTypes.string,
  styleContainer: StyleType,
};

Counter.defaultProps = {
  label: null,
  note: null,
  styleContainer: {},
};

export default Counter;
