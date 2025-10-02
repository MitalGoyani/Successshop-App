import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../constants/colors';
import { windowWidth } from '../../utils/deviceInfo';

export default StyleSheet.create({
  contentWrapper: {
    flex: 1,
    marginTop: -25,
		borderRadius: 25,
    backgroundColor: colors.paleGray,
    overflow: 'hidden'
  },
  contentContainerStyle: {
    flexGrow: 1
  },
  productsWrapper: {
    flex: 1,
    paddingBottom: 0
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: colors.white
  },
  innerWrapper: {
    flex: 1,
    marginTop: -30,
    backgroundColor: colors.primary
  },
  scrollViewStyle: {
    backgroundColor: colors.white
  },
  modal: {
    margin: 0,
    backgroundColor: colors.primary
  },
  container: {
    flex: 1
  },
  modalContent: {
    backgroundColor: colors.white
  },
  filterWrapper: {
    paddingTop: 10,
    backgroundColor: colors.paleGray,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25
  },
  filterBtn: {
    height: 48,
    width: (windowWidth - 100) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.paleGray
  },
  activeFilterBtn: {
    borderBottomColor: colors.red
  },
  filterBtnText: {
    fontSize: 18,
    fontFamily: 'Karla-Bold',
    lineHeight: 24
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10
  },
  valueText: {
    marginLeft: 15,
    fontSize: 14,
    fontFamily: 'Karla-Regular',
    color: colors.darkBlack
  },
  checkBoxStyle: {
    height: 20,
    width: 20
  },
  filterTypeWrapper: {
    marginHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor: colors.paleGray,
    paddingVertical: 8
  },
  filterTypeInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10
  },
  applyBtn: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioWrapper: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioInnerWrapper: {
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: colors.primary
  },
  categoriesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 20,
    marginTop: 5
  },
  categoryWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: colors.white,
    marginRight: 10,
    marginTop: 10
  },
  categoryText: {
    fontSize: 16,
    fontFamily: 'Karla-Regular',
    lineHeight: 24,
    color: colors.darkBlack
  }
})
