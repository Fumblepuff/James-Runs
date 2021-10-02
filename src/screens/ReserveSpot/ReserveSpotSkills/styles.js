
import {
  createStyle,
  cls,
} from 'src/styles';

export default createStyle({
  reserveBtn: {
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
    overflow: 'hidden',
    alignSelf: 'flex-end',
    backgroundColor: cls.green,
  },
  reserveBtnReserved: {
    backgroundColor: cls.red2,
  },
  reserveBtnDisabled: {
    backgroundColor: cls.gray,
  },
  reserveBtnText: {
    flex: 1,
    fontSize: 15,
    color: cls.white,
    textAlign: 'center',
    flexWrap: 'wrap',
    paddingLeft: 0,
    paddingRight: 0,
  },
});
