import apolloClient from '../graphql/client';
import { GET_ADDRESSES } from '../graphql/queries';

export const addressLoading = bool => ({
  type: 'ADDRESS_LOADING',
  isLoading: bool,
});

export const addressError = error => ({
  type: 'ADDRESS_ERROR',
  error,
});

export const setAddresses = (data) => ({
  type: 'GET_ADDRESSES',
  data
});

export const getAddresses = (userId) => dispatch => {
  dispatch(addressLoading(true));
  const data = {}
  return apolloClient.query({
      query: GET_ADDRESSES,
      variables: {
        userId
      },
      fetchPolicy: 'no-cache'
    })
    .then((result) => {
      if(result && result.data && result.data.getUserAddresses) dispatch(setAddresses(result.data.getUserAddresses));
      dispatch(addressLoading(false));
    })
    .catch((err) => {
      dispatch(addressLoading(false));
      dispatch(addressError(err.message || 'ERROR'));
    })
}
