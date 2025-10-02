import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';
import NetInfo from "@react-native-community/netinfo";
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import { AppNavigator } from './src/navigator';
import store from './src/store';
import apolloClient from './src/graphql/client';
import { GET_TEMP_USER_ID } from './src/graphql/queries';
import { getData, setData } from './src/utils/storage';
import { setToken } from './src/actions/login';
import OfflineNotice from './src/containers/OfflineNotice';
import OfflineScreen from './src/containers/OfflineScreen';
import Spinner from './src/containers/Spinner';
import StatusBar from './src/containers/StatusBar';

import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import IconSimpleLine from 'react-native-vector-icons/SimpleLineIcons';


IconFontAwesome.loadFont()
IconMaterialCommunity.loadFont()
IconMaterial.loadFont()
IconIonicons.loadFont()
AntIcon.loadFont()
IconSimpleLine.loadFont()

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isConnected: true,
			loading: true
		}
		this.setTempUser();
		console.disableYellowBox = true;
	}

	async componentWillMount() {
		await NetInfo.fetch().then(state => {
			this.setState({ isConnected: state.isConnected, loading: false })
		});
    SplashScreen.hide();
  }

	setTempUser = async () => {
    const token = JSON.parse(await getData('token'))
    if(token) {
			store.dispatch(setToken(token))
	  } else {
			const tempUserId = JSON.parse(await getData('tempUserId'))
      if(!tempUserId) {
        try {
          const result = await apolloClient.query({
            query: GET_TEMP_USER_ID,
            fetchPolicy: 'no-cache'
          })
          if (result && result.data && result.data.getTempUserId) await setData('tempUserId', result.data.getTempUserId)
        } catch (error) {
          console.log(error)
        }
      }
		}
  }

	onConnectionChanged = (isConnected) => {
    this.setState({ isConnected });
  }

	renderApp = () => {
		const { isConnected, loading } = this.state
		if(loading) return <Spinner />
		else if(!isConnected) return <OfflineScreen />
		else return <AppNavigator />
	}

  render() {
		return (
      <Provider store={store}>
        <ApolloProvider client={apolloClient}>
          <SafeAreaView style={styles.container} forceInset={{ top: 'never' }}>
						<StatusBar />
						<OfflineNotice onConnectionChanged={(isConnected) => this.onConnectionChanged(isConnected)} />
						{this.renderApp()}
          </SafeAreaView>
        </ApolloProvider>
      </Provider>
		);
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
