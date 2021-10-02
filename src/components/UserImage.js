import React from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, ActivityIndicator, CameraRoll, Alert, ScrollView } from 'react-native';
import { withNavigation } from '@react-navigation/compat';
import { Storage } from 'aws-amplify';

class UserImage extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            image: "../assets/james-full-logo.png",
        }

    }

    componentDidMount(){
        this.showProfileImage(this.props.image);
    }

    showProfileImage(image){

        Storage.get(image)
        .then(result => {

            this.setState({ image: result });
        })
        .catch(err => alert(err));

    }

    render() {
        return(
            <View style={[styles.profile, {width:this.props.size, height:this.props.size}]}>
                <Image resizeMode="cover" style={styles.profileImage} source={{ uri: this.state.image }} />
                {this.props.name? <Text style={styles.profileName}>{this.props.name.toUpperCase()}</Text> : false}
            </View>
        )
    }
}

const styles = {
    profile:{
        position:"relative",
        padding:3,
        justifyContent:"center",
        alignItems:"center",
        overflow:"hidden"
    },
    profileName:{
        position:"absolute",
        bottom:20,
        backgroundColor:"#000000",
        color:"#ffffff",
        fontFamily:"BarlowCondensed-Medium",
        padding:3,
        elevation:9,
        textAlign:"center",
        width:"80%"
    },
    profileImage:{
        position:"absolute",
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    },
    backButton:{
        fontSize:16,
        color:"#ffffff",
        fontFamily:"ProximaNova-Bold",
        textAlign:"center"
    }

}

export default withNavigation(UserImage);