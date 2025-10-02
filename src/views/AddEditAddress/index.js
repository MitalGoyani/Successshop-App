import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RNPickerSelect from 'react-native-picker-select';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import _ from 'underscore';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { getAddresses } from '../../actions/address';
import { ADD_ADDRESS, EDIT_ADDRESS } from '../../graphql/mutations';
import TopNavBar from '../../containers/TopNavBar/index';
import WrongInputWarning from '../../containers/WrongInputWarning';
import RCTextInput from '../../containers/TextInput';
import Button from '../../containers/Button';
import styles from './styles';
import sharedStyles from '../../styles';
import { colors } from '../../constants/colors';
import { countries } from '../../utils/country';
import { validateEmail, validateMobile } from '../../utils/validators';


class AddEditAddress extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      address: props.navigation.state && props.navigation.state.params && props.navigation.state.params.address ?
               _.extend({}, props.navigation.state.params.address) : { firstName: '', lastName: '', mobile: '', email: '', address: '', area: '', city: '', pincode: '', country: '' },
      errorText: null,
      disabled: false
    }
  }

  handleChange = ({ key, value }) => {
    const { address } = this.state
    address[key] = value
    this.setState({ address })
  }

  valid = () => {
		const { address } = this.state
    if (address.firstName.trim() === '') {
      this.setState({ errorText: 'Veuillez saisir le prénom' })
      this.firstNameInput.focus();
      return false
    }
    if (!validateMobile(address.mobile)) {
      const errorText = address.mobile.trim() === '' ? 'Veuillez entrer le numéro de téléphone' : 'Entrez un numéro de téléphone valide'
      this.setState({ errorText })
      this.mobileInput.focus();
      return false
    }
    if (!validateEmail(address.email)) {
      const errorText = address.email.trim() === '' ? 'Veuillez saisir un e-mail' : 'Entrez une adresse email valide'
      this.setState({ errorText })
      this.emailInput.focus();
      return false
    }
    if (address.address.trim() === '') {
      this.setState({ errorText: `Veuillez saisir l'adresse postale` })
      this.addressInput.focus();
      return false
    }
    if (address.area.trim() === '') {
      this.setState({ errorText: 'Veuillez saisir la zone' })
      this.areaInput.focus();
      return false
    }
    if (address.city.trim() === '') {
      this.setState({ errorText: 'Veuillez entrer la ville' })
      this.cityInput.focus();
      return false
    }
    if (address.pincode.trim() === '') {
      this.setState({ errorText: 'Veuillez entrer le code PIN' })
      this.pincodeInput.focus();
      return false
    }
    if (!address.country) {
      this.setState({ errorText: 'Veuillez sélectionner le pays' })
      return false
    }
    return true
	}

  submit = async () => {
    if (!this.valid()) return;

    const { navigation } = this.props
    const { address } = this.state
    this.setState({ disabled: true })
		Keyboard.dismiss()

    if(navigation.state && navigation.state.params && navigation.state.params.address && navigation.state.params.address._id) {
      try {
        const result = await this.props.editAddress({
          variables: {
            addressId: navigation.state.params.address._id,
            ...address,
          }
        })
        if(result && result.data && result.data.editAddress && result.data.editAddress._id) {
          await this.props.getAddress()
          navigation.goBack()
        }
      } catch (error) {
        try {
          this.setState({ errorText: error.graphQLErrors[0].message })
        } catch (e) {
          this.setState({ errorText: `Impossible de modifier l'adresse... une erreur s'est produite` })
        }
        this.scroll.scrollTo({ x: 0, y: 0, animated: true })
      }
    } else {
      try {
        const result = await this.props.addAddress({
          variables: {
            ...address
          }
        })
        if(result && result.data && result.data.addAddress && result.data.addAddress._id) {
          await this.props.getAddress()
          navigation.goBack()
        }
      } catch (error) {
        try {
          this.setState({ errorText: error.graphQLErrors[0].message })
        } catch (e) {
          this.setState({ errorText: `Impossible d'ajouter l'adresse... une erreur s'est produite` })
        }
        this.scroll.scrollTo({ x: 0, y: 0, animated: true })
      }
    }
    this.setState({ disabled: false })
  }

  getTitle = () => {
    const { navigation } = this.props
    var type = navigation.state && navigation.state.params && navigation.state.params.address ? 'Éditer' : 'Ajouter'
    return navigation.state && navigation.state.params && navigation.state.params.from && navigation.state.params.from == 'checkout' ? `${type} Adresse de livraison` : `${type} Adresse`
  }

  render() {
    const { props } = this
    const { navigation } = props
    const { errorText, address, disabled } = this.state

    return (
      <View style={sharedStyles.containerWrapper}>
        <TopNavBar
          title={this.getTitle()}
          navigation={navigation}
        />
        <KeyboardAwareScrollView
          innerRef={ref => { this.scroll = ref }}
          style={styles.scrollViewStyle}
  				contentContainerStyle={styles.keyboardAvoidingContainer}
  				bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'always'}
          enableOnAndroid={true}
  			>
          <View>
            {errorText && (
              <WrongInputWarning warningText={errorText} />
            )}
            <View style={styles.row}>
              <RCTextInput
                inputRef={(e) => { this.firstNameInput = e; }}
                wrapperStyle={styles.nameInput}
                title={'Prénom'}
                value={address.firstName}
                returnKeyType={'next'}
                onChangeText={firstName => this.handleChange({ key: 'firstName', value: firstName })}
                onSubmitEditing={() => { this.lastNameInput.focus() }}
              />
              <RCTextInput
                inputRef={(e) => { this.lastNameInput = e; }}
                wrapperStyle={styles.nameInput}
                title={'Nom de famille'}
                value={address.lastName}
                returnKeyType={'next'}
                onChangeText={lastName => this.handleChange({ key: 'lastName', value: lastName })}
                onSubmitEditing={() => { this.mobileInput.focus() }}
              />
            </View>
            <RCTextInput
              inputRef={(e) => { this.mobileInput = e; }}
              title={'Numéro de téléphone'}
              value={address.mobile}
              returnKeyType={'next'}
              onChangeText={mobile => this.handleChange({ key: 'mobile', value: mobile })}
              keyboardType={'phone-pad'}
              onSubmitEditing={() => { this.emailInput.focus() }}
            />
            <RCTextInput
              inputRef={(e) => { this.emailInput = e; }}
              title={'E-mail'}
              value={address.email}
              returnKeyType={'next'}
              onChangeText={email => this.handleChange({ key: 'email', value: email })}
              keyboardType={'email-address'}
              onSubmitEditing={() => { this.addressInput.focus() }}
            />
            <RCTextInput
              inputRef={(e) => { this.addressInput = e; }}
              title={'Adresse de la rue'}
              value={address.address}
              returnKeyType={'next'}
              onChangeText={address => this.handleChange({ key: 'address', value: address })}
              onSubmitEditing={() => { this.areaInput.focus() }}
            />
            <RCTextInput
              inputRef={(e) => { this.areaInput = e; }}
              title={'Surface'}
              value={address.area}
              returnKeyType={'next'}
              onChangeText={area => this.handleChange({ key: 'area', value: area })}
              onSubmitEditing={() => { this.cityInput.focus() }}
            />
            <View style={styles.row}>
              <RCTextInput
                inputRef={(e) => { this.cityInput = e; }}
                wrapperStyle={styles.nameInput}
                title={'Ville'}
                value={address.city}
                returnKeyType={'next'}
                onChangeText={city => this.handleChange({ key: 'city', value: city })}
                onSubmitEditing={() => { this.pincodeInput.focus() }}
              />
              <RCTextInput
                inputRef={(e) => { this.pincodeInput = e; }}
                wrapperStyle={styles.nameInput}
                title={'Code PIN'}
                value={address.pincode}
                returnKeyType={'next'}
                onChangeText={pincode => this.handleChange({ key: 'pincode', value: pincode })}
                keyboardType={'number-pad'}
              />
            </View>
            <View style={styles.pickerWrapper}>
              <View style={styles.pickerTitleWrapper}>
                <Text style={styles.titleText}>De campagne</Text>
                <MaterialIcon name={'keyboard-arrow-down'} size={22} color={colors.darkBlack} />
              </View>
              <RNPickerSelect
                style={pickerSelectStyles}
                value={address.country}
                useNativeAndroidPickerStyle={false}
                placeholder={{ label: '' }}
                doneText={`D'accord`}
                onValueChange={country => this.handleChange({ key: 'country', value: country })}
                items={countries}
                onUpArrow={() => this.pincodeInput.focus()}
              />
            </View>
          </View>
          <Button
            title={`Enregistrer l'adresse`}
            onPress={() => this.submit()}
            style={styles.buttonStyle}
            loading={disabled}
          />
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  getAddress: () => dispatch(getAddresses())
});

export default compose(
  graphql(ADD_ADDRESS, { name: 'addAddress' }),
  graphql(EDIT_ADDRESS, { name: 'editAddress' }),
  connect(null, mapDispatchToProps)
)(AddEditAddress);

const pickerStyle = {
  height: 42,
  fontSize: 16,
  color: colors.darkBlack,
  fontFamily: 'Karla-Regular',
  borderBottomWidth: 1,
  borderBottomColor: colors.placeholder,
  marginBottom: 10
}
export const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    ...pickerStyle
  },
  inputAndroid: {
    ...pickerStyle
  }
});
