
import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import HttpUtils from 'src/utils/HttpUtils';
import generalUtils from 'src/utils/generalUtils';
import {
  apiRequestBegin,
  apiRequestEnd,
} from 'src/reducers/network';
import {
  authUserIdSelector,
} from 'src/reducers/auth';

class HttpService extends Component {
  static HttpServiceInstance;

  static get(url, data) {
    return this.HttpServiceInstance.procInt('GET', url, data);
  }

  static post(url, data) {
    return this.HttpServiceInstance.procInt('POST', url, data);
  }

  static proc(method, url, data, options, optionsService) {
    return this.HttpServiceInstance.procInt(method, url, data, options, optionsService);
  }

  componentDidMount() {
    const { setRef } = this.props;
    setRef(this);
  }

  componentWillUnmount() {
    const { setRef } = this.props;
    setRef(null);
  }

  handleSpinner(show = true) {
    const { apiRequestBeginConnect, apiRequestEndConnect } = this.props;

    if (show) {
      apiRequestBeginConnect();
    } else {
      apiRequestEndConnect();
    }
  }

  getOptionsService(optionsInp = {}) {
    const res = {
      useSpinner: true,
      ...optionsInp,
    };

    return res;
  }

  setData(dataInp, options = {}) {
    const { userId } = this.props;

    if (!dataInp || !userId) {
      return dataInp;
    }

    const res = { ...dataInp };

    if (_.isObject(res)) {
      res.loggedInUserId = userId;

      if (options.isFormData) {
        return res;
      }

      if (_.isNil(res.data)) {
        res.data = {
          userId,
        };
      } else {
        // eslint-disable-next-line no-lonely-if
        if (_.isObject(res.data)) {
          if (_.isNull(res.data.userId)) {
            return res;
          }

          if (!res.data.userId) {
            res.data.userId = userId;
          }
        }
      }
    }

    return res;
  }

  async procInt(method, url, dataInp = {}, options, optionsService = {}) {
    let error;
    let resHttp;
    const data = this.setData(dataInp, options);
    const {
      useSpinner,
    } = this.getOptionsService(optionsService);

    if (useSpinner) {
      this.handleSpinner();
    }

    try {
      resHttp = await HttpUtils.proc(method, url, data, options);
    } catch (e) {
      error = e.message;
      // Toast.error(e.message);
    }

    if (useSpinner) {
      this.handleSpinner(false);

      // let's wait for the spinner to be closed
      await generalUtils.sleep(300);
    }

    if (error) {
      return Promise.reject(new Error(error));
    }

    return Promise.resolve(resHttp);
  }

  render() {
    return null;
  }
}

HttpService.propTypes = {
  setRef: PropTypes.func.isRequired,
  apiRequestBeginConnect: PropTypes.func.isRequired,
  apiRequestEndConnect: PropTypes.func.isRequired,
  userId: PropTypes.number,
};

HttpService.defaultProps = {
  userId: null,
};

const mapStateToProps = (state) => ({
  userId: authUserIdSelector()(state),
});

const mapDispatchToProps = {
  apiRequestBeginConnect: apiRequestBegin,
  apiRequestEndConnect: apiRequestEnd,
};

export default connect(mapStateToProps, mapDispatchToProps)(HttpService);
