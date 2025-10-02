import apolloClient from '../graphql/client';
import { SLIDER_PHOTOS } from '../graphql/queries';

export const sliderLoading = bool => ({
  type: 'SLIDER_LOADING',
  isLoading: bool,
});

export const getSliderPhoto = (photos) => ({
  type: 'GET_SLIDERS_PHOTOS',
  photos
});

export const getSliderPhotos = () => dispatch => {
  return apolloClient.query({
      query: SLIDER_PHOTOS,
      fetchPolicy: 'no-cache'
    })
    .then((result) => {
      if(result && result.data && result.data.getBanners) dispatch(getSliderPhoto(result.data.getBanners));
      dispatch(sliderLoading(false));
    })
    .catch((err) => {
      dispatch(sliderLoading(false));
    })
}
