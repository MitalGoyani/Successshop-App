const initialState = {
  processing: { orders: [], total: 1, loading: false },
  delivered: { orders: [], total: 1, loading: false },
  cancelled: { orders: [], total: 1, loading: false },
  error: null
};

export default function orderReducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_ORDER':
      if(action.data.status) {
        if(action.data.status == 'Placed') {
          return {
            ...state,
            processing: {
              orders: action.data.skip && action.data.skip > 0 ? [...state.processing.orders, ...action.data.data.orders] : action.data.data.orders,
              total: action.data.data.totalOrder,
              loading: false
            }
          }
        } else if(action.data.status == 'Delivered') {
          return {
            ...state,
            delivered: {
              orders: action.data.skip && action.data.skip > 0 ? [...state.delivered.orders, ...action.data.data.orders] : action.data.data.orders,
              total: action.data.data.totalOrder,
              loading: false
            }
          }
        } else if(action.data.status == 'Cancelled') {
          return {
            ...state,
            cancelled: {
              orders: action.data.skip && action.data.skip > 0 ? [...state.cancelled.orders, ...action.data.data.orders] : action.data.data.orders,
              total: action.data.data.totalOrder,
              loading: false
            }
          }
        }
      }
    case 'ORDER_LOADING':
      if(action.orderType == 'Placed') {
        return {
          ...state,
          processing: { ...state.processing, loading: action.isLoading }
        }
      } else if(action.orderType == 'Delivered') {
        return {
          ...state,
          delivered: { ...state.delivered, loading: action.isLoading }
        }
      } else if(action.orderType == 'Cancelled') {
        return {
          ...state,
          cancelled: { ...state.cancelled, loading: action.isLoading }
        }
      }
    case 'ORDER_ERROR':
      return { ...state, error: action.error };
    case 'CLEAR_ORDERS':
        return { ...initialState }
    default:
      return state;
  }
};
