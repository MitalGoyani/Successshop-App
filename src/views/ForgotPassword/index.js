import React from 'react';
import { View, Text, Keyboard, TouchableOpacity, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RCTextInput from '../../containers/TextInput';
import { FORGOT_PASSWORD } from '../../graphql/mutations';
import apolloClient from '../../graphql/client';
import { connect } from 'react-redux';
import styles from './styles';
import { colors } from '../../constants/colors';
import { getCart } from '../../actions/cart';
import { loginSuccess } from '../../actions/login';
// import Spinner from '../../containers/Spinner';
import Button from '../../containers/Button';
import Toast from '../../containers/Toast';
import WrongInputWarning from '../../containers/WrongInputWarning';
import { validateEmail } from '../../utils/validators';
import { setData, getData, deleteData } from '../../utils/storage';
import { images } from '../../../assets';
import { CustomIcon } from '../../utils/Icons';

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      loading: false,
      errorText: null
    };
  }

  valid = () => {
    const {email} = this.state;

    if (!validateEmail(email)) {
      const errorText = email.trim() === '' ? 'Veuillez saisir un e-mail' : 'Entrez une adresse email valide'
      this.setState({errorText});
      this.emailInput.focus();
      return false;
    }

    return true;
  }

  submit = async () => {
    if(this.valid()) {
      this.setState({ loading: true })
      Keyboard.dismiss()
      const credentials = {
        email: this.state.email
      }
      const tempUserId = JSON.parse(await getData('tempUserId'))
      if(tempUserId) credentials['userId'] = tempUserId
      try {
        const { data } = await apolloClient.mutate({
          mutation: FORGOT_PASSWORD,
          variables: {
            ...credentials
          }
        });
        if(data) {
          console.log(data, 'RESULT');
          const { navigation } = this.props
          this.refs.toast.show('E-mail envoyé avec succès');
          this.setState({ email: '', errorText: null })
          setTimeout(() => navigation.navigate('Login'), 700)
        }
      } catch (error) {
        try {
          this.setState({ errorText: error.graphQLErrors[0].message });
        } catch (e) {
          this.setState({ errorText: `Impossible de traiter... quelque chose s'est mal passé` });
        }
      }
      this.setState({ loading: false })
    }
  }

  render() {
    const { email, errorText, loading } = this.state
    const { navigation } = this.props

    // if(isLoading) return <Spinner />
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.keyboardAvoidingContainer}
          bounces={false}
          innerRef={ref => { this.scroll = ref }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'always'}
          enableOnAndroid={false}>
          <TouchableOpacity
            style={styles.backIconWrapper}
            activeOpacity={0.4}
            onPress={() => navigation.goBack()}>
            <CustomIcon name={'left-arrow'} size={16} color={colors.darkBlack} />
          </TouchableOpacity>
          <View style={styles.innerContainer}>
            <Image source={images.login} style={styles.loginImg} resizeMode={'contain'} />
            <Text style={styles.titleText}>Mot de passe oublié?</Text>
            <Text style={styles.subTitleText}>Processus pour réinitialiser votre mot de passe !</Text>
            {errorText && (<WrongInputWarning warningText={errorText} />)}
            <RCTextInput
              inputRef={(e) => { this.emailInput = e; }}
              title={'E-mail'}
              value={email}
              returnKeyType={'next'}
              iconLeft={'email'}
              keyboardType={'email-address'}
              onChangeText={email => this.setState({ email })}
              onSubmitEditing={() => this.submit()}
            />
            <Button
              title={'Nous faire parvenir'}
              onPress={() => this.submit()}
              loading={loading}
              style={styles.buttonStyle}
            />
            <Text style={styles.msgText}>Vous avez déjà un compte? <Text style={styles.signupText} onPress={() => navigation.navigate('Login')}>S'identifier</Text></Text>
          </View>
        </KeyboardAwareScrollView>
        <Toast
          ref={'toast'}
          position={'center'}
          positionValue={80}
        />
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loginSuccess: (data) => dispatch(loginSuccess(data)),
  getCart: () => dispatch(getCart())
});

export default connect(null, mapDispatchToProps)(ForgotPassword);
