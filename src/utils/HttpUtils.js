
import _ from 'lodash';
import axios from 'axios';

const { CancelToken } = axios;

class HttpUtils {
  static post(url, data, config) {
    return HttpUtils.proc('POST', url, data, config);
  }

  static get(url, data, config) {
    return HttpUtils.proc('GET', url, data, config);
  }

  static proc(method, url, dataInp = {}, optionsInp = {}) {
    let data;
    const params = null;

    const {
      headers: headersOptions = {},
      isFormData = false,
      ...options
    } = optionsInp;
    const headers = { ...headersOptions };

    if (!_.isEmpty(dataInp)) {
      data = dataInp;
    }

    if (isFormData) {
      const formData = new FormData();

      _.mapValues(data, (value, key) => {
        if (Array.isArray(value)) {
          value.forEach((valueTmp) => {
            formData.append(key, valueTmp);
          });
        } else {
          formData.append(key, value);
        }
      });

      data = formData;
      headers['Content-Type'] = 'multipart/form-data';
    }

    if (!_.isNil(options.cancelToken)) {
      options.cancelToken = new CancelToken(options.cancelToken);
    }

    const configAxios = {
      url,
      method,
      headers,
      data,
      params,
      timeout: 10000,
      ...options,
    };

    return axios(configAxios);
  }
}

export default HttpUtils;
