import React, { Component } from 'react';
import { Text, View, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../constants/colors';

const OfflineScreen = React.memo(() => {
  return (
    <View style={styles.container}>
      <Icon name="access-point-network" size={120} color={colors.lightGray} />
      <Text style={styles.titleStyle}>Pas de connection</Text>
      <Text style={styles.dscpStyle}>Veuillez vérifier votre connexion Internet</Text>
    </View>
  );
});

export default OfflineScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white
  },
  titleStyle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    marginTop: 15,
  },
  dscpStyle: {
    fontFamily: 'Karla-Regular',
    fontSize: 14,
    marginTop: 10,
    marginHorizontal: 40,
    textAlign: 'center'
  }
});
