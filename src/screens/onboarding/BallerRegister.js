/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { Picker, Keyboard, View, TextInput, Text, Image, KeyboardAvoidingView, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import { Container, Icon, Button} from 'native-base';
import {connect} from 'react-redux';
import {registerUser, loginUser} from '../../reducers/auth';
import {getRun} from '../../reducers/games';
import Modal from 'react-native-modal';
import { Storage } from 'aws-amplify';
import { Auth } from 'aws-amplify';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDarkMode } from 'react-native-dynamic';
import formStyle from '../../styles/Form';
import mainStyle from '../../styles/Style';
import modalStyle from '../../styles/Modal';
import 'moment-timezone';

const styles = mainStyle;
const formStyles = formStyle;
const modalStyles = modalStyle;

const moment = require('moment');

function DateSelectView({state, value, mode, title, update }){
    const isDarkMode = useDarkMode();

    return (
        <View style={[styles.dateTimePicker, {backgroundColor: !isDarkMode ? '#ffffff' : '#303030'}]}>
            <View style={[modalStyles.modalHeader, {alignItems:'center', backgroundColor:'#000000', justifyContent:'center', marginTop:0}]}>
                <Text style={styles.h1}>{title}</Text>
            </View>
            <DateTimePicker
                value={value}
                mode={mode}
                is24Hour={false}
                onChange={update}
            />
        </View>
    );

}

class BallerRegister extends Component {
	textRef = ref => this.text = ref;

