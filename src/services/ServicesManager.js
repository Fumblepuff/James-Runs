
import React, { PureComponent } from 'react';

import SpinnerService from './SpinnerService';
import HttpService from './HttpService';
import ReduxService from './ReduxService';
import ToastService from './ToastService';

class ServicesManager extends PureComponent {
  render() {
    return (
      <>
        <SpinnerService />
        <ToastService />

        <HttpService
          setRef={(c) => {
            if (c) {
              HttpService.HttpServiceInstance = c;
            }
          }}
        />

        <ReduxService />
      </>
    );
  }
}

export default ServicesManager;
