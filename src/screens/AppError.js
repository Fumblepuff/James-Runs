
import React from 'react';
import {
  View,
  Text,
} from 'native-base';

import Content from 'src/components/Content';

import {
  gs,
} from 'src/styles';

const AppError = () => (
  <Content
    scrollEnabled={false}
    styleContent={gs.jCCenter}
  >
    <View style={gs.aICenter}>
      <Text white style={[gs.textCenter, gs.fS20]}>
        Error lanching app.
        {'\n'}
        Please restart the app.
      </Text>
    </View>
  </Content>
);

export default AppError;
