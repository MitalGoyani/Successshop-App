import React, { Component } from 'react';
import NetInfo from "@react-native-community/netinfo";

class OfflineNotice extends Component {
  componentWillMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      if (this.props.onConnectionChanged) {
        this.props.onConnectionChanged(state.isConnected);
      }
    });
  }

  componentWillUnmount() {
    if(this.unsubscribe) this.unsubscribe();
  }

  render() {
    return null;
  }
}

export default OfflineNotice;
