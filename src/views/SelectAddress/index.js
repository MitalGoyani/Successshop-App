import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { CustomIcon } from '../../utils/Icons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import sharedStyles from '../../styles';
import { colors } from '../../constants/colors';
import { getAddresses } from '../../actions/address';
import TopNavBar from '../../containers/TopNavBar';
import CheckoutSteps from '../../containers/CheckoutSteps';
import Button from '../../containers/Button';
import Spinner from '../../containers/Spinner';

class SelectAddress extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      selectedAddressId: null
    }
  }

  async componentWillMount() {
    await this.props.getAddress()
    if(this.props.addresses && this.props.addresses.length > 0) this.setState({ selectedAddressId: this.props.addresses[0]._id })
    this.setState({ loading: false })
  }

  submit = () => {
    const { navigation, addresses } = this.props
    const { selectedAddressId } = this.state
    if(selectedAddressId) {
      const params = {}
      const address = addresses.find(address => address._id == selectedAddressId)
      if(address && address._id) params['address'] = address
      if(navigation && navigation.state && navigation.state.params && navigation.state.params.product) params['product'] = navigation.state.params.product
      navigation.navigate('OrderSummary', { ...params })
    }
  }

  renderAddresses = (addresses) => {
    const { selectedAddressId } = this.state
    return (
      <View style={styles.addressesWrapper}>
        <Text style={styles.textStyle}>Expédition à</Text>
        {addresses.map((address, index) => (
          <TouchableOpacity
            style={[styles.addressWrapper, (selectedAddressId == address._id) && styles.selectedAddressWrapper]}
            activeOpacity={0.8}
            onPress={() => this.setState({ selectedAddressId: address._id })}
            key={index}
          >
            <View
              style={[styles.radioWrapper, { borderColor: (selectedAddressId == address._id) ? colors.primary : colors.darkGray }]}
            >
              {(selectedAddressId == address._id) && <View style={styles.radioInnerWrapper} />}
            </View>
            <View style={styles.rightWrapper}>
              <View style={styles.row}>
                <Text style={[styles.textStyle, styles.textCapitalize]}>{address.firstName} {address.lastName}</Text>
                <TouchableOpacity activeOpacity={0.4} onPress={() => this.props.navigation.navigate('AddEditAddress', { from: 'checkout', address })}>
                  <CustomIcon name={'pencil'} size={20} color={colors.darkBlack} />
                </TouchableOpacity>
              </View>
              <View style={styles.addressInfoWrapper}>
                <Text style={styles.addressText}>{address.address},{'\n'}{address.area}, {address.city}-{address.pincode}, {address.country}</Text>
                <Text style={styles.mobileText}>{address.mobile}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  render() {
    const { props } = this
    const { addresses } = props
    const { loading, selectedAddressId } = this.state

    return (
      <View style={styles.container}>
        <TopNavBar
          title={`Sélectionnez l'adresse`}
          subTitle={addresses && addresses.length > 0 ? `(${addresses.length})` : ``}
          navigation={props.navigation}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollViewStyle}
          contentContainerStyle={[styles.scrollViewContainerStyle, loading && styles.spinnerContainerStyle]}
        >
          {loading ?
            <Spinner style={styles.spinner} />
          :
            <View style={styles.innerContainer}>
              <View>
                <CheckoutSteps currentStep={0} />
                <TouchableOpacity style={styles.addAddressWrapper} activeOpacity={0.8} onPress={() => props.navigation.navigate('AddEditAddress', { from: 'checkout' })}>
                  <IconFontAwesome name={'plus'} size={20} color={colors.darkBlack} />
                  <Text style={styles.addressTitleText}>AJOUTER UNE NOUVELLE ADRESSE</Text>
                </TouchableOpacity>
                {(addresses && addresses.length > 0) && this.renderAddresses(addresses)}
              </View>
              {selectedAddressId &&
                 <Button
                  title={'Livrez ici'}
                  onPress={() => this.submit()}
                  style={styles.buttonStyle}
                />
              }
            </View>
          }
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  addresses: state.address.addresses
});

const mapDispatchToProps = dispatch => ({
  getAddress: () => dispatch(getAddresses())
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(SelectAddress);
