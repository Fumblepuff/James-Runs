
import React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

import ApiUtils from 'src/utils/ApiUtils';
import Toast from 'src/utils/toastUtils';

import TeamsApi from 'src/api/TeamsApi';

import {
  authUserIdSelector,
} from 'src/reducers/auth';

const ModalListService = ({
  children,
}) => {
  const userId = useSelector(authUserIdSelector());
  const apiCancel = React.useRef();
  const [list, setList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');

  const onInput = (textInp) => {
    const text = textInp || '';
    setSearchText(text);
  };

  React.useEffect(() => {
    if (!searchText) {
      setList([]);
      return;
    }

    if (searchText.length <= 2) {
      return;
    }

    async function getList() {
      if (apiCancel.current) {
        apiCancel.current();
      }

      setIsLoading(true);

      try {
        const resApi = await TeamsApi.searchTeams(searchText, (c) => {
          apiCancel.current = c;
        }, userId);

        const error = ApiUtils.hasError(resApi);

        if (error) {
          Toast.showError(error);
        }

        if (Array.isArray(resApi)) {
          setList(resApi);
        } else {
          Toast.showError('wrong data');
        }
      } catch (e) {
        const isCanceled = (e instanceof axios.Cancel);

        if (!isCanceled) {
          Toast.showError(e);
        }
      }

      setIsLoading(false);
    }

    getList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  return children({
    list,
    isLoading,
    searchText,
    onInput,
  });
};

export default ModalListService;
