/* eslint-disable no-alert */
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import {Card, Icon, Button} from 'native-base';
import {connect} from 'react-redux';
import {Col, Row, Grid} from 'react-native-easy-grid';
import { Storage } from 'aws-amplify';
import {addToList, displayView, setBallers} from '../reducers/games';
import { withNavigation } from '@react-navigation/compat';
import Modal from 'react-native-modal';

 class GameList extends Component {

    constructor(props){
        super(props);

        this.state = {
            image: 'https:\/\/s3.amazonaws.com\/awsjames-userfiles-mobilehub-258458471\/public\/james-full-logo.png',
            teamA: this.props.teamA,
            teamB: this.props.teamB,
        };

        let profile = this.showProfileImage();
    }

    showProfileImage(){

        Storage.get(this.props.image)
        .then(result => {

            this.setState({ image: result });

        })
        .catch(err => console.log(err));

        //return this.state.image;
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

        const ballers = {
            run: this.props.data.data.runId,
        };

        this.props.getRun(ballers,'getRunBallers')
        .then(result => {
            this.props.setBallers(result);

        })
        .catch(err => alert(err));

        this.props.displayView(this.state.data);
        this.state.push ? this.props.navigation.push(page) : this.props.navigation.navigate(page);

    }

    render() {
        return (
            <View style={styles.listContainer}>

                <Grid>
                    <Row style={{ height:30 }}>
                        <Col>
                            <View style={styles.result}>
                                <Text style={styles.resultText}>{this.props.date}</Text>
                            </View>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <View style={styles.team}>
                                <Text style={styles.teamText}>HOME</Text>
                            </View>
                            <View style={styles.score}>
                                <Text style={styles.scoreText}>{this.props.scoreA}</Text>
                            </View>
                            <View style={styles.result}>
                                <Text style={styles.resultText}>{this.state.teamA ? 'Winner' : 'Looser'}</Text>
                            </View>
                        </Col>
                        <Col>
                            <View style={styles.team}>
                                <Text style={styles.teamText}>GUEST</Text>
                            </View>
                            <View style={styles.score}>
                                <Text style={styles.scoreText}>{this.props.scoreB}</Text>
                            </View>
                            <View style={styles.result}>
                                <Text style={styles.resultText}>{this.state.teamB ? 'Winner' : 'Looser'}</Text>
                            </View>
                        </Col>
                    </Row>
                </Grid>

            </View>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        displayView: (view) => dispatch(displayView(view)),
        addToList: (list) => dispatch(addToList(list)),
        setBallers: (ballers) => dispatch(setBallers(ballers)),
    };
};

const mapStateToProps = (state) => {
    return {
        list: state.games.addToList,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(GameList));

const styles = {
    listContainer:{
        backgroundColor:'rgba(0,0,0,.6)',
        padding:10,
        marginLeft:'auto',
        marginRight:'auto',
        marginTop:10,
        width:'80%',
        height:180,
        borderRadius:5,
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
    teamText:{
        padding:0,
        color:'white',
        fontFamily:'BarlowCondensed-Medium',
        fontSize:20,
        textAlign:'center',
    },
    scoreText:{
        padding:0,
        color:'white',
        fontFamily:'BarlowCondensed-Bold',
        fontSize:52,
        textAlign:'center',
    },
    resultText:{
        padding:0,
        color:'white',
        fontFamily:'BarlowCondensed-Medium',
        fontSize:20,
        textAlign:'center',
    },
};

