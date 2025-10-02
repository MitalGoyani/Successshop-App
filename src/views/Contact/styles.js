import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white
	},
  keyboardAvoidingContainer: {
    flexGrow: 1
  },
	innerContainer: {
		flex: 1,
		justifyContent: 'center'
	},
  titleText: {
    fontSize: 24,
    color: colors.darkBlack,
    fontFamily: 'Karla-Bold',
    textAlign: 'center',
    marginVertical: 8,
		marginHorizontal: 30
  },
	subTitleText: {
		fontSize: 14,
    color: colors.darkGray,
    fontFamily: 'Karla-Regular',
    textAlign: 'center',
    marginHorizontal: 30,
    marginBottom: 22
	},
  buttonStyle: {
    marginTop: 40,
    marginBottom: 20,
    alignSelf: 'center'
  },
  msgText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.darkGray,
    fontFamily: 'Karla-Regular',
		marginTop: 10,
		marginBottom: 25
  },
  signupText: {
    fontSize: 16,
    color: colors.red,
    fontFamily: 'Karla-Bold'
  },
	backIconWrapper: {
		height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
		marginTop: 10,
		marginLeft: 10
	},
  iconLeft: {
    position: 'absolute',
		top: 13,
    left: 5,
    color: colors.darkBlack
  }
})
