
import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
} from 'react-native';
import {
  ActionSheet,
} from 'native-base';
import {
  useForm,
  Controller,
} from 'react-hook-form';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Auth } from 'aws-amplify';

import Toast from 'src/utils/toastUtils';
import authUtils from 'src/utils/authUtils';

import Content from 'src/components/Content';
import TextInput from 'src/components/TextInput';

import AuthApi from 'src/api/AuthApi';

import {
  SpinnerService,
} from 'src/services';

import {
  gs,
} from 'src/styles';

import logo from 'src/assets/baller.png';
import background from 'src/assets/Background.png';

import VerifyCode from './Comps/VerifyCode';

const genders = authUtils.getGenders();

const RegisterDetails = ({ form }) => {
  const [modalData, setModalData] = React.useState({
    isVisible: false,
    form,
  });
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSetModalData = (data) => {
    setModalData({
      ...form,
      ...data,
    });
  };

  React.useEffect(() => {
    if (isSubmitting && !_.isEmpty(errors)) {
      Toast.showError('Check form please');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  const onSubmit = handleSubmit(async (data) => {
    const formNew = {
      ...form,
      ...data,
    };

    SpinnerService.show();

    // checking user
    try {
      await AuthApi.checkUser(form.email, form.phone);
    } catch (e) {
      SpinnerService.hide();
      Toast.showError(e);
      return;
    }

    // signup using AWS
    try {
      const params = {
        username: formNew.email,
        password: formNew.password,
        attributes: {
          email: formNew.email,
          phone_number: `+${formNew.phone}`,
        },
      };

      await Auth.signUp(params);
    } catch (e) {
      SpinnerService.hide();
      Toast.showError(e);
      return;
    }

    SpinnerService.hide(() => {
      onSetModalData({
        isVisible: true,
        form: formNew,
      });
    });
  });

  const renderTextInput = ({ field }, textInputProps = {}) => {
    const { name, onChange, value } = field;

    return (
      <TextInput
        value={value}
        onChangeText={onChange}
        error={!!errors[name]}
        {...textInputProps}
      />
    );
  };

  return (
    <Content
      useSafeAreaView
      style={gs.bgGray2A08}
      imageBg={background}
      registerNav={{}}
      footerButtonProps={[
        {
          text: 'COMPLETE',
          onPress: onSubmit,
        },
      ]}
    >

      <View style={[gs.flex, gs.jCCenter, gs.aICenter]}>
        <Image
          style={[gs.size80, gs.mB20]}
          source={logo}
        />

        <Controller
          control={control}
          render={(args) => renderTextInput(args, { placeholder: 'City' })}
          name="city"
          defaultValue=""
          rules={{
            required: true,
          }}
        />

        <Controller
          control={control}
          render={(args) => renderTextInput(args, { placeholder: 'State' })}
          name="state"
          defaultValue=""
          rules={{
            required: true,
          }}
        />

        <Controller
          control={control}
          render={(args) => renderTextInput(args, { placeholder: 'Zipcode', keyboardType: 'numeric' })}
          name="zipcode"
          defaultValue=""
          rules={{
            required: true,
          }}
        />

        <Controller
          control={control}
          render={({ field: { value, onChange, name } }) => (
            <TextInput
              value={value}
              error={!!errors[name]}
              placeholder="Select Gender"
              onPress={() => {
                const options = [
                  ...genders,
                  'Cancel',
                ];

                ActionSheet.show(
                  {
                    options,
                    cancelButtonIndex: (options.length - 1),
                  },
                  (selectedIndex) => {
                    const genderSelected = genders.find((_item, index) => selectedIndex === index);

                    onChange(genderSelected);
                  },
                );
              }}
            />
          )}
          name="gender"
          defaultValue=""
          rules={{
            required: true,
          }}
        />

      </View>

      <VerifyCode
        visible={modalData.isVisible}
        onClose={() => {
          onSetModalData({
            isVisible: false,
          });
        }}
        form={modalData.form}
      />
    </Content>
  );
};

RegisterDetails.propTypes = {
  form: PropTypes.object.isRequired,
};

const mapStateToProps = (_state, ownProps) => ({
  form: _.get(ownProps.route, 'params.form'),
});

export default connect(mapStateToProps)(RegisterDetails);
