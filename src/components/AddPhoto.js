/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, Image, TouchableOpacity, PermissionsAndroid, SafeAreaView, FlatList, Platform } from 'react-native';
import CameraRoll from "@react-native-community/cameraroll";
import CameraRollPicker from 'react-native-camera-roll-picker';
import { Container, Text, Button} from 'native-base';
import {connect} from 'react-redux';
import BasicNav from '../../components/BasicNav';
import CourtRunList from '../../components/CourtRunList';
import {getBaller, getRun, squadApi, addToSchedule, displayView} from '../../reducers/games';
import { Storage } from 'aws-amplify';
import { Buffer } from 'buffer';
import RNFetchBlob from 'rn-fetch-blob';
import DateTimePicker from '@react-native-community/datetimepicker';
import Geolocation from '@react-native-community/geolocation';
import 'moment-timezone';

import mainStyle from '../../styles/Style';
const styles = mainStyle;


class AddPhoto extends Component {

    constructor(props){
        super(props);

        const date = new Date();
        this.state = {
            darkMode: '',
            user: this.props.user,
            showPhotos: false,
            image: 'https:\/\/s3.amazonaws.com\/awsjames-userfiles-mobilehub-258458471\/public\/james-full-logo.png',
            photoUri: '',
            photoName: '',
            showLoader: false,

        };

    }

    componentDidMount(){
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
            }).then(() => {

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

    editCourt(){
        this.props.navigation.navigate('AddGame');
    }

    render() {
        const background = require('../../assets/managementBackground.png');

        return (
            <Container style={styles.container}>

                <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                    <Image style={{ flex: 1, resizeMode: 'cover', width: '100%', height: '100%', opacity: 0.5 }} source={background} />
                </View>

                <BasicNav navigation={this.props.navigation} page="Court" title="Baller Management" link="Settings" />
                <View style={styles.accountHeader}>
                    <View style={[styles.profilePic, {width:120}]}>
                        <TouchableOpacity style={styles.profileImage}  onPress={ () => this.selectPhotos()}>
                            <Image style={{ width:'100%', height:'100%', resizeMode: 'contain' }} source={{ uri: this.state.image }}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{ margin:5, flex:1 }}>
                        <Text style={[styles.profileText, {fontFamily:'BarlowCondensed-Bold'}]}>{this.state.name}</Text>
                        <Text style={styles.profileText}>{this.state.address}</Text>
                    </View>
                    <Button full style={[styles.addBtn, {backgroundColor: '#478cba', borderRadius:30, width:60, height:60}]} onPress={() => this.editCourt()}>
                        <Text style={[styles.addBtnText, {flex:1, fontSize:12, textAlign:'center', flexWrap:'nowrap'}]}>edit </Text>
                    </Button>
                </View>

                <SafeAreaView style={{flex: 1, backgroundColor: 'transparent'}}>
                        <CameraRollPicker
                            scrollRenderAheadDistance={500}
                            initialListSize={1}
                            removeClippedSubviews={false}
                            groupTypes='SavedPhotos'
                            maximum={1}
                            selected={this.state.selected}
                            assetType='Photos'
                            imagesPerRow={2}
                            containerWidth={335}
                            backgroundColor='rgba(255,255,255,.8)'
                            callback={this.getImage.bind(this)} />

                        <View style={{ flexDirection:"row", width:"100%", height:50 }}>
                            <Button full style={{flex:1, backgroundColor:"#52ce5e"}} onPress={() => this.uploadPhoto()}>
                                <Text style={{color:"#ffffff", fontSize:18}}>UPLOAD PHOTO</Text>
                            </Button>
                            <Button full style={{flex:1, backgroundColor:"#fd6464"}} onPress={() => this.cancelPhotos()}>
                                <Text style={{color:"#ffffff", fontSize:18}}>CANCEL UPLOAD</Text>
                            </Button>
                        </View>
                </SafeAreaView>
                <View style={{ flexDirection:'row' }}>
                    <Button full style={[styles.addBtn, {flex:1, backgroundColor: '#478cba', height:80}]} onPress={() => this.editCourt()}>
                        <Text style={styles.addBtnText}>ADD A GAME</Text>
                    </Button>
                </View>


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

export default connect(mapStateToProps, mapDispatchToProps)(AddPhoto);