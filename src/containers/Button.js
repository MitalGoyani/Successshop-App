import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Platform, ActivityIndicator, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../constants/colors';
import { windowWidth } from '../utils/deviceInfo';

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: windowWidth - 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignSelf: 'center'
  },
  innerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
	text: {
    fontSize: 16,
    lineHeight: 20,
    color: colors.white,
    fontFamily: 'Karla-Regular',
    textTransform: 'uppercase'
	},
	disabledStyle: {
		backgroundColor: '#e1e5e8'
	},
  icon: {
		marginLeft: 10,
    color: colors.white
	},
  iconLeft: {
    marginRight: 10,
    color: colors.white
  }
});

export default class Button extends React.PureComponent {
	render() {
		const {
			title, onPress, disabled, style, textStyle, loading, iconRight, iconLeft
		} = this.props;
		return (
      <TouchableOpacity
        style={[styles.button, disabled && styles.disabledStyle, style ]}
        activeOpacity={0.8}
        disabled={disabled || loading}
        onPress={onPress}
      >
        {loading ?
          <ActivityIndicator color={colors.white} />
        :
          <View style={styles.innerWrapper}>
            {iconLeft ? <Icon name={iconLeft} style={styles.iconLeft} size={14} /> : null}
            <Text style={[styles.text, textStyle]}>{title}</Text>
            {iconRight ? <Icon name={iconRight} style={styles.icon} size={14} /> : null}
          </View>
        }
      </TouchableOpacity>
		);
	}
}
