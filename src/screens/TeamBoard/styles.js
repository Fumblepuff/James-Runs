
import {
  createStyle,
} from 'src/styles';

export default createStyle({
  container: {
    backgroundColor: '#000000',
  },
  headerText: {
    width: '100%',
    height: 30,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'BarlowCondensed-Bold',
    fontSize: 18,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  boardItem: {
    borderBottomColor: '#ffffff',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  boardItemText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'BarlowCondensed-Bold',
  },
  message: {
    backgroundColor: '#000000',
    fontFamily: 'BarlowCondensed-Bold',
    color: '#ffffff',
    padding: 5,
    fontSize: 14,
    textAlign: 'center',
    width: '100%',
  },
  filterBtn: {
    flex: 1,
  },
  teamBoard: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  runLocation: {
    position: 'absolute',
    width: '100%',
    left: 10,
    bottom: 10,
  },
  runLocationText: {
    color: '#ffffff',
    fontFamily: 'BarlowCondensed-Light',
    fontSize: 18,
  },
  startBtn: {
    width: '100%',
    height: '100%',
    backgroundColor: '#044571',
    flexDirection: 'row',
  },
  startBtnText: {
    flex: 1,
    fontFamily: 'BarlowCondensed-Bold',
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  text: {
    fontFamily: 'BarlowCondensed-Light',
    fontSize: 18,
    color: '#ffffff',
    lineHeight: 24,
  },
});
