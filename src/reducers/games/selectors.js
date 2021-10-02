
import _ from 'lodash';
import { createSelector } from 'reselect';

export const gamesViewDataSelector = createSelector(
  [(state) => _.get(state.games, 'view.data', {})],
  (a) => a,
);

export const gamesViewSelector = createSelector(
  [(state) => _.get(state.games, 'view', {})],
  (a) => a,
);

export const gamesSkillsSelector = () => createSelector(
  [(state) => state.games.skills],
  (a) => a,
);

export const gamesNewEventSelector = createSelector(
  [(state) => state.games.newEvent],
  (a) => a,
);

export const gamesNewEventTypeSelector = createSelector(
  [(state) => _.get(state.games.newEvent, 'type')],
  (a) => a,
);

export const gamesNewEventEventRequestIdSelector = createSelector(
  [(state) => _.get(state.games.newEvent.data, 'eventRequestId')],
  (a) => a,
);

export const gamesNewEventHasStatkeepingSelector = createSelector(
  [(state) => _.get(state.games.newEvent.data, 'form1', {})],
  (a) => {
    const { services = [] } = a;

    const res = services.some(({ name, isSelected }) => {
      const nameFormat = name.toLowerCase();
      let resTmp = false;

      if (nameFormat.includes('statkeeping')) {
        resTmp = isSelected === 'Yes';
      }

      return resTmp;
    });

    return res;
  },
);

export const gamesNewEventForm1Selector = createSelector(
  [(state) => _.get(state.games.newEvent.data, 'form1', {})],
  (a) => a,
);

export const gamesNewEventForm2Selector = createSelector(
  [(state) => _.get(state.games.newEvent.data, 'form2', {})],
  (a) => a,
);

export const gamesNewEventForm3Selector = createSelector(
  [(state) => _.get(state.games.newEvent.data, 'form3', {})],
  (a) => a,
);
