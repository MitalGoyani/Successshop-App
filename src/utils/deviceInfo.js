import { Platform, Dimensions } from 'react-native';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = !isIOS;
export const windowWidth = Dimensions.get('window').width
export const windowHeight = Dimensions.get('window').height
export const isIphoneX = isIOS && !Platform.isPad && !Platform.isTVOS && ((windowHeight === 812 || windowWidth === 812) || (windowHeight === 896 || windowWidth === 896))

export const SLIDER_ITEM_WIDTH = windowWidth - ((windowWidth * 0.32) - 15)
export const SLIDER_IMAGE_WIDTH = windowWidth * 0.68
export const SLIDER_IMAGE_HEIGHT = (windowWidth * 0.68) / 1.8
