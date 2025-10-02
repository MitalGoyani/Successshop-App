import apolloClient from '../graphql/client';
import { setData } from '../utils/storage';

export const loginRequest = bool => ({
  type: 'LOGIN_REQUEST',
  isFetching: bool
});

export const loginSuccess = (user) => {
  return {
    type: 'LOGIN_SUCCESS',
    user
  }
};

export const loginError = (error) => ({
  type: 'LOGIN_ERROR',
  error
});

export const setToken = (token) => {
  return {
    type: 'SET_TOKEN',
    token
  }
}
