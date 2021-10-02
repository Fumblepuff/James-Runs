
import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  useWindowDimensions,
  Animated,
} from 'react-native';
import {
  Button,
} from 'native-base';
import {
  TabView as TabViewOrig,
} from 'react-native-tab-view';

import styles from './styles';

const TabView = ({
  tabs,
}) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState(tabs);
  const tabScene = {};

  tabs.forEach(({ key, component, props = {} }, indexTmp) => {
    const isFocused = (indexTmp === index);
    const Comp = component;

    tabScene[key] = <Comp {...props} isFocused={isFocused} />;
  });

  const renderScene = ({ route }) => {
    const res = tabScene[route.key] || null;
    return res;
  };

  const renderTabBar = (propsInp) => {
    const { position, navigationState } = propsInp;
    const inputRange = navigationState.routes.map((x, i) => i);

    return (
      <View style={styles.tabBarBl}>
        {navigationState.routes.map((route, i) => {
          const isActiveTab = (navigationState.index === i);
          const opacity = position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex) => (inputIndex === i ? 1 : 0.5)),
          });

          const styleBtn = [styles.tabBarBtn];

          if (isActiveTab) {
            styleBtn.push(styles.tabBarBtnActive);
          }

          return (
            <Button
              key={i.toString()}
              full
              style={styleBtn}
              onPress={() => setIndex(i)}
            >
              <Animated.Text style={[styles.tabBarText, { opacity }]}>{route.title}</Animated.Text>
            </Button>
          );
        })}
      </View>
    );
  };

  return (
    <TabViewOrig
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  );
};

TabView.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    component: PropTypes.any.isRequired,
    props: PropTypes.object,
  })).isRequired,
};

export default TabView;
