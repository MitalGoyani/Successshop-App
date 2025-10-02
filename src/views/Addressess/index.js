import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import apolloClient from '../../graphql/client';
import { REMOVE_ADDRESS } from '../../graphql/mutations';
import { CustomIcon } from '../../utils/Icons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import { colors } from '../../constants/colors';
import { getAddresses } from '../../actions/address';
import TopNavBar from '../../containers/TopNavBar';
import Spinner from '../../containers/Spinner';
import Alert from '../../containers/Alert';
import Toast from '../../containers/Toast';

class Addressess extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      addressId: null,
      isConfirmationModal: false
    }
    this.menuRefs = {}
  }

  async componentWillMount() {
    await this.props.getAddress()
    this.setState({ loading: false })
  }

  editAddress = async (index, address) => {
    await this.menuRefs[index].hide()
    this.props.navigation.navigate('AddEditAddress', { address })
  }

  openConfirmationModal = async (index, addressId) => {
    await this.menuRefs[index].hide()
    setTimeout(() => {
      this.setState({ isConfirmationModal: true, addressId })
    }, 300)
  }

  closeConfirmationModal = () => {
    this.setState({ isConfirmationModal: false, addressId: null })
  }

  removeAddress = async () => {
    const { addressId } = this.state
    this.setState({ isConfirmationModal: false })
    if(addressId) {
      try {
        const result = await apolloClient.mutate({
          mutation: REMOVE_ADDRESS,
          variables: {
            addressId
          }
        });
        if (result && result.data && result.data.removeAddress) {
          await this.props.getAddress()
          this.refs.successToast.show('Adresse supprimée avec succès')
        } else this.refs.errorToast.show(`Impossible de supprimer l'adresse`)
      } catch (error) {
        this.refs.errorToast.show(`Impossible de supprimer l'adresse`)
      }
      this.setState({ addressId: null })
    }
  }

  renderAddresses = (addresses) => {
    return (
      <View style={styles.addressesWrapper}>
        {addresses.map((address, index) => (
          <View
            style={styles.addressWrapper}
            key={index}
          >
            <Text style={[styles.textStyle, styles.textCapitalize]}>{address.firstName} {address.lastName}</Text>
            <Text style={styles.addressText}>{address.address},{'\n'}{address.area}, {address.city}-{address.pincode}, {address.country}</Text>
            <Text style={styles.mobileText}>{address.mobile}</Text>
            <View style={styles.menuWrapper}>
              <Menu
                ref={ref => this.menuRefs[index] = ref}
                button={
                  <TouchableOpacity
                    style={styles.menuIconWrapper}
                    activeOpacity={0.4}
                    onPress={() => this.menuRefs[index].show()}
                  >
                    <MaterialCommunityIcon name={'dots-vertical'} size={20} color={colors.darkBlack} />
                  </TouchableOpacity>
                }
              >
                <MenuItem onPress={() => this.editAddress(index, address)} style={styles.menuItem} textStyle={styles.menuItemText}>Éditer</MenuItem>
                <MenuDivider />
                <MenuItem onPress={() => this.openConfirmationModal(index, address._id)} style={styles.menuItem} textStyle={styles.menuItemText}>Effacer</MenuItem>
              </Menu>
            </View>
          </View>
        ))}
      </View>
    )
  }

  render() {
    const { props } = this
    const { addresses } = props
    const { loading, isConfirmationModal } = this.state

    return (
      <View style={styles.container}>
        <TopNavBar
          title={'Mes adresses'}
          subTitle={addresses && addresses.length > 0 ? `(${addresses.length})` : ``}
          navigation={props.navigation}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollViewStyle}
          contentContainerStyle={loading && styles.scrollViewContainerStyle}
        >
          {loading ?
            <Spinner style={styles.spinner} />
          :
            <>
              <TouchableOpacity style={styles.addAddressWrapper} activeOpacity={0.8} onPress={() => props.navigation.navigate('AddEditAddress')}>
                <IconFontAwesome name={'plus'} size={20} color={colors.darkBlack} />
                <Text style={styles.addressTitleText}>AJOUTER UNE NOUVELLE ADRESSE</Text>
              </TouchableOpacity>
              {(addresses && addresses.length > 0) && this.renderAddresses(addresses)}
            </>
          }
        </ScrollView>
        {isConfirmationModal &&
          <Alert
            isVisible={isConfirmationModal}
            message={'Voulez-vous vraiment supprimer cette adresse?'}
            cancelText={'Non'}
            confirmText={'Oui'}
            onConfirm={() => this.removeAddress()}
            onClosed={() => this.closeConfirmationModal()}
          />
        }
        <Toast
          ref={'errorToast'}
          position={'center'}
          positionValue={150}
          style={styles.errorToast}
          textStyle={styles.errorToastText}
        />
        <Toast
          ref={'successToast'}
          position={'center'}
          positionValue={150}
        />
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
)(Addressess);
