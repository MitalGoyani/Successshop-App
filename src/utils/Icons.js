import { createIconSetFromIcoMoon } from 'react-native-vector-icons';

import icoMoonConfig from './selection.json';

const CustomIcon = createIconSetFromIcoMoon(
	icoMoonConfig,
	'Icomoon',
	'Icomoon.ttf'
);

export { CustomIcon };
