/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  View,
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import { Container } from 'native-base';
import { connect } from 'react-redux';
import { createFilter } from 'react-native-search-filter';

import BasicNav from 'src/components/BasicNav';
import BasicList from 'src/components/BasicList';
import BallerStatList from 'src/components/BallerStatList';

import { uploadFile, addEdit } from 'src/reducers/auth';
import {
  getList,
  addToSchedule,
  addToList,
  squadApi,
  displayView,
  getRun,
} from 'src/reducers/games';

import background from 'src/assets/Background.png';

import styles from './styles';

const KEYS_TO_FILTERS = ['firstName', 'lastName', 'email'];

class Ballers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchBaller: '',
      leaderBoard: [],
    };
  }

  componentDidMount() {
    this.getLeaderBoard();
  }

  getLeaderBoard() {
    const ballers = {
      user: this.props.user.id,
    };

    this.props.getRun(ballers,'getLeaderboard')
      .then((result) => {
        console.log(result);
        this.setState({ leaderBoard: result });
      })
      .catch((err) => alert(err));
  }

  searchBaller(baller) {
    this.setState({ searchBaller: baller });
  }

  leaderBoard() {
    if (!this.state.searchBaller) {
      return (
        <FlatList
          data={this.state.leaderBoard}
          renderItem={({ item }) => (
            <BallerStatList
              push
              image={item.imageName}
              header={item.ballerTag ? item.ballerTag : `${item.firstName} ${item.lastName}`}
              subText={`${item.city} ${item.state}`}
              data={item}
            />
          )}
          keyExtractor={(item) => item.email}
        />
      );
    }

    return null;
  }

  listBallers() {
    const ballersArr = Object.values(this.props.ballers);
    const filteredBallers = ballersArr.filter(createFilter(this.state.searchBaller, KEYS_TO_FILTERS));

    if (this.state.searchBaller) {
      return (
        <FlatList
          data={filteredBallers}
          renderItem={({ item }) => (
            <BasicList
              image={item.imageName}
              header={`${item.firstName} ${item.lastName}`}
              page="BallerProfile"
              subText={`${item.city} ${item.state}`}
              data={({ data: item })}
            />
          )}
          keyExtractor={(item) => item.email}
        />
      );
    }

    return null;
  }

  render() {
    return (
      <Container style={styles.container}>

        <View style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        }}
        >
          <Image
            style={{
              flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: 0.5,
            }}
            source={background}
          />
        </View>
        <View>
          <BasicNav navigation={this.props.navigation} drawer title="Top Ten Ballers" button="Create A Squad" modal="true" />
          <TextInput
            onChangeText={(searchBaller) => this.searchBaller(searchBaller)}
            style={styles.textInput}
            autoCapitalize="none"
            placeholderTextColor="#ffffff"
            underlineColorAndroid="transparent"
            keyboardAppearance="dark"
            placeholder="SEARCH BALLERS"
          />
        </View>
        <View style={{ flex: 1 }}>
          {this.leaderBoard()}
          {/* {this.listBallers()} */}
        </View>

      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  getRun: (runId, type) => dispatch(getRun(runId, type)),
  displayView: (view) => dispatch(displayView(view)),
  addToSchedule: (schedule) => dispatch(addToSchedule(schedule)),
  addToList: (list) => dispatch(addToList(list)),
  addEdit: (edit) => dispatch(addEdit(edit)),
  getList: (list) => dispatch(getList(list)),
  squadApi: (id, type, data) => dispatch(squadApi(id, type, data)),
  uploadFile: (update) => { dispatch(uploadFile(update)); },
});

const mapStateToProps = (state) => ({
  edit: state.auth.edit,
  user: state.auth.user.profile,
  userSquad: state.auth.user.squads,
  squads: state.games.squads,
  ballers: state.games.ballers,
  squadList: state.games.addToList,
  scheduleList: state.games.addToSchedule,
  view: state.games.view,
});

export default connect(mapStateToProps, mapDispatchToProps)(Ballers);
