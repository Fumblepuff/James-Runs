/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { Col, Grid } from 'react-native-easy-grid';
// import { Storage } from 'aws-amplify';
import { withNavigation } from '@react-navigation/compat';

import generalUtils from 'src/utils/generalUtils';

import cellStyle from 'src/styles/Cell';
import {
  addToList,
  displayView,
  getBaller,
} from 'src/reducers/games';

const styles = cellStyle;

class ProfileCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // image: 'https:\/\/s3.amazonaws.com\/awsjames-userfiles-mobilehub-258458471\/public\/james-full-logo.png',
      push: this.props.push,
      data: this.props.data,
      added: false,
      requested: false,
    };
  }

  componentDidMount() {
    // this.showProfileImage();
    this.loadBaller();
  }

  loadBaller() {
    const baller = {
      id: this.props.data.id,
    };

    this.props.getBaller(baller)
      .then((results) => {
        if (!results) {
          return;
        }

        this.setState({
          games: results.stats.gameCount,
          wins: results.stats.wins,
          losses: results.stats.losses,
          jamesRating: results.stats.jamesRating,
        });
      })
      .catch((err) => alert(err));
  }

  // showProfileImage() {
  //   if (this.props.imageType) {
  //     if (this.props.imageType === 'google') {
  //       this.setState({ image: this.props.image ? this.props.image : 'https:\/\/s3.amazonaws.com\/awsjames-userfiles-mobilehub-258458471\/public\/james-full-logo.png' });
  //     } else {
  //       Storage.get(this.props.image)
  //         .then((result) => {
  //           this.setState({ image: result });
  //         })
  //         .catch((err) => alert(err));
  //     }
  //   } else {
  //     Storage.get(this.props.image)
  //       .then((result) => {
  //         this.setState({ image: result });
  //       })
  //       .catch((err) => alert(err));
  //   }
  // }

  removeItem() {
    var array = this.props.list;
    let obj = array.find((x) => x.id === this.state.data.id);

    if (obj) {
      var index = array.indexOf(obj);
      array.splice(index, 1);

      this.setState({
        added: false,
        requested: !this.state.requested,
      });
    }
  }

  addItem() {
    if (this.state.added) {
      this.removeItem();
    } else {
      // This just checks to see if the item is already is located in the array.
      // If it is then it removes it to be replaced.

      // this.removeItem();
      this.setState({
        added: true,
        requested: !this.state.requested,
      });

      this.props.addToList(this.state.data);
    }
  }

  view(page) {
    // let image = this.state.image;
    // let update = { ...this.props.data, image };
    const baller = {
      data: this.props.data,
    };

    this.props.displayView(baller);
    this.state.push ? this.props.navigation.push(page) : this.props.navigation.navigate(page);
  }

  render() {
    const { data } = this.props;
    const image = generalUtils.getItemImage(data.image);

    return (
      <TouchableOpacity style={styles.listContainer} onPress={() => this.view(this.props.page)}>

        <Grid>
          <Col style={styles.userColumn}>
            <View style={styles.imageContainer}>
              <Image
                style={{
                  flex: 1, resizeMode: 'cover', width: '100%', height: '100%',
                }}
                source={{ uri: image }}
              />
            </View>
            <View><Text style={styles.headerText}>{this.props.name.toUpperCase()}</Text></View>
            <View><Text style={styles.subText}>{this.props.data.city + ' ' + this.props.data.state}</Text></View>
          </Col>
          <Col style={styles.statColumn}>
            <View style={styles.rating}>
              <View style={styles.jamesRatingContainer}>
                <Text style={[styles.score, { fontSize: 32 }]}>
                  {this.state.jamesRating}
                  %
                </Text>
                <Text style={[styles.score, { fontSize: 15, color: '#4B89BA' }]}>Rating</Text>
              </View>
            </View>
            <View style={styles.stats}>
              <View style={styles.statScore}>
                <Text style={[styles.score, { fontSize: 32 }]}>{this.state.wins}</Text>
                <Text style={[styles.score, { fontSize: 15, color: '#4B89BA' }]}>WINS</Text>
              </View>
              <View style={styles.statScore}>
                <Text style={[styles.score, { fontSize: 32 }]}>{this.state.losses}</Text>
                <Text style={[styles.score, { fontSize: 15, color: '#4B89BA' }]}>LOSES</Text>
              </View>
              <View style={styles.statScore}>
                <Text style={[styles.score, { fontSize: 32 }]}>{this.state.games}</Text>
                <Text style={[styles.score, { fontSize: 15, color: '#4B89BA' }]}>GAMES</Text>
              </View>
            </View>
          </Col>
        </Grid>

      </TouchableOpacity>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  displayView: (view) => dispatch(displayView(view)),
  addToList: (list) => dispatch(addToList(list)),
  getBaller: (baller) => dispatch(getBaller(baller)),
});

const mapStateToProps = (state) => ({
  list: state.games.addToList,
});

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(ProfileCell));
