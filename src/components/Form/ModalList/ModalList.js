
import React, {
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  View,
} from 'react-native';
import {
  Text,
  Button,
} from 'native-base';

import TextInput from 'src/components/TextInput';
import Modal from 'src/components/Modal';
import { SpinnerLocal } from 'src/components/Spinner';

import {
  gs,
} from 'src/styles';

import FormItem from '../FormItem';

import ModalListService from './ModalListService';
import ModalListEmpty from './ModalListEmpty';

const ModalList = ({
  label,
  note,
  value,
  onSelect,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const renderItem = (data) => {
    const { item } = data;
    const { name, shortName } = item;

    return (
      <View style={[gs.row, gs.jCSpaceBetween, gs.mV10, gs.aICenter]}>
        <View>
          <Text white>{name}</Text>
          <Text white>{shortName}</Text>
        </View>

        <Button
          onPress={() => {
            onSelect(item);
            hideModal();
          }}
        >
          <Text>select</Text>
        </Button>
      </View>
    );
  };

  return (
    <FormItem
      label={label}
      note={note}
    >
      <TextInput
        isFullWidth
        iconRightCaret
        value={value}
        onPress={() => {
          showModal();
        }}
      />

      <Modal
        isVisible={isModalVisible}
        onClose={hideModal}
        opacity={1}
        styleContent={gs.mH20}
      >
        <ModalListService>
          {({
            isLoading,
            onInput,
            list,
            searchText,
          }) => (
            <>
              <TextInput
                debounce
                onChangeText={onInput}
                placeholder="Ex. Atlanta Angels"
              />

              <SpinnerLocal
                visible={isLoading}
              />

              {(
                (searchText !== '')
                && (list.length < 1)
                && !isLoading
              ) && (
                <ModalListEmpty
                  onAdded={(data) => {
                    onSelect(data);
                    hideModal();
                  }}
                />
              )}

              {(list.length > 0) && (
                <FlatList
                  data={list}
                  keyExtractor={(_item, i) => (`key-${i}`)}
                  renderItem={renderItem}
                  ListEmptyComponent={null}
                />
              )}
            </>
          )}
        </ModalListService>
      </Modal>
    </FormItem>
  );
};

ModalList.propTypes = {
  label: PropTypes.string,
  note: PropTypes.string,
  value: PropTypes.string,
  onSelect: PropTypes.func,
};

ModalList.defaultProps = {
  label: null,
  note: null,
  value: '',
  onSelect: () => null,
};

export default ModalList;
