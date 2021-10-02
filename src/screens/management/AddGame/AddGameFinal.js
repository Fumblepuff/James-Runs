
import React from 'react';
import {
  View,
} from 'react-native';
import {
  useSelector,
  useDispatch,
} from 'react-redux';

import Toast from 'src/utils/toastUtils';

import GameApi from 'src/api/GameApi';
import FilesApi from 'src/api/FilesApi';

import Content from 'src/components/Content';
import ProgressBar from 'src/components/ProgressBar';
import {
  TextInput,
  FilePicker,
} from 'src/components/Form';

import {
  gamesNewEventForm3Selector,
  gamesNewEventUpdateData,
  gamesNewEventEventRequestIdSelector,
  gamesNewEventHasStatkeepingSelector,
} from 'src/reducers/games';

import {
  routeNames,
} from 'src/navigation';

import {
  gs,
} from 'src/styles';

import AddGamePay from './Comps/AddGamePay';

const AddGameFinal = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const [isPaymentSuccess, setPaymentSuccess] = React.useState(false);
  const eventRequestId = useSelector(gamesNewEventEventRequestIdSelector);
  const formStore = useSelector(gamesNewEventForm3Selector);
  const hasStatkeeping = useSelector(gamesNewEventHasStatkeepingSelector);

  const {
    homeTeamScoreBookFileId = {},
    guestTeamScoreBookFileId = {},
  } = formStore;

  const {
    value: homeTeamScoreBookId,
    label: homeScoreBookLabel,
  } = homeTeamScoreBookFileId;

  const {
    value: guestTeamScoreBookId,
    label: guestScoreBookLabel,
  } = guestTeamScoreBookFileId;

  const onRequest = async () => {
    if (!isPaymentSuccess) {
      Toast.showError('You should pay first.');
      return;
    }

    const {
      videoLink: {
        value: videoLink,
      },
      specialNotes: {
        value: specialNotes,
      },
    } = formStore;

    const formSave = {
      eventRequestId,
      specialNotes,
      videoLink,
      homeTeamScoreBookFileId: homeTeamScoreBookId,
      guestTeamScoreBookFileId: guestTeamScoreBookId,
      commitForm: 'Yes',
    };

    try {
      const form3 = await GameApi.setEventForm3Data(formSave);

      dispatch(gamesNewEventUpdateData({
        form3,
      }));
    } catch (e) {
      Toast.showError(e);
      return;
    }

    navigation.navigate(routeNames.GAME_LISTING);
  };

  const onFormUpdate = (data) => {
    const formUpdate = {
      form3: {
        ...formStore,
        ...data,
      },
    };

    dispatch(gamesNewEventUpdateData(formUpdate));
  };

  return (
    <Content
      useSafeAreaView
      basicNav={{}}
      hasContentPadding
      footerButtonProps={[
        {
          text: 'REQUEST',
          onPress: onRequest,
          type: 'success',
        },
        {
          text: 'CANCEL',
          onPress: () => {
            navigation.navigate(routeNames.ADD_GAME);
          },
          type: 'danger',
        },
      ]}
    >
      <ProgressBar currentStep={3} />

      <View style={gs.mT20}>

        {hasStatkeeping && (
          <TextInput
            isFullWidth
            label="Video Link"
            note="If you are requesting post-game stats, pleace include the link to the video. YouTuve, DropBox or Vimeo are all good options."
            placeholder="http://"
            onChangeText={(text) => {
              onFormUpdate({
                videoLink: {
                  value: text,
                },
              });
            }}
          />
        )}

        <FilePicker
          label="Home team's scorebook"
          value={homeScoreBookLabel || 'select a file'}
          onSelectFile={async (data) => {
            try {
              const respApi = await FilesApi.uploadFile(data);

              onFormUpdate({
                homeTeamScoreBookFileId: {
                  value: respApi.id,
                  label: respApi.label,
                },
              });
            } catch (e) {
              Toast.showError(e);
            }
          }}
        />

        <FilePicker
          label="Guest team's scorebook"
          value={guestScoreBookLabel || 'select a file'}
          onSelectFile={async (data) => {
            try {
              const respApi = await FilesApi.uploadFile(data);

              onFormUpdate({
                guestTeamScoreBookFileId: {
                  value: respApi.id,
                  label: respApi.label,
                },
              });
            } catch (e) {
              Toast.showError(e);
            }
          }}
        />

        <AddGamePay
          onPaymentSuccess={() => {
            setPaymentSuccess(true);
          }}
        >
          <TextInput
            styleContainer={gs.mT20}
            isFullWidth
            label="Special Notes"
            note="Please note any important items that we should be aware of thwn processing this request"
            onChangeText={(text) => {
              onFormUpdate({
                specialNotes: {
                  value: text,
                },
              });
            }}
          />
        </AddGamePay>

      </View>

    </Content>
  );
};

export default AddGameFinal;
