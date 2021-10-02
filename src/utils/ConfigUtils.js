
import {
  APP_ENV,
  ENV_STAGING,
  ENV_PRODUCTION,
} from '../config/environments';

export const isProd = () => !__DEV__;

export default class ConfigUtils {
  static instance;

  constructor() {
    if (!ConfigUtils.instance) {
      ConfigUtils.instance = this;
    }

    return ConfigUtils.instance;
  }

  static get() {
    let res;

    if (isProd()) {
      res = APP_ENV[ENV_PRODUCTION];
    } else {
      res = APP_ENV[ENV_STAGING];
    }

    return res;
  }
}

