
import PropTypes from 'prop-types';

import Toast from 'src/utils/toastUtils';

import GameApi from 'src/api/GameApi';

import {
  NavigationService,
  routeNames,
} from 'src/navigation';

const ReserveSpotButtonService = ({
  run,
  isManageStack,
  userId,
  children,
}) => {
  const onPress = () => {
    const { runId } = run;
    GameApi.getRunDetail(runId).then((data) => {
      const routeName = isManageStack ? routeNames.RESERVE_SPOT_MANAGER : routeNames.RESERVE_SPOT;
      NavigationService.navigate(routeName, {
        dataGame: run,
        dataGameDetail: data,
        userId,
      });
    }).catch((err) => {
      Toast.showError(err);
    });
  };

  return children({
    onPress,
  });
};

ReserveSpotButtonService.propTypes = {
  run: PropTypes.object.isRequired,
  isManageStack: PropTypes.bool,
  userId: PropTypes.number,
};

ReserveSpotButtonService.defaultProps = {
  isManageStack: false,
  userId: null,
};

export default ReserveSpotButtonService;
