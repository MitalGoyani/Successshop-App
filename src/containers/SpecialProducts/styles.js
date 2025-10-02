import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { windowWidth } from '../../utils/deviceInfo';

export default StyleSheet.create({
	wrapper: {
		backgroundColor: colors.white,
    borderRadius: 25,
    margin: 15,
    paddingHorizontal: 8,
    paddingVertical: 16
	},
	titleWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginHorizontal: 8,
		marginBottom: 16,
		paddingVertical: 8,
		backgroundColor: colors.white,
		borderBottomWidth: 1,
		borderBottomColor: colors.paleGray
	},
	titleText: {
		fontSize: 16,
    fontFamily: 'Karla-Bold',
		color: colors.darkBlack,
    lineHeight: 20,
		textTransform: 'capitalize'
	},
	seeAllWrapper: {
		padding: 5,
		borderRadius: 4
	},
	seeAllText: {
		fontSize: 14,
    fontFamily: 'Karla-Regular',
		color: colors.red,
    lineHeight: 18
	},
	filterWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: 8,
		marginBottom: 10
	},
	filterBtn: {
		width: 96,
		height: 40,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: colors.darkGray,
		flexDirection: 'row',
		marginBottom: 5
	},
	filterIcon: {
		color: colors.darkBlack,
		marginRight: 8
	},
	totalText: {
		fontSize: 16,
    fontFamily: 'Karla-Regular',
		color: colors.darkGray,
    lineHeight: 24
	},
  productWrapper: {
    width: (windowWidth - 78) / 2,
    backgroundColor: colors.white,
    marginHorizontal: 8,
    marginBottom: 10
  },
  productImgWrapper: {
    height: (windowWidth - 78) / 2,
    width: (windowWidth - 78) / 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.paleGray
  },
  productImg: {
    height: (windowWidth - 78) / 2,
    width: (windowWidth - 78) / 2,
    borderRadius: 10
  },
  productInfoWrapper: {
    marginTop: 6,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  productName: {
    fontSize: 16,
    fontFamily: 'Karla-Regular',
		color: colors.darkBlack,
    lineHeight: 20,
		textTransform: 'capitalize',
  },
  priceText: {
    fontSize: 16,
    fontFamily: 'Karla-Bold',
		color: colors.primary,
    lineHeight: 20,
		marginTop: 2
  },
  oldPriceText: {
    fontSize: 14,
    fontFamily: 'Karla-Regular',
    color: colors.darkGray,
    lineHeight: 20,
    textDecorationLine: 'line-through'
  },
	offerWrapper: {
		position: 'absolute',
		top: 10,
		left: 10,
		height: 30,
		width: 30,
		backgroundColor: colors.red,
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
		borderBottomLeftRadius: 15,
		alignItems: 'center',
		justifyContent: 'center'
	},
	offerText: {
		fontSize: 12,
    color: colors.white,
    lineHeight: 16
  },
	loadingWrapper: {
		marginTop: 10,
		marginBottom: 20
	},
	emptyText: {
		fontSize: 16,
		fontFamily: 'Karla-Regular',
		color: colors.darkBlack,
		textAlign: 'center'
	}
})
