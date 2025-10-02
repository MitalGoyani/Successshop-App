import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../constants/colors';
import { windowWidth } from '../../utils/deviceInfo';

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.paleGray
	},
	scrollViewStyle: {
		flex: 1,
		marginTop: -25,
		borderRadius: 25,
		backgroundColor: colors.paleGray
	},
	wrapper: {
    backgroundColor: colors.white,
    borderRadius: 25,
    padding: 16,
    margin: 15
  },
  productWrapper: {
		flexDirection: 'row',
		backgroundColor: colors.white,
    borderBottomColor: colors.paleGray
	},
  imageWrapper: {
    height: windowWidth * 0.25,
		width: windowWidth * 0.25,
    backgroundColor: colors.paleGray,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden'
  },
	productImage: {
		height: windowWidth * 0.25,
		width: windowWidth * 0.25,
    borderRadius: 10
	},
	rightWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
		marginLeft: 12,
    width: windowWidth - (windowWidth * 0.25 + 75)
	},
	nameText: {
    fontSize: 16,
    color: colors.darkBlack,
    fontFamily: 'Karla-Regular',
    textTransform: 'capitalize',
    lineHeight: 20
	},
  optionsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: windowWidth - (windowWidth * 0.25 + 75),
    marginTop: 12
  },
  optionTitleText: {
    fontSize: 14,
    color: colors.darkGray,
    fontFamily: 'Karla-Regular',
    textTransform: 'capitalize'
  },
  optionValueText: {
    fontSize: 14,
    color: colors.darkBlack,
    fontFamily: 'Karla-Regular',
    textTransform: 'none'
  },
	optionBorder: {
		marginHorizontal: 10,
		height: 15,
		width: 1,
		backgroundColor: colors.darkGray
	},
  infoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12
  },
  priceText: {
    fontSize: 16,
    color: colors.primary,
    fontFamily: 'Karla-Bold',
  },
	summaryWrapper: {
		backgroundColor: colors.white,
		marginHorizontal: 15,
		marginBottom: 15,
		borderRadius: 10,
		paddingHorizontal: 15,
		paddingVertical: 5
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 6
	},
	textStyle: {
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
	colorBlack: {
		color: colors.darkBlack
	}
})
