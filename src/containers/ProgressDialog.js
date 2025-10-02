import React from 'react';
import { StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { colors } from '../constants/colors';

const styles = StyleSheet.create({
  indicator: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  }
});

const ProgressDialog = React.memo(({ isVisible }) => (
  <Modal
    animationType={'none'}
    transparent
    visible={isVisible}
    transparent
  >
    <ActivityIndicator color={colors.white} size={'large'} style={styles.indicator} />
  </Modal>
));

export default ProgressDialog
