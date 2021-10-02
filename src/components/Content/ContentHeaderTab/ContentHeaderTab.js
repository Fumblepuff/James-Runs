
import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';
import {
  Text,
} from 'native-base';

import TextInput from 'src/components/TextInput';

import mainStyle from 'src/styles/Style';
import {
  gs,
  cls,
} from 'src/styles';

import styles from './styles';

const ContentHeaderTab = ({
  title,
  subTitle,
  onChangeText,
}) => {
  const renderTitleBl = () => {
    if (!title) {
      return null;
    }

    return (
      <View style={styles.titleBl}>
        <Text style={[mainStyle.runLocationText, gs.fS24]}>{title}</Text>
        <View style={styles.line} />
        {subTitle && <Text style={[mainStyle.runLocationText]}>{subTitle}</Text>}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderTitleBl()}

      <TextInput
        debounce
        onChangeText={(search) => onChangeText(search)}
        style={[mainStyle.search, styles.input]}
        styleContainer={styles.inputContainer}
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor={cls.white}
        underlineColorAndroid={cls.transparent}
        placeholder="SEARCH COURTS"
      />
    </View>
  );
};

ContentHeaderTab.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  onChangeText: PropTypes.func,
};

ContentHeaderTab.defaultProps = {
  title: null,
  subTitle: null,
  onChangeText: () => null,
};

export default ContentHeaderTab;
