import { StyleSheet, Platform } from 'react-native';
import sharedStyles from '../../styles';
import { colors } from '../../constants/colors';
import { windowWidth, isIphoneX } from '../../utils/deviceInfo';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  scrollViewStyle: {
		flex: 1,
		flexGrow: 1,
		borderTopLeftRadius: 25,
		borderTopRightRadius: 25,
		marginTop: -25,
		backgroundColor: colors.white
	},
  scrollViewContainerStyle: {
    flexGrow: 1
	},
  spinnerContainerStyle: {
    alignItems: 'center',
		justifyContent: 'center',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  paymentWrapper: {
    margin: 24
  },
  textStyle: {
    fontSize: 16,
    color: colors.darkBlack,
    fontFamily: 'Karla-Bold',
    lineHeight: 20
  },
  spinner: {
    backgroundColor: colors.white
  },
  paymentOptionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20
  },
  radioWrapper: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15
  },
  radioInnerWrapper: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: colors.primary
  },
  paymentOptionInner: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  paymentIconWrapper: {
    height: 50,
    width: 50,
    borderRadius: 25,
		backgroundColor: colors.paleGray,
		alignItems: 'center',
		justifyContent: 'center',
    marginRight: 15
  },
  summaryWrapper: {
		backgroundColor: colors.white,
    marginTop: 5,
		marginHorizontal: 24,
		marginBottom: 24,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    ...sharedStyles.shadow
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 6
	},
	priceText: {
		fontSize: 14,
		color: colors.darkBlack,
    fontFamily: 'Karla-Regular',
    lineHeight: 20
	},
	border: {
    marginTop: 5,
		borderTopWidth: 1,
		borderTopColor: colors.paleGray
	},
	payAmountText: {
		fontSize: 14,
		color: colors.darkBlack,
		fontFamily: 'Karla-Bold',
		paddingVertical: 4
	},
	discountText: {
		fontSize: 14,
    color: colors.red,
    fontFamily: 'Karla-Regular',
    lineHeight: 20,
    paddingBottom: 8
	},
  modal: {
    margin: 0
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white
  },
  closeContainer: {
    position: 'absolute',
    zIndex: 9,
    alignSelf: 'flex-end',
    top: isIphoneX ? 35 : 5,
    right: 5
  },
  loading: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center'
	},
  toastStyle: {
    backgroundColor: colors.red
  },
  toastTextStyle: {
    color: colors.white
  },
  successContainer: {
		flex: 1,
		backgroundColor: colors.white,
		justifyContent: 'center',
		alignItems: 'center'
	},
  orderSuccessImg: {
    maxWidth: '100%'
  },
  successText: {
    fontSize: 24,
    lineHeight: 30,
		color: colors.darkBlack,
		fontFamily: 'Karla-Regular',
		marginTop: 25
	},
	msgText: {
    fontSize: 14,
    lineHeight: 20,
		color: colors.darkGray,
		fontFamily: 'Karla-Regular',
		marginTop: 20,
    textAlign: 'center',
    maxWidth: 300
  },
	continueButtonStyle: {
		marginVertical: 25,
    borderRadius: 5,
    maxWidth: 200
	},
  continueButtonTextStyle: {
    textTransform: 'capitalize'
  },
  buttonStyle: {
    marginBottom: 24
  }
})
