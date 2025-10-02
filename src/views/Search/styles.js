import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { windowWidth } from '../../utils/deviceInfo';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.plaeGray
  },
  headerView: {
    flexDirection: 'row',
    zIndex: 1,
    width: '100%',
    height: 50,
    backgroundColor: colors.white,
    shadowColor: colors.darkBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    shadowOpacity: 0.1,
    elevation: 3
  },
  iconWrapper: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  serchInputStyle: {
  	alignSelf: 'center',
    width: windowWidth - 100,
    height: 50,
    backgroundColor: 'transparent',
    fontSize: 16,
    lineHeight: 18,
    fontFamily: 'Karla-Regular',
    color: colors.darkBlack
  },
  historyWrapper: {
    flex: 1,
    marginTop: 20,
    marginHorizontal: 20
  },
  recentSearchText: {
    fontSize: 16,
    lineHeight: 18,
    fontFamily: 'Karla-Bold',
    color: colors.darkBlack,
    marginBottom: 10
  },
  searchHistoryView: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: colors.white,
    alignItems: 'center'
  },
  historyTextWrapper: {
    marginLeft: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.paleGray,
    height: '100%',
    width: windowWidth - 60,
    justifyContent: 'center'
  },
  historyText: {
    fontSize: 16,
    lineHeight: 18,
    fontFamily: 'Karla-Regular',
    color: colors.darkGray
  }
})
