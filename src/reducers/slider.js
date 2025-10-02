export default function sliderReducer(state = {
  photos: [],
  loading: true
}, action) {
  switch (action.type) {
    case 'GET_SLIDERS_PHOTOS':
      return { ...state, photos: action.photos };
    case 'SLIDER_LOADING':
      return { ...state, loading: action.isLoading };
    default:
      return state;
  }
};
