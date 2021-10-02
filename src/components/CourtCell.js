/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  Text,
} from 'react-native';
import {
  Button,
  Text as TextNB,
} from 'native-base';
import { connect } from 'react-redux';
import { Col, Grid } from 'react-native-easy-grid';
import { withNavigation } from '@react-navigation/compat';

import Toast from 'src/utils/toastUtils';

import {
  displayView,
  getRun,
  gamesNewEventAddCourt,
  gamesNewEvent,
} from 'src/reducers/games';
import {
  authUserIdSelector,
} from 'src/reducers/auth';

import {
  routeNames,
} from 'src/navigation';

import cellStyle from 'src/styles/Cell';

const styles = cellStyle;

class CourtCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      games: '',
    };
  }

  componentDidMount() {
    this.getUpcomingRuns();
  }

  getUpcomingRuns() {
    const { data, getRunConnect, userId } = this.props;
    const user = {
      court: data.id,
      userId,
    };

    getRunConnect(user, 'getUpcomingCourtRuns')
      .then((result) => {
        const count = result.length;
        this.setState({ games: count });
      })
      .catch((err) => {
        Toast.showError(err);
      });
  }

  view(page) {
    const {
      navigation,
      displayViewConnect,
      gamesNewEventConnect,
      data,
    } = this.props;

    const baller = {
      data,
    };

    displayViewConnect(baller);
    gamesNewEventConnect({
      court: data,
      isAdminMenu: true,
    });

    navigation.navigate(page);
  }

  renderButtons() {
    const {
      navigation,
      gamesNewEventAddCourtConnect,
      data,
      isAdmin,
    } = this.props;

    if (isAdmin) {
      return (
        <View style={styles.edits}>
          <Button full style={[styles.editButton, { backgroundColor: '#498BBA' }]} onPress={() => this.view(routeNames.EDIT_COURT)}>
            <TextNB bold>EDIT COURT</TextNB>
          </Button>
          <Button full style={[styles.editButton, { backgroundColor: '#1D659B' }]} onPress={() => this.view(routeNames.ADD_GAME)}>
            <TextNB bold>ADD EVENT</TextNB>
          </Button>
        </View>
      );
    }

    return (
      <View style={styles.edits}>
        <Button
          full
          style={[styles.editButton, { backgroundColor: '#498BBA' }]}
          onPress={() => {
            gamesNewEventAddCourtConnect(data);
            navigation.goBack();
          }}
        >
          <TextNB bold>USE THIS COURT</TextNB>
        </Button>
      </View>
    );
  }

  render() {
    const { data } = this.props;
    const { games } = this.state;
    const { image, addressFormat, name } = data;

    return (
      <View style={styles.listContainer}>

        <Grid>
          <Col style={styles.courtColumn}>
            <View style={styles.courtImageContainer}>
              <Image
                style={{
                  flex: 1, resizeMode: 'cover', width: '100%', height: '100%',
                }}
                source={{ uri: image }}
              />
            </View>
            <View style={styles.courtGames}>
              <Text style={styles.gameCount}>{games}</Text>
              <View style={styles.gameTextContainer}>
                <Text style={styles.gameText}>Upcoming</Text>
                <Text style={styles.gameText}>Games</Text>
              </View>
            </View>

          </Col>
          <Col style={styles.detailColumn}>
            <View style={styles.detail}>
              <Text style={[styles.title, { fontSize: 24 }]}>{name.toUpperCase()}</Text>
              <Text style={[styles.title, { fontSize: 16, color: '#3C3C3C', fontFamily: 'BarlowCondensed-Light' }]}>{addressFormat}</Text>
            </View>
            {this.renderButtons()}
          </Col>
        </Grid>

      </View>
    );
  }
}

CourtCell.propTypes = {
  data: PropTypes.object.isRequired,
  displayViewConnect: PropTypes.func.isRequired,
  getRunConnect: PropTypes.func.isRequired,
  gamesNewEventAddCourtConnect: PropTypes.func.isRequired,
  gamesNewEventConnect: PropTypes.func.isRequired,
  userId: PropTypes.number,
  isAdmin: PropTypes.bool,
};

CourtCell.defaultProps = {
  userId: null,
  isAdmin: false,
};

const mapStateToProps = (state) => ({
  userId: authUserIdSelector()(state),
});

const mapDispatchToProps = {
  displayViewConnect: displayView,
  getRunConnect: getRun,
  gamesNewEventAddCourtConnect: gamesNewEventAddCourt,
  gamesNewEventConnect: gamesNewEvent,
};

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(CourtCell));
