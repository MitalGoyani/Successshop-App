import React from 'react';
import { View, Text, TextInput, Keyboard, TouchableOpacity, Image } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import RCTextInput from '../../containers/TextInput';
import { AUTH_USER, SOCIAL_LOGIN } from '../../graphql/queries';
import apolloClient from '../../graphql/client';
import { connect } from 'react-redux';
import styles from './styles';
import { colors } from '../../constants/colors';
import { getCart } from '../../actions/cart';
import { loginSuccess } from '../../actions/login';
import Spinner from '../../containers/Spinner';
import Button from '../../containers/Button';
import Toast from '../../containers/Toast';
import WrongInputWarning from '../../containers/WrongInputWarning';
import FacebookAuthWebView from '../../containers/FacebookAuthWebView';
import { validateEmail } from '../../utils/validators';
import { setData, getData, deleteData } from '../../utils/storage';
import { images } from '../../../assets';
import config from '../../../config';
import { CustomIcon } from '../../utils/Icons';

class Login extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        email: '',
        password: '',
        loading: false,
        errorText: null,
        isLoading: false,
        isFacebookAuthWebView: false,
        isFacebookLogin: false,
        isGoogleLogin: false
      };
      this.focusListener = this.props.navigation.addListener('willFocus', async () => {
        this.setState({ isLoading: true })
        const token = JSON.parse(await getData('token'))
        if(token) this.props.navigation.navigate('Profile')
        this.setState({ isLoading: false })
      })
      this.configureGoogleSignIn()
  };

  configureGoogleSignIn = () => {
    const webClientId = config && config.google && config.google.webClientId ? config.google.webClientId : ''
    const iosClientId = config && config.google && config.google.iosClientId ? config.google.iosClientId : ''
    GoogleSignin.configure({
      webClientId: webClientId,
      iosClientId: iosClientId,
      offlineAccess: true
    });
  }

  valid = () => {
		const {
		    email, password
		} = this.state;

    if (!validateEmail(email)) {
      const errorText = email.trim() === '' ? 'Veuillez saisir un e-mail' : 'Entrez une adresse email valide'
      this.setState({ errorText })
      this.emailInput.focus();
      return false
    }
    if (password.trim() === '') {
      this.setState({ errorText: 'Veuillez entrer le mot de passe'  })
      this.passwordInput.focus();
      return false
    }

    return true
	}

  submit = async () => {
    if(this.valid()) {
      this.setState({ loading: true })
      Keyboard.dismiss()
      const credentials = {
        email: this.state.email,
        password: this.state.password
      }
      const tempUserId = JSON.parse(await getData('tempUserId'))
      if(tempUserId) credentials['userId'] = tempUserId
      try {
        const { data } = await apolloClient.query({
          query: AUTH_USER,
          variables: {
            ...credentials
          }
        });
        if(data && data.authUser && data.authUser._id) await this.onLoginSuccess(data.authUser)
      } catch (error) {
        try {
          this.setState({ errorText: error.graphQLErrors[0].message });
        } catch (e) {
          this.setState({ errorText: `Impossible de se connecter... quelque chose s'est mal passé` });
        }
      }
      this.setState({ loading: false })
    }
  }

  openFaceBookAuthWebView = () => {
    this.setState({ isFacebookAuthWebView: true })
  }

  closeFacebookAuthWebView = () => {
    this.setState({ isFacebookAuthWebView: false })
  }

  handleFacebookLogin = async (token) => {
    try {
      this.setState({ isFacebookLogin: true })
      if(token) {
        try {
          const args = { token, type: 'facebook' }
          const tempUserId = JSON.parse(await getData('tempUserId'))
          if(tempUserId) args['userId'] = tempUserId

          const res = await apolloClient.query({
            query: SOCIAL_LOGIN,
            variables: {
              ...args
            }
          });
          if(res && res.data && res.data.socialLogin && res.data.socialLogin._id) this.onLoginSuccess(res.data.socialLogin)
          else this.refs.errorToast.show(`Impossible de se connecter avec Facebook... quelque chose s'est mal passé`)
        } catch (error) {
          this.refs.errorToast.show(`Impossible de se connecter avec Facebook... quelque chose s'est mal passé`)
        }
      } else {
        this.refs.errorToast.show(`Impossible de se connecter avec Facebook... quelque chose s'est mal passé`)
      }
    } catch (error) {
      this.refs.errorToast.show(`Impossible de se connecter avec Facebook... quelque chose s'est mal passé`)
    }
    this.setState({ isFacebookAuthWebView: false, isFacebookLogin: false })
  }

  handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const data = await GoogleSignin.signIn();
      if(data && data.idToken) {
        this.setState({ isGoogleLogin: true })
        try {
          const args = { token: data.idToken, type: 'google' }
          const tempUserId = JSON.parse(await getData('tempUserId'))
          if(tempUserId) args['userId'] = tempUserId

          const res = await apolloClient.query({
            query: SOCIAL_LOGIN,
            variables: {
              ...args
            }
          });
          if(res && res.data && res.data.socialLogin && res.data.socialLogin._id) this.onLoginSuccess(res.data.socialLogin)
          else this.refs.errorToast.show(`Impossible de se connecter avec Google... quelque chose s'est mal passé`)
        } catch (error) {
          this.refs.errorToast.show(`Impossible de se connecter avec Google... quelque chose s'est mal passé`)
        }
        this.setState({ isGoogleLogin: false })
      } else {
        this.refs.errorToast.show(`Impossible de se connecter avec Google... quelque chose s'est mal passé`)
      }
    } catch (error) {
      if (error.code !== statusCodes.SIGN_IN_CANCELLED || error.code === statusCodes.IN_PROGRESS) {
        this.refs.errorToast.show(`Impossible de se connecter avec Google... quelque chose s'est mal passé`)
      }
    }
  }

  onLoginSuccess = async (data) => {
    const { params } = this.props.navigation.state
    await setData('token', data.token)
    await this.props.loginSuccess(data)
    await deleteData('tempUserId')
    await this.props.getCart()
    if(params && params.from && params.from === 'cartScreen') {
      this.props.navigation.navigate('Cart')
    } else if(params && params.from && params.from === 'buyNow' && params.product && params.product.productId) {
      this.props.navigation.dispatch(StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'Main',
            action: NavigationActions.navigate({
              routeName: 'SelectAddress',
              params: { product: params.product }
            })
          })
        ]
      }))
    } else this.props.navigation.navigate('Home')
  }

  render() {
    const { email, password, isLoading, errorText, isFacebookAuthWebView, loading, isFacebookLogin, isGoogleLogin } = this.state
    const { navigation } = this.props

    if(isLoading) return <Spinner />
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
  				contentContainerStyle={styles.keyboardAvoidingContainer}
  				bounces={false}
          innerRef={ref => { this.scroll = ref }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'always'}
          enableOnAndroid={false}
  			>
          <TouchableOpacity
            style={styles.backIconWrapper}
            activeOpacity={0.4}
            onPress={() => navigation.goBack()}
          >
            <CustomIcon name={'left-arrow'} size={16} color={colors.darkBlack} />
          </TouchableOpacity>
          <View style={styles.innerContainer}>
            <Image source={images.login} style={styles.loginImg} resizeMode={'contain'} />
            <Text style={styles.titleText}>Connectez-vous</Text>
            <Text style={styles.subTitleText}>Content de te revoir!</Text>
            {errorText && (
              <WrongInputWarning warningText={errorText} />
            )}
            <RCTextInput
              inputRef={(e) => { this.emailInput = e; }}
              title={'E-mail'}
              value={email}
              returnKeyType={'next'}
              iconLeft={'email'}
              keyboardType={'email-address'}
              onChangeText={email => this.setState({ email })}
              onSubmitEditing={() => { this.passwordInput.focus(); }}
            />
            <RCTextInput
              inputRef={(e) => { this.passwordInput = e; }}
              title={'Mot de passe'}
              secureTextEntry={true}
              value={password}
              returnKeyType={'go'}
              iconLeft={'padlock'}
              onChangeText={password => this.setState({ password })}
              onSubmitEditing={() => this.submit()}
            />
            <Button
              title={`s'identifier`}
              onPress={() => this.submit()}
              loading={loading}
              disabled={isFacebookLogin || isGoogleLogin}
              style={styles.buttonStyle}
            />
            <View style={styles.socialWrapper}>
              <View  style={styles.orWrapper}>
                <Text style={styles.orText}>ou alors</Text>
              </View>
              <View style={styles.socialBtnWrapper}>
                <Button
                  title={'Facebook'}
                  onPress={() => this.openFaceBookAuthWebView()}
                  style={styles.facebookButtonStyle}
                  textStyle={styles.socialBtnText}
                  iconLeft={'facebook'}
                  loading={isFacebookLogin}
                  disabled={loading || isGoogleLogin}
                />
                <Button
                  title={'Google'}
                  onPress={() => this.handleGoogleLogin()}
                  style={styles.GoogleButtonStyle}
                  textStyle={styles.socialBtnText}
                  iconLeft={'google'}
                  loading={isGoogleLogin}
                  disabled={loading || isFacebookLogin}
                />
              </View>
            </View>
            <Text style={styles.msgText} onPress={() => navigation.navigate('ForgotPassword')}>Mot de passe oublié?</Text>
            <Text style={styles.msgText}>Vous n'avez pas de compte? <Text style={styles.signupText} onPress={() => navigation.navigate('SignUp')}>S'inscrire</Text></Text>
            </View>
        </KeyboardAwareScrollView>
        <Toast
          ref={'errorToast'}
          position={'center'}
          positionValue={150}
          style={styles.errorToast}
          textStyle={styles.errorToastText}
        />
        {isFacebookAuthWebView &&
          <FacebookAuthWebView
            isVisible={isFacebookAuthWebView}
            onClosed={() => this.closeFacebookAuthWebView()}
            handleFacebookLogin={(token) => this.handleFacebookLogin(token)}
          />
        }
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loginSuccess: (data) => dispatch(loginSuccess(data)),
  getCart: () => dispatch(getCart())
});

export default connect(null, mapDispatchToProps)(Login);
