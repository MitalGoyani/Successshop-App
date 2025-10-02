const initialState = {
  notifications: [],
  loading: false,
  unreadNotification: 0,
  totalNotification: 1
};

export default function notificationReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.data.skip === 0 ? action.data.notifications : [...state.notifications, ...action.data.notifications], totalNotification: action.data.totalNotification };
    case 'NOTIFICATION_LOADING':
      return { ...state, loading: action.isLoading };
    case 'SET_NOTIFICATION_COUNT':
      return { ...state, unreadNotification: action.count}
    case 'CLEAR_NOTIFICATION':
      return { ...initialState, unreadNotification: state.unreadNotification }
    default:
      return state;
  }
};
