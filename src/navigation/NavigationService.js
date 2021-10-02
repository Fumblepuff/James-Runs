
import {
  CommonActions,
  useNavigation,
  DrawerActions,
} from '@react-navigation/native';

let navigator;

function setTopLevelNavigator(navigatorRef) {
  if (!navigatorRef) {
    return;
  }

  navigator = navigatorRef;
}

function navigate(name, params) {
  if (!navigator) {
    return;
  }

  navigator.dispatch(
    CommonActions.navigate({
      name,
      params,
    }),
  );
}

function navigateNested(name, nameNested, params) {
  if (!navigator) {
    return;
  }

  navigator.dispatch(
    CommonActions.navigate(name, {
      screen: nameNested,
      params,
    }),
  );
}

function goBack() {
  if (!navigator) {
    return;
  }

  navigator.dispatch(
    CommonActions.goBack(),
  );
}

function toggleDrawer() {
  if (!navigator) {
    return;
  }

  navigator.dispatch(
    DrawerActions.toggleDrawer(),
  );
}

export default {
  setTopLevelNavigator,
  navigate,
  navigateNested,
  useNavigation,
  goBack,
  toggleDrawer,
};
