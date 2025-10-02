import React from 'react';
import Spinner from '../containers/Spinner';
import { getData } from '../utils/storage';

export default class AuthLoading extends React.Component {
  componentDidMount() {
    this.openScreen();
  }

  openScreen = async () => {
    const userToken = JSON.parse(await getData('token'))
    this.props.navigation.navigate(userToken ? 'Profile' : 'Auth');
  };

  render() {
    return <Spinner />
  }
}
