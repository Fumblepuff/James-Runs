
import React from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
} from 'react-native';
import {
  Icon,
  Button,
  Text,
} from 'native-base';
import RNModal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ToastService,
  SpinnerService,
} from 'src/services';

import {
  StyleType,
} from 'src/common/Types';

import {
  gs,
  cls,
} from 'src/styles';

export const Modal = (props) => {
  const {
    onClose,
    children,
    useSafeArea,
    scrollEnabled,
    styleContent,
    closeModalByToastTap,
    opacity,
    ...restProps
  } = props;
  const renderSafeArea = (childrenInp) => {
    if (!useSafeArea) {
      return childrenInp;
    }

    return (
      <SafeAreaView
        style={[gs.flex]}
      >
        {childrenInp}
      </SafeAreaView>
    );
  };

  const renderHeader = () => (
    <Button
      full
      transparent
      style={gs.jCSpaceBetween}
      onPress={onClose}
    >
      <Icon
        style={[gs.colorWhite, gs.fS22]}
        type="MaterialIcons"
        name="keyboard-backspace"
      />
      <Text
        bold
        style={[gs.colorWhite]}
      >
        BACK
      </Text>
    </Button>
  );

  const rendernContent = () => {
    if (scrollEnabled) {
      return (
        <ScrollView
          contentContainerStyle={[gs.flex, styleContent]}
        >
          {children}
        </ScrollView>
      );
    }

    return (
      <View
        style={[gs.flex, styleContent]}
      >
        {children}
      </View>
    );
  };

  return (
    <RNModal
      {...restProps}
      style={[gs.jCStart, gs.m0]}
      backdropColor={cls.black}
      backdropOpacity={opacity}
    >
      <ToastService
        isModal
        onModalClose={() => {
          if (!closeModalByToastTap) {
            return;
          }

          onClose();
        }}
      />

      <SpinnerService isModal />

      {renderSafeArea(
        <>
          {renderHeader()}
          {rendernContent()}
        </>,
      )}
    </RNModal>
  );
};

Modal.propTypes = {
  onClose: PropTypes.func,
  children: PropTypes.node,
  useSafeArea: PropTypes.bool,
  scrollEnabled: PropTypes.bool,
  styleContent: StyleType,
  closeModalByToastTap: PropTypes.bool,
  opacity: PropTypes.number,
};

Modal.defaultProps = {
  onClose: () => null,
  children: null,
  useSafeArea: true,
  scrollEnabled: false,
  styleContent: {},
  closeModalByToastTap: false,
  opacity: 0.7,
};

export default Modal;
