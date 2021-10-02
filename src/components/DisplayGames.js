import React, { Component } from 'react';
import { View, Text } from 'react-native';
import {Icon, Button} from 'native-base';
import {connect} from 'react-redux';
import {Col, Row, Grid} from 'react-native-easy-grid';
import {addToList, displayView} from '../reducers/games';
import { withNavigation } from '@react-navigation/compat';


 class DisplayGames extends Component {

    constructor(props){
        super(props);

        this.state = {
            score: this.props.score,
            header: this.props.header,
            subText: this.props.subText,
            data: this.props.data,
            added: false,
            requested: false,
        }

    }

    UNSAFE_componentWillMount(){

    }

    view(page){

        this.props.displayView(this.state.data);
        this.state.push? this.props.navigation.push(page) : this.props.navigation.navigate(page);

    }

    render() {
        return (
            <View style={styles.listContainer}>

                <Grid>
                    <Row>
                        <Col>
                            <View>
                                <Text style={styles.scoreText}>{this.props.score}</Text>
                            </View>
                        </Col>
                        <Col style={{ width:190, justifyContent:"center" }}>
                            <View><Text style={styles.headerText}>{this.props.header.toUpperCase()}</Text></View>
                            <View><Text style={styles.subText}> {this.props.subText} </Text></View>
                        </Col>
                        <Col style={{ width:50 }}>
                            <Button full transparent style={{height:"100%"}} onPress={() => this.view(this.props.page)}><Icon style={{color:"#ffffff"}} name="arrow-forward" /></Button>
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

export default connect(mapStateToProps, mapDispatchToProps) (withNavigation(DisplayGames));

const styles = {
    listContainer:{
        flex:1,
        backgroundColor:"rgba(53,53,53,.9)",
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
        flex:1,
        color:"white",
        fontFamily:"BarlowCondensed-Bold",
        fontSize:24,
        padding:5
    },
    scoreText:{
        flex:1,
        color:"white",
        fontFamily:"BarlowCondensed-Bold",
        fontSize:36,
        padding:5
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

