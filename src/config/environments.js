
export const ENV_STAGING = 'staging';
export const ENV_PRODUCTION = 'production';

export const APP_ENV = {
  [ENV_STAGING]: {
    apiUrl: 'http://35.224.164.208/dev/',
    googleApi: 'AIzaSyDWT8jYR4J5oUXqLYoFznHLPi-oB5aWLEI',
  },
  [ENV_PRODUCTION]: {
    apiUrl: 'http://35.224.164.208/api/',
    // apiUrl: 'http://35.224.164.208/dev/',
    googleApi: 'AIzaSyDWT8jYR4J5oUXqLYoFznHLPi-oB5aWLEI',
  },
};
