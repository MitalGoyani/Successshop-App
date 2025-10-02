import apolloClient from '../graphql/client';
import { ORDER_LIST } from '../graphql/queries';

export const orderLoading = (type, bool) => ({
  type: 'ORDER_LOADING',
  isLoading: bool,
  orderType: type
});

export const orderError = error => ({
  type: 'ORDER_ERROR',
  error
});

export const getOrderDetails = (data) => ({
  type: 'GET_ORDER',
  data
});

export const clearOrders = () => {
	return {
		type: 'CLEAR_ORDERS'
	};
};

export const getOrders = (args) => dispatch => {
  dispatch(orderLoading(args.status, true));
  return apolloClient.query({
      query: ORDER_LIST,
      variables: {
        ...args
      },
      fetchPolicy: 'no-cache'
    })
    .then((result) => {
      if(result && result.data && result.data.getOrders) dispatch(getOrderDetails({ data: result.data.getOrders, ...args }));
    })
    .catch((err) => {
      dispatch(orderLoading(args.status, false));
      dispatch(orderError(err.message || 'ERROR'));
    })
}
