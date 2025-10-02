import apolloClient from '../graphql/client';
import { CATEGORY_LIST } from '../graphql/queries';

export const categoryLoading = bool => ({
  type: 'CATEGORY_LOADING',
  isLoading: bool,
});

export const categoryError = error => ({
  type: 'CATEGORY_ERROR',
  error,
});

export const getCategory = (categories) => ({
  type: 'GET_CATEGORIES',
  categories
});

export const getCategories = (data) => dispatch => {
  return apolloClient.query({
      query: CATEGORY_LIST,
      variables: {
        ...data
      },
      fetchPolicy: 'no-cache'
    })
    .then((result) => {
      if(result && result.data && result.data.getCategories && result.data.getCategories.categories) dispatch(getCategory(result.data.getCategories.categories));
      dispatch(categoryLoading(false));
    })
    .catch((err) => {
      dispatch(categoryLoading(false));
      dispatch(categoryError(err.message || 'ERROR'));
    })
}
