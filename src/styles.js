import { StyleSheet, Platform } from 'react-native';
import { colors } from './constants/colors';

const shadow = {
  shadowColor: 'rgba(0, 0, 0, 0.6)',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.27,
  shadowRadius: 4.65,
  elevation: 4
}

export default StyleSheet.create({
  tabBarStyle: {
    height: 70,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderTopWidth: 0,
    ...shadow
  },
  tabStyle: {
    paddingVertical: 11
  },
	tabLabelStyle: {
    fontSize: 12,
    color: colors.gray,
    lineHeight: 20,
    fontFamily: 'Karla-Regular',
    textAlign: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: colors.paleGray,
    paddingBottom: 70
  },
  containerWrapper: {
    flex: 1,
    backgroundColor: colors.paleGray
  },
  contentWrapper: {
		flex: 1,
		height: '100%',
		width: '100%',
		borderTopLeftRadius: 25,
		borderTopRightRadius: 25,
		position: 'absolute',
		top: 70,
		backgroundColor: colors.paleGray
  },
  spinner: {
    borderTopLeftRadius: 25,
		borderTopRightRadius: 25
  },
  shadow: {
    ...shadow
  }
})
