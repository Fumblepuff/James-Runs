import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Card, Icon, Button } from 'native-base';
import { connect } from 'react-redux';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Storage } from 'aws-amplify';

import gameUtils from 'src/utils/gameUtils';

import { addToList } from 'src/reducers/games';

class ReviewList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      header: this.props.header,
      subText: this.props.subText,
      data: this.props.data,
      added: false,
      requested: false,
      list: this.props.list,
      opacity: 1,
    };
  }

  showProfileImage() {
    Storage.get(this.props.image)
      .then(result => {
        this.setState({ image: result });
      })
      .catch(err => console.log(err));
  }

  removeItem() {
    var array = this.props.list;
    let obj = array.find(x => x.id === this.state.data.id);

    if(obj) {
      var index = array.indexOf(obj);
      array.splice(index, 1);

      this.setState({
        added: false,
        requested:!this.state.requested,
        list: array,
      }, ()=>{
        this.setState({ opacity:0 });
      });
    }
  }

  addItem() {
    if(this.state.added) {
      this.removeItem();
    }else{
      //This just checks to see if the item is already is located in the array.
      //If it is then it removes it to be replaced.

      //this.removeItem();
      this.setState({
        added: true,
        requested:!this.state.requested,
      });

      this.props.addToList(this.state.data);
    }
  }

  render() {
    return (
            <View style={[styles.listContainer, { opacity: this.state.opacity }]}>

                <Grid>
                    <Row>
                        <Col>
                            <Button style={styles.selectBtn} transparent onPress={() => this.removeItem() }>
                                <Icon style={ styles.iconActive } name="ios-remove-circle"/>
                            </Button>
                        </Col>
                        <Col style={{ width:250, justifyContent:"center" }}>
                        <View><Text style={styles.headerText}>{gameUtils.isPickUpGame(this.props.data.type) ? 'Run' : 'Game'}</Text></View>
                        <View><Text style={styles.subText}>{this.state.header}, {this.state.subText}</Text></View>
                        </Col>
                    </Row>
                </Grid>

            </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addToList: (list) => {
      dispatch(addToList(list));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    list: state.games.addToSchedule,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewList);

const styles = {
  listContainer:{
    flex:1,
    backgroundColor:"#0E4071",
    padding:10,
    marginBottom:5,
  },
  selectBtn:{
    alignItems: "center",
    justifyContent:"center",
    height:"100%",
    padding:0,
  },
  profileImageWrapper:{
    width:100,
    height:100,
    alignItems: "center",
    justifyContent:"center",
    overflow:"hidden",
  },
  profileImage:{
    width:120,
    height:120,
  },
  headerText:{
    color:"white",
    fontFamily:"BarlowCondensed-Bold",
    fontSize:24,
  },
  subText:{
    color:"white",
    fontFamily:"BarlowCondensed-Medium",
    fontSize:20,
  },
  iconActive:{
    opacity: 1,
    color:"#478cba",
    fontSize:40,
    alignSelf:"center",
    marginRight:0,
    marginLeft:0,
  },
  iconInActive:{
    opacity: 1,
    color:"white",
    fontSize:40,
    alignSelf:"center",
    marginRight:0,
    marginLeft:0,
  },
};

