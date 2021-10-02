/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, Image, TouchableOpacity, CameraRoll, Alert, ScrollView, SafeAreaView, FlatList, Platform, PermissionsAndroid } from 'react-native';
import { Container, Icon, Text, Button} from 'native-base';
import {connect} from 'react-redux';
import {Col, Row, Grid} from 'react-native-easy-grid';
import BasicNav from '../components/BasicNav';
import ReviewList from '../components/ReviewList';
import CourtRunList from '../components/CourtRunList';
import Modal from 'react-native-modal';
import {getBaller, getRun, squadApi, addToSchedule, displayView} from '../reducers/games';
import { Storage } from 'aws-amplify';
import { Buffer } from 'buffer';
import RNFetchBlob from 'rn-fetch-blob';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDarkMode } from 'react-native-dynamic';
import Geolocation from '@react-native-community/geolocation';
import 'moment-timezone';

import momentUtils from 'src/utils/momentUtils';

function DateSelectView({state, value, mode, title, update }){
    const isDarkMode = useDarkMode();

    return (
        <View style={[styles.dateTimePicker, {backgroundColor: !isDarkMode ? '#ffffff' : '#303030'}]}>
            <View style={[styles.modalHeader, {alignItems:'center', backgroundColor:'#000000', justifyContent:'center', marginTop:0}]}>
                <Text style={styles.h1}>{title}</Text>
            </View>
            <DateTimePicker
                value={value}
                mode={mode}
                is24Hour={false}
                isVisible={state.dateTimePicker}
                onChange={update}
            />
        </View>
    );

}

class EditCourt extends Component {

    constructor(props){
        super(props);

        const date = new Date();
        this.state = {
            darkMode: '',
            date: date,
            time: date,
            mode: 'datetime',
            addSchedule: 'flex',
            showSchedule: 'none',
            user: this.props.user,
            squad: this.props.squad,
            showPhotos: false,
            dateTime: '',
            image: 'https:\/\/s3.amazonaws.com\/awsjames-userfiles-mobilehub-258458471\/public\/james-full-logo.png',
            photoUri: '',
            photoName: '',
            showLoader: false,
            court: this.props.court.data,
            name: this.props.court.data ? this.props.court.data.name : '',
            address: this.props.court.data ? this.props.court.data.address : '',
            city: this.props.court.data ? this.props.court.data.city : '',
            state: this.props.court.data ? this.props.court.data.state : '',
            zipcode: this.props.court.data ? this.props.court.data.zipcode : '',
            admin: this.props.admin,
            edit: false,
            addRun: false,
            addGame: false,
            upcomingTab: '#478cba',
            pastTab: '#305f80',
            myTab:'#305f80',
        };

    }

    componentDidMount(){
        this.setState({
            darkMode: true,
        });

        this.checkExpires();
        this.getUpcomingRuns();
        this.getLocation();
    }

    getLocation(){
        if (Platform.OS === 'android') {

           this.requestLocationPermission();

        } else {

            this.userLocation();

        }
    }

