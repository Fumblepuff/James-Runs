import {StyleSheet} from 'react-native';

const tabStyle = StyleSheet.create({
    container:{
        flexDirection: 'row',
        height: 120,
        elevation: 2,
        backgroundColor:'#000000',
    },
    tabButton:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabText:{
        fontFamily:'BarlowCondensed-Medium',
        color:'#ffffff',
        fontSize:18,
        marginTop:10,
    }
});

export default tabStyle;
