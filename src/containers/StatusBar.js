import React from 'react';
import { StatusBar as StatusBarRN, StyleSheet, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { isIOS } from '../utils/deviceInfo';
import { colors } from '../constants/colors';

const StatusBar = React.memo(() => {
  if(isIOS) {
    return (
      <View style={[styles.statusbarWrapper, { height: getStatusBarHeight() }]}>
        <StatusBarRN backgroundColor={colors.statusBar} barStyle='light-content' />
      </View>
    )
  }
  return <StatusBarRN backgroundColor={colors.statusBar} barStyle='light-content' />
});

export default StatusBar;

const styles = StyleSheet.create({
  statusbarWrapper: {
    width: '100%',
    backgroundColor: colors.statusBar
  }
})
