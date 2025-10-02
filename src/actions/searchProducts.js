import apolloClient from '../graphql/client';
import { PRODUCT_LIST } from '../graphql/queries';

export const productLoading = bool => ({
  type: 'SEARCH_PRODUCT_LOADING',
  isLoading: bool,
});

export const productError = error => ({
  type: 'SEARCH_PRODUCT_ERROR',
  error,
});

export const getProduct = (data) => ({
  type: 'GET_SEARCH_PRODUCTS',
  data
});

export const clearProducts = () => {
	return {
		type: 'SEARCH_CLEAR_PRODUCTS'
	};
};

export const getProducts = (args) => dispatch => {
  dispatch(productLoading(true));
  return apolloClient.query({
      query: PRODUCT_LIST,
      variables: {
        ...args
      },
      fetchPolicy: 'no-cache'
    })
    .then((result) => {
      if(result && result.data && result.data.getProducts) dispatch(getProduct(result.data.getProducts));
      dispatch(productLoading(false));
    })
    .catch((err) => {
      dispatch(productLoading(false));
      dispatch(productError(err.message || 'ERROR'));
    })
}
