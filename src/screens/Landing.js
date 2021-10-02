import React, { Component } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native';
import {connect} from 'react-redux';
import {login} from '../reducers/auth';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            error:false
        }

        // this.props.foodProducts.client = {};
        // this.props.foodProducts.dashboard = {};
        // this.props.foodProducts.allProducts = {};
        
    }

    handleChange(formField, value) {
        this.setState({[formField]: value});
    } 
   
    render() {
        const logo = require ("../assets/Logo.png"); 
        const background = require ("../assets/Background.png");

        return (
            <View style={styles.container}>
                <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
                    <Image style={{ flex: 1, resizeMode: 'cover', width: '100%', height: '100%' }} source={background} />
                </View>
                    <Image style={styles.logo} source={logo} />
                    <KeyboardAvoidingView style={{ width: '100%', margin:'auto', alignItems:"center", justifyContent:"center"}} behavior="padding">
                        <TextInput
                            onChangeText={(username) => this.handleChange('username', username)}
                            style={styles.textInput}
                            autoCapitalize = "none"
                            placeholderTextColor = "#ffffff"
                            underlineColorAndroid="transparent"
                            keyboardAppearance="dark"
                            placeholder="email address" />
                        <TextInput 
                            onChangeText={(password) => this.handleChange('password', password)}
                            style={styles.textInput}
                            secureTextEntry
                            autoCapitalize = "none"
                            keyboardAppearance="dark"
                            placeholderTextColor = "#ffffff"
                            placeholder="password" />
                    </KeyboardAvoidingView>
                    <TouchableOpacity style={styles.loginButton} onPress={() => this.props.login(this.state.password, this.state.username)}>
                        <View>
                            <Text style={{color:"#ffffff",textAlign: "center", fontSize:18 }}>LOGIN</Text>
                        </View>
                    </TouchableOpacity>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth,
        foodProducts: state.foodProducts
    }
}

const mapDispatchToProps = (dispatch) => ({
    login(password, username) {
        dispatch(login(password, username));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login)

const styles = {
    logo:{
        width:70,
        height:70,
        justifyContent:"center"
    },
    container:{
        backgroundColor:"#000000",
        flex:1,
        justifyContent:"center",
        alignItems:"center",
    },
    textInput:{
        color:"#ffffff",
        borderBottomWidth: 1,
        borderBottomColor:"#fff",
        marginBottom:"5%",
        padding:"5%",
        width:"80%",
        height:60,
        textAlign: "center",
        elevation:0
    },
    loginButton:{
        backgroundColor:"#76bc21",
        borderWidth: 0,
        borderColor:"#fff",
        marginBottom:0,
        padding:15,
        position: "absolute",
        bottom:0,
        left:0,
        right:0,

    }
}