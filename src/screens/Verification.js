import React, { Component } from 'react';
import { Dimensions, Picker, Keyboard, View, TextInput, Text, TouchableOpacity, Image, KeyboardAvoidingView, Alert, CameraRoll, ActivityIndicator, SafeAreaView } from 'react-native';
import { Container, Content, Icon, Card, CardItem, Button} from 'native-base';
import {connect} from 'react-redux';
import {registerUser, loginUser} from '../reducers/auth';
import {getRun} from '../reducers/games';
import Modal from 'react-native-modal';
import ModalDropdown from 'react-native-modal-dropdown';
import CameraRollPicker from 'react-native-camera-roll-picker';
import {uploadFile} from '../reducers/auth';
import { Storage } from 'aws-amplify';
import { Buffer } from 'buffer';
import RNFetchBlob from 'rn-fetch-blob';
import { Auth } from 'aws-amplify';

class Register extends Component {
	textRef = ref => this.text = ref;

	constructor(props) {
		super(props);
		this.state = {
			detailModal: false,
			completeModal: false,
			showPhotos: false,
			showLoader: false,
			display: '',
			firstName: '',
			lastName: '',
			city: '',
			state: '',
			zipcode: '',
			phone: '',
			email: '',
			gender: '',
			password: '',
			confirmPassword: '',
			verification:'',
			registerMessage: '',
			pickerDisplay:'none',
			dropdown: false,
			error:false,
			verifyModal:false,
		};


	}

