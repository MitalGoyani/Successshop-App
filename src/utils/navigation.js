export const getActiveRouteName = (navigationState) => {
	if (!navigationState) {
		return null;
	}

  if(navigationState.routes) {
  	const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
  	if (route && route.routes && route.routes.length > 0) {
  		return getActiveRouteName(route);
  	}
  	return route && route.routeName ? route.routeName : null;
  } else {
    return navigationState.routeName ? navigationState.routeName : null;
  }
}
