/* eslint-disable camelcase */

import URI from 'urijs';
import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js';
import VersionCheck from 'react-native-version-check';

import ConfigUtils from 'src/utils/ConfigUtils';
import dateUtils from 'src/utils/dateUtils';

export default {
  isUrl(url) {
    if (!url) {
      return false;
    }

    const res = [
      'http://',
      'https://',
      'data:image/',
    ].some((v) => url.includes(v));

    return res;
  },

  async sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  },

  getItemImage(imageInp) {
    let res = 'https://s3.amazonaws.com/awsjames-userfiles-mobilehub-258458471/public/james-full-logo.png';

    if (this.isUrl(imageInp)) {
      res = imageInp;
      const isGoogle = imageInp.includes('maps.googleapis.com');

      if (isGoogle) {
        const { googleApi } = ConfigUtils.get();

        res = URI(imageInp).setQuery({ key: googleApi }).toString();
      }
    }

    return res;
  },

  generateUUID() { // Public Domain/MIT: https://stackoverflow.com/a/8809472
    let d = dateUtils.toMilliseconds(new Date());
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now(); // use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // eslint-disable-next-line no-bitwise
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      // eslint-disable-next-line no-bitwise, no-mixed-operators
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  },

  getAddressFromGoogleApi(respApi) {
    const res = {
      address: '',
      city: '',
      state: '',
      zipcode: '',
      longitude: '',
      latitude: '',
    };

    const { result } = respApi;

    if (!result) {
      return res;
    }

    const { address_components, geometry } = result;

    res.longitude = geometry.location.lng;
    res.latitude = geometry.location.lat;

    if (address_components && Array.isArray(address_components)) {
      const address = [];

      address_components.forEach((item) => {
        const { types, long_name, short_name } = item;

        const isStreetNumber = types.includes('street_number');
        const isRoute = types.includes('route');
        const isSublocality = types.includes('sublocality_level_1');
        const isLocality = types.includes('locality');
        const isAdministrativeArea = types.includes('administrative_area_level_1');
        const isPostalCode = types.includes('postal_code');
        const isPostalTown = types.includes('postal_town');

        if (
          isStreetNumber
          || isRoute
          || isSublocality
        ) {
          address.push(long_name);
        } else if (
          isLocality
          || isPostalTown
        ) {
          res.city = long_name;
        } else if (isAdministrativeArea) {
          res.state = short_name;
        } else if (isPostalCode) {
          res.zipcode = long_name;
        }
      });

      res.address = address.join(' ');
    }

    return res;
  },

  getAddressFormat(item) {
    const res = [];

    if (!item) {
      return res.join('');
    }

    const {
      city,
      state,
      address,
      zipcode,
    } = item;

    if (address) {
      res.push(address);
    }

    if (city) {
      res.push(city);
    }

    if (state) {
      res.push(state);
    }

    if (zipcode) {
      res.push(zipcode);
    }

    return res.join(' ');
  },

  formatPhoneNumber(phoneNumber) {
    const res = {
      phoneNumber,
      phoneNumberFormatPlus: '',
      phoneNumberFormat: '',
      isValid: false,
    };

    const phoneNumberPlus = `+${phoneNumber}`;

    res.phoneNumberFormatPlus = new AsYouType().input(phoneNumberPlus);
    res.phoneNumberFormat = res.phoneNumberFormatPlus.replace('+', '');

    try {
      res.isValid = parsePhoneNumberFromString(phoneNumberPlus).isValid();
    } catch (e) {
      res.isValid = false;
    }

    return res;
  },

  getVersion() {
    const buildNumber = VersionCheck.getCurrentBuildNumber();
    const version = VersionCheck.getCurrentVersion();

    const res = `${version} (${buildNumber})`;

    return res;
  },

  async hasNewAppVersion() {
    const needUpdate = await VersionCheck.needUpdate();

    if (__DEV__ && !needUpdate) {
      return false;
    }

    const res = needUpdate.isNeeded;

    return res;
  },

  isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }

    return true;
  },

  getFileInfo(filePathInp) {
    let extention = null;
    const name = filePathInp.replace(/^.*[\\/]/, '');

    if ((/[.]/.exec(name))) {
      extention = `${/[^.]+$/.exec(name)}`;
    }

    return {
      uri: filePathInp,
      name,
      extention,
    };
  },
};
