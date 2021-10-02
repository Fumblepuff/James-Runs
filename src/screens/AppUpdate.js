
import React from 'react';
import {
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {
  View,
  Text,
} from 'native-base';

import deviceUtils from 'src/utils/deviceUtils';

import Content from 'src/components/Content';

import {
  gs,
} from 'src/styles';

const AppUpdate = () => {
  const renderLink = () => {
    const linkAndroid = 'https://play.google.com/store/apps/details?id=com.jamesapp';
    const linkIos = 'https://apps.apple.com/us/app/james-basketball-organizer/id1400549559';
    const link = deviceUtils.isIOS ? linkIos : linkAndroid;
    const linkText = deviceUtils.isIOS ? 'Apple Store' : 'Google Play';

    return (
      <TouchableOpacity
        style={gs.mT10}
        onPress={async () => {
          const canOpen = await Linking.canOpenURL(link);

          if (!canOpen) {
            Alert.alert(`Coudn't open link ${link}`);

            return;
          }

          await Linking.openURL(link);
        }}
      >
        <Text style={[gs.fS23, gs.colorBlue]}>{linkText}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Content
      scrollEnabled={false}
      styleContent={gs.jCCenter}
    >
      <View style={gs.aICenter}>
        <Text white style={[gs.textCenter, gs.fS20]}>
          We released a new version of this app
          {'\n'}
          Please update this app from the link
        </Text>
        {renderLink()}
      </View>
    </Content>
  );
};

export default AppUpdate;
