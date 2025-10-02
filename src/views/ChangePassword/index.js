import React from 'react';
import { View, Text, TouchableOpacity, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { compose, graphql } from "react-apollo";
import apolloClient from '../../graphql/client';
import { CHANGE_PASSWORD } from '../../graphql/mutations';
import styles from './styles';
import { colors } from '../../constants/colors';
import RCTextInput from '../../containers/TextInput';
import Button from '../../containers/Button';
import WrongInputWarning from '../../containers/WrongInputWarning';
import Toast from '../../containers/Toast';
import { validatePassword } from '../../utils/validators';
import { CustomIcon } from '../../utils/Icons';

class ChangePassword extends React.Component {
  constructor(props) {
		super(props);
    this.state = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      saving: false,
      errorText: null
    }
    this.focusListener = this.props.navigation.addListener('willFocus', async () => {
      this.setState({ currentPassword: '', newPassword: '', confirmPassword: '', saving: false, errorText: null })
    })
	}

  componentWillUnmount() {
    this.focusListener.remove()
  }

  valid = () => {
		const {
		    currentPassword, newPassword, confirmPassword
		} = this.state;

    if (currentPassword.trim() === '') {
      this.setState({ errorText: 'Veuillez entrer le mot de passe actuel' })
      this.currentPasswordInput.focus();
      return false
    }

    if (!validatePassword(newPassword)) {
      const errorText = newPassword.trim() === '' ? 'Veuillez saisir un nouveau mot de passe' : `Entrez un nouveau mot de passe d'au moins six caractères`
      this.setState({ errorText })
      this.newPasswordInput.focus();
      return false
    }

    if (confirmPassword.trim() === '' || newPassword !== confirmPassword) {
      const errorText = confirmPassword.trim() === '' ? 'Veuillez saisir le mot de passe de confirmation' : 'Le nouveau mot de passe et le mot de passe de confirmation ne correspondent pas'
      this.setState({ errorText })
      this.confirmPasswordInput.focus();
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
		   currentPassword, newPassword
		} = this.state;

    try {
      const result = await this.props.changePassword({
        variables: {
          currentPassword, newPassword
        }
      });
      if(result && result.data && result.data.changePassword) {
        this.refs.toast.show('Le mot de passe a été changé avec succès');
        this.setState({ currentPassword: '', newPassword: '', confirmPassword: '', errorText: null })
      }
    } catch (error) {
      try {
        this.setState({ errorText: error.graphQLErrors[0].message })
      } catch (e) {
        this.setState({ errorText: `Impossible de changer le mot de passe... quelque chose s'est mal passé` })
      }
      this.scroll.scrollTo({ x: 0, y: 0, animated: true })
    }
    this.setState({ saving: false });
	}

  render() {
    const { navigation } = this.props
    const { errorText, currentPassword, newPassword, confirmPassword } = this.state

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
              <Text style={styles.titleText}>Changer le mot de passe</Text>
              {errorText && (
                <WrongInputWarning warningText={errorText} />
              )}
              <RCTextInput
                inputRef={(e) => this.currentPasswordInput = e}
                secureTextEntry={true}
                title={'Mot de passe actuel'}
                value={currentPassword}
                returnKeyType={'next'}
                iconLeft={'padlock'}
                onChangeText={currentPassword => this.setState({ currentPassword })}
                onSubmitEditing={() => this.newPasswordInput.focus()}
              />
              <RCTextInput
                inputRef={(e) => this.newPasswordInput = e}
                secureTextEntry={true}
                title={'nouveau mot de passe'}
                value={newPassword}
                returnKeyType={'next'}
                iconLeft={'padlock'}
                onChangeText={newPassword => this.setState({ newPassword })}
                onSubmitEditing={() => this.confirmPasswordInput.focus()}
              />
              <RCTextInput
                inputRef={(e) => this.confirmPasswordInput = e}
                secureTextEntry={true}
                title={'Confirmez le mot de passe'}
                value={confirmPassword}
                returnKeyType={'go'}
                iconLeft={'padlock'}
                onChangeText={confirmPassword => this.setState({ confirmPassword })}
                onSubmitEditing={() => this.submit()}
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
  graphql(CHANGE_PASSWORD, { name: 'changePassword' })
)(ChangePassword);
