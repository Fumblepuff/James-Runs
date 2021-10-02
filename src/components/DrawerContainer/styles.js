
import {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.8)',
    justifyContent: 'space-between',
  },
  headerStyle: {
    width: '100%',
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    borderBottomColor: '#ffffff',
    borderColor: 'transparent',
    elevation: 0,
  },
  drawerItem: {
    backgroundColor: 'rgba(0,0,0,.5)',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'BarlowCondensed-SemiBold',
    color: '#ffffff',
    padding: 15,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 2,
    borderWidth: 0,
    textAlign: 'center',
  },
  logout: {
    borderRadius: 0,
    backgroundColor: '#fd6464',
    width: '100%',
  },
});
