/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
import React, { Component } from 'react';
import {
  View,
  Image,
  TextInput,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Container,
  Icon,
  Text,
  Button,
} from 'native-base';
import { connect } from 'react-redux';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Modal from 'react-native-modal';

import background from 'src/assets/managementBackground.png';
import poster from 'src/assets/ballerManagement.png';

import { addEdit, cacheData } from 'src/reducers/auth';
import {
  addToList,
  squadApi,
  displayView,
  resetGroups,
  getRun,
  getLocationDetails,
} from 'src/reducers/games';
import AuthNav from 'src/components/AuthNav';
import ProfileCell from 'src/components/ProfileCell';
import mainStyle from 'src/styles/Style';

const styles = mainStyle;

class Management extends Component {
  constructor(props) {
    super(props);

    this.state = {
      baller: true,
      title: 'Member Management',
      ballerSearch: false,
      getBallers: 'getBallers',
      page: 0,
    };
  }

  componentDidMount() {
    // const { navigation } = this.props;

    this.onFocus();

    // this.navigationListeners = [
    //   navigation.addListener('focus', this.onFocus),
    // ];
  }

  componentWillUnmount() {
    if (this.navigationListeners) {
      // this.navigationListeners.forEach((listener) => {
      //   listener();
      // });
    }
  }

  handleChange(formField, value) {
    this.setState({ [formField]: value });
  }

  onFocus = () => {
    if (this.searchText) {
      this.searchList(this.searchText);
    } else {
      this.getAllBallers();
    }
  }

  getAllBallers() {
    const ballers = {
      page: 0,
    };

    this.props.getRun(ballers, 'getBallers')
      .then((result) => {
        this.setState({ ballers: '' }, () => {
          this.setState({ ballers: result });
        });
      })
      .catch((err) => alert(err));
  }

  getMoreBallers() {
    this.setState({ page: this.state.page + 10 }, () => {
      const ballers = {
        search: this.state.ballerSearch ? this.state.ballerSearch : '',
        page: this.state.page,
      };

      this.props.getRun(ballers, this.state.getBallers)
        .then((result) => {
          // console.log(result);
          if (result) {
            const update = [ ...this.state.ballers, ...result ];
            this.setState({ ballers: update });
          }
        })
        .catch((err) => alert(err));
    });
  }

  closeModal() {
    this.props.addEdit(false);
  }

  searchList(list) {
    this.searchText = list;

    if (this.state.baller) {
      this.searchBallers(list);
    } else {
      this.searchCourts(list);
    }
  }

  searchBallers(search) {
    const ballers = {
      search: search,
      page: 0,
    };

    this.props.getRun(ballers, 'searchBallers')
      .then((result) => {
        if (result) {
          this.setState({
            ballers: result,
            ballerSearch: search,
            getBallers: 'searchBallers',
            page: 0,
          });
        } else {
          this.getAllBallers();
          this.setState({
            ballerSearch: false,
          });
        }
      })
      .catch((err) => alert(err));
  }

  listBallers() {
    if (this.state.ballers) {
      const ballersArr = Object.values(this.state.ballers);
      return (
        <FlatList
          data={ballersArr}
          renderItem={({ item }) => (
            <ProfileCell
              image={item.imageName}
              name={`${item.firstName} ${item.lastName}`}
              page="EditBaller"
              subText={`${item.city} ${item.state}`}
              data={item}
            />
          )}
          keyExtractor={(item) => item.id}
          onEndReached={() => this.getMoreBallers()}
          initialNumToRender={5}
          onEndReachedThreshold={0.5}
        />
      );
    }

    return null;
  }

