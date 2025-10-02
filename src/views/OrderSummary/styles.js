import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../constants/colors';
import { windowWidth } from '../../utils/deviceInfo';

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
  spinner: {
    backgroundColor: colors.white
  },
  addressWrapper: {
    marginTop: 20,
    marginHorizontal: 24,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.paleGray
  },
  addressInfoWrapper: {
    width: windowWidth - 110
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  changeText: {
    fontSize: 14,
    color: colors.red,
    fontFamily: 'Karla-Regular'
  },
  addressInnerWrapper: {
    flexDirection: 'row',
    marginTop: 18
  },
  locationIconWrapper: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c8ecf0',
    marginRight: 15
  },
  cartWrapper: {
    margin: 24
  },
  cartInnerWrapper: {
    marginTop: 20,
    marginHorizontal: 0,
    marginBottom: 0,
    padding: 0,
    borderRadius: 0
  },
  rightWrapperStyle: {
    width: windowWidth - 160
  },
  summaryWrapper: {
		marginHorizontal: 24,
		marginBottom: 20,
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
	}
})
