import { StyleSheet, Platform } from 'react-native';
import sharedStyles from '../../styles';
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
  addAddressWrapper: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: colors.paleGray,
    borderRadius: 10,
    marginHorizontal: 24,
    marginVertical: 24
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
    flexDirection: 'row',
    padding: 15,
    backgroundColor: colors.paleGray,
    borderRadius: 10,
    marginTop: 20
  },
  selectedAddressWrapper: {
    backgroundColor: colors.white,
    ...sharedStyles.shadow
  },
  addressInfoWrapper: {
    width: windowWidth - 118
  },
  radioWrapper: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15
  },
  radioInnerWrapper: {
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: colors.primary
  },
  rightWrapper: {
    width: windowWidth - 116
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
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
  buttonStyle: {
    marginBottom: 20
  }
})
