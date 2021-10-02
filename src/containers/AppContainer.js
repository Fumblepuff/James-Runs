
import React from 'react';
import Amplify from 'aws-amplify';
import {
  StyleProvider,
  Container,
  Root,
} from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  theme,
  getTheme,
} from 'src/theme';
import NavigationContainer from 'src/navigation';
import ServicesManager from 'src/services';
import awsmobile from 'src/config/awsExports';
import mainStyle from 'src/styles/Style';

Amplify.configure(awsmobile);

class AppContainer extends React.PureComponent {
  render() {
    return (
      <Root
        ref={(c) => {
          this._root = c;
        }}
      >
        <SafeAreaProvider>
          <StyleProvider style={getTheme(theme)}>
            <Container style={mainStyle.container}>
              <NavigationContainer />
              <ServicesManager />
            </Container>
          </StyleProvider>
        </SafeAreaProvider>
      </Root>
    );
  }
}

export default AppContainer;
