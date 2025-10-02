import apolloClient from '../graphql/client';
import { GET_NOTIFICATIONS } from '../graphql/queries';

export const notificationLoading = bool => ({
  type: 'NOTIFICATION_LOADING',
  isLoading: bool,
});

export const setNotification = (data) => ({
  type: 'SET_NOTIFICATIONS',
  data
});

export const setNotificationCount = (count) => ({
  type: 'SET_NOTIFICATION_COUNT',
  count
})

export const clearNotifications = () => {
	return {
		type: 'CLEAR_NOTIFICATION'
	};
};

export const getNotifications = (args) => dispatch => {
  dispatch(notificationLoading(true));
  return apolloClient.query({
      query: GET_NOTIFICATIONS,
      variables: {
        ...args
      },
      fetchPolicy: 'no-cache'
    })
    .then((result) => {
      if(result && result.data && result.data.getNotifications) dispatch(setNotification({ ...result.data.getNotifications, ...args }));
      dispatch(notificationLoading(false));
    })
    .catch((err) => {
      dispatch(notificationLoading(false));
    })
}
