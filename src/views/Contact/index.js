import React from 'react';
import { View, Text, TouchableOpacity, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import { compose, graphql } from "react-apollo";
import apolloClient from '../../graphql/client';
import { ADD_CONTACT_REQUEST } from '../../graphql/mutations';
import styles from './styles';
import { colors } from '../../constants/colors';
import RCTextInput from '../../containers/TextInput';
import Button from '../../containers/Button';
import WrongInputWarning from '../../containers/WrongInputWarning';
import Toast from '../../containers/Toast';
import { validateEmail, validateMobile } from '../../utils/validators';
import { CustomIcon } from '../../utils/Icons';

class Contact extends React.Component {
  constructor(props) {
		super(props);
    this.state = {
      name: '',
      mobile: '',
      email: '',
      subject: '',
      message: '',
      saving: false,
      errorText: null
    }
    this.focusListener = this.props.navigation.addListener('willFocus', async () => {
      this.setState({ name: '', mobile: '', email: '', subject: '', message: '', saving: false, errorText: null })
    })
	}

  componentWillUnmount() {
    this.focusListener.remove()
  }

  valid = () => {
		const {
		    name, mobile, email, subject, message
		} = this.state;

    if (name.trim() === '') {
      this.setState({ errorText: 'Veuillez entrer le nom' })
      this.nameInput.focus();
      return false
    }
    if (mobile.trim() !== '' && !validateMobile(mobile)) {
      this.setState({ errorText: mobile.trim() === '' ? 'Veuillez entrer le numéro de téléphone' : 'Entrez un numéro de téléphone valide' })
      this.mobileInput.focus();
      return false
    }
    if (!validateEmail(email)) {
      this.setState({ errorText: email.trim() === '' ? 'Veuillez saisir un e-mail' : 'Entrez une adresse email valide' })
      this.emailInput.focus();
      return false
    }
    if (subject.trim() === '') {
      this.setState({ errorText: 'Veuillez entrer le sujet' })
      this.subjectInput.focus();
      return false
    }
    if (message.trim() === '') {
      this.setState({ errorText: 'Veuillez entrer un message' })
      this.messageInput.focus();
      return false
    }
    return true
	}

  submit = async() => {
		if (!this.valid()) {
			return;
		}
		this.setState({ saving: true, errorText: null });
		Keyboard.dismiss();

		const {
		   name, email, mobile, subject, message
		} = this.state;

    try {
      const result = await this.props.addContactRequest({
        variables: {
          name, email, mobile, subject, message
        }
      });
      if(result && result.data && result.data.addContactRequest) {
        this.refs.toast.show('Demande de contact envoyée avec succès');
        this.setState({ name: '', mobile: '', email: '', subject: '', message: '', errorText: null })
      }
    } catch (error) {
      this.setState({ errorText: `Impossible d'envoyer le message... quelque chose s'est mal passé` })
      this.scroll.scrollTo({ x: 0, y: 0, animated: true })
    }
    this.setState({ saving: false });
	}

  render() {
    const { navigation } = this.props
    const { errorText, name, email, mobile, subject, message } = this.state

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.keyboardAvoidingContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
          innerRef={ref => { this.scroll = ref }}
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
              <Text style={styles.titleText}>Comment pouvons-nous vous aider!</Text>
              <Text style={styles.subTitleText}>Si vous avez des questions, veuillez remplir le formulaire et nous vous répondrons dans les plus brefs délais..</Text>
              {errorText && (
                <WrongInputWarning warningText={errorText} />
              )}
              <RCTextInput
                inputRef={(e) => { this.nameInput = e; }}
                title={'Nom'}
                value={name}
                returnKeyType={'next'}
                iconLeft={'user'}
                onChangeText={name => this.setState({ name })}
                onSubmitEditing={() => { this.mobileInput.focus(); }}
              />
              <RCTextInput
                inputRef={(e) => { this.mobileInput = e; }}
                title={'Numéro de téléphone'}
                value={mobile}
                returnKeyType={'next'}
                iconLeft={'smartphone'}
                keyboardType={'phone-pad'}
                onChangeText={mobile => this.setState({ mobile })}
                onSubmitEditing={() => { this.emailInput.focus(); }}
              />
              <RCTextInput
                inputRef={(e) => { this.emailInput = e; }}
                title={'E-mail'}
                value={email}
                returnKeyType={'next'}
                iconLeft={'email'}
                keyboardType={'email-address'}
                onChangeText={email => this.setState({ email })}
                onSubmitEditing={() => { this.subjectInput.focus(); }}
              />
              <RCTextInput
                inputRef={(e) => { this.subjectInput = e; }}
                title={'Sujette'}
                value={subject}
                returnKeyType={'next'}
                iconLeft={'padlock'}
                onChangeText={subject => this.setState({ subject })}
                onSubmitEditing={() => { this.messageInput.focus(); }}
                renderIconLeft={() => <IconMaterialCommunity name={'file-document-outline'} size={17} style={styles.iconLeft} />}
              />
              <RCTextInput
                inputRef={(e) => { this.messageInput = e; }}
                title={'Message'}
                value={message}
                returnKeyType={'go'}
                iconLeft={'padlock'}
                onChangeText={message => this.setState({ message })}
                multiline={true}
                textAlignVertical={'top'}
                renderIconLeft={() => <IconMaterialCommunity name={'message-text-outline'} size={15} style={styles.iconLeft} />}
                inputStyle={{ height: 70, marginTop: 5,  paddingBottom: 8 }}
              />
              <Button
                title={'Nous faire parvenir'}
                style={styles.buttonStyle}
                loading={this.state.saving}
                onPress={() => this.submit()}
              />
          </View>
        </KeyboardAwareScrollView>
        <Toast ref={'toast'} position={'center'} positionValue={80} />
      </View>
    );
  }
}

export default compose(
  graphql(ADD_CONTACT_REQUEST, { name: 'addContactRequest' })
)(Contact);
