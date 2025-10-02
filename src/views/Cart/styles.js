import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../constants/colors';
import { windowWidth } from '../../utils/deviceInfo';

export default StyleSheet.create({
	emptyWrapper: {
		flex: 1,
		backgroundColor: colors.paleGray,
		alignItems: 'center',
		justifyContent: 'center'
	},
	emptyCartIcon: {
		position: 'absolute',
		top: 30,
		left: 25
	},
	emptyText: {
		fontSize: 16,
		color: colors.darkGray,
		fontFamily: 'Karla-Regular',
		marginTop: 15,
		marginBottom: 30
	},
	scrollViewStyle: {
		flex: 1,
		flexGrow: 1,
		borderTopLeftRadius: 25,
		borderTopRightRadius: 25,
		marginTop: -25,
		backgroundColor: colors.paleGray
	},
	scrollViewContainerStyle: {
		flexGrow: 1
	},
	spinnerWrapper: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	innerWrapper: {
		flex: 1,
		justifyContent: 'space-between'
	},
	summaryWrapper: {
		marginHorizontal: 24,
		marginBottom: 24,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	summaryTitle: {
		fontSize: 16,
		color: colors.darkBlack,
		fontFamily: 'Karla-Regular',
		lineHeight: 20
	},
	discountText: {
		fontSize: 14,
		color: colors.darkGray,
		fontFamily: 'Karla-Regular'
	},
	payAmountWrapper: {
		alignItems: 'flex-end'
	},
	payAmountText: {
		fontSize: 20,
		lineHeight: 20,
		color: colors.darkBlack,
		fontFamily: 'Karla-Bold'
	},
	bottomWrapper: {
		paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
		alignItems: 'center'
	},
	errorToast: {
    backgroundColor: colors.red
  },
  errorToastText: {
    color: colors.white
  },
	continueButtonStyle: {
		borderRadius: 5
	},
	continueButtonTextStyle: {
		textTransform: 'capitalize'
	}
})
