
import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import DrawerContainer from 'src/components/DrawerContainer';

import routes from './routes';
import routeNames from './routeNames';
import {
  TabNavigator,
} from './NavigatorsTab';

const RootStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const StackScreens = (routesScreens, Comp) => (routesScreens.map((item) => {
  const {
    name,
    component,
    options = {},
  } = item;

  const {
    title,
  } = options;

  return (
    <Comp.Screen
      key={name}
      name={name}
      component={component}
      options={() => ({
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        ...options,
        title,
      })}
    />
  );
}));

export const StackNavigator = (routesInp, Stack, initialRouteName) => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    initialRouteName={initialRouteName}
  >
    {StackScreens(routesInp, Stack)}
  </Stack.Navigator>
);

export const AppPreLaunchNavigator = (initialRouteName) => StackNavigator(routes.appPreLaunchRoutes, RootStack, initialRouteName);
export const AuthNavigator = () => StackNavigator(routes.authRoutes, RootStack);

const ManagementNavigator = () => TabNavigator(routes.managementTabRoutes);

const DrawerNavigator = () => (
  <Drawer.Navigator
    screenOptions={{
      headerShown: false,
    }}
    drawerContent={(props) => <DrawerContainer {...props} />}
  >
    {routes.statRoutes.map(({ name, component }) => (
      <Drawer.Screen
        key={name}
        name={name}
        component={component}
      />
    ))}

    <Drawer.Screen
      name={routeNames.MANAGEMENT}
    >
      {() => (
        <RootStack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <RootStack.Screen
            name="ManagementMain"
          >
            {() => ManagementNavigator()}
          </RootStack.Screen>
          {StackScreens(routes.managementScreensRoutes, RootStack)}
        </RootStack.Navigator>
      )}
    </Drawer.Screen>
  </Drawer.Navigator>
);

export const StatNavigator = () => (
  <RootStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <RootStack.Screen
      name="Drawer"
      component={DrawerNavigator}
    />

    {StackScreens(routes.commonScreensRoutes, RootStack)}
  </RootStack.Navigator>
);
