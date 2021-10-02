
import { useEffect } from 'react';
import {
  useSelector,
  useDispatch,
} from 'react-redux';

import {
  fetchGamesSkills,
} from 'src/reducers/games';
import {
  authUserIdSelector,
  authMemberTypes,
} from 'src/reducers/auth';

const ReduxService = () => {
  const dispatch = useDispatch();
  const userId = useSelector(authUserIdSelector());

  useEffect(() => {
    if (userId) {
      dispatch(fetchGamesSkills());
      dispatch(authMemberTypes());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return null;
};

export default ReduxService;
