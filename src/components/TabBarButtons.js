import React, { Component } from 'react';
import { View, Image } from 'react-native';
import {Button} from 'native-base';
import {connect} from 'react-redux';
import {logoutUser, addEdit} from '../reducers/auth';

import baller from '../assets/icons/baller.png';
import court from '../assets/icons/court.png';
import league from '../assets/icons/league.png';
import team from '../assets/icons/team.png';


class TabBarButtons extends Component {

    constructor(props){
        super(props);

        this.state = {
            image: '',
            active: false,
            opacity: 0.15,
        };

    }

    componentDidMount(){

    }

    focusButton(screen){
        this.setState({active: true});
        this.props.navigation.navigate(screen);
    }

    categoryIcon(category){

        switch (category) {
            case 'BallerManagement':

                return (
                    <Image style={{ flex: 1, width: 35, height: 35 }} source={baller} />
                );

            case 'CourtManagement':
                return (
                    <Image style={{ flex: 1, width: 35, height: 35 }} source={court} />
                );

            case 'TeamManagement':
                return (
                    <Image style={{ flex: 1, width: 35, height: 35 }} source={team} />
                );


            case 'LeagueManagement':
                return (
                    <Image style={{ flex: 1, width: 35, height: 35 }} source={league} />
                );

        }

    }

    render() {
        return (
            <View>{this.categoryIcon(this.props.route)}</View>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    addEdit: (edit) => dispatch(addEdit(edit)),
    logoutUser: () => dispatch(logoutUser()),
});

const mapStateToProps = (state, ownProps) => {

    return {
      user: state.auth.user,
      view: state.games.view,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TabBarButtons);
