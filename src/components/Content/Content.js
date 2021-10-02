
import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
} from 'react-native';
import {
  Text,
  Button,
} from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import deviceUtils from 'src/utils/deviceUtils';

import BasicNav from 'src/components/BasicNav';
import AuthNav from 'src/components/AuthNav';

import {
  ImageSource,
  Children,
  StyleType,
} from 'src/common/Types';

import {
  NavigationService,
} from 'src/navigation';

import {
  gs,
} from 'src/styles';

import styles from './styles';

const Content = ({
  children,
  imageBg,
  navigation,
  header,
  basicNav,
  authNav,
  registerNav,
  footer,
  style,
  styleContent,
  scrollEnabled,
  headerImage,
  headerText,
  useSafeAreaView,
  safeAreaEdges,
  footerButtonProps,
  hasContentPadding,
}) => {
  const [footerBlPosittion, setFooterBlPosittion] = React.useState(0);

  const renderHeaderInfo = () => {
    if (!headerImage && !headerText) {
      return null;
    }

    return (
      <View style={styles.headerInfoBl}>
        <View style={[styles.headerInfoImageBl]}>
          <View style={styles.headerInfoImageSubBl}>
            {headerImage && <Image style={styles.headerInfoImage} source={{ uri: headerImage }} />}
          </View>
        </View>
        <View style={styles.headerInfoMiddleBl}>
          {headerText && headerText.map(({ text, style: styleText = {}, props = {} }, indexTmp) => (
            <Text
              key={indexTmp.toString()}
              style={[styles.headerInfoMiddleText, styleText]}
              white
              {...props}
            >
              {text}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    let headerComp = null;

    if (header) {
      if (typeof header === 'function') {
        headerComp = header();
      } else {
        headerComp = header;
      }
    }

    const headerInfo = renderHeaderInfo();

    return (
      <View>
        {headerInfo}
        {headerComp}
      </View>
    );
  };

  const renderNavs = () => {
    if (basicNav) {
      return (
        <BasicNav
          navigation={navigation}
          {...basicNav}
        />
      );
    }

    if (authNav) {
      return (
        <AuthNav
          navigation={NavigationService}
          {...authNav}
        />
      );
    }

    if (registerNav) {
      const {
        title = 'Back',
      } = registerNav;

      return (
        <View style={[gs.width80p, gs.aSCenter]}>
          <Button
            style={gs.aSEnd}
            transparent
            onPress={() => {
              NavigationService.goBack();
            }}
          >
            <Text bold style={[gs.colorWhite]}>{title}</Text>
          </Button>
        </View>
      );
    }

    return null;
  };

  const renderFooter = () => {
    const styleFooter = { bottom: footerBlPosittion };
    let footerRender = null;

    if (footerButtonProps) {
      const footerButtonPropsGet = (typeof footerButtonProps === 'function') ? footerButtonProps() : footerButtonProps;

      if (footerButtonPropsGet.length > 0) {
        return (
          <View style={[styleFooter, gs.row]}>
            {footerButtonPropsGet.map(({ text, onPress, type }, index) => (
              <Button
                key={index.toString()}
                full
                onPress={onPress}
                style={gs.flex}
                success={type === 'success'}
                danger={type === 'danger'}
              >
                <Text style={[gs.colorWhite, gs.fS18]}>{text}</Text>
              </Button>
            ))}
          </View>
        );
      }
    }

    if (!footer) {
      return footerRender;
    }

    if (typeof footer === 'function') {
      footerRender = footer();
    } else {
      footerRender = footer;
    }

    return (
      <View style={styleFooter}>
        {footerRender}
      </View>
    );
  };

  const renderChildren = () => {
    const styleChildren = [
      gs.flexGrow,
      gs.pV10,
      styleContent,
    ];

    if (hasContentPadding) {
      styleChildren.push(gs.pH20);
    }

    if (!scrollEnabled) {
      return (
        <View
          style={styleChildren}
        >
          {children}
        </View>
      );
    }

    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styleChildren}
        bounces={false}
        extraScrollHeight={50}
        onKeyboardDidShow={(e) => {
          if (!deviceUtils.isIOS) {
            return;
          }

          const { height } = e.endCoordinates;
          const heightCalc = height - 35;

          if (heightCalc !== footerBlPosittion) {
            setFooterBlPosittion(heightCalc);
          }
        }}
        onKeyboardWillHide={() => {
          setFooterBlPosittion(0);
        }}
      >
        {children}
      </KeyboardAwareScrollView>
    );
  };

  const renderContent = (childrenInp) => {
    if (!useSafeAreaView) {
      return childrenInp;
    }

    return (
      <SafeAreaView
        style={gs.flex}
        edges={safeAreaEdges}
      >
        {childrenInp}
      </SafeAreaView>
    );
  };

  return (
    <View
      style={[gs.flex, gs.bgBlack, style]}
    >

      <View
        style={styles.imageBgContainer}
      >
        {imageBg && (
          <Image
            style={styles.imageBg}
            source={imageBg}
          />
        )}
      </View>

      {renderContent(
        <>
          <View>
            {renderNavs()}
            {renderHeader()}
          </View>

          {renderChildren()}

          {renderFooter()}
        </>,
      )}
    </View>
  );
};

Content.propTypes = {
  imageBg: ImageSource,
  children: Children,
  basicNav: PropTypes.shape({
    page: PropTypes.string,
    title: PropTypes.string,
    link: PropTypes.string,
  }),
  authNav: PropTypes.shape({
    drawer: PropTypes.bool,
    title: PropTypes.string,
    link: PropTypes.string,
    page: PropTypes.string,
    button: PropTypes.string,
  }),
  registerNav: PropTypes.shape({
    title: PropTypes.string,
  }),
  header: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element,
    PropTypes.elementType,
  ]),
  footer: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element,
    PropTypes.elementType,
  ]),
  // footerButtonProps: PropTypes.arrayOf(PropTypes.shape({
  //   text: PropTypes.string,
  //   onPress: PropTypes.func,
  //   type: PropTypes.oneOf([
  //     'success',
  //     'danger',
  //   ]),
  // })),
  footerButtonProps: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string,
      onPress: PropTypes.func,
      type: PropTypes.oneOf([
        'success',
        'danger',
      ]),
    })),
  ]),
  style: StyleType,
  styleContent: StyleType,
  scrollEnabled: PropTypes.bool,
  headerImage: PropTypes.string,
  headerText: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    style: PropTypes.object,
    props: PropTypes.object,
  })),
  useSafeAreaView: PropTypes.bool,
  safeAreaEdges: PropTypes.array, // 'top' | 'right' | 'bottom' | 'left'
  hasContentPadding: PropTypes.bool,
};

Content.defaultProps = {
  imageBg: null,
  children: null,
  basicNav: null,
  authNav: null,
  registerNav: null,
  header: null,
  footer: null,
  style: {},
  styleContent: {},
  scrollEnabled: true,
  headerImage: null,
  headerText: null,
  useSafeAreaView: false,
  safeAreaEdges: [],
  footerButtonProps: null,
  hasContentPadding: false,
};

export default Content;
