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
	scrollView: {
		flex: 1,
		marginTop: -25,
		backgroundColor: colors.paleGray
	},
	infoWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.primary,
		paddingTop: 5,
		paddingHorizontal: 24,
		paddingBottom: 50
	},
	imageOuterWrapper: {
		height: windowWidth * 0.24,
		width: windowWidth * 0.24,
		borderRadius: (windowWidth * 0.24) / 2,
		backgroundColor: colors.white,
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden'
	},
	imageInnerWrapper: {
		height: (windowWidth * 0.24) - 4,
		width: (windowWidth * 0.24) - 4,
		borderRadius: ((windowWidth * 0.24) - 4) / 2,
		backgroundColor: colors.paleGray,
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden'
	},
	profileImage: {
		height: (windowWidth * 0.24) - 4,
		width: (windowWidth * 0.24) - 4,
		borderRadius: ((windowWidth * 0.24) - 4) / 2
	},
	profileIcon: {
		height: 50,
		width: 40
	},
	rightWrapper: {
		marginLeft: 15,
		width: windowWidth - 165
	},
	nameText: {
		fontSize: 18,
		lineHeight: 20,
		fontFamily: 'Karla-Bold',
		color: colors.white
	},
	textStyle: {
		fontSize: 16,
		lineHeight: 20,
		fontFamily: 'Karla-Regular',
		color: colors.white,
		marginTop: 4
	},
	editIconWrapper: {
		height: 34,
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
		position: 'absolute',
		top: 5,
		right: 15
	},
	optionsOuterWrapper: {
		flex: 1,
		backgroundColor: colors.paleGray,
		marginTop: -25,
		borderTopLeftRadius: 25,
		borderTopRightRadius: 25
	},
	optionsInnerWrapper: {
		flex: 1,
		backgroundColor: colors.white,
		borderTopLeftRadius: 25,
		borderTopRightRadius: 25,
		marginTop: 15,
		marginHorizontal: 15
	},
	optionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24
  },
	optionTextWrapper: {
		width: windowWidth - 120,
		marginLeft: 24,
		paddingVertical: 20,
		borderBottomWidth: 1,
		borderBottomColor: colors.paleGray
	},
  optionText: {
    fontSize: 16,
    color: colors.darkBlack,
		fontFamily: 'Karla-Regular'
  }
})
