export default function categoryReducer(state = {
  addresses: [],
  loading: true,
  error: null,
}, action) {
  switch (action.type) {
    case 'GET_ADDRESSES':
      return { ...state, addresses: action.data };
    case 'ADDRESS_LOADING':
      return { ...state, loading: action.isLoading };
    case 'ADDRESS_ERROR':
      return { ...state, error: action.error };
    default:
      return state;
  }
};
