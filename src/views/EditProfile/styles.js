import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { windowWidth } from '../../utils/deviceInfo';

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.paleGray
	},
  spinnerStyle: {
    marginTop: -25
  },
	keyboardAvoidingView: {
		flex: 1,
		marginTop: -25,
		backgroundColor: colors.paleGray
	},
	infoWrapper: {
		alignItems: 'center',
		backgroundColor: colors.primary,
		paddingTop: 5,
		paddingHorizontal: 24,
		paddingBottom: 25,
    marginBottom: 30
	},
	imageOuterWrapper: {
		height: 100,
		width: 100,
		borderRadius: 50,
		backgroundColor: colors.white,
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden'
	},
	imageInnerWrapper: {
		height: 96,
		width: 96,
		borderRadius: 48,
		backgroundColor: colors.paleGray,
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden'
	},
	profileImage: {
    height: 96,
    width: 96,
    borderRadius: 48
	},
	profileIcon: {
		height: 50,
		width: 40
	},
  editIconWrapper: {
    height: 24,
		width: 24,
		borderRadius: 12,
		backgroundColor: colors.white,
		alignItems: 'center',
		justifyContent: 'center',
    position: 'absolute',
    bottom: 12,
    right: -2
  },
  saveBtnStyle: {
    marginVertical: 30
  },
  errorToast: {
    backgroundColor: colors.red
  },
  errorToastText: {
    color: colors.white
  }
})
