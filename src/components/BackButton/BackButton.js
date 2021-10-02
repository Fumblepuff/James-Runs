
import React from 'react';
import {
  Text,
  Button,
} from 'native-base';

import {
  NavigationService,
} from 'src/navigation';

import {
  gs,
} from 'src/styles';

const ChatView = () => (
  <Button
    block
    style={gs.bgTrans}
    onPress={() => NavigationService.goBack()}
  >
    <Text style={[gs.fontBold2, gs.colorBlue2]}>BACK</Text>
  </Button>
);

export default ChatView;
