const initialState = {
  search: { products: [], total: 1 },
  category: { products: [], total: 1 },
  special: { products: [], total: 1 },
  bestSelling: { products: [], total: 1 },
  popular: { products: [], total: 1 },
  similar: { products: [], total: 1 },
  loading: false,
  error: null
};

export default function productReducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_PRODUCTS':
      if(action.data.type && action.data.type == 'special') {
        return {
          ...state,
          special: { products: action.data.skip && action.data.skip > 0 ? [...state.special.products, ...action.data.data.products] : action.data.data.products, total: action.data.data.totalProduct }
        };
      } else if(action.data.type && action.data.type == 'popular') {
        return {
          ...state,
          popular: { products: action.data.skip && action.data.skip > 0 ? [...state.popular.products, ...action.data.data.products] : action.data.data.products, total: action.data.data.totalProduct }
        };
      } else if(action.data.type && action.data.type == 'bestSelling') {
        return {
          ...state,
          bestSelling: { products: action.data.skip && action.data.skip > 0 ? [...state.bestSelling.products, ...action.data.data.products] : action.data.data.products, total: action.data.data.totalProduct }
        };
      } else if(action.data.type && action.data.type == 'similar') {
        return {
          ...state,
          similar: { products: action.data.skip && action.data.skip > 0 ? [...state.similar.products, ...action.data.data.products] : action.data.data.products, total: action.data.data.totalProduct }
        };
      } else if(action.data.search) {
        return {
          ...state,
          search: { products: action.data.skip && action.data.skip > 0 ? [...state.search.products, ...action.data.data.products] : action.data.data.products, total: action.data.data.totalProduct }
        };
      } else if(action.data.categoryId) {
        return {
          ...state,
          category: { products: action.data.skip && action.data.skip > 0 ? [...state.category.products, ...action.data.data.products] : action.data.data.products, total: action.data.data.totalProduct }
        };
      }
    case 'PRODUCT_LOADING':
      return { ...state, loading: action.isLoading };
    case 'PRODUCT_ERROR':
      return { ...state, error: action.error };
    case 'CLEAR_PRODUCTS':
      return { ...initialState }
    default:
      return state;
  }
};
