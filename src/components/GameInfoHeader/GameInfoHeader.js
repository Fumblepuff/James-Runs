
import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
} from 'react-native';
import {
  Text,
} from 'native-base';

import styles from './styles';

const GameInfoHeader = ({ data }) => {
  const { image, name, address } = data;

  return (
    <View style={styles.accountHeader}>
      <View style={[styles.profilePic]}>
        <View style={styles.profileImageBl}>
          <Image style={styles.profileImage} source={{ uri: image }} />
        </View>
      </View>
      <View style={styles.profileTextBl}>
        <Text style={[styles.profileText]} bold>{name}</Text>
        <Text style={[styles.profileTextAddress]}>{address}</Text>
      </View>
    </View>
  );
};

GameInfoHeader.propTypes = {
  data: PropTypes.object.isRequired,
};

export default GameInfoHeader;
