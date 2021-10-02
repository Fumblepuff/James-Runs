import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import {Card, Icon, Button} from 'native-base';
import {connect} from 'react-redux';
import {Col, Row, Grid} from 'react-native-easy-grid';
import { Storage } from 'aws-amplify';

import {addToList} from '../reducers/games';

 class SelectList extends Component {

    constructor(props){
        super(props);

        this.state = {
            image: "https:\/\/s3.amazonaws.com\/awsjames-userfiles-mobilehub-258458471\/public\/james-full-logo.png",
            header: this.props.header,
            subText: this.props.subText,
            data: this.props.data,
            added: false,
            requested: false,
        }

    }

    componentDidMount(){
        this.showProfileImage();
    }

    showProfileImage(){

        Storage.get(this.props.image)
        .then(result => {

            this.setState({ image: result });

        })
        .catch(err => console.log(err));


    }

    removeItem(){

        var array = this.props.list;
        let obj = array.find(x => x.id === this.state.data.id);

        if(obj){
            var index = array.indexOf(obj);
            array.splice(index, 1);

            this.setState({
                added: false,
                requested:!this.state.requested
            });
        }
    }

    addItem(){

        if(this.state.added){

            this.removeItem();

        }else{

            //This just checks to see if the item is already is located in the array.
            //If it is then it removes it to be replaced.

            //this.removeItem();
            this.setState({
                added: true,
                requested:!this.state.requested
            });

            this.props.addToList(this.state.data)

        }
    }

    render() {
        return (
            <View style={styles.listContainer}>

                <Grid>
                    <Row>
                        <Col style={{ width:50 }}>
                            <Button style={styles.selectBtn} transparent onPress={this.state.added ? () => this.removeItem() : () => this.addItem() }>
                                <Icon style={!this.state.select ? styles.iconInActive : styles.iconActive } name={!this.state.requested ? "ios-add-circle" : "ios-checkmark-circle-outline"} />
                            </Button>
                        </Col>
                        <Col style={{ width:110 }}>
                            <View style={{ width: 100, height: 100 }}>
                                <Image style={{ flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: .5 }} source={{uri: this.state.image}} />
                            </View>
                        </Col>
                        <Col style={{justifyContent:"center" }}>
                            <View><Text style={styles.headerText}>{this.state.header.toUpperCase()}</Text></View>
                            <View><Text style={styles.subText}>{this.state.subText}</Text></View>
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
            dispatch(addToList(list))
        }
    }
}

const mapStateToProps = (state) => {
    return {
        list: state.games.addToList,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectList);

const styles = {
    listContainer:{
        flex:1,
        backgroundColor:"rgba(0,0,0,.5)",
        padding:10,
        marginBottom:5
    },
    selectBtn:{
        alignItems: "center",
        justifyContent:"center",
        height:"100%",
        padding:0
    },
    profileImageWrapper:{
        width:100,
        height:100,
        alignItems: "center",
        justifyContent:"center",
        overflow:"hidden"
    },
    profileImage:{
        width:120,
        height:120
    },
    headerText:{
        color:"white",
        fontFamily:"BarlowCondensed-Bold",
        fontSize:24
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
        marginLeft:0
    },
    iconInActive:{
        opacity: 1,
        color:"white",
        fontSize:40,
        alignSelf:"center",
        marginRight:0,
        marginLeft:0
    },
}

