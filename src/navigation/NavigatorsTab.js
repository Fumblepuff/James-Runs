
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBar from 'src/components/TabBar';

const TabBottom = createBottomTabNavigator();

export const TabNavigator = (routes) => (
  <TabBottom.Navigator
    backBehavior="none"
    tabBar={(props) => <TabBar {...props} />}
    tabBarOptions={{
      inactiveTintColor: '#151515',
      activeTintColor: '#000000',
    }}
  >
    {routes.map(({ name, component }) => (
      <TabBottom.Screen
        key={name}
        name={name}
        component={component}
      />
    ))}
  </TabBottom.Navigator>
);

export const getTabNavigator = (routes) => () => TabNavigator(routes);
