import { AsyncStorage } from 'react-native';
import apolloClient from '../graphql/client';
import { PRODUCT_LIST } from '../graphql/queries';

export const productLoading = bool => ({
  type: 'PRODUCT_LOADING',
  isLoading: bool,
});

export const productError = error => ({
  type: 'PRODUCT_ERROR',
  error,
});

export const getProduct = (data) => ({
  type: 'GET_PRODUCTS',
  data
});

export const clearProducts = () => {
	return {
		type: 'CLEAR_PRODUCTS'
	};
};

export const getProducts = (data) => dispatch => {
  dispatch(productLoading(true));
  return apolloClient.query({
      query: PRODUCT_LIST,
      variables: {
        ...data
      },
      fetchPolicy: 'no-cache'
    })
    .then((result) => {
      if(result && result.data && result.data.getProducts && result.data.getProducts.products) dispatch(getProduct({ data: result.data.getProducts, ...data }));
      dispatch(productLoading(false));
    })
    .catch((err) => {
      dispatch(productLoading(false));
      dispatch(productError(err.message || 'ERROR'));
    })
}
