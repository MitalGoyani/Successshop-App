import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../constants/colors';
import { windowWidth } from '../../utils/deviceInfo';

export default StyleSheet.create({
  scrollViewWraper: {
		flex: 1,
		flexGrow: 1,
		borderTopLeftRadius: 25,
		borderTopRightRadius: 25,
		marginTop: -25,
		backgroundColor: colors.paleGray,
    overflow: 'hidden'
	},
	scrollViewContainerStyle: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
  topBarButton: {
    height: 40,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cartTotalWrapper: {
    position: 'absolute',
    left: 21,
    top: -1,
    backgroundColor: colors.red,
    height: 20,
    width: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cartTotal: {
    height: 26,
    width: 26,
    borderRadius: 13,
  },
  cartTotalText: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Karla-Regular'
  },
  infoWrapper: {
    backgroundColor: colors.white,
    borderRadius: 25,
    margin: 15,
    padding: 15
  },
  productSlideWrapper: {
    backgroundColor: colors.paleGray,
		width: windowWidth - 60,
	  borderRadius: 10,
    overflow: 'hidden'
  },
	sliderContainerStyle: {
    width: '100%',
		paddingVertical: 0,
    position: 'absolute',
    alignItems: 'center',
    bottom: 10
	},
	slideImageWrapper: {
		height: windowWidth - 60,
		width: windowWidth - 60
	},
	slideImage: {
		height: windowWidth - 60,
		width: windowWidth - 60,
		borderRadius: 10
	},
	dotContainerStyle: {
		marginHorizontal: 3
	},
	dotStyle: {
		width: 6,
		height: 6
	},
  productName: {
    fontSize: 16,
    fontFamily: 'Karla-Regular',
		color: colors.darkBlack,
    lineHeight: 20,
    marginTop: 12,
    textTransform: 'capitalize'
  },
  shortDescriptionText: {
    fontSize: 14,
    fontFamily: 'Karla-Regular',
		color: colors.darkGray,
    lineHeight: 18,
    marginTop: 4
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5
  },
  priceText: {
    fontSize: 16,
    fontFamily: 'Karla-Bold',
		color: colors.primary,
    lineHeight: 20,
    marginTop: 5
  },
  oldPriceText: {
    fontSize: 14,
    fontFamily: 'Karla-Regular',
    color: colors.darkGray,
    lineHeight: 20,
    textDecorationLine: 'line-through',
    marginLeft: 5,
    marginTop: 5
  },
  discountText: {
    fontSize: 14,
    fontFamily: 'Karla-Regular',
    color: colors.red,
    lineHeight: 16,
    paddingLeft: 12,
    marginTop: 5
  },
  taxText: {
    fontSize: 12,
    fontFamily: 'Karla-Regular',
		color: colors.darkGray,
    lineHeight: 16,
    marginTop: 5
  },
  textStyle: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Karla-Bold',
		color: colors.darkBlack
  },
  outerWrapper: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 15
  },
  collapsibleBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 15,
    paddingLeft: 15,
    paddingRight: 10
  },
  innerWrapper: {
    flex: 1,
    height: 'auto',
    paddingBottom: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  optionValuesWrapper: {
    paddingBottom: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  optionWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginLeft: 15,
    marginRight: 7
  },
  optionInner: {
    flexDirection: 'row',
    width: (windowWidth - 80) / 2,
    marginRight: 10,
    marginBottom: 8
  },
  radioWrapper: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  radioInnerWrapper: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: colors.primary
  },
  optionNameText: {
    color: colors.darkBlack,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Karla-Regular',
    maxWidth: (windowWidth - 100) / 2
  },
  optionPriceText: {
    color: colors.darkGray,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Karla-Regular'
  },
  selectOptionWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 15,
    marginRight: 7
  },
  selectOptionInner: {
    flexDirection: 'row',
    marginRight: 10,
    marginBottom: 8,
    alignItems: 'center'
  },
  selectOptionNameWrapper: {
    minWidth: 48,
    maxWidth: windowWidth - 80,
    borderRadius: 4,
    backgroundColor: colors.paleGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  selectOptionText: {
    color: colors.darkBlack,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Karla-Regular'
  },
  webView: {
    width: windowWidth - 60,
    marginHorizontal: 15
  },
  productsWrapper: {
    paddingVertical: 0,
    marginTop: 0,
    borderRadius: 10
  },
  bottomWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: 'rgba(0, 0, 0, 0.6)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 4
  },
  actionButton: {
    height: 50,
    width: (windowWidth - 80) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Karla-Regular',
		color: colors.white,
    lineHeight: 20
  },
  cartButton: {
    backgroundColor: colors.darkBlack
  },
  buyNowButton: {
    backgroundColor: colors.red
  },
  quantityWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12
  },
  quantityButton: {
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: colors.paleGray
  },
  quantityTextWrapper: {
    height: 36,
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fontRegular: {
    fontFamily: 'Karla-Regular'
  },
  errorToast: {
    backgroundColor: colors.red
  },
  errorToastText: {
    color: colors.white
  },
  textCaptitalize: {
    textTransform: 'capitalize'
  }
})
