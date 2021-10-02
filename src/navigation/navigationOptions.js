/* eslint-disable import/prefer-default-export */

import React from 'react';

import BackButton from 'src/components/BackButton';

export const renderHeaderLeft = (options, props) => {
  const { canGoBack } = props;
  const { headerTransparent } = options;

  if (!canGoBack) {
    return null;
  }

  return (
    <BackButton
      noBackground={!headerTransparent}
    />
  );
};
