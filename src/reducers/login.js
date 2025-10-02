export default function LoginReducer(state = {
  user: { token: null },
  isFetching: false,
  error: null,
}, action) {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return { ...state, isFetching: action.isFetching };
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.user };
    case 'LOGIN_ERROR':
      return { ...state, error: action.error };
    case 'SET_TOKEN':
      return { ...state, user: { ...state.user, token: action.token } }
    default:
      return state;
  }
};