	componentDidMount() {
		this.keyboardDidShowListener = Keyboard.addListener(
			'keyboardDidShow',
			this._keyboardDidShow,
		);
		this.keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			this._keyboardDidHide,
		);
	}

	componentWillUnmount() {
		this.keyboardDidShowListener.remove();
		this.keyboardDidHideListener.remove();
	}

	_keyboardDidShow() {

 	}

	_keyboardDidHide() {

	}

	nextScreen(screen){
		switch (screen) {
			case 'basic':

				if ( this.state.firstName && this.state.lastName && this.state.email && this.state.password && this.state.confirmPassword){

					if (this.state.password == this.state.confirmPassword){

						const now = Date.now();
						this.setState({
							detailModal:!this.state.detailModal,
							display:'none',
						});

					} else {
						Alert.alert(
							'Check your Password',
							'Passwords Do Not Match!',
							[
								{text: 'OK', onPress: () => console.log('OK Pressed')},
							],
							{ cancelable: true }
						);
					}


				} else {
					Alert.alert(
						'All Fields Are Required',
						'Please Be Sure All Fields are Filled',
						[
							{text: 'OK', onPress: () => console.log('OK Pressed')},
						],
						{ cancelable: true }
					);
				}


				break;
			case 'detail':

				if ( this.state.city && this.state.state && this.state.zipcode && this.state.phone && this.state.gender ){
					this.setState({
						detailModal: !this.state.detailModal,
					}, ()=>{
						this.setState({showLoader: true});
					});
					setTimeout(() => {
						this.registerUser();
					}, 500);

				} else {

					Alert.alert(
						'All Fields Are Required',
						'Please Be Sure All Fields are Filled',
						[
							{text: 'OK', onPress: () => console.log('OK Pressed')},
						],
						{ cancelable: true }
					);

				}

				break;
			default:
				break;

		}
	}

	switchModal(from, to){

        this.setState({
	        [from]: false,
	        next: true,
	    }, ()=>{

	        setTimeout(() => {

	            this.setState({ [to]: true });

	        }, 500);

	    });

    }

	closeModal(modal){
        this.setState({
            [modal]: false,
            error:false,
        });
    }

	confirmation(){
		this.props.register.register.check ?
			this.setState({registerMessage: 'THANK YOU FOR REGISTERING.'}) :
			this.setState({registerMessage: 'Email Already Registered'});
		this.setState({completeModal: !this.state.completeModal});
	}

	registerUser(){
		const register = {
			firstName:this.state.firstName,
			lastName:this.state.lastName,
			email:this.state.email,
			password:this.state.password,
			city:this.state.city,
			state:this.state.state,
			zipcode:this.state.zipcode,
			phone:this.state.phone,
			gender:this.state.gender,
		};

		const attr = {
            email:this.state.email,
            phone_number:this.state.phone,
        };

        const params = {
            username: this.state.email,
            password: this.state.password,
            attributes: attr,
        };

        Auth.signUp(params)
        .then(data => {

        	this.setState({verifyModal: true});

        })
        .catch(err => {
            const error = err.message.split(':');
            console.log(error);

            this.setState({
                error:true,
                message: err.message,
            });

        });

		// this.props.getRun(register,"registerUser")
		// .then(result => {
		// 	if(result == "email"){
		// 		this.setState({registerMessage: "Email Already Registered"})
		// 	}else {
		// 		this.setState({registerMessage: "THANK YOU FOR REGISTERING."})
		// 	}

		// 	setTimeout(() => {
		// 		this.setState({
		// 			completeModal: !this.state.completeModal,
		// 		});
		// 	}, 400);
		// })
		// .catch(err => alert(err));

	}

	resendVerification(){
		Auth.resendSignUp(this.state.email).then(() => {
		    this.setState({
                error:true,
                message: 'Verification Code Resent!',
            });
		}).catch(e => {
		    console.log(e);
		});
	}

	verify(){

		if (this.state.verification){

			Auth.confirmSignUp(this.state.email, this.state.verification)
			.then(data => {

				const auth = {
	                email: this.state.email,
	            };

				this.props.loginUser(auth)
		        .then(result => {

		            if (result){

		                this.props.navigation.navigate('RunListing');

		            } else {
		                alert('Password or Email is incorrect');
		            }

		        })
		        .catch(err => alert(err));

			})
			.catch(err => console.log(err));

		}

	}

	removeLoader(result){

		this.setState({showLoader: false});
		Storage.get(this.state.photoName, {expires: 60 * 60 * 24 * 365})
		.then(result => {

			this.setState({photoUri: result});
			this.registerUser();

		})
		.catch(err => console.log(err));

	}

	selectItem() {
		Keyboard.dismiss();
		this.setState({
			dropdown: true,
			pickerDisplay:'flex',
		});
	}

	handleChange(formField, value) {
		this.setState({
			[formField]: value,
			error:false,
		});
	}

	handleSelect(formField, value){
		this.text.focus();

		this.setState({
			[formField]: value,
			dropdown: true,
			pickerDisplay:'none',
		});
	}

	errorStatus(){
        if (this.state.error){
            return (
                <View style={{ borderRadius:3, backgroundColor:'#000000', padding:10 }}>
                    <Text style={{borderWidth:0, alignItems:'center', textAlign:'center', color:'#FFFFFF', fontFamily:'BarlowCondensed-Bold'}}>{this.state.message}</Text>
                </View>
            );
        }
    }

	completeModal(){
		return (
			<Modal isVisible={this.state.completeModal} backdropColor="rgba(0,0,0,.6)">
				<View style={{ width:'80%' , justifyContent:'center' , alignItems:'center', backgroundColor:'white', alignSelf:'center', padding:15 }}>
					<Text style={styles.blueText} >{ this.state.registerMessage }</Text>
					<Text style={styles.thanksText} >Login below</Text>
				</View>
				<Button style={styles.nextButton} onPress={() => this.props.navigation.navigate('Login')}>
						<Text style={{color:'#ffffff',textAlign: 'center', fontSize:18, width:'100%' }}>LOGIN</Text>
				</Button>
			</Modal>
		);
	}

	verifyModal(){
		return (
			<Modal style={{flex:1, width:'100%', margin:0}} isVisible={this.state.verifyModal} backdropColor="#000000">
				<SafeAreaView style={styles.registerBox}>
					<View style={styles.modalHeader}>
	                    <Button full transparent style={styles.close} onPress={() => this.closeModal('detailModal')}>
	                        <Icon style={styles.closeText} type="MaterialIcons" name="keyboard-backspace" />
	                        <Text style={{fontFamily:'BarlowCondensed-Bold', textAlign:'left', color:'#ffffff', marginLeft:20, margin:0}}>BACK</Text>
	                    </Button>
	                </View>
					<KeyboardAvoidingView behavior="padding">
						<View style={{ flex:1, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
						{this.errorStatus()}
						<TextInput
							onChangeText={(verification) => this.handleChange('verification', verification)}
							style={[styles.textInput, {textAlign:'center'}]}
							autoCapitalize = "none"
							placeholderTextColor = "#ffffff"
							underlineColorAndroid="transparent"
							keyboardAppearance="dark"
							keyboardType="number-pad"
							autoFocus = {true}
							placeholder="Enter Verification Number" />
						</View>
						<Button full style={styles.resendBtn} onPress={() => this.resendVerification()}>
							<Text style={{color:'#ffffff',textAlign: 'left', fontFamily:'BarlowCondensed-Bold', width:'95%' }}>RESEND CODE</Text>
						</Button>

					<Button full style={styles.nextButton} onPress={() => this.verify()}>
						<Text style={{color:'#ffffff',textAlign: 'center', fontSize:18, width:'100%' }}> Verify </Text>
					</Button>

					</KeyboardAvoidingView>



				</SafeAreaView>
			</Modal>

		);
	}

	detailModal(){
		return (
			<Modal style={{flex:1, width:'100%', margin:0}} isVisible={this.state.detailModal} backdropColor="#000000">
				<SafeAreaView style={styles.registerBox}>
					<View style={styles.modalHeader}>
	                    <Button full transparent style={styles.close} onPress={() => this.closeModal('detailModal')}>
	                        <Icon style={styles.closeText} type="MaterialIcons" name="keyboard-backspace" />
	                        <Text style={{fontFamily:'BarlowCondensed-Bold', textAlign:'left', color:'#ffffff', marginLeft:20, margin:0}}>BACK</Text>
	                    </Button>
	                </View>
					<KeyboardAvoidingView behavior="padding">
						<View style={{ flex:1, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
						{this.errorStatus()}
						<TextInput
							onChangeText={(city) => this.handleChange('city', city)}
							style={styles.textInput}
							autoCapitalize = "none"
							placeholderTextColor = "#ffffff"
							underlineColorAndroid="transparent"
							keyboardAppearance="dark"
							autoFocus = {true}
							placeholder="City" />
						<TextInput
							onChangeText={(state) => this.handleChange('state', state)}
							style={styles.textInput}
							autoCapitalize = "none"
							keyboardAppearance="dark"
							placeholderTextColor = "#ffffff"
							placeholder="State" />

						<TextInput
							onChangeText={(zipcode) => this.handleChange('zipcode', zipcode)}
							style={styles.textInput}
							autoCapitalize = "none"
							keyboardAppearance="dark"
							placeholderTextColor = "#ffffff"
							placeholder="Zipcode" />

						<TextInput
							ref={this.textRef}
							onChangeText={(phone) => this.handleChange('phone', phone)}
							style={styles.textInput}
							autoCapitalize = "none"
							keyboardAppearance="dark"
							placeholderTextColor = "#ffffff"
							placeholder="Phone" />

						<Button full style={styles.selectBtn} onPress={() => this.selectItem()}>
							<Text style={{color:'#ffffff',textAlign: 'left', fontFamily:'BarlowCondensed-Bold', width:'95%' }}>{this.state.gender ? this.state.gender : 'Select Gender'}</Text>
						</Button>

						</View>

					<Button full style={styles.nextButton} onPress={() => this.nextScreen('detail')}>
						<Text style={{color:'#ffffff',textAlign: 'center', fontSize:18, width:'100%' }}> REGISTER </Text>
					</Button>
					<Picker
						selectedValue={this.state.gender ? this.state.gender : 'Select Gender'}
						style={{backgroundColor:'#ffffff', display:this.state.pickerDisplay, flex:1, height: 50, width: Dimensions.get('window').width}}
						onValueChange ={(gender) => this.handleSelect('gender', gender)} >
						<Picker.Item label="Male" value="Male" />
						<Picker.Item label="Female" value="Female" />
					</Picker>
					</KeyboardAvoidingView>



				</SafeAreaView>
			</Modal>

		);
	}

	loadingModal(){
		return (
			<Modal isVisible={this.state.showLoader} backdropColor="rgba(0,0,0,.6)" >
				<View style={styles.loadView}>
					<ActivityIndicator size="large" color="#0000ff" />
				</View>
			</Modal>
		);
	}

	render() {
		const logo = require('../assets/logo_basic.png');
		const background = require('../assets/Background.png');

		return (
			<Container style={styles.container}>
				<View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
					<Image style={{ flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity:0.6 }} source={background} />
				</View>

				<SafeAreaView style={[styles.registerBox, {display: this.state.display}]}>
					<Button style={[styles.registerMenuButton, {display: this.state.display}]} transparent onPress={() => this.props.navigation.navigate('Login')}>
						<Text style={styles.registerMenuText}>Back to Login</Text>
					</Button>
					<KeyboardAvoidingView behavior="padding">
						<View style={{ flex:1, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
						{this.errorStatus()}
						<TextInput
							onChangeText={(firstName) => this.handleChange('firstName', firstName)}
							style={styles.textInput}
							autoCapitalize = "none"
							keyboardAppearance="dark"
							placeholderTextColor = "#ffffff"
							autoFocus = {true}
							placeholder="First Name" />

						<TextInput
							onChangeText={(lastName) => this.handleChange('lastName', lastName)}
							style={styles.textInput}
							autoCapitalize = "none"
							keyboardAppearance="dark"
							placeholderTextColor = "#ffffff"
							placeholder="Last Name" />

						<TextInput
							onChangeText={(email) => this.handleChange('email', email)}
							style={styles.textInput}
							autoCapitalize = "none"
							keyboardAppearance="dark"
							placeholderTextColor = "#ffffff"
							placeholder="Email Address" />

						<TextInput
							onChangeText={(password) => this.handleChange('password', password)}
							secureTextEntry
							style={styles.textInput}
							autoCapitalize = "none"
							keyboardAppearance="dark"
							placeholderTextColor = "#ffffff"
							placeholder="Password" />

						<TextInput
							onChangeText={(confirmPassword) => this.handleChange('confirmPassword', confirmPassword)}
							secureTextEntry
							style={styles.textInput}
							autoCapitalize = "none"
							keyboardAppearance="dark"
							placeholderTextColor = "#ffffff"
							placeholder="Confirm Password" />

						</View>
					<Button full style={styles.nextButton} onPress={() => this.nextScreen('basic')}>
						<Text style={{color:'#ffffff',textAlign: 'center', fontSize:18, width:'100%' }}> NEXT </Text>
					</Button>
					</KeyboardAvoidingView>
				</SafeAreaView>
				{this.loadingModal()}
				{this.detailModal()}
				{this.completeModal()}
				{this.verifyModal()}

			</Container>

		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.auth,
		register: state.auth.register,
	};
};

const mapDispatchToProps = (dispatch) => ({
	getRun: (runId, type) => dispatch(getRun(runId, type)),
	registerUser: (userRegister) => dispatch(registerUser(userRegister)),
	loginUser: (auth) => dispatch(loginUser(auth)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);

const styles = {
	profilePhoto:{
		height:70,
		width:70,
		borderRadius:50,
		borderWidth: 2,
		borderColor:'#fff',
		marginRight:'auto',
		marginLeft:'auto',
		marginTop:15,
		overflow:'hidden',
		justifyContent:'center',
		alignItems:'center',
	},
	uploadButton:{
		backgroundColor:'#478cba',
		borderWidth: 0,
		borderColor:'#fff',
		marginBottom:0,
		padding:15,
		position: 'absolute',
		bottom:0,
		left:0,
		right:0,
		zIndex:9,
	},
	logo:{
		width:250,
		height:250,
		justifyContent:'center',
	},
	registerBox:{
		position:'relative',
		width:'100%',
		flex:1,
		padding: 5,
		backgroundColor:'rgba(60,60,60,.8)',
		justifyContent:'center',
		alignItems:'center',
	},
	container:{
		backgroundColor:'#000000',
		flex:1,
		justifyContent:'center',
		alignItems:'center',
		overflow:'scroll',
		width:'100%',
		margin:'auto',
	},
	modalHeader:{
        top:0,
        width:'100%',
        height: 50,
    },
    close:{
        height:70,
        flexDirection:'column',
        alignItems:'flex-start',
    },
    closeText:{
        width:'100%',
        color:'#FFFFFF',
        textAlign:'left',
        fontSize:22,
        flex:1,
        justifyContent:'flex-start',
        alignItems:'flex-start',
        fontFamily: 'ProximaNova-Bold',
    },
	registerMenuButton:{
		width:275,
		marginLeft:'auto',
		marginRight:'auto',
	},
	registerMenuText:{
		width:275,
		color:'#ffffff',
		fontFamily:'BarlowCondensed-Bold',
		textAlign:'right',
	},
	registerMenu:{

	},
	textInput:{
		color:'#ffffff',
		fontFamily:'BarlowCondensed-Bold',
		fontSize:16,
		lineHeight:20,
		borderBottomWidth: 1,
		borderBottomColor:'#fff',
		marginBottom:10,
		padding:5,
		width:'80%',
		height:50,
		textAlign: 'left',
		elevation:0,
	},
	registerText:{
		color:'#ffffff',
		fontFamily:'BarlowCondensed-Medium',
		fontSize:16,
		padding:10,
	},
	icon:{
		color:'#ffffff',
		margin:15,
		fontSize:18,
	},
	optionStyle:{
		width:'80%',
		backgroundColor:'transparent',
		borderBottomWidth: 1,
		borderBottomColor:'#ffffff',
	},
	nextButton:{
		backgroundColor:'#478cba',
		borderWidth: 0,
		borderColor:'#ffffff',
		marginTop:15,
		padding:15,
	},
	resendBtn:{
		width:'80%',
		alignSelf:'center',
		backgroundColor:'transparent',
		borderBottomWidth: 0,
		borderBottomColor:'#ffffff',
	},
	selectBtn:{
		width:'80%',
		alignSelf:'center',
		backgroundColor:'transparent',
		borderBottomWidth: 1,
		borderBottomColor:'#ffffff',
	},
	blueText:{
		color:'#478cba',
		fontSize:22,
		fontWeight:'900',
		textAlign:'center',
	},
	thanksText:{
		fontSize:18,
	},
};
