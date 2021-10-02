
import React from 'react';
import {
  FlatList,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
} from 'native-base';

// import {
//   TextStyleProps,
//   ViewStyleProps,
// } from 'src/Styles';

import {
  DropdownListDefaultProps,
} from './DropdownListTypes';
import DropdownListUtils from './DropdownListUtils';
import styles, { viewTwoStyles } from './styles';

const TOUCHABLE_ELEMENTS = [
  'TouchableHighlight',
  'TouchableOpacity',
  'TouchableWithoutFeedback',
  'TouchableNativeFeedback',
];

const DropdownList = (props) => {
  const {
    data,
    renderRow,
    onRowPress,
    isRenderItemSelected,
    renderSeparator,
    keyboardShouldPersistTaps,
    onLayoutContainer,
    styleContainer,
    renderSearch,
    isTypeViewTwo,
    ...restProps
  } = { ...DropdownListDefaultProps, ...props };
  let stylesTypes = styles;

  if (isTypeViewTwo) {
    stylesTypes = viewTwoStyles;
  }

  const renderItemOwn = ({ item, index }) => {
    const styleText = [stylesTypes.itemText];

    if (isRenderItemSelected({ item, index })) {
      styleText.push(stylesTypes.itemTextSeleted);
    }

    return (
      <View style={stylesTypes.renderItemOwn}>
        <Text style={styleText}>{item.title || item.name}</Text>
      </View>
    );
  };

  const renderItem = (...args) => {
    const { item, index } = args[0];
    const styleItemBtn = [];
    let res = renderRow ? renderRow(...args) : renderItemOwn(...args);

    if (!Object.keys(TOUCHABLE_ELEMENTS).find((itemEl) => TOUCHABLE_ELEMENTS[itemEl] === res.type.displayName)) {
      res = (
        <TouchableOpacity
          onPress={() => {
            onRowPress(item, index);
          }}
          style={[stylesTypes.itemBtn, styleItemBtn]}
        >
          {res}
        </TouchableOpacity>
      );
    }

    res = (
      <View>
        {res}
      </View>
    );

    return res;
  };

  const renderItemSeparator = ({ leadingItem = '' }) => {
    const key = `spr_${leadingItem}`;

    if (renderSeparator) {
      return renderSeparator();
    }

    return <View style={stylesTypes.separator} key={key} />;
  };

  const heightContainer = DropdownListUtils.getHeightContainer(data, { isTypeViewTwo });

  return (
    <View
      style={[
        { height: heightContainer },
        stylesTypes.dropdownBl,
        styleContainer,
      ]}
      onLayout={onLayoutContainer}
    >
      <FlatList
        data={data}
        style={stylesTypes.container}
        keyExtractor={(_item, i) => (`key-${i}`)}
        renderItem={renderItem}
        ItemSeparatorComponent={renderItemSeparator}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        automaticallyAdjustContentInsets={false}
        stickyHeaderIndices={renderSearch ? [0] : undefined}
        showsVerticalScrollIndicator
        scrollEnabled
        {...restProps}
      />
    </View>
  );
};

export default DropdownList;
