import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  FlatList,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import background from 'src/assets/managementBackground.png';

import Toast from 'src/utils/toastUtils';

import CourtCell from 'src/components/CourtCell';
import Content, { ContentHeaderTab } from 'src/components/Content';

import CourtApi from 'src/api/CourtApi';

import {
  routeNames,
  NavigationService,
} from 'src/navigation';

import {
  gs,
} from 'src/styles';

class Courts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: 'Court Management',
      courtSearch: false,
      getCourts: 'getCourts',
      courts: [],
    };
  }

  componentDidMount() {
    this.getLocation();
    this.getAllCourts();
  }

  getLocation() {
    if (Platform.OS === 'android') {
      this.requestLocationPermission();
    } else {
      this.userLocation();
    }
  }

  getAllCourts() {
    const courts = {
      page: 0,
    };

    CourtApi.getCourts(courts).then((result) => {
      this.setState({
        courts: result,
      });
    })
      .catch((err) => {
        Toast.showError(err);
      });
  }

  getMoreCourts() {
    const { courtSearch, courts, getCourts } = this.state;

    const courtsApi = {
      search: courtSearch || '',
      page: courts.length,
    };

    CourtApi[getCourts](courtsApi, false).then((resFormat) => {
      if (resFormat) {
        const update = [...courts, ...resFormat];

        this.setState({
          courts: update,
        });
      }
    })
      .catch((err) => {
        Toast.showError(err);
      });
  }

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Get My Location',
          message: 'James App needs your location'
                    + 'to find Runs near you.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.userLocation();
      } else {
        // console.log('Location denied');
      }
    } catch (err) {
      // console.warn(err);
    }
  }

  userLocation() {
    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          userLocation: position.coords,
        });
      },
      (error) => {
        Toast.showError(`Courts: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  listCourts() {
    const { isAdmin } = this.props;
    const { courts, userLocation } = this.state;

    if (courts && userLocation) {
      const courtsArr = Object.values(courts);

      return (
        <View style={[gs.flex, gs.width100p]}>
          <FlatList
            data={courtsArr}
            renderItem={({ item }) => (
              <CourtCell
                page="EditCourt"
                data={item}
                isAdmin={isAdmin}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={() => this.getMoreCourts()}
            initialNumToRender={10}
            maxToRenderPerBatch={2}
            onEndReachedThreshold={0}
          />
        </View>
      );
    }

    return null;
  }

  searchCourts(search) {
    const courts = {
      search,
      page: 0,
    };

    CourtApi.searchCourts(courts, false).then((result) => {
      if (result) {
        this.setState({
          courts: result,
          courtSearch: search,
          getCourts: 'searchCourts',
        });
      }
    })
      .catch((err) => {
        Toast.showError(err);
      });
  }

  renderHeader = () => {
    const { title, address } = this.state;

    return (
      <ContentHeaderTab
        title={title}
        subTitle={address}
        onChangeText={(search) => this.searchCourts(search)}
      />
    );
  }

  render() {
    const { isAdmin } = this.props;
    let contentProps = {};

    if (isAdmin) {
      contentProps = {
        authNav: {
          drawer: true,
          page: routeNames.NEW_COURT,
          pageProps: {
            isAdmin,
          },
          button: 'Add Court',
          link: 'Settings',
        },
      };
    } else {
      contentProps = {
        basicNav: {
          rightButton: {
            text: 'Add Court',
            onPress: () => {
              NavigationService.navigate(routeNames.NEW_COURT, {
                isAdmin,
              });
            },
          },
        },
      };
    }

    return (
      <Content
        {...contentProps}
        header={this.renderHeader}
        imageBg={background}
        scrollEnabled={false}
        hasContentPadding={false}
        styleContent={gs.pT0}
      >
        {this.listCourts()}
      </Content>
    );
  }
}

Courts.propTypes = {
  isAdmin: PropTypes.bool,
};

Courts.defaultProps = {
  isAdmin: false,
};

export default Courts;
