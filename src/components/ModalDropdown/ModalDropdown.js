/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import _ from 'lodash';
import {
  StyleSheet,
  Dimensions,
  View,
  TouchableWithoutFeedback,
  Modal,
  ActivityIndicator,
  ViewStyle,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Icon,
} from 'native-base';
import { HeaderHeightContext } from '@react-navigation/stack';

// import InputFake from 'src/Components/InputFake';
// import { TextInput } from 'src/components/Form';
import DropdownList, {
  DropdownListUtils,
} from 'src/components/DropdownList';

import deviceUtils from 'src/utils/deviceUtils';

// import {
//   ModalDropdownPropTypesOpt,
//   ModalDropdownPropTypes,
//   ModalDropdownStateTypes,
//   ModalDropdownPropTypesReq,
// } from './ModalDropdownTypes';
import styles from './styles';

const defaultProps = {
  disabled: false,
  multipleSelect: false,
  scrollEnabled: true,
  defaultIndex: -1,
  defaultValue: 'Please select...',
  selectedValue: null,
  selectedIndex: null,
  accessible: true,
  animated: true,
  showsVerticalScrollIndicator: true,
  style: {},
  dropdownStyle: {},
  textButtonContainerStyle: {},
  renderRow: null,
  renderButtonText: null,
  onDropdownWillShow: null,
  onDropdownWillHide: null,
  onSelect: null,
  inputProps: {},
  filterOptions: null,
  hasSearch: false,
  renderButton: null,
  isTypeViewTwo: false,
  isTypeViewThree: false,
  positionTopFix: 0,
};

class ModalDropdown extends Component {
  static defaultProps = defaultProps;

  _button = null;

  _buttonFrame = null;

  _data = [];

  _dataFiltered = [];

  _headerHeight = 0;

  constructor(props) {
    super(props);

    this.state = {
      // accessible: !!props.accessible,
      loading: !props.options,
      showDropdown: false,
      buttonText: props.defaultValue,
      selectedIndex: props.defaultIndex,
      inputSearch: '',
    };
  }

  static getDerivedStateFromProps(nextProps, state) {
    const { selectedIndex: selectedIndexState } = state;
    const { loading } = state;
    const {
      defaultIndex,
      defaultValue,
      options,
      selectedIndex: selectedIndexProps,
    } = nextProps;
    let selectedIndex = !_.isNil(selectedIndexProps) ? selectedIndexProps : selectedIndexState;
    let newState = null;

    if (selectedIndex < 0) {
      selectedIndex = defaultIndex;

      newState = {
        selectedIndex,
      };
      if (selectedIndex < 0) {
        newState.buttonText = defaultValue;
      }
    }

    if (!loading !== !options) {
      if (!newState) {
        newState = {};
      }
      newState.loading = !options;
    }

    return newState;
  }

  onButtonPress = () => {
    const { onDropdownWillShow } = this.props;

    if (!onDropdownWillShow || onDropdownWillShow() !== false) {
      this.show();
    }
  };

  onRequestClose = () => {
    const { onDropdownWillHide } = this.props;

    if (!onDropdownWillHide || onDropdownWillHide() !== false) {
      this.hide();
    }
  };

  onModalPress = () => {
    const { onDropdownWillHide } = this.props;

    if (!onDropdownWillHide || onDropdownWillHide() !== false) {
      this.hide();
    }
  };

  onRowPress = (item, index) => {
    const {
      onSelect,
      renderButtonText,
      onDropdownWillHide,
      multipleSelect,
    } = this.props;

    if (!onSelect || onSelect(item, index) !== false) {
      const value = (renderButtonText && renderButtonText(item)) || item.title.toString();

      this.setState({
        buttonText: value,
        selectedIndex: index,
      });
    }

    if (
      !multipleSelect
      && (!onDropdownWillHide || onDropdownWillHide() !== false)
    ) {
      this.hide();
    }
  };

