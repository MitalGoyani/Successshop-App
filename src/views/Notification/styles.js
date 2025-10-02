import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { windowWidth } from '../../utils/deviceInfo';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  spinnerStyle: {
    flex: 1,
    marginTop: -25,
		borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
		backgroundColor: colors.white
  },
  flatList: {
    flexGrow: 1,
    marginTop: -25,
		borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
		backgroundColor: colors.white
  },
  contentContainerStyle: {
    paddingTop: 5,
    paddingBottom: 8
  },
  notificationView: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  iconWrapper: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: colors.primary
  },
  textViewStyle: {
    width: windowWidth - 108,
    marginLeft: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.paleGray,
    paddingVertical: 14
  },
  textStyle: {
    fontFamily: 'Karla-Bold',
    fontSize: 16,
    lineHeight: 24,
    color: colors.darkBlack
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dotStyle: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 4
  },
  dateStyle: {
    fontFamily: 'Karla-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.darkGray,
    marginBottom: 6
  },
  emptyWrapper: {
		flex: 1,
		backgroundColor: colors.white,
		alignItems: 'center',
		justifyContent: 'center',
    marginTop: -25,
		borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
	},
	emptyText: {
		fontSize: 16,
		color: colors.darkGray,
		fontFamily: 'Karla-Regular',
    marginTop: 30
	},
  loadingWrapper: {
    marginBottom: 10
  }
})
