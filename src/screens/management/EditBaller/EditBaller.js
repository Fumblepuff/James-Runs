
import React from 'react';
import { useSelector } from 'react-redux';

import moment from 'src/common/moment';

import generalUtils from 'src/utils/generalUtils';

import Content, { ContentHeaderPart } from 'src/components/Content';
import TabView from 'src/components/TabView';

import {
  gamesViewDataSelector,
} from 'src/reducers/games';

import {
  gs,
} from 'src/styles';

import background from 'src/assets/managementBackground.png';

import EditBallerGames from './EditBallerGames';
import EditBallerRuns from './EditBallerRuns';
import ProfileSetting from './ProfileSettings';

const EditBaller = (_props) => {
  const [isSettingsVisible, setSettingsVisible] = React.useState(false);
  const baller = useSelector(gamesViewDataSelector);
  const {
    id,
    firstName,
    lastName,
    city,
    state,
    zipcode,
    image,
    date,
  } = baller;
  const ballerId = parseInt(id, 10);
  const imageFormat = generalUtils.getItemImage(image);

  return (
    <Content
      imageBg={background}
      basicNav={{}}
      scrollEnabled={false}
      styleContent={gs.pT0}
      header={(
        <ContentHeaderPart
          textLeft="UPCOMING EVENTS"
          textRight="EDIT USER"
          onPressRight={() => {
            setSettingsVisible(true);
          }}
        />
      )}
      headerImage={imageFormat}
      headerText={[
        {
          text: `${firstName} ${lastName}`,
        },
        {
          text: `${city || 'None'}, ${state || 'None'} ${zipcode || ''}`,
        },
        {
          text: `Joined: ${moment(date).format('MM/DD/YYYY')}`,
        },
      ]}
    >
      <TabView
        tabs={[
          {
            key: 'runs',
            title: 'Runs',
            component: EditBallerRuns,
            props: {
              ballerId,
            },
          },
          {
            key: 'games',
            title: 'Games',
            component: EditBallerGames,
            props: {
              ballerId,
            },
          },
        ]}
      />

      <ProfileSetting
        isVisible={isSettingsVisible}
        userInfo={baller}
        onHide={() => {
          setSettingsVisible(false);
        }}
      />
    </Content>
  );
};

export default EditBaller;
