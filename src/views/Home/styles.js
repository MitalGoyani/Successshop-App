import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { windowWidth, SLIDER_IMAGE_WIDTH, SLIDER_IMAGE_HEIGHT } from '../../utils/deviceInfo';

export default StyleSheet.create({
	scrollViewWraper: {
		flex: 1,
		flexGrow: 1,
		borderTopLeftRadius: 25,
		borderTopRightRadius: 25,
		marginTop: -50,
		backgroundColor: colors.paleGray,
		overflow: 'hidden'
	},
	scrollViewContainerStyle: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	slideShowWrapper: {
    backgroundColor: colors.white,
		width: windowWidth - 30,
		marginHorizontal: 15,
		borderRadius: 25
  },
	sliderContainerStyle: {
		paddingVertical: 0,
		paddingBottom: 10
	},
	slideImageWrapper: {
		height: SLIDER_IMAGE_HEIGHT,
		width: SLIDER_IMAGE_WIDTH,
		marginTop: 15,
		marginBottom: 8,
		paddingHorizontal: 7
	},
	slideImage: {
		height: SLIDER_IMAGE_HEIGHT,
		width: SLIDER_IMAGE_WIDTH,
		borderRadius: 25
	},
	dotContainerStyle: {
		marginHorizontal: 3
	},
	dotStyle: {
		width: 6,
		height: 6
	},
	categoriesWrapper: {
		backgroundColor: colors.white,
		borderRadius: 25,
		margin: 15
	},
	flatList: {
		flex: 1,
		backgroundColor: colors.white,
		borderRadius: 25,
		paddingVertical: 15
	},
  categoryWrapper: {
    width: (windowWidth - 104) / 4,
    flexDirection: 'column',
    alignItems: 'center',
		marginHorizontal: 10
	},
	categoryImageWrapper: {
		height: (windowWidth - 120) / 4,
    width: (windowWidth - 120) / 4,
    borderRadius: ((windowWidth - 120) / 4) / 2,
		backgroundColor: colors.paleGray,
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center'
	},
  categoryImage: {
    height:  (windowWidth - 120) / 4,
    width:  (windowWidth - 120) / 4,
    borderRadius: ((windowWidth - 120) / 4) / 2
  },
  categoryName: {
		fontSize: 14,
		fontFamily: 'Karla-Bold',
		color: colors.black,
    textAlign: 'center',
    flexWrap: 'wrap',
    paddingTop: 10,
		textTransform: 'capitalize',
		lineHeight: 18
  },
	categoryText: {
		fontSize: 18,
		color: colors.lightGray,
		fontFamily: 'Karla-SemiBold',
	},
	offerBannerImage: {
		height: windowWidth * 0.35,
		width: windowWidth - 32,
		borderRadius: 25,
		marginHorizontal: 15
	},
	offerBanner2Image: {
		height: windowWidth * 0.45,
		width: windowWidth - 32,
		borderRadius: 25,
		marginHorizontal: 15
	},
	productsWrapper: {
		paddingVertical: 0
	},
	emptyMsgWrapper: {
		marginVertical: 30,
		alignItems: 'center',
		justifyContent: 'center'
	},
	emptyMsgText: {
		fontSize: 24,
		fontFamily: 'Karla-bold',
		color: colors.lightGray,
		textAlign: 'center',
		marginTop: 10
	},
	emptyMsgSubText: {
		fontSize: 16,
		fontFamily: 'Karla-Regular',
		color: colors.lightGray,
		textAlign: 'center'
	},
	emptyCategoryWrapper: {
		backgroundColor: colors.white,
		paddingVertical: 15,
		margin: 15,
		borderRadius: 25
	},
	emptyCategoryText: {
		fontSize: 14,
		fontFamily: 'Karla-Regular',
		color: colors.gray,
		textAlign: 'center'
	},
	bgPrimary: {
		backgroundColor: colors.primary
	}
})
