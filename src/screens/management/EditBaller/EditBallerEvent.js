/* eslint-disable no-alert */

import React, {
  useState,
  useEffect,
  createRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  FlatList,
} from 'react-native';
import {
  useIsFocused,
} from '@react-navigation/native';

import { SpinnerLocal } from 'src/components/Spinner';
import ReserveCell from 'src/components/ReserveCell';

import GameApi from 'src/api/GameApi';

import {
  gs,
} from 'src/styles';

const EditBallerEvent = ({
  ballerId,
  typeEvent,
}) => {
  const isFocused = useIsFocused();
  const spinnerRef = createRef();
  const [isLoading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  const getUpcomingRuns = async () => {
    setLoading(true);

    try {
      const resApi = await GameApi.getUpcomingEventData(typeEvent);
      setList(resApi);
    } catch (e) {
      alert(e);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (isFocused) {
      getUpcomingRuns();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const renderList = () => (
    <FlatList
      keyExtractor={(item) => item.runId}
      data={list}
      refreshing={isLoading}
      onRefresh={() => {
        getUpcomingRuns();
      }}
      renderItem={({ item }) => (
        <ReserveCell
          baller={ballerId}
          run={item}
        />
      )}
    />
  );

  return (
    <View style={gs.flex}>
      {renderList()}

      <SpinnerLocal
        ref={spinnerRef}
        visible={isLoading}
        style={[gs.absolute, gs.aSCenter, gs.mT10]}
      />
    </View>
  );
};

EditBallerEvent.propTypes = {
  ballerId: PropTypes.number.isRequired,
  typeEvent: PropTypes.number.isRequired,
};

export default EditBallerEvent;
