import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { windowWidth } from '../../utils/deviceInfo';

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
  loginImg: {
    marginTop: 10,
    alignSelf: 'center',
    maxWidth: '100%'
  },
  titleText: {
    fontSize: 24,
    color: colors.darkBlack,
    fontFamily: 'Karla-Bold',
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 8
  },
	subTitleText: {
		fontSize: 14,
    color: colors.darkGray,
    fontFamily: 'Karla-Regular',
    textAlign: 'center',
    marginBottom: 22
	},
  buttonStyle: {
    marginTop: 15,
    marginBottom: 25,
    alignSelf: 'center'
  },
  msgText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.darkGray,
    fontFamily: 'Karla-Regular',
		marginVertical: 25
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
  orWrapper: {
    height: 1,
    width: 180,
    alignSelf: 'center',
    backgroundColor: colors.placeholder
  },
  orText: {
    fontSize: 14,
    color: colors.darkGray,
    fontFamily: 'Karla-Regular',
    paddingHorizontal: 14,
    position: 'absolute',
    top: -8,
    left: 70,
    backgroundColor: colors.white
  },
  socialBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginTop: 30
  },
  facebookButtonStyle: {
    height: 40,
    width: (windowWidth - 58) / 2,
    borderRadius: 5,
    backgroundColor: colors.facebook
  },
  GoogleButtonStyle: {
    height: 40,
    width: (windowWidth - 58) / 2,
    borderRadius: 5,
    backgroundColor: colors.google
  },
  socialBtnText: {
    textTransform: 'capitalize'
  },
	errorToast: {
    backgroundColor: colors.red
  },
  errorToastText: {
    color: colors.white
  }
})
