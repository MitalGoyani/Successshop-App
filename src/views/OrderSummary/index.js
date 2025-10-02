import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import TopNavBar from '../../containers/TopNavBar';
import CheckoutSteps from '../../containers/CheckoutSteps';
import CartProduct from '../../containers/CartProduct';
import Button from '../../containers/Button';
import Spinner from '../../containers/Spinner';
import styles from './styles';
import sharedStyles from '../SelectAddress/styles';
import { colors } from '../../constants/colors';
import { getData } from '../../utils/storage';
import { getCart } from '../../actions/cart';
import { getCartData } from '../../utils/appUtils';
import { images } from '../../../assets';

class OrderSummary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true
    }
  }

  async componentWillMount() {
    const { params } = this.props.navigation.state
    if(params && params.product && params.product.productId) this.setState({ loading: false })
    else await this.getCartDetails()
  }

  getCartDetails = async () => {
    const token = JSON.parse(await getData('token'))
    if(token) await this.props.getCart()
    else this.props.navigation.navigate('SignUp')
    this.setState({ loading: false })
  }

  getAmountInfo = () => {
    const { params } = this.props.navigation.state
    const data = params && params.product && params.product.productId ? { products: [params.product] } : this.props.cart
    return getCartData(data)
  }

  renderOrderSummary = (products) => {
    const { params } = this.props.navigation.state
    const { totalDiscount, payableAmount } = this.getAmountInfo()
    if(products && products.length > 0) {
      return (
        <>
          <View style={styles.cartWrapper}>
            <Text style={sharedStyles.textStyle}>Ma ordre ({params && params.product && params.product.productId ? 1 : this.props.cartTotal})</Text>
            <CartProduct
              products={products}
              wrapperStyle={styles.cartInnerWrapper}
              rightWrapperStyle={styles.rightWrapperStyle}
              navigation={this.props.navigation}
            />
          </View>
          <View style={styles.summaryWrapper}>
            <Text style={styles.summaryTitle}>Soustotal:</Text>
            <View style={styles.payAmountWrapper}>
              <Text style={styles.payAmountText}>€{payableAmount}</Text>
              <Text style={styles.discountText}>Enregistrée €{totalDiscount}</Text>
            </View>
          </View>
        </>
      )
    }
    return null
  }

  onContinuePress = () => {
    const { navigation } = this.props
    const params = {}
    if(navigation && navigation.state && navigation.state.params) {
      if(navigation.state.params.address) params['address'] = navigation.state.params.address
      if(navigation.state.params.product) params['product'] = navigation.state.params.product
    }
    navigation.navigate('Payment', { ...params })
  }

  render() {
    const { props } = this
    const { params } = props.navigation.state
    const address = params && params.address ? params.address : null
    const products = params && params.product && params.product.productId ? [params.product] : props.cart.products
    const { loading, selectedAddress } = this.state

    return (
      <View style={styles.container}>
        <TopNavBar
          title={'Récapitulatif de la ordre'}
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
                <CheckoutSteps currentStep={1} />
                {address != null &&
                  <View style={styles.addressWrapper}>
                    <View style={styles.row}>
                      <Text style={sharedStyles.textStyle}>Adresse de livraison</Text>
                      <TouchableOpacity activeOpacity={0.4} onPress={() => props.navigation.navigate('SelectAddress')}>
                        <Text style={styles.changeText}>Changement</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.addressInnerWrapper}>
                      <View
                        style={styles.locationIconWrapper}
                      >
                        <Image source={images.location} />
                      </View>
                      <View style={styles.addressInfoWrapper}>
                        <Text style={[sharedStyles.textStyle, sharedStyles.textCapitalize]}>{address.firstName} {address.lastName}</Text>
                        <Text style={sharedStyles.addressText}>{address.address},{'\n'}{address.area}, {address.city}-{address.pincode}, {address.country}</Text>
                        <Text style={sharedStyles.mobileText}>{address.mobile}</Text>
                      </View>
                    </View>
                  </View>
                }
                {this.renderOrderSummary(products)}
              </View>
              {(products && products.length > 0) &&
                 <Button
                  title={'Continuer'}
                  onPress={() => this.onContinuePress()}
                  style={sharedStyles.buttonStyle}
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
  cart: state.cart.cart,
  cartTotal: state.cart.total
});

const mapDispatchToProps = dispatch => ({
  getCart: (userId) => dispatch(getCart(userId))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(OrderSummary);
