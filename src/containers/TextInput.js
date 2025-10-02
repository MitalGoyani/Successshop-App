import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../constants/colors';
import { CustomIcon } from '../utils/Icons';

const styles = StyleSheet.create({
	inputContainer: {
		marginBottom: 10,
    marginHorizontal: 24
	},
	titleText: {
		fontSize: 14,
		color: colors.darkGray,
		fontFamily: 'Karla-Regular',
		lineHeight: 24
	},
	input: {
		height: 42,
		fontSize: 16,
		color: colors.darkBlack,
    fontFamily: 'Karla-Regular',
		borderBottomWidth: 1
	},
	inputIconLeft: {
		paddingLeft: 32
	},
	inputSecureText: {
		paddingRight: 32
	},
	wrap: {
		position: 'relative'
	},
	icon: {
		position: 'absolute',
		top: 13,
    left: 5,
    color: colors.darkBlack
	},
	iconEyeWrapper: {
		position: 'absolute',
		height: 40,
		width: 34,
		alignItems: 'center',
		justifyContent: 'center',
		right: 5,
		bottom: 5,
    color: colors.darkBlack
	}
});


export default class RCTextInput extends React.PureComponent {
	state = {
		showPassword: false,
		focused: false
	}

	handleFocus = () => {
    this.setState({ focused: true })
  }

  handleBlur = () => {
    this.setState({ focused: false })
  }

	renderIconLeft = (iconLeft) => {
		const { props } = this
		if(iconLeft) return <CustomIcon name={iconLeft} style={[styles.icon, props.iconStyle]} size={14} />
		return null
	}

	tooglePassword = () => {
		this.setState(prevState => ({ showPassword: !prevState.showPassword }));
	}

	iconPassword = () => {
		const { showPassword } = this.state;
		return (
			<TouchableOpacity onPress={() => this.tooglePassword()} activeOpacity={0.8} style={styles.iconEyeWrapper}>
				<Icon name={showPassword ? 'eye' : 'eye-slash'} size={14} color={colors.darkBlack} />
			</TouchableOpacity>
		);
	}

  render() {
    const {
	     wrapperStyle, title, renderIconLeft, iconLeft, secureTextEntry, placeholder, value, inputRef, inputStyle, iconStyle, ...inputProps
		} = this.props;
		const { showPassword, focused } = this.state
		return (
      <View style={[styles.inputContainer, wrapperStyle]}>
				{title !== undefined && <Text style={styles.titleText}>{title}</Text>}
				<View style={styles.wrap}>
					{renderIconLeft ? renderIconLeft () : this.renderIconLeft(iconLeft)}
					<TextInput
            ref={inputRef}
						style={[styles.input, iconLeft && styles.inputIconLeft, secureTextEntry && styles.inputSecureText, { borderBottomColor: focused ? colors.primary : colors.placeholder }, inputStyle]}
						autoCorrect={false}
						autoCapitalize='none'
						underlineColorAndroid='transparent'
						placeholder={placeholder}
						placeholderTextColor={colors.placeholder}
						selectionColor={colors.darkBlack}
						secureTextEntry={secureTextEntry && !showPassword}
						value={value}
						onBlur={() => this.handleBlur()}
            onFocus={() => this.handleFocus()}
            {...inputProps}
					/>
					{secureTextEntry ? this.iconPassword() : null}
				</View>
			</View>
    );
  }
}