    async requestLocationPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Get My Location',
                    'message': 'James App needs your location' +
                    'to find Runs near you.',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {

                this.userLocation();

            } else {

                console.log('Location denied');

            }
        } catch (err) {
            console.warn(err);
        }
    }

    userLocation(){
        Geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  userLocation: position.coords,
                  error: null,
                });

            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );
    }

    checkExpires(){
        let imageName = this.state.court.imageName;
        this.showProfileImage(imageName);
    }

    getUpcomingRuns(){
        const user = {
            court: this.state.court.id,
        };

        this.props.getRun(user,'getUpcomingCourtRuns')
        .then(result => {

            this.setState({runs: result});

        })
        .catch(err => alert(err));

    }

    getPastRuns(){
        const user = {
            court: this.state.court.id,
        };

        this.props.getRun(user,'getPastCourtRuns')
        .then(result => {

            this.setState({runs: result});

        })
        .catch(err => alert(err));

    }

    listRuns(){

        if (this.state.runs && this.state.userLocation){
            const RunArr = Object.values(this.state.runs);
            return (
                <FlatList
                    data ={RunArr}
                    renderItem ={({item}) =>

                        <CourtRunList date={item.timeStamp} navigation={this.props.navigation} header="test" page="SingleRun" run={item} data={({ data: item })} />

                    }
                    keyExtractor={item => item.runId}
                />
            );

        }

    }

    selectPhotos(){

        CameraRoll.getPhotos({
            first: 20,
            assetType: 'Photos',
            groupTypes: 'All',
        })
        .then(r => {
            this.setState({
                photos: r.edges,
                showPhotos: true,
            });
        })
        .catch((err) => {
            console.log(err);
        });

    }

    showProfileImage(image){

        if (this.state.court.imageType == 'google'){

            this.setState({ image: image ? image : 'https:\/\/s3.amazonaws.com\/awsjames-userfiles-mobilehub-258458471\/public\/james-full-logo.png'});

        } else {
            Storage.get(image)
            .then(result => {

                this.setState({ image: result });

            })
            .catch(err => alert(err));
        }

    }

    removeLoader(){

        this.setState({showLoader: false});
        Storage.get(this.state.photoName, {expires: 60 * 60 * 24 * 365})
        .then(result => {

            const update = {
                id:this.state.court.id,
                image: result,
                imageName: this.state.photoName,
                imageLocal: this.state.photoUri,
            };

            this.setState({image: result});
            this.props.uploadFile(update);
        })
        .catch(err => console.log(err));

    }


    async uploadPhoto(){

        this.setState({ showPhotos: false });
        setTimeout(() => {
            this.setState({showLoader: true});
        }, 500);

        this.readFile(this.state.photoUri).then(buffer => {

            Storage.put(this.state.photoName, buffer, {
                contentType: 'image/jpeg',
            }).then(result => {

                this.removeLoader();

            })
            .catch(err => alert(err));

        }).catch(e => {
            console.log(e);
        });
    }

    readFile(filePath) {
        return RNFetchBlob.fs.readFile(filePath, 'base64').then(data => new Buffer(data, 'base64'));
    }

    getImage(current) {

        this.setState({
          photoUri: current.uri,
          photoName: this.state.firstName + '-' + this.state.court.id + '.jpg',
        });
        console.log(current);

    }

    profileImage(){
        this.setState({image: this.state.court.image});
    }

    userSettings(){
        this.props.addEdit(true);
    }

    cancelEdit(){
        this.props.addEdit(false);
    }

    setUser(){
        var update = '';

        this.setState({admin: !this.state.admin}, () => {

            this.state.admin ? update = 'userAdminRole' : update = 'userBallerRole';

            const run = {
                id: this.state.court.id,
            };

            console.log(update);

            this.props.getRun(run,update)
            .then(() => {

                this.props.addEdit(false);

            })
            .catch(err => alert(err));

        });

    }

    closeModal(modal){
        this.setState({[modal]: false});
    }

    openModal(modal){
        this.setState({[modal]: true});
    }

    SelectValue(formField, value) {
        this.setState({ [formField]: value } );
    }

    handleChange(formField, value) {
        this.setState({[formField]: value});
    }

    updateUser(){
        const update = {
            id: this.state.court.id,
            firstName:this.state.firstName,
            lastName:this.state.lastName,
            email:this.state.email,
            password:this.state.password,
            city:this.state.city,
            state:this.state.state,
            zipcode:this.state.zipcode,
            phone:this.state.phone,
        };

        this.props.getRun(update,'updateUser')
        .then(() => {

            const baller = {
                id: this.state.court.id,
            };

            this.props.getBaller(baller)
            .then(results => {

                const data = {
                    data: results.profile,
                    squads: results.squads,
                    stats: results.stats,
                };

                this.props.displayView(data);
                this.setState({edit: false});

            })
            .catch(err => alert(err));

        })
        .catch(err => alert(err));
    }

    showDateTime = (date, time) => {
        const moment = require('moment');

        const showDate = moment(date).format('ll');
        const showTime = momentUtils.getTime(time);


        return (
            <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
                <Text style={[styles.h1, { color:'#000000', textAlign:'center' }]}>{showDate + ' ' + showTime}</Text>
            </View>
        );
    }

    setDate = (event, date) => {

        this.setState({
            date: date,
        });

    }

    setTime = (event, time) => {

        this.setState({
            time: time,
        });

    }

    submitSchedule = (type) => {
        if (this.state.addSchedule === 'none'){

            this.showAddSchedule();

        } else {
            const moment = require('moment');

            const newDate = moment(this.state.date).format('YYYY-MM-DD');
            const newTime = moment(this.state.time).format('HH:mm:ss');
            const datetime = newDate + ' ' + newTime;

            const scheduleObj = {
                id: datetime,
                runSchedule: datetime,
                type: type,

            };

            // console.log(scheduleObj);
            this.props.addToSchedule(scheduleObj);

            this.setState({
                showSchedule: 'flex',
                addSchedule: 'none',
            });
        }

    }

    showAddSchedule = () => {
        this.setState({
            showSchedule: 'none',
            addSchedule: 'flex',
        });
    }

    addRunDate(){

        this.setState({
            dateTimePicker: true,
            type:1,
        });
    }

    addGameDate(){

        this.setState({
            dateTimePicker: true,
            type:2,
        });
    }

    cancelDateTime(){
        this.setState({dateTimePicker: false});
    }

    listSchedule(){
        const scheduleArr = Object.values(this.props.scheduleList);
        var moment = require('moment');

        return scheduleArr.map((value, key) => {

            var header = moment(value.runSchedule).format('dddd');
            var subtext = moment(value.runSchedule).format('MMMM Do YYYY');

             return <ReviewList header={header} subText={subtext} data={value} key={key} />;

        } );
    }

    addNewRuns(){

        if (this.props.scheduleList.length > 0 && this.state.showSchedule !== 'none'){

            const data = {
                court: this.state.court.id,
                schedule: this.props.scheduleList,
            };

            console.log(data);
            this.props.getRun(data,'addNewRun')
            .then(() => {

                this.setState({
                    addRun: false,
                    addGame: false,
                }, ()=>{
                    this.props.scheduleList.length = 0;
                });
                this.getUpcomingRuns();

            })
            .catch(err => alert(err));

        } else if (this.props.scheduleList.length > 0 && this.state.showSchedule === 'none'){

            this.setState({
                showSchedule: 'flex',
                addSchedule: 'none',
            });


        } else {

            Alert.alert(
                'Missing Dates',
                'Please add a date to the schedule before adding.',
                [
                    {text: 'OK'},
                ],
                { cancelable: true }
            );
        }



    }

    addRun(){

        return (
            <Modal style={{flex:1, margin:0, position:'relative', padding:0}} isVisible={this.state.addRun} backdropOpacity={1} backdropColor="#DDE0E3"  >
                <SafeAreaView style={{flex: 1, backgroundColor: 'transparent'}}>
                <View style={styles.modalHeader}>
                    <Button full transparent style={styles.close} onPress={() => this.closeModal('addRun')}><Icon style={styles.closeText} type="MaterialIcons" name="clear" /><Text style={{ flex:1, textAlign:'left', color:'#000000' }}>Close</Text></Button>
                </View>
                <View style={[styles.modalHeader, {alignItems:'center', backgroundColor:'#000000', justifyContent:'center', marginTop:0}]}>
                    <Text style={styles.h1}>Add Runs</Text>
                </View>
                <View style={[styles.modalWrapper, {flex:1, display:this.state.addSchedule}]}>

                    <DateSelectView state={this.state} value={this.state.date} mode={'date'} title="Select the Date" update={this.setDate} />
                    <DateSelectView state={this.state} value={this.state.time} mode={'time'} title="Select the Time" update={this.setTime} />

                    {this.showDateTime(this.state.date, this.state.time)}
                    {/* <Button full style={[styles.squadButtons, {backgroundColor: this.state.courtComplete ? '#478cba' : '#4f4f4f'}]} onPress={() => this.addRunDate()}>
                        <Text style={{color:'#ffffff',textAlign: 'center', fontSize:18, width:'100%', fontFamily:'BarlowCondensed-Medium' }}>SELECT A DATE/TIME</Text>
                    </Button> */}
                </View>
                <View style={[styles.modalWrapper, {flex:1, display:this.state.showSchedule}]}>

                    <ScrollView style={{width:'100%', flex:1}}>
                        {this.listSchedule()}
                    </ScrollView>

                </View>
                <View style={{ flexDirection:'row' }}>
                    <Button full style={[styles.addBtn, {flex:1, backgroundColor: this.props.scheduleList.length > 0 ? '#478cba' : '#000000'}]} onPress={() => this.submitSchedule(1)}>
                        <Text style={styles.addBtnText}>{ this.state.addSchedule === 'none' ? 'Add Another Date' : 'ADD TO SCHEDULE' }</Text>
                    </Button>
                    <Button full style={[styles.addBtn, {backgroundColor: this.props.scheduleList.length > 0 ? '#47BA92' : '#BA4747'}]} onPress={() => this.addNewRuns()}>
                        <Text style={styles.addBtnText}>{ this.state.addSchedule === 'none' ? 'SAVE SCHEDULE' : 'VIEW SCHEDULE' }</Text>
                    </Button>
                </View>
                </SafeAreaView>
            </Modal>
        );
    }

    addGame(){

        return (
            <Modal style={{flex:1, margin:0, position:'relative', padding:0}} isVisible={this.state.addGame} backdropOpacity={1} backdropColor="#DDE0E3"  >
                <SafeAreaView style={{flex: 1, backgroundColor: 'transparent'}}>
                <View style={styles.modalHeader}>
                    <Button full transparent style={styles.close} onPress={() => this.closeModal('addGame')}><Icon style={styles.closeText} type="MaterialIcons" name="clear" /><Text style={{ flex:1, textAlign:'left', color:'#000000' }}>Close</Text></Button>
                </View>
                <View style={[styles.modalHeader, {alignItems:'center', backgroundColor:'#000000', justifyContent:'center', marginTop:0}]}>
                    <Text style={styles.h1}>Add Events</Text>
                </View>
                <View style={[styles.modalWrapper, {flex:1, display:this.state.addSchedule}]}>

                    <DateSelectView state={this.state} value={this.state.date} mode={'date'} title="Select the Date" update={this.setDate} />
                    <DateSelectView state={this.state} value={this.state.time} mode={'time'} title="Select the Time" update={this.setTime} />

                    {this.showDateTime(this.state.date, this.state.time)}
                    {/* <Button full style={[styles.squadButtons, {backgroundColor: this.state.courtComplete ? '#478cba' : '#4f4f4f'}]} onPress={() => this.addRunDate()}>
                        <Text style={{color:'#ffffff',textAlign: 'center', fontSize:18, width:'100%', fontFamily:'BarlowCondensed-Medium' }}>SELECT A DATE/TIME</Text>
                    </Button> */}
                </View>
                <View style={[styles.modalWrapper, {flex:1, display:this.state.showSchedule}]}>

                    <ScrollView style={{width:'100%', flex:1}}>
                        {this.listSchedule()}
                    </ScrollView>

                </View>
                <View style={{ flexDirection:'row' }}>
                    <Button full style={[styles.addBtn, {flex:1, backgroundColor: this.props.scheduleList.length > 0 ? '#478cba' : '#000000'}]} onPress={() => this.submitSchedule(2)}>
                        <Text style={styles.addBtnText}>{ this.state.addSchedule === 'none' ? 'Add Another Date' : 'ADD TO SCHEDULE' }</Text>
                    </Button>
                    <Button full style={[styles.addBtn, {backgroundColor: this.props.scheduleList.length > 0 ? '#47BA92' : '#BA4747'}]} onPress={() => this.addNewRuns()}>
                        <Text style={styles.addBtnText}>{ this.state.addSchedule === 'none' ? 'SAVE SCHEDULE' : 'VIEW SCHEDULE' }</Text>
                    </Button>
                </View>
                </SafeAreaView>
            </Modal>
        );
    }


    filterListing(type){

        switch (type) {
            case 'past':

                this.setState({
                    pastTab: '#478cba',
                    upcomingTab: '#214660',
                    myTab: '#305f80',
                    loadingModal:true,
                }, () => {
                     this.getPastRuns();
                });

                break;
            case 'upcoming':

                this.setState({
                    pastTab: '#305f80',
                    upcomingTab: '#478cba',
                    myTab: '#305f80',
                    loadingModal:true,
                }, () => {
                     this.getUpcomingRuns();
                });

                break;
            case 'myRuns':

                this.setState({
                    pastTab: '#305f80',
                    upcomingTab: '#214660',
                    myTab: '#478cba',
                    loadingModal:true,
                }, () => {
                     this.getMyRuns();
                });

                break;
            default:

                this.setState({
                    pastTab: '#305f80',
                    upcomingTab: '#478cba',
                    myTab: '#305f80',
                    loadingModal:true,
                }, () => {
                     this.getUpcomingRuns();
                });
                break;
        }

    }

    render() {
        const background = require('../assets/Background.png');
        const poster = require('../assets/courtManagement.png');

        return (
            <Container style={styles.container}>

                <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                    <Image style={{ flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: 0.5 }} source={background} />
                </View>

                {this.addRun()}
                {this.addGame()}
                <Grid>
                    <Row style={{position:'relative', flexDirection:'column', height:250, backgroundColor:'#000000'}}>
                        <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                            <Image style={{ flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity:0.4 }} source={poster} />
                        </View>

                        <BasicNav navigation={this.props.navigation} page="Management" title="Baller Management" link="Settings" />
                        <Row style={{width:'100%', paddingBottom:20, backgroundColor:'rgba(0,0,0,.4)'}} size={1}>
                            <Col style={styles.profilePic}>
                                <Row style={{ justifyContent:'center', alignItems:'center', position:'relative' }}>
                                    <TouchableOpacity style={styles.profileImage}  onPress={ () => this.selectPhotos()}>
                                        <Image style={{ width: 200, height:200, resizeMode: 'contain' }} source={{ uri: this.state.image }}/>
                                    </TouchableOpacity>
                                </Row>
                            </Col>
                            <Col style={{ justifyContent:'center', alignItems:'flex-start' }}>
                                <View style={{ paddingRight:20 }}>
                                <Row style={styles.profile}><Text style={[styles.profileText, {fontFamily:'BarlowCondensed-Bold'}]}>{this.state.name}</Text></Row>
                                <Row style={styles.profile}><Text style={styles.profileText}>{this.state.address}</Text></Row>
                                </View>
                            </Col>
                        </Row>
                    </Row>
                    <Row style={{ flexDirection:'row', flex:0.1, padding:0, alignItems:'center', justifyContent:'center', marginBottom:0}}>

                            <Button full style={[styles.filterBtn, {backgroundColor:this.state.pastTab}]} onPress={() => this.filterListing('past')}>
                                <Text style={styles.runTab}>Past Games</Text>
                            </Button>
                            <Button full style={[styles.filterBtn, {backgroundColor:this.state.upcomingTab}]} onPress={() => this.filterListing('upcoming')}>
                                <Text style={styles.runTab}>Upcoming Games</Text>
                            </Button>

                    </Row>
                    <Row>
                        {this.listRuns()}
                    </Row>
                    <Row style={{ flexDirection:'row', flex:0.15, padding:0, alignItems:'center', justifyContent:'center', marginBottom:0 }}>

                        <Button full style={ styles.startBtn } onPress={() => this.openModal('addRun')}>
                            <Text style={styles.startBtnText}>Add Run</Text>
                        </Button>
                        <Button full style={[ styles.startBtn, {backgroundColor:'#0C63B9'}]} onPress={() => this.openModal('addGame')}>
                            <Text style={styles.startBtnText}>Add Game</Text>
                        </Button>

                    </Row>
                </Grid>

            </Container>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user.profile,
        court: state.games.view,
        edit: state.auth.edit,
        scheduleList: state.games.addToSchedule,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addToSchedule: (schedule) => dispatch(addToSchedule(schedule)),
        getRun: (runId, type) => dispatch(getRun(runId, type)),
        displayView: (view) => dispatch(displayView(view)),
        getBaller: (baller) => dispatch(getBaller(baller)),
        squadApi: (userId,type,data) => dispatch(squadApi(userId,type,data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditCourt);

const styles = {
    dateTimePicker:{
        overflow:'hidden',
        backgroundColor:'#ffffff',
        shadowOffset:{  width: 5,  height: 10  },
        shadowColor: 'black',
        shadowOpacity: 0.5,
        borderRadius: 20,
        margin:10,
    },
    h1:{
        fontFamily:'BarlowCondensed-Bold',
        fontSize:22,
        color:'#ffffff',
    },
    modalHeader:{
        top:0,
        width:'100%',
        height: 50,
        marginBottom:0,
        borderBottomWidth:0,
        borderBottomColor:'#0C63B9',
    },
    startBtn:{
        flex:1,
    },
    close:{
        flex:1,
        right:0,
    },
    closeText:{
        color:'#000000',
        textAlign:'left',
        fontSize:22,
        justifyContent:'center',
        alignItems:'center',
        fontFamily: 'BarlowCondensed-Bold',
    },
    textLabel:{
        color:'#ffffff',
        fontFamily:'BarlowCondensed-Medium',
        fontSize:14,
        padding:5,
        textAlign: 'left',
        flex:0.5,
        elevation:0,
    },
    addBtn:{
        height:70,
    },
    addBtnText:{
        fontFamily:'BarlowCondensed-Bold',
        fontSize:18,
        color:'#ffffff',
    },
    textInput:{
        color:'#ffffff',
        backgroundColor:'#000000',
        fontFamily:'BarlowCondensed-Bold',
        fontSize:16,
        margin:5,
        paddingLeft:5,
        paddingRight:5,
        textAlign: 'left',
        flex:1,
        height:'100%',
        elevation:0,
    },
    gameDate:{
        fontFamily:'BarlowCondensed-Light',
        color:'#ffffff',
        fontSize:18,
        textAlign:'center',
    },
    gameScore:{
        fontFamily:'BarlowCondensed-Bold',
        color:'#ffffff',
        fontSize:26,
        textAlign:'center',
    },
    gameTitle:{
        fontFamily:'BarlowCondensed-Bold',
        color:'#ffffff',
        fontSize:18,
        textAlign:'center',
    },
    container:{
        backgroundColor:'#000000',
    },
    boardItem:{
        backgroundColor:'#000000',
        marginBottom:10,
        padding:10,
        width:'80%',
        marginLeft:'auto',
        marginRight:'auto',
        borderRadius:5,
    },
    message:{
        backgroundColor:'#000000',
        fontFamily:'BarlowCondensed-Bold',
        color:'#ffffff',
        padding:5,
        fontSize:14,
        textAlign:'center',
        width:'100%',
    },
    filterBtn:{
        flex:1,
    },
    profileImage:{
        backgroundColor:'#ffffff',
        overflow:'hidden',
        justifyContent:'center',
        alignItems:'center',
        width: 125,
        height: 125,
        borderColor:'#ffffff',
        borderWidth:1,
        borderRadius:125 / 2,
    },
    profilePic:{
        justifyContent:'center',
        alignItems:'center',
    },
    profile:{
        height:'auto',
        flexWrap:'wrap',
    },
    profileText:{
        color:'#ffffff',
        fontFamily:'BarlowCondensed-Medium',
        fontSize: 20,
    },
    photos:{
        margin:5,
        width: 150,
        height: 150,
    },
    text:{
        fontFamily:'BarlowCondensed-Bold',
        fontSize:18,
        color:'#ffffff',
        lineHeight:24,
    },
};
