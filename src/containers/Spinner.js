import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

const styles = StyleSheet.create({
	indicator: {
		flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.paleGray
	}
});

const Spinner = ({style}) => <ActivityIndicator style={[styles.indicator, style]} color={colors.primary} size={'large'} />;

export default Spinner;
