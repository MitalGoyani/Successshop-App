const initialState = {
  products: [],
  loading: false,
  error: null,
  total: 0
};

export default function searchProductReducer(state = initialState, action) {
  switch (action.type) {
    case 'SEARCH_CLEAR_PRODUCTS':
      return { ...initialState }
    case 'GET_SEARCH_PRODUCTS':
      return { ...state, products: [...state.products, ...action.data.products], total: action.data.totalProduct };
    case 'SEARCH_PRODUCT_LOADING':
      return { ...state, loading: action.isLoading };
    case 'SEARCH_PRODUCT_ERROR':
      return { ...state, error: action.error };
    default:
      return state;
  }
};
