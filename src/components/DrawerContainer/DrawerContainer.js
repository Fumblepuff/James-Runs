/* eslint-disable camelcase */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  View,
  ScrollView,
  Image,
} from 'react-native';
import {
  Header,
  Right,
  Button,
  Body,
  Text,
} from 'native-base';
import { Auth } from 'aws-amplify';

import authUtils from 'src/utils/authUtils';
import generalUtils from 'src/utils/generalUtils';

import {
  logoutUser,
  cacheData,
} from 'src/reducers/auth';

import menuCloseImg from 'src/assets/menu-close.png';

import {
  gs,
} from 'src/styles';

import styles from './styles';

class DrawerContainer extends Component {
  navigateToScreen = (route) => () => {
    const { navigation } = this.props;

    navigation.closeDrawer();
    navigation.navigate(route);
  }

  navigateWithParams = (route, params) => () => {
    const { cacheDataConnect, navigation } = this.props;

    if (route === 'Management') {
      cacheDataConnect(false);
    }

    navigation.closeDrawer();
    navigation.navigate(route, params);
  }

  async userLogout() {
    const { logoutUserConnect } = this.props;

    try {
      await Auth.signOut();
    } catch (e) {
      alert('Couldn\'t logout. Try again');
    }

    logoutUserConnect();
  }

  adminMenu() {
    const { user } = this.props;

    if (user) {
      const ballerManagement = {
        page: 'ballers',
      };

      // const courtManagement = {
      //   page: 'courts',
      // };

      if (user.profile) {
        const { member_type } = user.profile;
        const memberTypeFormat = parseInt(member_type, 10);

        if (memberTypeFormat) {
          const menuGames = (
            <View key={1}>
              <Text onPress={this.navigateWithParams('GameListing', ballerManagement)} style={styles.drawerItem}>
                GAMES
              </Text>
            </View>
          );

          const menuManagement = (
            <View key={2}>
              <Text onPress={this.navigateWithParams('Management', ballerManagement)} style={styles.drawerItem}>
                ADMIN
              </Text>
            </View>
          );

          const getMenu = (compsArr) => (
            <View>
              {compsArr.map((item) => item)}
            </View>
          );

          switch (memberTypeFormat) {
            case authUtils.MEMBER_TYPES.ADMIN:
              // System Admin
              return getMenu([menuGames, menuManagement]);
            case authUtils.MEMBER_TYPES.STAFF:
              // OG Admin
              return getMenu([menuGames]);
            case authUtils.MEMBER_TYPES.PLAYER:
              // Stat Keeper
              // no management
              return getMenu([menuGames]);
            default:
              return null;
          }
        }
      }
    }

    return null;
  }

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <ScrollView bounces={false} contentContainerStyle={{ marginBottom: 10 }}>
          <Header style={styles.headerStyle}>
            <Body style={gs.center}>
              <Text style={gs.colorGray}>{generalUtils.getVersion()}</Text>
            </Body>
            <Right style={gs.flexNull}>
              <Button transparent onPress={() => navigation.closeDrawer()}>
                <Image style={{ width: 25, height: 25 }} source={menuCloseImg} />
              </Button>
            </Right>
          </Header>

          <Text onPress={this.navigateToScreen('Profile')} style={styles.drawerItem}>
            PROFILE
          </Text>
          <Text onPress={this.navigateToScreen('RunListing')} style={styles.drawerItem}>
            RUNS
          </Text>
          {this.adminMenu()}
        </ScrollView>

        <Button block style={styles.logout} onPress={() => this.userLogout()}>
          <Text style={{ fontFamily: 'BarlowCondensed-SemiBold', color: '#ffffff', fontSize: 22 }}>LOG OUT</Text>
        </Button>
      </View>
    );
  }
}

DrawerContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  cacheDataConnect: PropTypes.func.isRequired,
  logoutUserConnect: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  cache: state.auth.cache,
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch) => ({
  cacheDataConnect: (cache) => dispatch(cacheData(cache)),
  logoutUserConnect: () => {
    dispatch(logoutUser());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContainer);
