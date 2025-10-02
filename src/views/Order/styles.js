import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { windowHeight, windowWidth } from '../../utils/deviceInfo';

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.paleGray
	},
	ordersWrapper: {
		flex: 1,
		marginTop: -25,
		borderRadius: 25,
		backgroundColor: colors.paleGray
	},
	statusBtnWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 15,
		marginHorizontal: 15
	},
	statusBtn: {
		height: 40,
		width: 'auto',
		paddingHorizontal: 12,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 10
	},
	statusBtnText: {
		fontSize: 16,
		fontFamily: 'Karla-Regular',
		textTransform: 'capitalize'
	},
	orderInnerWrapper: {
		flexShrink: 1
	},
	flatList: {
		borderRadius: 15,
		margin: 15,
		backgroundColor: colors.white
	},
	orderWrapper: {
		marginHorizontal: 16,
    paddingVertical: 16,
		backgroundColor: colors.white,
		borderBottomColor: colors.paleGray
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	numberText: {
		fontSize: 16,
		color: colors.darkBlack,
		fontFamily: 'Karla-Bold'
	},
	textStyle: {
		fontSize: 14,
		color: colors.darkGray,
		fontFamily: 'Karla-Regular'
	},
	infoWrapper: {
		marginTop: 8
	},
	infoText: {
		color: colors.darkBlack
	},
	btnWrapper: {
		flexDirection: 'row'
	},
	detailButtonStyle: {
		height: 'auto',
		width: 'auto',
		paddingVertical: 6,
		paddingHorizontal: 18,
		borderRadius: 5,
		marginTop: 14,
		alignSelf: 'flex-start'
	},
	cancelButtonStyle: {
		backgroundColor: colors.red,
		marginLeft: 10
	},
	detailButtonText: {
		fontSize: 14,
		textTransform: 'capitalize'
	},
	loadingWrapper: {
		marginBottom: 15
	},
	emptyWrapper: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	emptyText: {
		fontSize: 16,
		color: colors.darkGray,
		fontFamily: 'Karla-Regular',
		textAlign: 'center',
		marginTop: 40
	},
	errorToast: {
    backgroundColor: colors.red
  },
  errorToastText: {
    color: colors.white
  },
})