	constructor(props) {
		super(props);

		const date = new Date();
		this.state = {
			detailModal: false,
			completeModal: false,
			showPhotos: false,
			showLoader: false,
			display: 'flex',
			firstName: '',
			lastName: '',
			city: '',
			state: '',
			zipcode: '',
			phone: '',
			email: '',
			dob: date,
			password: '',
			confirmPassword: '',
			verification:'',
			registerMessage: '',
			pickerDisplay:'none',
			select:'',
            selectItems: [],
            positions: ['1G','2G','3F','4F','5C'],
            experienceList: ['Recreational', 'High School', 'College', 'Semi-Pro', 'Professional'],
            genderList: ['Male', 'Female', 'Other'],
			dropdown: false,
			error:false,
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

	hasNumber(myString) {
		return /\d/.test(myString);
	}

	nextScreen(){
		if ( this.state.ballerTag && this.state.dob){
			this.setState({showLoader:true});
			setTimeout(() => {
				this.updateUser();
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

	updateUser(){
		const birthDate = moment(this.state.dob).format('YYYY-MM-DD');

		const register = {
			dob:birthDate,
            ballerTag:this.state.ballerTag,
            jersey:this.state.jersey,
            position:this.state.position,
            highestLevelOfPlay:this.state.highestLevelOfPlay,
		};

		console.log(register);

        this.props.getRun(register,'addBallerDetail')
		.then(result => {
			this.setState({showLoader:false});
			this.props.navigation.navigate('RunListing');

		})
		.catch(err => alert(err));

	}

	removeLoader(){

		this.setState({showLoader: false});
		Storage.get(this.state.photoName, {expires: 60 * 60 * 24 * 365})
		.then(result => {

			this.setState({photoUri: result});
			this.registerUser();

		})
		.catch(err => console.log(err));

	}

	handleChange(formField, value) {
		this.setState({
			[formField]: value,
			error:false,
		});
	}

	closeSelect(){
        Keyboard.dismiss();

        this.setState({
            dropdown: true,
            pickerDisplay:'none',
        });
    }

    handleSelect(type, value){
        // this.text.focus();
        Keyboard.dismiss();

        switch (type) {
            case 'positions':
                this.setState({
                    dropdown: true,
                    pickerDisplay:'none',
                    position: value,
                });
                break;

            case 'highestLevelOfPlay':
                this.setState({
                    dropdown: true,
                    pickerDisplay:'none',
                    highestLevelOfPlay: value,
                });
                break;

            case 'gender':
                this.setState({
                    dropdown: true,
                    pickerDisplay:'none',
                    gender: value,
                });
                break;

        }
    }

    selectItem(type) {
        Keyboard.dismiss();

        switch (type) {
            case 'positions':
                this.setState({
                    dropdown: true,
                    pickerDisplay:'flex',
                    selectType: 'positions',
                    select: this.state.position,
                    selectItems: this.state.positions,
                });
                break;

            case 'highestLevelOfPlay':
                this.setState({
                    dropdown: true,
                    pickerDisplay:'flex',
                    selectType: 'highestLevelOfPlay',
                    select: this.state.highestLevelOfPlay,
                    selectItems: this.state.experienceList,
                });
                break;

            case 'gender':
                this.setState({
                    dropdown: true,
                    pickerDisplay:'flex',
                    selectType: 'gender',
                    select: this.state.gender,
                    selectItems: this.state.genderList,
                });
                break;

        }

    }

    showOptions(){

        return this.state.selectItems.map((value, key) => {

            return (

                <Picker.Item label={value} value={value} key={key} />

            );

        });
	}

	setBirthDate = (event, date) => {

        this.setState({
            dob: date,
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
					<Text style={formStyles.blueText} >{ this.state.registerMessage }</Text>
					<Text style={formStyles.thanksText} >Login below</Text>
				</View>
				<Button style={formStyles.nextButton} onPress={() => this.props.navigation.navigate('Login')}>
						<Text style={{color:'#ffffff',textAlign: 'center', fontSize:18, width:'100%' }}>LOGIN</Text>
				</Button>
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
		const logo = require('../../assets/baller.png');
		const background = require('../../assets/Background.png');

		return (
			<Container style={styles.container}>
				<View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
					<Image style={{ flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity:0.6 }} source={background} />
				</View>

				<SafeAreaView style={[formStyles.registerBox, {display: this.state.display}]}>
					<Button style={[formStyles.registerMenuButton, {display: this.state.display}]} transparent onPress={() => this.props.navigation.navigate('Login')}>
						<Text style={formStyles.registerMenuText}>Back to Login</Text>
					</Button>
					<KeyboardAvoidingView behavior="padding">
						<View style={{ flex:1, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
							{this.errorStatus()}
							<TextInput
								onChangeText={(ballerTag) => this.handleChange('ballerTag', ballerTag)}
								style={formStyles.textInput}
								autoCapitalize = "none"
								keyboardAppearance="dark"
								placeholderTextColor = "#000000"
								placeholder="Baller Tag"
								autoFocus = {true}
								value={this.state.ballerTag} />

							<TextInput
								onChangeText={(jersey) => this.handleChange('jersey', jersey)}
								style={formStyles.textInput}
								autoCapitalize = "none"
								keyboardAppearance="dark"
								placeholderTextColor = "#000000"
								keyboardType="number-pad"
								placeholder="Jersey Number"
								value={this.state.jersey} />

							<Button full style={formStyles.selectBtn} onPress={() => this.selectItem('highestLevelOfPlay')}>
								<Text style={{color:'#000000' ,textAlign:'left', fontSize:18, fontFamily:'BarlowCondensed-Medium'}}>{this.state.highestLevelOfPlay ? this.state.highestLevelOfPlay : 'Highest Level of Play'}</Text>
							</Button>

							<Button full style={formStyles.selectBtn} onPress={() => this.selectItem('positions')}>
								<Text style={{color:'#000000', textAlign:'left', fontSize:18, fontFamily:'BarlowCondensed-Medium' }}>{this.state.position ? this.state.position : 'Ideal Position'}</Text>
							</Button>
							<DateSelectView state={this.state} value={this.state.dob} mode={'date'} title="Birth date" update={this.setBirthDate} />
						</View>

						<Button full style={formStyles.nextButton} onPress={() => this.nextScreen('info')}>
							<Text style={{color:'#ffffff', textAlign: 'center', fontSize:18, width:'100%' }}> COMPLETE </Text>
						</Button>
						<Picker
							selectedValue={this.state.select}
							style={{backgroundColor:'#ffffff', borderRadius:5, display:this.state.pickerDisplay}}
							onValueChange ={(value) => this.handleSelect(this.state.selectType, value)} >
							{this.showOptions()}
						</Picker>
					</KeyboardAvoidingView>
				</SafeAreaView>
				{this.loadingModal()}
				{this.completeModal()}

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

export default connect(mapStateToProps, mapDispatchToProps)(BallerRegister);
