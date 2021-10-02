
import React from 'react';
import {
  View,
} from 'react-native';
import {
  Text,
} from 'native-base';
import {
  useSelector,
  useDispatch,
} from 'react-redux';

import Toast from 'src/utils/toastUtils';

import Content from 'src/components/Content';
import ProgressBar from 'src/components/ProgressBar';
import {
  ActionSheet,
  ActionSheetUtils,
  Counter,
} from 'src/components/Form';

import {
  routeNames,
} from 'src/navigation';

import GameApi from 'src/api/GameApi';

import gameUtils from 'src/utils/gameUtils';

import {
  gamesNewEventForm1Selector,
  gamesNewEventUpdateData,
  gamesNewEventEventRequestIdSelector,
  gamesNewEventTypeSelector,
} from 'src/reducers/games';

import {
  gs,
} from 'src/styles';

import AddGameServices from './Comps/AddGameServices';

const AddGameList = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const eventRequestId = useSelector(gamesNewEventEventRequestIdSelector);
  const type = useSelector(gamesNewEventTypeSelector);
  const formStore = useSelector(gamesNewEventForm1Selector);

  const isGame = (gameUtils.TYPES.GAME === type);

  const leagues = ActionSheetUtils.formatOptions(formStore.leagueId.options, 'name');
  const leagueSelected = leagues.find(({ id }) => id === formStore.leagueId.value) || {};

  const gameLevels = ActionSheetUtils.formatOptions(formStore.eventLevelId.options, 'name');
  const gameLevelSelected = gameLevels.find(({ id }) => id === formStore.eventLevelId.value) || {};

  const { services } = formStore;

  const onFormUpdate = (data) => {
    const formUpdate = {
      form1: {
        ...formStore,
        ...data,
      },
    };

    dispatch(gamesNewEventUpdateData(formUpdate));
  };

  const onFormSet = (data) => {
    dispatch(gamesNewEventUpdateData({
      form1: data,
    }));
  };

  const onContinue = async () => {
    const errors = [];

    const leagueId = leagueSelected.id;
    const eventLevelId = gameLevelSelected.id;

    // check unckecked redios
    services.forEach(({
      id,
      name,
      isSelected,
      options,
    }) => {
      const res = {
        id,
        isSelected,
      };

      if (
        options
        && (Array.isArray(options))
        && (options.length > 0)
      ) {
        res.options = options.filter((item) => (item.isSelected === 'Yes')).map((item) => item.id);

        if (
          (isSelected === 'Yes')
          && (res.options.length < 1)
        ) {
          errors.push(`${name} - choose option please`);
        }
      }

      return res;
    });

    if (
      !leagueId
      || !eventLevelId
    ) {
      Toast.showError('Check form please');
      return;
    }

    if (errors.length > 0) {
      Toast.showError(errors.join('\n'));
      return;
    }

    const formSave = {
      eventRequestId,
      leagueId,
      eventLevelId,
      commitForm: 'Yes',
    };

    try {
      const form1 = await GameApi.setEventForm1Data(formSave);

      dispatch(gamesNewEventUpdateData({
        form1,
      }));
    } catch (e) {
      Toast.showError(e);
      return;
    }

    try {
      const form2 = await GameApi.getEventForm2Data(eventRequestId);

      dispatch(gamesNewEventUpdateData({
        form2,
      }));
    } catch (e) {
      Toast.showError(e);
      return;
    }

    navigation.navigate(routeNames.ADD_GAME_TEAMS);
  };

  const renderTotalCost = () => {
    const { orderTotals: { grandTotal } } = formStore;

    return (
      <Text white style={[gs.textCenter, gs.fS20, gs.mT20]}>{`Total event cost: $${grandTotal}`}</Text>
    );
  };

  const renderLeagueLeveltLists = () => {
    if (!isGame) {
      return null;
    }

    return (
      <>
        <ActionSheet
          label="League/Assiciation"
          note="Which leage/association is this gaem a part of?"
          value={leagueSelected.name || 'Choose please'}
          list={leagues}
          onSelected={async (itemInfo) => {
            try {
              const respApi = await GameApi.setEventForm1Data({
                eventRequestId,
                leagueId: itemInfo.id,
              });

              onFormSet(respApi);
            } catch (e) {
              Toast.showError(e);
            }
          }}
        />

        <ActionSheet
          label="Game Level"
          value={gameLevelSelected.name || 'Choose please'}
          list={gameLevels}
          onSelected={async (itemInfo) => {
            try {
              const respApi = await GameApi.setEventForm1Data({
                eventRequestId,
                eventLevelId: itemInfo.id,
              });

              onFormSet(respApi);
            } catch (e) {
              Toast.showError(e);
            }
          }}
        />
      </>
    );
  };

  const renderBallers = () => {
    if (isGame) {
      return null;
    }

    return (
      <View>
        <Counter
          label="How may ballers are allowed to play?"
          value={30}
        />

        <Counter
          label="What is the cost for ballers to reserve?"
          value={10}
          styleContainer={gs.mT20}
        />
      </View>
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
          onPress: onContinue,
        },
      ]}
    >
      <ProgressBar />

      <View style={gs.mT20}>

        {renderLeagueLeveltLists()}

        {renderBallers()}

        <Text white style={gs.mT20}>Which services will you be requesting?</Text>

        {services.map((item, index) => (
          <AddGameServices
            key={index.toString()}
            data={item}
            onCheckbox={async (itemInfo, isSelect) => {
              const hasOptions = (itemInfo.options.length > 0);

              if (hasOptions && isSelect) {
                const servicesNew = services.map((itemInp) => {
                  const { id: idTmp } = itemInp;
                  const itemRes = { ...itemInp };

                  if (idTmp === itemInfo.id) {
                    itemRes.isSelected = isSelect ? 'Yes' : 'No';
                  }

                  return itemRes;
                });

                onFormUpdate({
                  services: servicesNew,
                });

                return;
              }

              try {
                const itemInfoFormat = {
                  id: itemInfo.id,
                  isSelected: isSelect ? 'Yes' : 'No',
                };

                const respApi = await GameApi.setEventForm1Data({
                  eventRequestId,
                  services: [
                    itemInfoFormat,
                  ],
                });

                onFormSet(respApi);
              } catch (e) {
                Toast.showError(e);
              }
            }}
            onRadio={async (itemInfo, optionInfo) => {
              const itemInfoFormat = {
                id: itemInfo.id,
                isSelected: 'Yes',
                options: [optionInfo.id],
              };

              try {
                const respApi = await GameApi.setEventForm1Data({
                  eventRequestId,
                  services: [
                    itemInfoFormat,
                  ],
                });

                onFormSet(respApi);
              } catch (e) {
                Toast.showError(e);
              }
            }}
          />
        ))}

        {renderTotalCost()}

      </View>
    </Content>
  );
};

export default AddGameList;
