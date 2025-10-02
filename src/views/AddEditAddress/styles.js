import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../constants/colors';
import { windowWidth } from '../../utils/deviceInfo';

export default StyleSheet.create({
  scrollViewStyle: {
		flex: 1,
		flexGrow: 1,
		borderTopLeftRadius: 25,
		borderTopRightRadius: 25,
		marginTop: -25,
		backgroundColor: colors.white
	},
  keyboardAvoidingContainer: {
    flexGrow: 1,
    paddingTop: 20,
    justifyContent: 'space-between'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24
  },
  nameInput: {
    width: (windowWidth - 68) / 2,
    marginHorizontal: 0
  },
  titleText: {
    fontSize: 14,
		color: colors.darkGray,
		fontFamily: 'Karla-Regular',
		lineHeight: 24
  },
  buttonStyle: {
    marginVertical: 15
  },
  pickerWrapper: {
    marginHorizontal: 24
  },
  pickerTitleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})
