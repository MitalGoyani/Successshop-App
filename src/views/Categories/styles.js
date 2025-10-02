import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { windowWidth } from '../../utils/deviceInfo';

export default StyleSheet.create({
	contentWrapper: {
		flex: 1,
		marginTop: -25,
		borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
		backgroundColor: colors.paleGray
	},
	flatList: {
		margin: 15,
		paddingTop: 20,
		paddingHorizontal: 5,
		backgroundColor: colors.white,
		borderRadius: 25
	},
	contentContainerStyle: {
		paddingBottom: 15
	},
	categoryWrapper: {
    width: (windowWidth - 104) / 4,
    flexDirection: 'column',
    alignItems: 'center',
		marginHorizontal: 8,
		marginBottom: 22
	},
	categoryImageWrapper: {
		height: (windowWidth - 120) / 4,
    width: (windowWidth - 120) / 4,
    borderRadius: ((windowWidth - 120) / 4) / 2,
		backgroundColor: colors.paleGray,
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center'
	},
	categoryImage: {
    height: (windowWidth - 120) / 4,
    width: (windowWidth - 120) / 4,
    borderRadius: ((windowWidth - 120) / 4) / 2
  },
	categoryName: {
		fontSize: 14,
		fontFamily: 'Karla-Bold',
		color: colors.black,
    textAlign: 'center',
    flexWrap: 'wrap',
    paddingTop: 10,
		textTransform: 'capitalize',
		lineHeight: 18
  },
	loadingWrapper: {
    marginBottom: 10,
		height: 110,
		width: '100%'
  },
	notFoundText: {
		fontSize: 16,
		fontFamily: 'Karla-Regular',
		color: colors.black,
    textAlign: 'center',
		paddingVertical: 20
	}
})
