import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../constants/colors';
import { windowWidth } from '../utils/deviceInfo';

const CkeckoutSteps = React.memo(({ currentStep }) => {
  const steps = ['Adresse', 'Récapitulatif de la ordre', 'Paiement']
  const customStyles = {
    stepIndicatorSize: windowWidth * 0.1,
    currentStepIndicatorSize: windowWidth * 0.1,
    separatorStrokeWidth: 1,
    currentStepStrokeWidth: 0,
    stepStrokeWidth: 0,
    separatorFinishedColor: colors.placeholder,
    separatorUnFinishedColor: colors.placeholder,
    stepIndicatorFinishedColor: colors.paleGray,
    stepIndicatorUnFinishedColor: colors.paleGray,
    stepIndicatorCurrentColor: colors.primary,
    labelColor: colors.darkGray,
    labelSize: 14,
    currentStepLabelColor: colors.darkBlack
  }

  return (
    <View style={styles.wrapper}>
      <StepIndicator
         customStyles={customStyles}
         currentPosition={currentStep}
         labels={steps}
         stepCount={steps.length}
         renderStepIndicator={(step) => (
           step.stepStatus === 'finished' ?
             <FontAwesomeIcon name={'check'} size={18} color={colors.darkGray} />
           :
              <Text style={[styles.textStyle, { color: step.position == currentStep ? colors.white : colors.darkGray }]}>{step.position + 1}</Text>
         )}
      />
    </View>
  );
});

export default CkeckoutSteps

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 15
  },
  textStyle: {
    fontSize: 16,
    fontFamily: 'Karla-Regular'
  }
});
