/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import {connect} from 'react-redux';
import {Col, Row, Grid} from 'react-native-easy-grid';
import { Storage } from 'aws-amplify';
import {addToList, displayView, getRun} from '../reducers/games';

import { withNavigation } from '@react-navigation/compat';


 class BallerStatList extends Component {

    constructor(props){
        super(props);

        this.state = {
            image: 'https:\/\/s3.amazonaws.com\/awsjames-userfiles-mobilehub-258458471\/public\/james-full-logo.png',
            header: this.props.header,
            subText: this.props.subText,
            push: this.props.push,
            data: this.props.data,
            added: false,
            requested: false,
            checkin: this.props.checkin,
            bench: this.props.bench,
        };

        this.showProfileImage();
    }

    componentDidMount(){
        this.ballerStats();
    }

    showProfileImage(){

        Storage.get(this.props.image)
        .then(result => {

            this.setState({ image: result });

        })
        .catch(err => alert(err));

        //return this.state.image;
    }
    editBaller(){
        Alert.alert(
            this.props.data.firstName + ' ' + this.props.data.lastName,
            'Select An Option Below',
            [
                {text: 'View Profile', onPress: () => this.viewBallerProfile()},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            ],
            { cancelable: true }
        );
    }
    viewBallerProfile(){
        var baller = {
            city: this.props.data.city,
            date: this.props.data.date,
            email: this.props.data.email,
            firstName: this.props.data.firstName,
            id: this.props.data.id,
            image: this.props.data.image,
            imageLocal: this.props.data.imageLocal,
            imageName: this.props.data.imageName,
            lastName: this.props.data.lastName,
            password: this.props.data.password,
            phone: this.props.data.phone,
            state: this.props.data.state,
            type: this.props.data.type,
            zipcode: this.props.data.zipcode,
        };

        var data = { data: baller };
        this.props.displayView(data);
        this.props.navigation.navigate('BallerProfile');

    }

    removeItem(){

        var array = this.props.list;
        let obj = array.find(x => x.id === this.state.data.id);

        if (obj){
            var index = array.indexOf(obj);
            array.splice(index, 1);

            this.setState({
                added: false,
                requested:!this.state.requested,
            });
        }
    }

    addItem(){

        if (this.state.added){

            this.removeItem();

        } else {

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

    view(page){
        this.props.displayView(this.props.data);
        this.state.push ? this.props.navigation.push(page) : this.props.navigation.navigate(page);

    }

    addDefaultSrc(ev){
        return ev.target.src = 'https:\/\/s3.amazonaws.com\/awsjames-userfiles-mobilehub-258458471\/public\/james-full-logo.png';
    }

    ballerStats(){
       var user = {
            user: this.props.data.id,
        };

        this.props.getRun(user,'getUserStats')
        .then(result => {

            this.setState({
                jamesRating: result.jamesRating ? result.jamesRating : 0,
                winPercentage: result.winPercentage ? result.winPercentage : 0,
                games: result.gameCount ? result.gameCount : 0,
            });

        })
        .catch(err => alert(err));
    }

    render() {
        return (

            <Grid style={styles.listContainer}>
                <Row>
                    <Col style={{ flex:0.35 }}>
                        <View style={{ width: 80, height: 100 }}>
                            <TouchableOpacity style={{ width: 80, height: 100 }} onPress={() => this.editBaller()}>
                            <Image style={{ flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: 0.5 }} source={{uri: this.state.image}} />
                            </TouchableOpacity>
                        </View>
                    </Col>
                    <Col style={{ flex:1 }}>
                        <Row style={{ flex:0.25 }}>
                            <Col style={{ flex:1, flexDirection:'row' }}>
                                <View><Text style={styles.headerText}>{this.props.header.toUpperCase()}</Text></View>
                                <View><Text style={styles.subText}>{this.props.subText}</Text></View>
                            </Col>
                        </Row>
                        <Row>

                            <Col style={{ flex:1, flexDirection:'row' }}>
                                <View style={{height:'100%', flex:1, margin:5, alignContent:'center', justifyContent:'center'}}>
                                    <Text style={[styles.subText, {fontSize:32, fontFamily:'BarlowCondensed-Bold', color:'#478cba', textAlign:'center'}]}>{this.state.jamesRating}</Text>
                                    <Text style={[styles.subText, {fontSize:16, textAlign:'center'}]}>James Rating</Text>
                                </View>
                                <View style={{height:'100%', flex:1, margin:5, alignContent:'center', justifyContent:'center'}}>
                                    <Text style={[styles.subText, {fontSize:32, textAlign:'center'}]}>{this.state.winPercentage}%</Text>
                                    <Text style={[styles.subText, {fontSize:16, textAlign:'center'}]}>Wins % </Text>
                                </View>
                                <View style={{height:'100%', flex:1, margin:5, alignContent:'center', justifyContent:'center'}}>
                                    <Text style={[styles.subText, {fontSize:32, textAlign:'center'}]}>{this.state.games}</Text>
                                    <Text style={[styles.subText, {fontSize:16, textAlign:'center'}]}>Games</Text>
                                </View>
                            </Col>

                        </Row>
                    </Col>
                </Row>
            </Grid>

        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getRun: (runId, type) => dispatch(getRun(runId, type)),
        displayView: (view) => dispatch(displayView(view)),
        addToList: (list) => {
            dispatch(addToList(list));
        },
    };
};

const mapStateToProps = (state) => {
    return {
        list: state.games.addToList,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(BallerStatList));

const styles = {
    listContainer:{
        backgroundColor:'rgba(53,53,53,.9)',
        width:'100%',
        marginBottom:5,
    },
    selectBtn:{
        alignItems: 'center',
        justifyContent:'center',
        height:'100%',
        padding:0,
    },
    profileImageWrapper:{
        width:100,
        height:100,
        alignItems: 'center',
        justifyContent:'center',
        overflow:'hidden',
    },
    profileImage:{
        width:120,
        height:120,
    },
    headerText:{
        flex:1,
        color:'white',
        fontFamily:'BarlowCondensed-Bold',
        fontSize:18,
        marginRight:10,
    },
    subText:{
        color:'white',
        fontFamily:'BarlowCondensed-Medium',
        fontSize:16,
    },
    iconActive:{
        opacity: 1,
        color:'#478cba',
        fontSize:40,
        alignSelf:'center',
        marginRight:0,
        marginLeft:0,
    },
    iconInActive:{
        opacity: 1,
        color:'white',
        fontSize:40,
        alignSelf:'center',
        marginRight:0,
        marginLeft:0,
    },
};

