import { StyleSheet, Platform } from 'react-native';
import sharedStyles from '../../styles';
import { colors } from '../../constants/colors';
import { windowWidth } from '../../utils/deviceInfo';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paleGray
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
		flex: 1,
    alignItems: 'center',
		justifyContent: 'center',
    backgroundColor: colors.paleGray
	},
  addAddressWrapper: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: colors.white,
    borderRadius: 10,
    marginHorizontal: 24,
    marginTop: 24
  },
  addressTitleText: {
    fontSize: 16,
    color: colors.darkBlack,
    fontFamily: 'Karla-Bold',
    textTransform: 'uppercase',
    lineHeight: 20,
    marginLeft: 10
  },
  addressesWrapper: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  textStyle: {
    fontSize: 16,
    color: colors.darkBlack,
    fontFamily: 'Karla-Bold',
    lineHeight: 20
  },
  textCapitalize: {
    textTransform: 'capitalize'
  },
  addressWrapper: {
    padding: 15,
    backgroundColor: colors.white,
    borderRadius: 10,
    marginTop: 20
  },
  addressText: {
    fontSize: 16,
    color: colors.darkGray,
    fontFamily: 'Karla-Regular',
    lineHeight: 20,
    marginTop: 5
  },
  mobileText: {
    fontSize: 16,
    color: colors.darkGray,
    fontFamily: 'Karla-Regular',
    lineHeight: 20,
    marginTop: 8
  },
  menuWrapper: {
    position: 'absolute',
    top: 0,
    right: 0
  },
  menuIconWrapper: {
		height: 40,
    width: 30,
		alignItems: 'center',
    justifyContent: 'center'
	},
  menuItem: {
    height: 40
  },
	menuItemText: {
		color: colors.darkBlack,
    fontSize: 14,
    fontFamily: 'Karla-Regular'
	},
  errorToast: {
    backgroundColor: colors.red
  },
  errorToastText: {
    color: colors.white
  }
})
