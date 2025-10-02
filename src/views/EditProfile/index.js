import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-picker';
import styles from './styles';
import { colors } from '../../constants/colors';
import { uploadToS3 } from '../../utils/aws';
import { GET_USER_DETAILS } from '../../graphql/queries';
import { EDIT_USER } from '../../graphql/mutations';
import apolloClient from '../../graphql/client';
import Spinner from '../../containers/Spinner';
import TopNavBar from '../../containers/TopNavBar/index';
import RCTextInput from '../../containers/TextInput';
import Button from '../../containers/Button';
import Toast from '../../containers/Toast';
import { validateEmail, validateMobile } from '../../utils/validators';
import { images } from '../../../assets';
import { CustomIcon } from '../../utils/Icons';

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: { name: '', email: '', mobile: '', photo: '' },
      saving: false,
      isUploadAvtar: false
    }
    this.focusListener = this.props.navigation.addListener('willFocus', async () => {
      await this.getUserDetails()
    })
  }

  componentWillUnmount() {
    this.focusListener.remove()
  }

  getUserDetails = async () => {
    this.setState({ loading: true })
    try {
      const result = await apolloClient.query({
        query: GET_USER_DETAILS,
        fetchPolicy: 'no-cache'
      })
      if(result && result.data && result.data.getUserDetails && result.data.getUserDetails.profile) {
        let user = {}
        if(result.data.getUserDetails.email) user['email'] = result.data.getUserDetails.email
        if(result.data.getUserDetails.profile.name) user['name'] = result.data.getUserDetails.profile.name
        if(result.data.getUserDetails.profile.mobile) user['mobile'] = result.data.getUserDetails.profile.mobile
        if(result.data.getUserDetails.profile.photo) user['photo'] = result.data.getUserDetails.profile.photo
        this.setState({ user })
      }
    } catch (error) {
      console.log(error)
    }
    this.setState({ loading: false })
  }

  openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      quality: 1.0,
      maxWidth: 200,
      maxHeight: 200,
      storageOptions: {
        skipBackup: true
      },
      title: 'sélectionner une photo',
      takePhotoButtonTitle: 'prendre une photo',
      chooseFromLibraryButtonTitle: 'Choisir depuis la galerie',
      cancelButtonTitle: 'annuler'
    };

    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        this.refs.errorToast.show(`Impossible d'ouvrir la galerie`);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.setState({ isUploadAvtar: true })
        try {
          if(response && response.uri) {
            if(response.fileSize && response.fileSize <= 1048576) {
              let url = await uploadToS3(response.uri, this.getFileExtension(response.uri), response.width, response.height, response.fileSize);
              if(url) {
                const result = await this.props.editUser({
                  variables: {
                    photo: url
                  }
                });
                if(result && result.data && result.data.editUser && result.data.editUser._id) {
                  const { user } = this.state
                  user['photo'] = url
                  this.setState({ user })
                  this.refs.toast.show('Avtar mis à jour avec succès');
                }
              } else {
                this.refs.errorToast.show('Impossible de mettre à jour avtar');
              }
            } else {
              this.refs.errorToast.show('Veuillez télécharger un avatar, avec une taille égale ou inférieure à 1 Mo');
            }
          } else {
            this.refs.errorToast.show('Veuillez choisir un avatar valide');
          }
        } catch (e) {
          this.refs.errorToast.show('Impossible de mettre à jour avtar');
        }
        this.setState({ isUploadAvtar: false })
      }
    });
  }

  getFileExtension = (filename) => {
    if (filename) {
      return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    }
    return "";
  }

  handleChange = ({ key, value }) => {
    const { user } = this.state
    user[key] = value
    this.setState({ user })
  }

  valid = () => {
		const { user } = this.state;
    if (user.name.trim() === '') {
      this.refs.errorToast.show(`Veuillez entrer le nom d'utilisateur`);
      return false
    }
    if (!validateMobile(user.mobile)) {
      this.refs.errorToast.show(user.mobile.trim() === '' ? 'Veuillez entrer le numéro de téléphone' : 'Entrez un numéro de téléphone valide');
      return false
    }
    if (!validateEmail(user.email)) {
      this.refs.errorToast.show(user.email.trim() === '' ? 'Veuillez saisir un e-mail' : 'Entrez une adresse email valide');
      return false
    }
    return true
	}

  submit = async() => {
    Keyboard.dismiss();

		if (!this.valid()) {
			return;
		}

		this.setState({ saving: true });
    const { user } = this.state
    try {
      const result = await this.props.editUser({
        variables: {
          ...user
        }
      });
      if(result && result.data && result.data.editUser && result.data.editUser._id) {
        this.refs.toast.show('Votre profil a été mis à jour avec succès');
      } else {
        this.refs.errorToast.show('Impossible de mettre à jour le profil');
      }
    } catch (error) {
      this.refs.errorToast.show('Impossible de mettre à jour le profil');
    }

		this.setState({ saving: false });
	}

  render() {
    const { navigation } = this.props
    const { loading, user, saving, isUploadAvtar } = this.state

    return (
      <View style={styles.container}>
        <TopNavBar navigation={navigation} />
        { loading ?
          <Spinner style={styles.spinnerStyle} />
        :
          <KeyboardAwareScrollView
            style={styles.keyboardAvoidingView}
            contentContainerStyle={styles.keyboardAvoidingContainer}
            showsVerticalScrollIndicator={false}
            bounces={false}
            innerRef={ref => { this.scroll = ref }}
            keyboardShouldPersistTaps={'always'}
            enableOnAndroid={false}
          >
            <View style={styles.infoWrapper}>
              <TouchableOpacity
                onPress={() => this.openImagePicker()}
                style={styles.imageWrapper}
                activeOpacity={0.8}
                disabled={isUploadAvtar}
              >
                <View style={styles.imageOuterWrapper}>
                  <View style={styles.imageInnerWrapper}>
                    {user.photo !== undefined ?
                      <FastImage source={{ uri: user.photo }} style={styles.profileImage} resizeMode={FastImage.resizeMode.stretch} />
                    :
                      <FastImage source={images.user} style={styles.profileIcon} resizeMode={FastImage.resizeMode.contain} />
                    }
                  </View>
                </View>
                <View style={styles.editIconWrapper}>
                  <CustomIcon name={'pencil'} size={12} color={colors.darkBlack} />
                </View>
              </TouchableOpacity>
            </View>
            <RCTextInput
              inputRef={(e) => { this.nameInput = e; }}
              title={`Nom d'utilisateur`}
              value={user.name}
              returnKeyType={'next'}
              iconLeft={'user'}
              onChangeText={name => this.handleChange({ key: 'name', value: name })}
              onSubmitEditing={() => { this.mobileInput.focus(); }}
            />
            <RCTextInput
              inputRef={(e) => { this.mobileInput = e; }}
              title={'Numéro de téléphone'}
              value={user.mobile}
              returnKeyType={'next'}
              iconLeft={'smartphone'}
              keyboardType={'phone-pad'}
              onChangeText={mobile => this.handleChange({ key: 'mobile', value: mobile })}
              onSubmitEditing={() => { this.emailInput.focus(); }}
            />
            <RCTextInput
              inputRef={(e) => { this.emailInput = e; }}
              title={'E-mail'}
              value={user.email}
              returnKeyType={'go'}
              iconLeft={'email'}
              keyboardType={'email-address'}
              onChangeText={email => this.handleChange({ key: 'email', value: email })}
              onSubmitEditing={() => this.submit()}
            />
            <Button
              title={'sauver'}
              onPress={() => this.submit()}
              style={styles.saveBtnStyle}
              loading={saving}
            />
          </KeyboardAwareScrollView>
        }
        <Toast
          ref={'toast'}
          position={'center'}
          positionValue={80}
        />
        <Toast
          ref={'errorToast'}
          position={'center'}
          positionValue={80}
          style={styles.errorToast}
          textStyle={styles.errorToastText}
        />
      </View>
    );
  }
}

export default compose(
  graphql(EDIT_USER, { name: 'editUser' })
)(EditProfile);