  getSelectedTitle() {
    const { options, defaultIndex, defaultValue } = this.props;
    // const { selectedIndex } = this.state;
    const { selectedIndex } = this.getSelectedValueIndex();

    let res = '';

    if (selectedIndex >= 0) {
      const findRes = options.find((_info, index) => index === selectedIndex);
      if (findRes) {
        res = findRes.title;
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (defaultIndex) {
        const findRes = options.find((_info, index) => index === defaultIndex);
        if (findRes) {
          res = findRes.title;
        }
      }
    }

    if (!res) {
      res = defaultValue || 'unknown_';
    }

    return res;
  }

  getSelectedValueIndex() {
    const {
      selectedValue: selectedValueProps,
      selectedIndex: selectedIndexProps,
    } = this.props;
    const {
      buttonText: selectedValueState,
      selectedIndex: selectedIndexState,
    } = this.state;

    const res = {
      selectedIndex: !_.isNil(selectedIndexProps) ? selectedIndexProps : selectedIndexState,
      selectedValue: !_.isNil(selectedValueProps) ? selectedValueProps : selectedValueState,
    };

    return res;
  }

  calcPosition = (data) => {
    const {
      dropdownStyle,
      inputProps,
      positionTopFix,
      isTypeViewTwo,
    } = this.props;
    const { label } = inputProps;
    const hasLabel = !!label;

    const dimensions = Dimensions.get('window');
    const windowWidth = dimensions.width;
    const windowHeight = dimensions.height;
    let styleHeight; // dropdownlist height
    let styleWidth; // dropdownlist width

    if (dropdownStyle) {
      styleHeight = StyleSheet.flatten(dropdownStyle).height;
      styleWidth = StyleSheet.flatten(dropdownStyle).width;
    }

    const dropdownHeight = styleHeight || DropdownListUtils.getHeightContainer(data, { isTypeViewTwo });

    const bottomSpace = windowHeight - this._buttonFrame.y - this._buttonFrame.h;
    const rightSpace = windowWidth - this._buttonFrame.x;
    const showInBottom = bottomSpace >= (dropdownHeight + 20) || bottomSpace >= this._buttonFrame.y;
    const marginInBottom = 5;
    const marginInTop = hasLabel ? -15 : marginInBottom;

    const positionStyle = {
      // height: dropdownHeight,
      top: showInBottom
        ? this._buttonFrame.y + this._buttonFrame.h + marginInBottom
        : Math.max(0, (this._buttonFrame.y - dropdownHeight)) - marginInTop,
    };

    if (!deviceUtils.isIOS && this._headerHeight) {
      positionStyle.top -= (this._headerHeight / 2);
    }

    let positionLeft = this._buttonFrame.x;
    const positionRight = rightSpace - this._buttonFrame.w;
    const widthSelectedValue = this._buttonFrame.w;
    let widthOffset = positionLeft;

    // let's center dropdown list if we have dropdown width
    if (styleWidth) {
      if (styleWidth > widthSelectedValue) {
        widthOffset = styleWidth - widthSelectedValue;
        positionLeft -= (widthOffset / 2);
      } else if (widthSelectedValue > styleWidth) {
        widthOffset = widthSelectedValue - styleWidth;
        positionLeft += (widthOffset / 2);
      }
    } else {
      positionStyle.right = positionRight;
    }

    positionStyle.top += positionTopFix;
    positionStyle.left = positionLeft;

    // this.setState({
    //   positionStyle,
    // });

    return positionStyle;
  };

  filterOptions = (options) => {
    const { filterOptions } = this.props;
    const { inputSearch } = this.state;

    if (
      !inputSearch
      || (inputSearch === '')
    ) {
      return options;
    }

    if (filterOptions) {
      return filterOptions(inputSearch, options);
    }

    const inputFormat = inputSearch.toLowerCase();

    const res = options.filter(({ name, title }) => {
      const titleFormat = title.toLowerCase();

      if (
        name.toLowerCase().startsWith(inputFormat)
        || titleFormat.includes(inputFormat)
      ) {
        return true;
      }

      return false;
    });

    return res;
  };

  isRenderItemSelected = ({ index }) => {
    // const { selectedIndex } = this.state;
    const { selectedIndex } = this.getSelectedValueIndex();
    const isSelected = (index === selectedIndex);

    return isSelected;
  };

  show() {
    this.updatePosition(() => {
      this.setState({
        showDropdown: true,
      });
    });
  }

  hide() {
    this.setState({
      showDropdown: false,
      inputSearch: '',
    });
  }

  select(idxInp) {
    const {
      defaultValue,
      options,
      defaultIndex,
      renderButtonText,
    } = this.props;
    let value = defaultValue;
    let idx = idxInp;

    if (idx == null || !options || idx >= options.length) {
      idx = defaultIndex;
    }

    if (idx >= 0) {
      value = renderButtonText ? renderButtonText(options[idx]) : options[idx].toString();
    }

    this.setState({
      buttonText: value,
      selectedIndex: idx,
    });
  }

  updatePosition(callback) {
    if (this._button && this._button.measure) {
      // @ts-ignore
      this._button.measure((fx, fy, width, height, px, py) => {
        this._buttonFrame = {
          x: px,
          y: py,
          w: width,
          h: height,
        };

        if (callback) {
          callback();
        }
      });
    }
  }

  renderLoading = () => <ActivityIndicator size="small" />;

  renderTextButton() {
    const {
      textButtonContainerStyle,
      isTypeViewThree,
    } = this.props;
    const selectedTitle = this.getSelectedTitle();
    const icon = (style) => (
      <Icon
        type="Ionicons"
        name="caret-down-sharp"
        style={style}
      />
    );
    let iconLeft = null;
    let iconRight = icon(styles.viewTwoTextBlIcon);
    let textProps = {
      text1Sb: true,
    };

    if (isTypeViewThree) {
      iconRight = null;
      iconLeft = icon(styles.viewThreeTextBlIcon);
      textProps = {
        sCapsBold: true,
      };
    }

    return (
      <TouchableOpacity
        onPress={() => {
          this.onButtonPress();
        }}
        ref={(c) => {
          if (c) {
            this._button = c;
          }
        }}
      >
        <View
          style={[styles.viewTwoTextBl, textButtonContainerStyle]}
        >
          {iconLeft}
          <Text
            style={styles.viewTwoTextBlText}
            {...textProps}
          >
            {selectedTitle}
          </Text>
          {iconRight}
        </View>
      </TouchableOpacity>
    );
  }

  renderButton() {
    const {
      disabled,
      accessible,
      inputProps,
      renderButton,
      isTypeViewTwo,
      isTypeViewThree,
    } = this.props;
    const { showDropdown } = this.state;

    if (renderButton) {
      return renderButton();
    }

    if (isTypeViewTwo || isTypeViewThree) {
      return this.renderTextButton();
    }

    const { selectedValue } = this.getSelectedValueIndex();

    return null;
    // return (
    //   <InputFake
    //     getRef={(c) => {
    //       if (c) {
    //         this._button = c;
    //       }
    //     }}
    //     value={selectedValue}
    //     disabled={disabled}
    //     accessible={accessible}
    //     onPress={this.onButtonPress}
    //     caretDown={!showDropdown}
    //     {...inputProps}
    //   />
    // );
  }

  renderModal() {
    const { animated, accessible } = this.props;
    const { showDropdown, loading } = this.state;

    if (showDropdown && this._buttonFrame) {
      const animationType = animated ? 'fade' : 'none';

      return (
        <Modal
          animationType={animationType}
          visible
          transparent
          onRequestClose={this.onRequestClose}
          supportedOrientations={[
            'portrait',
            'portrait-upside-down',
            'landscape',
            'landscape-left',
            'landscape-right',
          ]}
        >
          <TouchableWithoutFeedback
            accessible={accessible}
            disabled={!showDropdown}
            onPress={this.onModalPress}
          >
            <View style={styles.modal}>
              {loading ? this.renderLoading() : this.renderDropdown()}
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      );
    }

    return null;
  }

  renderDropdown() {
    const {
      options,
      dropdownStyle,
      isTypeViewTwo,
      isTypeViewThree,
    } = this.props;
    const data = this.filterOptions(options);
    this._dataFiltered = data;
    this._data = options;

    const styleDropdownList = this.calcPosition(data);

    return (
      <DropdownList
        data={data}
        onRowPress={this.onRowPress}
        ListHeaderComponent={this.renderSearch}
        isRenderItemSelected={this.isRenderItemSelected}
        styleContainer={[
          dropdownStyle,
          styleDropdownList,
        ]}
        isTypeViewTwo={isTypeViewTwo || isTypeViewThree}
      />
    );
  }

  renderSearch = () => {
    const { hasSearch } = this.props;

    if (!hasSearch) {
      return null;
    }

    return (
      <View style={styles.inputSearchBl}>
        <TextInput
          numberOfLines={1}
          style={styles.inputSearch}
          placeholder="search"
          onChangeText={(e) => {
            this.setState({
              inputSearch: e,
            });
          }}
          onSubmitEditing={() => {
            if (this._dataFiltered.length === 1) {
              const item = this._dataFiltered[0];
              const index = this._data.findIndex(({ name }) => item.name === name);

              this.onRowPress(item, index);
            }
          }}
        />
      </View>
    );
  };

  render() {
    const { style } = this.props;

    return (
      <View {...this.props} style={style}>
        {this.renderButton()}

        <HeaderHeightContext.Consumer>
          {(headerHeight) => {
            this._headerHeight = headerHeight;

            return this.renderModal();
          }}
        </HeaderHeightContext.Consumer>
      </View>
    );
  }
}

export default ModalDropdown;
