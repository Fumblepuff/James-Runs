
import React from 'react';
import {
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  Text,
} from 'native-base';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';

import logo from 'src/assets/logo_basic.png';

class Spinner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: props.visible,
    };

    this.onModalHideCallback = null;
  }

  componentDidUpdate(prevProps) {
    const { visible } = this.props;

    if (prevProps.visible && !visible) {
      if (this.visibleTimeout) {
        clearTimeout(this.visibleTimeout);
      }

      this.visibleTimeout = setTimeout(() => {
        this.hide();
      }, 300);
    } else if (!prevProps.visible && visible) {
      if (this.visibleTimeout) {
        clearTimeout(this.visibleTimeout);
      }

      this.show();
    }
  }

  show() {
    this.setState({
      visible: true,
    });
  }

  hide(callback = () => null) {
    this.onModalHideCallback = callback;

    this.setState({
      visible: false,
    });
  }

  render() {
    const { visible } = this.state;

    return (
      <Modal
        style={{ flex: 1, width: '100%', margin: 0 }}
        onModalHide={() => {
          if (this.onModalHideCallback) {
            this.onModalHideCallback();
          }

          this.onModalHideCallback = () => null;
        }}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={visible}
        useNativeDriver
        hideModalContentWhileAnimating
        backdropColor="#000000"
        backdropOpacity={0.95}
      >
        <View
          style={{
            flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center',
          }}
        >

          <View
            style={{
              flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            }}
          >
            <Image
              style={{
                width: 80, height: 80, margin: 'auto', justifyContent: 'center', alignItems: 'center',
              }}
              source={logo}
            />
            <View>
              <Text
                style={{
                  color: '#ffffff', fontFamily: 'BarlowCondensed-Bold', fontSize: 16, paddingTop: 10, paddingBottom: 30,
                }}
              >
                Loading...
              </Text>
            </View>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>

        </View>
      </Modal>
    );
  }
}

Spinner.defaultProps = {
  visible: false,
};

Spinner.propTypes = {
  visible: PropTypes.bool,
};

export default Spinner;
