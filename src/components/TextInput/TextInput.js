
import React from 'react';
import PropTypes from 'prop-types';
import {
  TextInput as TextInputRN,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Icon,
} from 'native-base';

import {
  StyleType,
} from 'src/common/Types';

import {
  gs,
} from 'src/styles';

import styles from './styles';

const TextInput = ({
  style,
  styleContainer: styleContainerProps,
  onPress,
  error,
  isFullWidth,
  iconRightCaret,
  iconLeftPlus,
  small,
  editable,
  debounce,
  onChangeText,
  ...restProps
}) => {
  const timeoutId = React.useRef();

  const height = small ? 30 : 50;
  const heightInput = height - 4; // minus container border
  const styleContainer = [styles.container, { height }, styleContainerProps];
  const styleInput = [
    styles.textInput,
    { height: heightInput },
    style,
  ];
  let styleTouchable = gs.width80p;

  if (isFullWidth) {
    styleTouchable = [gs.flex, gs.width100p];
    styleInput.push([gs.widthUndef, gs.flex]);
  }

  if (onPress && !isFullWidth) {
    styleInput.push(gs.width100p);
  }

  if (error) {
    styleContainer.push(styles.containerError);
  }

  const renderTouchable = (children) => {
    if (onPress) {
      return (
        <TouchableOpacity
          onPress={onPress}
          style={styleTouchable}
        >
          <View
            pointerEvents="none"
            // style={gs.flex}
          >
            {children}
          </View>
        </TouchableOpacity>
      );
    }

    return children;
  };

  const renderRightIcons = () => {
    let Comp = null;
    const IconBl = (childrenTmp) => (
      <View style={styles.iconRightBl}>
        {childrenTmp}
      </View>
    );

    if (iconRightCaret) {
      Comp = IconBl(
        <Icon
          type="Ionicons"
          name="caret-down"
          style={styles.icon}
        />,
      );
    }

    return Comp;
  };

  const renderLeftIcons = () => {
    let Comp = null;
    const IconBl = (childrenTmp) => (
      <View style={styles.iconRightBl}>
        {childrenTmp}
      </View>
    );

    if (iconLeftPlus) {
      Comp = IconBl(
        <Icon
          style={styles.iconPlus}
          type="FontAwesome5"
          name="plus"
          // style={formStyles.textInputIcon}
        />,
      );
    }

    return Comp;
  };

  return renderTouchable(
    <View style={styleContainer}>
      {renderLeftIcons()}
      <TextInputRN
        autoCapitalize="none"
        keyboardAppearance="dark"
        placeholderTextColor="#000000"
        editable={!onPress && editable}
        {...restProps}
        style={styleInput}
        onChangeText={(text) => {
          if (!debounce) {
            onChangeText(text);
            return;
          }

          if (timeoutId.current) {
            clearTimeout(timeoutId.current);
          }

          timeoutId.current = setTimeout(() => {
            onChangeText(text);
          }, 300);
        }}
      />
      {renderRightIcons()}
    </View>,
  );
};

TextInput.propTypes = {
  style: StyleType,
  styleContainer: StyleType,
  onPress: PropTypes.func,
  error: PropTypes.bool,
  isFullWidth: PropTypes.bool,
  iconRightCaret: PropTypes.bool,
  iconLeftPlus: PropTypes.bool,
  small: PropTypes.bool,
  editable: PropTypes.bool,
  debounce: PropTypes.bool,
  onChangeText: PropTypes.func,
};

TextInput.defaultProps = {
  style: {},
  styleContainer: {},
  onPress: null,
  error: false,
  isFullWidth: false,
  iconRightCaret: false,
  iconLeftPlus: false,
  small: false,
  editable: true,
  debounce: false,
  onChangeText: () => null,
};

export default TextInput;
