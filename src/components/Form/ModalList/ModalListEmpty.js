
import React from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
} from 'react-native';
import {
  Text,
  Button,
} from 'native-base';
import {
  useForm,
  Controller,
} from 'react-hook-form';

import Toast from 'src/utils/toastUtils';

import {
  TextInput,
} from 'src/components/Form';

import TeamsApi from 'src/api/TeamsApi';

import {
  gs,
} from 'src/styles';

const ModalListEmpty = ({
  onAdded,
}) => {
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const respApi = await TeamsApi.addTeam(data.name, data.shortName);
      onAdded(respApi);
    } catch (e) {
      Toast.showError(e);
    }
  });

  const renderTextInput = ({ field }, textInputProps = {}) => {
    const { name, onChange, value } = field;

    return (
      <TextInput
        isFullWidth
        value={value}
        onChangeText={onChange}
        error={!!errors[name]}
        {...textInputProps}
      />
    );
  };

  return (
    <ScrollView
      bounces={false}
      style={[gs.flex, gs.m20]}
    >
      <Text white style={gs.fS20}>Coudn&apos;t find the team.</Text>

      <Controller
        control={control}
        render={(args) => renderTextInput(args, {
          label: 'Team Name',
          note: 'Please include the full team name.',
          placeholder: 'Ex. Atlanta Angels',
        })}
        name="name"
        defaultValue=""
        rules={{
          required: true,
        }}
      />

      <Controller
        control={control}
        render={(args) => renderTextInput(args, {
          label: 'Team Short Name',
          note: 'Please include the full team name.',
          placeholder: 'Ex. Angels',
        })}
        name="shortName"
        defaultValue=""
        rules={{
          required: true,
        }}
      />

      <Button
        block
        onPress={onSubmit}
      >
        <Text>Add team</Text>
      </Button>

    </ScrollView>
  );
};

ModalListEmpty.propTypes = {
  onAdded: PropTypes.func.isRequired,
};

export default ModalListEmpty;
