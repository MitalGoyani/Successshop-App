export default function categoryReducer(state = {
  categories: [],
  loading: true,
  error: null,
}, action) {
  switch (action.type) {
    case 'GET_CATEGORIES':
      return { ...state, categories: action.categories };
    case 'CATEGORY_LOADING':
      return { ...state, loading: action.isLoading };
    case 'CATEGORY_ERROR':
      return { ...state, error: action.error };
    default:
      return state;
  }
};
