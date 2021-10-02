import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import {Icon, Button} from 'native-base';
import {connect} from 'react-redux';
import {Col, Row, Grid} from 'react-native-easy-grid';
import { Storage } from 'aws-amplify';
import {addToList, displayView} from '../reducers/games';
import { withNavigation } from '@react-navigation/compat';


 class BasicList extends Component {

    constructor(props){
        super(props);

        this.state = {
            image: "https:\/\/s3.amazonaws.com\/awsjames-userfiles-mobilehub-258458471\/public\/james-full-logo.png",
            header: this.props.header,
            subText: this.props.subText,
            push: this.props.push,
            data: this.props.data,
            added: false,
            requested: false,
        }


    }

    componentDidMount(){
        this.showProfileImage();
    }

    showProfileImage(){

        if(this.props.imageType){

            if(this.props.imageType == "google"){

                this.setState({ image: this.props.image? this.props.image: "https:\/\/s3.amazonaws.com\/awsjames-userfiles-mobilehub-258458471\/public\/james-full-logo.png"});

            }else{
                Storage.get(this.props.image)
                .then(result => {

                    this.setState({ image: result });

                })
                .catch(err => alert(err));
            }

        }else{
            Storage.get(this.props.image)
            .then(result => {

                this.setState({ image: result });

            })
            .catch(err => alert(err));
        }

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

    view(page){
        this.props.displayView(this.props.data);
        this.state.push? this.props.navigation.push(page) : this.props.navigation.navigate(page);

    }

    addDefaultSrc(ev){
        return ev.target.src = 'https:\/\/s3.amazonaws.com\/awsjames-userfiles-mobilehub-258458471\/public\/james-full-logo.png';
    }

    render() {
        return (
            <View style={styles.listContainer}>

                <Grid>
                    <Row>
                        <Col>
                            <View style={{ width: 90, height: 100 }}>
                                <Image style={{ flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: .5 }} source={{uri: this.state.image}} />
                            </View>
                        </Col>
                        <Col style={{ width:200, paddingLeft:10, justifyContent:"center" }}>
                            <View><Text style={styles.headerText}>{this.props.header.toUpperCase()}</Text></View>
                            <View><Text style={styles.subText}>{this.props.subText}</Text></View>
                        </Col>
                        <Col style={{ width:50 }}>
                            <Button full transparent style={{height:"100%"}} onPress={() => this.view(this.props.page)}><Icon style={{color:"#ffffff", margin:0}} name="arrow-forward" /></Button>
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

export default connect(mapStateToProps, mapDispatchToProps) (withNavigation(BasicList));

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

