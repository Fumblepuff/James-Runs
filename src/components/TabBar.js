import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

import baller from 'src/assets/icons/baller.png';
import court from 'src/assets/icons/court.png';
import league from 'src/assets/icons/league.png';
import team from 'src/assets/icons/team.png';
import tabStyle from 'src/styles/TabBar';

const styles = tabStyle;

const TabBar = (props) => {
  const {
    activeTintColor,
    inactiveTintColor,
    state,
    navigation,
  } = props;

  const { routes, index: activeRouteIndex } = state;

  const pageIcon = (page) => {
    switch (page) {
      case 'Baller':
        return (<Image source={baller} />);
      case 'Court':
        return (<Image source={court} />);
      case 'Team':
        return (<Image source={team} />);
      case 'League':
        return (<Image source={league} />);
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {routes.map((route, routeIndex) => {
        const { name, key } = route;
        const isRouteActive = routeIndex === activeRouteIndex;
        const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;

        return (
          <TouchableOpacity
            key={key}
            style={[styles.tabButton, { backgroundColor: tintColor }]}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: key,
                canPreventDefault: true,
              });

              if (!isRouteActive && !event.defaultPrevented) {
                navigation.navigate(name);
              }
            }}
            onLongPress={() => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            }}
            accessibilityLabel={name}
          >
            {pageIcon(name)}
            <Text style={styles.tabText}>{name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

TabBar.propTypes = {
  state: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  activeTintColor: PropTypes.string.isRequired,
  inactiveTintColor: PropTypes.string.isRequired,
};

export default TabBar;
