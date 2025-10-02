import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  spinnerStyle: {
    position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.white
  },
  webViewWrapper: {
    marginTop: -25,
    flex: 1,
    backgroundColor: colors.white
  },
  webView: {
    flex: 1
  }
})
