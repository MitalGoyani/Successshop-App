import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white
	},
  keyboardAvoidingContainer: {
    flexGrow: 1
  },
	innerContainer: {
		flex: 1,
		justifyContent: 'center'
	},
  titleText: {
    fontSize: 24,
    color: colors.darkBlack,
    fontFamily: 'Karla-Bold',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 22
  },
	buttonStyle: {
    marginTop: 40,
    marginBottom: 20,
    alignSelf: 'center'
  },
  backIconWrapper: {
		height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
		marginTop: 10,
		marginLeft: 10
	}
})
