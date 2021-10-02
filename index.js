/**
 * @format
 */

import 'react-native-gesture-handler';

import { AppRegistry, LogBox } from 'react-native';

import RootContainer from './src/containers/RootContainer';
import { name as appName } from './app.json';

LogBox.ignoreLogs([
  'Warning: componentWillReceiveProps has been renamed,',
  'DatePickerIOS has been merged',
  'Picker has been extracted from react-native core',
  '`useNativeDriver` was not specified.',
]);

AppRegistry.registerComponent(appName, () => RootContainer);
