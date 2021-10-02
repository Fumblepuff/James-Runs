/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { withNavigation } from '@react-navigation/compat';

import generalUtils from 'src/utils/generalUtils';

import { addToList, displayView } from 'src/reducers/games';

import CheckInOut from './CheckInOut';
import styles from './styles';

class BallerList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subText: null,
    };
  }

  componentDidMount() {
    this.ballerSetup();
  }

  ballerSetup() {
    const { data } = this.props;

    const checkin = parseInt(data.checkIn, 10) === 1;
    const checkinText = checkin ? 'checked in' : 'checked out';

    const reserve = parseInt(data.reserve, 10) === 1 ? 'reserved' : checkinText;
    const active = parseInt(data.active, 10) === 1 ? 'playing' : reserve;

    this.setState({
      subText: active,
    });
  }

  editBaller() {
    const { data } = this.props;

    Alert.alert(
      `${data.firstName} ${data.lastName}`,
      'Select An Option Below',
      [
        { text: 'View Profile', onPress: () => this.viewBallerProfile() },
        { text: 'Close', onPress: () => null, style: 'cancel' },
      ],
      { cancelable: true },
    );
  }

  viewBallerProfile() {
    const {
      displayViewConnect,
      navigation,
      data,
    } = this.props;

    const baller = {
      city: data.city,
      date: data.date,
      email: data.email,
      firstName: data.firstName,
      id: data.id,
      image: data.image,
      imageLocal: data.imageLocal,
      imageName: data.imageName,
      lastName: data.lastName,
      password: data.password,
      phone: data.phone,
      state: data.state,
      type: data.type,
      zipcode: data.zipcode,
    };

    const dataTmp = { data: baller };

    displayViewConnect(dataTmp);
    navigation.navigate('BallerProfile');
  }

  render() {
    const {
      run,
      data,
      image,
      header,
    } = this.props;
    const { subText } = this.state;
    const imageFormat = generalUtils.getItemImage(image);

    return (
      <Grid style={styles.listContainer}>
        <Row>
          <Col style={{ width: 80 }}>
            <View style={{ width: 80, height: 100 }}>
              <TouchableOpacity style={{ width: 80, height: 100 }} onPress={() => this.editBaller()}>
                <Image
                  style={{
                    flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: 0.5,
                  }}
                  source={{ uri: imageFormat }}
                />
              </TouchableOpacity>
            </View>
          </Col>

          <Col style={{ paddingLeft: 10, justifyContent: 'center' }}>
            <View><Text style={styles.headerText}>{header}</Text></View>
            <View><Text style={styles.subText}>{subText}</Text></View>
          </Col>

          <Col style={{ flex: 0, marginHorizontal: 10, justifyContent: 'center' }}>
            <CheckInOut
              data={data}
              run={run}
            />
          </Col>
        </Row>
      </Grid>

    );
  }
}

BallerList.propTypes = {
  data: PropTypes.object.isRequired,
  image: PropTypes.string.isRequired,
  run: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  header: PropTypes.string.isRequired,
  displayViewConnect: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  displayViewConnect: (view) => dispatch(displayView(view)),
  addToList: (list) => {
    dispatch(addToList(list));
  },
});

const mapStateToProps = (state) => ({
  list: state.games.addToList,
});

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(BallerList));