  addBallerModal() {
    return (
      <Modal isVisible={this.props.edit} backdropColor="#3c3c3c" backdropOpacity={0.95}>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
          <View style={styles.modalHeader}>
            <Button full transparent style={styles.close} onPress={() => this.closeModal()}>
              <Icon type="MaterialIcons" name="clear" />
              <Text style={{
                fontSize: 28, fontFamily: 'BarlowCondensed-Bold', width: '100%', color: '#ffffff', flex: 1,
              }}
              >
                New Baller
              </Text>
            </Button>
          </View>
          <KeyboardAvoidingView
            behavior="padding"
            style={{
              width: '100%', flex: 0.75, margin: 'auto', justifyContent: 'center', alignItems: 'center',
            }}
          >
            <Grid style={{ width: '100%' }}>
              <Row>
                <Col>
                  <Text style={styles.textLabel}>First Name</Text>
                  <TextInput
                    onChangeText={(firstName) => this.handleChange('firstName', firstName)}
                    style={styles.textInput}
                    autoCapitalize="none"
                    keyboardAppearance="dark"
                    placeholderTextColor="#ffffff"
                    placeholder=""
                  />
                </Col>
                <Col>
                  <Text style={styles.textLabel}>Last Name</Text>
                  <TextInput
                    onChangeText={(lastName) => this.handleChange('lastName', lastName)}
                    style={styles.textInput}
                    autoCapitalize="none"
                    keyboardAppearance="dark"
                    placeholderTextColor="#ffffff"
                    placeholder=""
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Text style={styles.textLabel}>Email Address</Text>
                  <TextInput
                    onChangeText={(email) => this.handleChange('email', email)}
                    style={styles.textInput}
                    autoCapitalize="none"
                    keyboardAppearance="dark"
                    placeholderTextColor="#ffffff"
                    placeholder=""
                  />
                </Col>
                <Col>
                  <Text style={styles.textLabel}>Phone Number</Text>
                  <TextInput
                    onChangeText={(phone) => this.handleChange('phone', phone)}
                    style={styles.textInput}
                    autoCapitalize="none"
                    keyboardAppearance="dark"
                    placeholderTextColor="#ffffff"
                    placeholder=""
                  />
                </Col>
              </Row>
              <Row style={{ flexDirection: 'column' }}>
                <Col>
                  <Text style={styles.textLabel}>City</Text>
                  <TextInput
                    onChangeText={(city) => this.handleChange('city', city)}
                    style={[styles.textInput]}
                    autoCapitalize="none"
                    placeholderTextColor="#ffffff"
                    underlineColorAndroid="transparent"
                    keyboardAppearance="dark"
                    placeholder=""
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Text style={styles.textLabel}>State</Text>
                  <TextInput
                    onChangeText={(state) => this.handleChange('state', state)}
                    style={styles.textInput}
                    autoCapitalize="none"
                    keyboardAppearance="dark"
                    placeholderTextColor="#ffffff"
                    placeholder=""
                  />
                </Col>
                <Col>
                  <Text style={styles.textLabel}>Zipcode</Text>
                  <TextInput
                    onChangeText={(zipcode) => this.handleChange('zipcode', zipcode)}
                    style={styles.textInput}
                    autoCapitalize="none"
                    keyboardAppearance="dark"
                    placeholderTextColor="#ffffff"
                    placeholder=""
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Text style={styles.textLabel}>Password</Text>
                  <TextInput
                    onChangeText={(password) => this.handleChange('password', password)}
                    secureTextEntry
                    style={styles.textInput}
                    autoCapitalize="none"
                    keyboardAppearance="dark"
                    placeholderTextColor="#ffffff"
                    placeholder="Password"
                  />
                </Col>
                <Col>
                  <Text style={styles.textLabel}>Confirm Password</Text>
                  <TextInput
                    onChangeText={(confirmPassword) => this.handleChange('confirmPassword', confirmPassword)}
                    secureTextEntry
                    style={styles.textInput}
                    autoCapitalize="none"
                    keyboardAppearance="dark"
                    placeholderTextColor="#ffffff"
                    placeholder="Confirm Password"
                  />
                </Col>
              </Row>
              <Row>
                <Button full style={styles.updateButton} onPress={() => this.newUser()}>
                  <Text style={{
                    color: '#ffffff', textAlign: 'center', fontSize: 22, width: '100%', fontFamily: 'BarlowCondensed-Bold',
                  }}
                  >
                    {' '}
                    SAVE
                    {' '}
                  </Text>
                </Button>
              </Row>
            </Grid>

          </KeyboardAvoidingView>

        </SafeAreaView>
      </Modal>
    );
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
              flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: 0.3,
            }}
            source={background}
          />
        </View>
        {this.addBallerModal()}
        <Grid>
          <Row style={{ position: 'relative', height: 170, backgroundColor: '#000000' }}>
            <View style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            }}
            >
              <Image
                style={{
                  flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: 0.4,
                }}
                source={poster}
              />
            </View>

            <AuthNav navigation={this.props.navigation} drawer={true} title="" page="NewMember" button="Add Member" link="Settings" />

            <View style={styles.runLocation}>
              <Text style={[styles.runLocationText, { fontSize: 24 }]}>{this.state.title}</Text>
              <View style={{
                height: 1, width: '70%', backgroundColor: '#ffffff', marginTop: 5, marginBottom: 5,
              }}
              />
              <Text style={[styles.runLocationText, { fontSize: 18 }]}>{this.state.address}</Text>
            </View>
          </Row>
          <Row style={{ flexDirection: 'row', width: '100%', height: 50 }}>

            <TextInput
              onChangeText={(search) => this.searchList(search)}
              style={styles.search}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#ffffff"
              underlineColorAndroid="transparent"
              keyboardAppearance="dark"
              placeholder="SEARCH MEMBERS"
            />

          </Row>
          <Row>
            {this.listBallers()}
          </Row>
        </Grid>

      </Container>

    );
  }
}

const mapStateToProps = (state) => ({
  cache: state.auth.cache,
  edit: state.auth.edit,
  user: state.auth.user.profile,
  data: state.games.view.data,
});

const mapDispatchToProps = (dispatch) => ({
  addEdit: (edit) => dispatch(addEdit(edit)),
  cacheData: (cache) => dispatch(cacheData(cache)),
  getLocationDetails: (locationID) => dispatch(getLocationDetails(locationID)),
  getRun: (runId, type) => dispatch(getRun(runId, type)),
  displayView: (view) => dispatch(displayView(view)),
  resetGroups: () => dispatch(resetGroups()),
  addToList: (list) => dispatch(addToList(list)),
  squadApi: (userId, type, data) => dispatch(squadApi(userId, type, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Management);
