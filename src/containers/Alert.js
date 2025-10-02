import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '../constants/colors';
import { windowWidth } from '../utils/deviceInfo';

export default class Alert extends React.Component {
  render() {
    const { props } = this
    return (
      <Modal
    		style={styles.modal}
    	  isVisible={props.isVisible}
    		onBackdropPress={() => props.onClosed()}
    		onBackButtonPress={() => props.onClosed()}
    		onSwipeComplete={() => props.onClosed()}
    		swipeDirection={['up', 'down']}
        coverScreen={true}
    	>
        <View style={styles.modalWrapper}>
          <Text style={styles.msgText}>{props.message}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelBtn} activeOpacity={0.8} onPress={() => props.onClosed()}>
              <Text style={styles.cancelBtnText}>{props.cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.8} onPress={() => props.onConfirm()}>
              <Text style={styles.confirmBtnText}>{props.confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles =  StyleSheet.create({
	modal: {
    margin: 0
  },
  modalWrapper: {
    backgroundColor: colors.white,
    marginHorizontal: 20
  },
  msgText: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Karla-Regular',
    color: colors.darkBlack
  },
  buttonContainer: {
    flexDirection: 'row',
    height: 50,
    borderTopWidth: 1,
    borderTopColor: colors.paleGray
  },
  cancelBtn: {
    width: windowWidth / 2 - 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cancelBtnText: {
    fontSize: 16,
    color: colors.darkBlack,
    fontFamily: 'Karla-Bold'
  },
  confirmBtn: {
    width: windowWidth / 2 - 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: colors.paleGray
  },
  confirmBtnText: {
    fontSize: 16,
    color: colors.primary,
    fontFamily: 'Karla-Bold'
  }
})
