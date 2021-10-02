
import {
  createStyle,
  cls,
} from 'src/styles';

export default createStyle({
  imageBgContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  imageBg: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  headerInfoBl: {
    paddingTop: 0,
    paddingBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: cls.black08,
    flexDirection: 'row',
  },
  headerInfoImageBl: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
  },
  headerInfoImageSubBl: {
    backgroundColor: cls.white,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    borderRadius: 50,
    borderColor: cls.white,
    borderWidth: 1,
  },
  headerInfoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  headerInfoMiddleBl: {
    margin: 5,
    flex: 1,
  },
  headerInfoMiddleText: {
    display: 'flex',
    fontSize: 20,
    flexWrap: 'wrap',
    flexShrink: 1,
  },
});
