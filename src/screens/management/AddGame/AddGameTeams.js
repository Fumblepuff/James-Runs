
import React from 'react';
import {
  View,
} from 'react-native';
import {
  useForm,
  Controller,
} from 'react-hook-form';
import _ from 'lodash';
import {
  useSelector,
  useDispatch,
} from 'react-redux';

import Toast from 'src/utils/toastUtils';

import GameApi from 'src/api/GameApi';

import Content from 'src/components/Content';
import ProgressBar from 'src/components/ProgressBar';
import {
  TextInput,
  ModalList,
} from 'src/components/Form';

import {
  gamesNewEventForm2Selector,
  gamesNewEventUpdateData,
  gamesNewEventEventRequestIdSelector,
} from 'src/reducers/games';

import {
  routeNames,
} from 'src/navigation';

import {
  gs,
} from 'src/styles';

const AddGameTeams = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const eventRequestId = useSelector(gamesNewEventEventRequestIdSelector);
  const formStore = useSelector(gamesNewEventForm2Selector);
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const {
      homeTeamId: {
        value: homeTeamId,
      },
      guestTeamId: {
        value: guestTeamId,
      },
    } = formStore;

    if (!homeTeamId) {
      Toast.showError('Choose Team #1 please');
      return;
    }

    if (!guestTeamId) {
      Toast.showError('Choose Team #2 please');
      return;
    }

    const formSave = {
      eventRequestId,
      homeTeamId,
      homeTeamColor: data.homeTeamColor,
      homeTeamRosterUrl: data.homeTeamRosterUrl,
      guestTeamId,
      guestTeamColor: data.guestTeamColor,
      guestTeamRosterUrl: data.guestTeamRosterUrl,
      commitForm: 'Yes',
    };

    try {
      const form2 = await GameApi.setEventForm2Data(formSave);

      dispatch(gamesNewEventUpdateData({
        form2,
      }));
    } catch (e) {
      Toast.showError(e);
      return;
    }

    try {
      const form3 = await GameApi.getEventForm3Data(eventRequestId);

      dispatch(gamesNewEventUpdateData({
        form3,
      }));
    } catch (e) {
      Toast.showError(e);
      return;
    }

    navigation.navigate(routeNames.ADD_GAME_FINAL);
  });

  const onFormUpdate = (data) => {
    const formUpdate = {
      form2: {
        ...formStore,
        ...data,
      },
    };

    dispatch(gamesNewEventUpdateData(formUpdate));
  };

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
        onChangeText={(text) => {
          onChange(text);
        }}
        error={!!errors[name]}
        {...textInputProps}
        autoCapitalize="none"
      />
    );
  };

  return (
    <Content
      useSafeAreaView
      basicNav={{}}
      hasContentPadding
      footerButtonProps={[
        {
          text: 'CONTINUE',
          onPress: onSubmit,
        },
      ]}
    >
      <ProgressBar currentStep={2} />

      <View style={gs.mT20}>

        {/* Team 1 */}
        <ModalList
          label="Team #1 Name"
          note="Please include the team name."
          value={formStore.homeTeamId.label || 'Choose team #1'}
          onSelect={(itemInfo) => {
            onFormUpdate({
              homeTeamId: {
                value: itemInfo.id,
                label: itemInfo.name,
              },
            });
          }}
        />

        <Controller
          control={control}
          render={(args) => renderTextInput(args, {
            label: 'Team #1 Color',
            note: 'Please indicate the jersey color of the team.',
            placeholder: 'Black',
          })}
          name="homeTeamColor"
          defaultValue=""
          rules={{
            required: true,
          }}
        />

        <Controller
          control={control}
          render={(args) => renderTextInput(args, {
            label: 'Team #1 Roster',
            note: 'Please provide the link to where the most recent roster can be found.',
          })}
          name="homeTeamRosterUrl"
          defaultValue=""
          rules={{
            required: true,
          }}
        />

        {/* Team 2 */}
        <ModalList
          label="Team #2 Name"
          note="Please include the team name."
          value={formStore.guestTeamId.label || 'Choose team #2'}
          onSelect={(itemInfo) => {
            onFormUpdate({
              guestTeamId: {
                value: itemInfo.id,
                label: itemInfo.name,
              },
            });
          }}
        />

        <Controller
          control={control}
          render={(args) => renderTextInput(args, {
            label: 'Team #2 Color',
            note: 'Please indicate the jersey color of the team.',
            placeholder: 'Black',
          })}
          name="guestTeamColor"
          defaultValue=""
          rules={{
            required: true,
          }}
        />

        <Controller
          control={control}
          render={(args) => renderTextInput(args, {
            label: 'Team #2 Roster',
            note: 'Please provide the link to where the most recent roster can be found.',
          })}
          name="guestTeamRosterUrl"
          defaultValue=""
          rules={{
            required: true,
          }}
        />

      </View>

    </Content>
  );
};

export default AddGameTeams;
