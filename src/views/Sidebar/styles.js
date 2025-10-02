import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  contentContainerStyle: {
    flexGrow: 1
  },
  spinnerStyle: {
    backgroundColor: colors.white
  },
  logoWrapper: {
    marginTop: 45,
    marginBottom: 30,
    alignItems: 'center'
  },
  logo: {
		height: 50,
		width: 157
	},
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 12,
    marginVertical: 5
  },
  menuWrapper: {
    paddingLeft: 20
  },
  menuItemText: {
    fontSize: 16,
    color: colors.darkBlack,
    marginLeft: 25,
    fontFamily: 'Karla-Regular'
  },
  otherWrapper: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.paleGray,
    paddingBottom: 30
  },
  otherText: {
    fontSize: 16,
    color: colors.darkGray,
    fontFamily: 'Karla-Bold',
    paddingTop: 20,
    paddingLeft: 30,
    marginBottom: 12
  },
  otherItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 8,
    marginVertical: 4
  },
  otherItemText: {
    fontSize: 16,
    color: colors.darkBlack,
    fontFamily: 'Karla-Regular'
  }
})
