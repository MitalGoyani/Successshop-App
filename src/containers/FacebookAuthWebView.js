import React, { Component } from 'react';
import { View, ActivityIndicator, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Modal from 'react-native-modal';
import { WebView } from 'react-native-webview';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import StatusBar from './StatusBar';
import { colors } from '../constants/colors';
import config from '../../config';
import { isIOS } from '../utils/deviceInfo';

const userAgent = isIOS
	? 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
	: 'Mozilla/5.0 (Linux; Android 6.0.1; SM-G920V Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.36';

export default class FacebookAuthWebView extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: true
        }
    }

    onNavigationStateChange = (webViewState) => {
      const url = decodeURIComponent(webViewState.url)
			if (url.indexOf('?#access_token=') != -1) {
				this.setState({ loading: true })
				var code = url.split('#access_token=')[1].split('&state')[0];
				if(code) this.props.handleFacebookLogin(code)
			}
    }

    renderWebview = () => {
      const props = this.props
      const appId = config && config.facebook && config.facebook.appId ? config.facebook.appId : ''
      const redirectUri = config && config.facebook && config.facebook.redirectUri ? config.facebook.redirectUri : ''
      const uri = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&state={st=state123abc,ds=123456789}&response_type=token`;

      return (
        <WebView
          useWebKit
          source={{ uri }}
          userAgent={userAgent}
          onNavigationStateChange={this.onNavigationStateChange}
          onLoadStart={() => {
            this.setState({ loading: true });
          }}
          onLoadEnd={() => {
            this.setState({ loading: false });
          }}
          bounces={false}
        />
      )
    }

    render() {
        const { props } = this
        const { loading } = this.state

        return (
            <Modal
              style={styles.modal}
          	  isVisible={props.isVisible}
          		onBackButtonPress={() => props.onClosed()}
          		coverScreen={true}
            >
              <StatusBar />
              <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                  <TouchableOpacity style={styles.closeContainer} activeOpacity={0.8} onPress={() => props.onClosed()}>
                    <IconAntDesign name={'closecircleo'} size={25} color={colors.white} />
                  </TouchableOpacity>
                  {this.renderWebview()}
                  {loading ? <ActivityIndicator size={'large'} style={styles.loading} color={colors.primary} /> : null }
                </View>
              </SafeAreaView>
            </Modal>
        );
    }
}

const styles =  StyleSheet.create({
	modal: {
    margin: 0
  },
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  loading: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.white
	},
	closeContainer: {
		position: 'absolute',
		zIndex: 2,
		alignSelf: 'flex-end',
		top: 8,
		right: 5
	}
})
