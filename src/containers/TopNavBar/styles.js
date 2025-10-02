import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { windowWidth } from '../../utils/deviceInfo';

const header = {
	flexDirection: 'row',
	width: '100%',
	height: 80,
	alignItems: 'center',
	backgroundColor: colors.primary
}

export default StyleSheet.create({
	headerWrapper: {
		backgroundColor: colors.primary,
		paddingBottom: 25
	},
	headerTopWrapper: {
    ...header,
		justifyContent: 'space-between',
    paddingHorizontal: 22
	},
	headerStyle: {
		...header,
		height: 70,
		paddingLeft: 12,
		paddingRight: 10,
		justifyContent: 'space-between'
	},
	logo: {
		height: 40,
		width: 100,
		marginLeft: 18
	},
	badgeWrapper: {
    position: 'absolute',
    left: 18,
    top: 9,
    backgroundColor: colors.red,
    height: 20,
    width: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeWrapperStyle: {
    height: 26,
    width: 26,
    borderRadius: 13,
		top: 6
  },
	badgeText: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Karla-Regular'
  },
  iconContainer: {
    flexDirection: 'row',
		alignItems: 'center'
  },
  iconWrapper: {
    height: 60,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center'
  },
	searchWrapper: {
		marginHorizontal: 15,
		marginBottom: 40,
		height: 50,
		borderRadius: 10,
		paddingLeft: 50,
    paddingRight: 10,
		backgroundColor: colors.white,
		justifyContent: 'center'
	},
	searchText: {
		fontSize: 14,
    color: colors.placeholder,
    fontFamily: 'Karla-Regular'
	},
	searchIcon: {
		position: 'absolute',
		top: 15,
		left: 20,
		right: 10,
		color: colors.placeholder
	},
	backIconWrapper: {
		height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center'
	},
	titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
	titleText: {
		fontSize: 20,
		color: colors.white,
		fontFamily: 'Karla-Bold',
		width: '100%',
    textAlign: 'center',
		textTransform: 'capitalize',
		position: 'absolute',
		lineHeight: 24
	},
	subTitleText: {
		fontSize: 16,
		color: colors.white,
		fontFamily: 'Karla-Regular',
		lineHeight: 24
	}
})
