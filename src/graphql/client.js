import React, {Component} from 'react';
import ApolloClient from 'apollo-boost';
import { getData } from '../utils/storage';
import config from '../../config';

const API_BASE_URL = config && config.apiUrl ? config.apiUrl : '';

const client = new ApolloClient({
  uri: API_BASE_URL,
  fetchOptions: {
    credentials: 'include'
  },
  request: async (operation) => {
    const token = await getData('token');
    operation.setContext({
      headers: {
        authorization: JSON.parse(token)
      },
    });
  },
  onError: ({
    graphQLErrors, networkError
  }) => {
    if (graphQLErrors) {
      // TODO - Handle graphql error
      if (__DEV__) console.warn(graphQLErrors);
    }
    if (networkError) {
      // TODO - Handle network error
      if (__DEV__) console.warn(networkError);
    }
  },
});

export default client;
