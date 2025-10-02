import apolloClient from '../graphql/client';
import { CART_LIST } from '../graphql/queries';

export const cartLoading = bool => ({
  type: 'CART_LOADING',
  isLoading: bool,
});

export const cartError = error => ({
  type: 'CART_ERROR',
  error,
});

export const getCartDetails = (data) => ({
  type: 'GET_CART',
  data
});

export const updateCart = (product) => ({
  type: 'UPDATE_CART',
  product
})

export const resetCart = () => ({
  type: 'RESET_CART'
})

export const getCart = (userId) => dispatch => {
  dispatch(cartLoading(true));
  const data = {}
  if(userId) data['userId'] = userId
  return apolloClient.query({
      query: CART_LIST,
      variables: {
        ...data
      },
      fetchPolicy: 'no-cache'
    })
    .then((result) => {
      if(result && result.data && result.data.getCartDetails) dispatch(getCartDetails(result.data.getCartDetails));
      dispatch(cartLoading(false));
    })
    .catch((err) => {
      dispatch(cartLoading(false));
      dispatch(cartError(err.message || 'ERROR'));
    })
}
