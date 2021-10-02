
import React from 'react';
import {
  Grid,
} from 'native-base';

import {
  Children,
} from 'src/common/Types';

import {
  gs,
} from 'src/styles';

const GridItem = ({ children }) => (
  <Grid style={[gs.flexNull, gs.bgGray1A08, gs.p10, gs.mB5]}>
    {children}
  </Grid>
);

GridItem.propTypes = {
  children: Children.isRequired,
};

export default GridItem;
