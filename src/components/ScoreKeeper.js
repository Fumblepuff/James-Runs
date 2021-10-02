import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import {Card, Icon, Button} from 'native-base';
import {connect} from 'react-redux';
import {Col, Row, Grid} from 'react-native-easy-grid';
import { Storage } from 'aws-amplify';
import {squadApi} from '../reducers/games';
import UserImage from '../components/UserImage';

 class ScoreKeeper extends Component {

    constructor(props){
        super(props);

        this.state = {
            image: "https:\/\/s3.amazonaws.com\/awsjames-userfiles-mobilehub-258458471\/public\/james-full-logo.png",
            data: this.props.data,
            ballers: this.props.ballers,
            team: this.props.team? this.props.team: "Team",
            point:this.props.score? this.props.score: 0,
        }

    }

    addPoint(){
        var point = this.state.point + 1;
        this.setState({point: point});

        const game = {
            team: this.state.team,
            points: point,
            gameId: this.props.game
        }

        console.log('Team:'+this.state.team+' Game ID:'+this.props.game)
        this.props.squadApi(this.props.user.id,"runPoint",game);

    }
    listBallers(){
        const ballers = Object.values(this.state.ballers);

        return ballers.map((value, key) => {
            var image = value.imageName;
            var name = value.firstName+' '+value.lastName;

            return <UserImage width="20%" image={image} name={false} key={key} />

        } )
    }

    scoreCard(){
        if(this.props.winner == this.state.team){

            return(

                <View style={{ backgroundColor:"#689f34", padding:10, flexDirection:"row", width:"100%" }}>
                    <View style={styles.score}>
                    <Text style={styles.scoreText}>{this.state.point}</Text>
                    </View>
                    <View style={styles.resultView}>
                    <Text style={styles.pointText}>WINNER!</Text>
                    </View>
                </View>

            );

        }else if( this.props.winner == "Tie" ){

            return(

                <View style={{ backgroundColor:"#478cba", padding:10, flexDirection:"row", width:"100%" }}>
                    <View style={styles.score}>
                    <Text style={styles.scoreText}>{this.state.point}</Text>
                    </View>
                    <View style={styles.resultView}>
                    <Text style={styles.pointText}>TIE</Text>
                    </View>
                </View>

            );

        }else if( !this.props.winner){

            return(

                <View style={{ backgroundColor:"#000000", padding:10, flexDirection:"row", width:"100%" }}>
                    <View style={styles.score}>
                    <Text style={styles.scoreText}>{this.state.point}</Text>
                    </View>
                    <Button style={styles.pointBtn} onPress={() => this.addPoint()}>
                    <Text style={styles.pointText}>+1</Text>
                    </Button>
                </View>

            );

        }else{

            return(

                <View style={{ backgroundColor:"#e44240", padding:10, flexDirection:"row", width:"100%" }}>
                    <View style={styles.score}>
                    <Text style={styles.scoreText}>{this.state.point}</Text>
                    </View>
                    <View style={styles.resultView}>
                    <Text style={styles.pointText}>LOSER</Text>
                    </View>
                </View>

            );

        }



    }

    render() {
        return (
            <View style={styles.listContainer}>

                <Grid>
                    <Row style={{height:40}}>
                        <View style={{width:"100%"}}>
                        <Text style={{ padding:10, width:"100%", textAlign:"center", backgroundColor:"#ffffff", color:"#000000", flexDirection:"row" }}>{this.state.team}</Text>
                        </View>
                    </Row>
                    <Row style={{height:60}}>
                        <View style={{ width:"100%", flexDirection:"row" }}>
                            {this.listBallers()}
                        </View>
                    </Row>
                    <Row style={{height:80}}>
                        {this.scoreCard()}
                    </Row>

                </Grid>

            </View>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addToList: (list) => { dispatch(addToList(list)) },
        squadApi: (userId,type,data) => dispatch(squadApi(userId,type,data))
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user.profile,
        runId: state.games.view.schedule.id,
        gameId: state.games.view.game,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScoreKeeper);

const styles = {
    listContainer:{
        backgroundColor:"rgba(0,0,0,.5)",
        padding:10,
        marginBottom:5,
        height:200,
        width:"80%"
    },
    pointBtn:{
        flex:1,
        alignItems: "center",
        justifyContent:"center",
        backgroundColor:"#478cba",
        height:"100%"
    },
    resultView:{
        flex:1,
        alignItems: "center",
        justifyContent:"center",
        backgroundColor:"transparent",
        height:"100%"
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
    pointText:{
        color:"white",
        fontFamily:"BarlowCondensed-Bold",
        fontSize:34,
        textAlign:"center",
    },
    score:{
        flex:1,
        alignItems: "center",
        justifyContent:"center",
    },
    scoreText:{
        color:"white",
        fontFamily:"BarlowCondensed-Bold",
        fontSize:55,
        textAlign:"center"
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

