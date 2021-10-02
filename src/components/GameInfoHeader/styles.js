
import {
  createStyle,
  cls,
} from 'src/styles';

export default createStyle({
  accountHeader: {
    padding: 10,
    backgroundColor: cls.black08,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePic: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
  },
  profileTextBl: {
    margin: 5,
    flex: 1,
  },
  profileText: {
    display: 'flex',
    color: cls.white,
    fontSize: 20,
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  get profileTextAddress() {
    return {
      ...this.profileText,
      fontSize: 14,
    };
  },
  profileImageBl: {
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
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
