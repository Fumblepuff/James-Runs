
import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';
import {
  Text,
} from 'native-base';
import {
  useForm,
  Controller,
} from 'react-hook-form';
import _ from 'lodash';
import { connect } from 'react-redux';

import Toast from 'src/utils/toastUtils';

import {
  TextInput,
} from 'src/components/Form';
import Content from 'src/components/Content';

import GameApi from 'src/api/GameApi';

import {
  routeNames,
} from 'src/navigation';

import {
  gs,
} from 'src/styles';

const AddGameNoStaff = ({
  navigation,
  eventRequestId,
}) => {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const dataApi = {
      ...data,
      phoneNumber: data.phoneNumber.value,
      eventRequestId,
    };

    try {
      await GameApi.referStaffer(dataApi);
    } catch (e) {
      Toast.showError(e);
      return;
    }

    navigation.navigate(routeNames.GAME_LISTING);
  });

  React.useEffect(() => {
    if (isSubmitting && !_.isEmpty(errors)) {
      Toast.showError('Check form please');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

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
    <Content
      basicNav={{}}
      hasContentPadding
      useSafeAreaView
      footerButtonProps={[
        {
          text: 'REFER',
          onPress: onSubmit,
        },
      ]}
    >
      <View style={gs.aICenter}>
        <Text white style={gs.textCenter}>There are currently no staffers in your zone.</Text>
        <Text white style={[gs.textCenter, gs.mV10]}>We will be recruting immediately so we can assist you in the near future.</Text>
        <Text white style={[gs.textCenter, gs.mB10]}>If you would like to refer a potential staffer, submit their information below for a referral bonus.</Text>
      </View>

      <View>
        <Controller
          control={control}
          render={(args) => renderTextInput(args, {
            placeholder: 'First Name',
          })}
          name="firstName"
          defaultValue=""
          rules={{
            required: true,
          }}
        />

        <Controller
          control={control}
          render={(args) => renderTextInput(args, {
            placeholder: 'Last Name',
          })}
          name="lastName"
          defaultValue=""
          rules={{
            required: true,
          }}
        />

        <Controller
          control={control}
          render={(args) => renderTextInput(args, {
            placeholder: 'Email Address',
          })}
          name="email"
          defaultValue=""
          rules={{
            required: true,
          }}
        />

        <Controller
          control={control}
          render={({ field: { value, onChange } }) => {
            const { phoneNumberFormat } = value;

            return (
              <TextInput
                isPhoneNumber
                isFullWidth
                value={phoneNumberFormat}
                onChangeText={onChange}
                error={!!errors.phoneNumber}
              />
            );
          }}
          name="phoneNumber"
          defaultValue={{ phoneNumberFormat: '' }}
          rules={{
            validate: ({ value }) => !!value,
          }}
        />
      </View>
    </Content>
  );
};

AddGameNoStaff.propTypes = {
  eventRequestId: PropTypes.number.isRequired,
};

const mapStateToProps = (_state, ownProps) => ({
  eventRequestId: _.get(ownProps.route, 'params.eventRequestId'),
});

export default connect(mapStateToProps)(AddGameNoStaff);
