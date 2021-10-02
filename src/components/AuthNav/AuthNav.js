import React, { Component } from 'react';
import {
  Header,
  Left,
  Right,
  Button,
  Icon,
  Text,
  View,
} from 'native-base';
import { connect } from 'react-redux';
import { withNavigation } from '@react-navigation/compat';
import PropTypes from 'prop-types';

import { logoutUser, addEdit } from 'src/reducers/auth';

import styles from './styles';

class AuthNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      drawer: this.props.drawer,
    };
  }

  async userLogOut() {
    const arr = Object.values(this.props.user);
    arr.length = await 0;
    this.props.logoutUser();
  }

  displaySettings() {
    this.props.addEdit(true);
  }

  goTo() {
    const { navigation, page, pageProps } = this.props;

    navigation.navigate(page, pageProps);
  }

  navButton() {
    if (this.state.drawer) {
      return (
        <Button transparent onPress={() => this.props.navigation.toggleDrawer()}>
          <Icon name="menu" style={{ fontSize: 20, color: 'white' }} />
          <Text style={styles.headerText}>{this.props.title}</Text>
        </Button>
      );
    }

    return (
      <Button block info color="#ffffff" style={styles.backButton} onPress={() => this.goTo()}>
        <Text style={{ textAlign: 'left', fontFamily: 'ProximaNova-Bold', color: '#ffffff', width: 100 }}>BACK</Text>
      </Button>
    );
  }

  render() {
    const { onPressButton } = this.props;

    return (
      <View style={styles.containerStyle}>
        <Header style={styles.headerStyle}>
          <Left style={styles.menuView}>
            {this.navButton()}
          </Left>
          <Right>
            <Button
              block
              info
              onPress={() => {
                if (onPressButton) {
                  onPressButton();
                  return;
                }

                this.goTo();
              }}
            >
              <Text style={styles.editButton}> {this.props.button} </Text>
            </Button>
          </Right>
        </Header>
      </View>
    );
  }
}

AuthNav.propTypes = {
  onPressButton: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  addEdit: (edit) => dispatch(addEdit(edit)),
  logoutUser: () => dispatch(logoutUser()),
});

const mapStateToProps = (state) => {

  return {
    user: state.auth.user,
    view: state.games.view
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(AuthNav));
