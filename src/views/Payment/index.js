import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, BackHandler } from 'react-native';
import { SafeAreaView, StackActions, NavigationActions } from 'react-navigation';
import { WebView } from 'react-native-webview';
import Modal from 'react-native-modal';
import stripe from 'tipsi-stripe';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconSimpleLine from 'react-native-vector-icons/SimpleLineIcons';
import _ from 'underscore';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { PLACE_ORDER } from '../../graphql/mutations';
import TopNavBar from '../../containers/TopNavBar';
import CheckoutSteps from '../../containers/CheckoutSteps';
import Button from '../../containers/Button';
import Spinner from '../../containers/Spinner';
import ProgressDialog from '../../containers/ProgressDialog';
import Toast from '../../containers/Toast';
import styles from './styles';
import config from '../../../config';
import { colors } from '../../constants/colors';
import { getData } from '../../utils/storage';
import { fetchData } from '../../utils/api';
import { getCart } from '../../actions/cart';
import { getCartData } from '../../utils/appUtils';
import { CustomIcon } from '../../utils/Icons';
import { countries } from '../../utils/country';
import { images } from '../../../assets';

var base64 = require('base-64');

stripe.setOptions({
  publishableKey: config.stripe && config.stripe.key ? config.stripe.key : ''
})

class Payment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      paymentOptions: [
        { title: 'Carte de débit/crédit', type: 'stripe', iconName: 'credit-card' },
        { title: 'Paypal', type: 'paypal', iconName: 'paypal' },
        { title: 'Paiement à la livraison', type: 'cod', iconName: 'wallet' },
      ],
      paymentType: 'stripe',
      disabled: false,
      isPaying: false,
      displayOrderSuccessView: false,
      displayPaypalPaymentModal: false,
      approvalUrl: null
    }

    this.blurListener = this.props.navigation.addListener('didBlur', () => {
      this.setState({ displayOrderSuccessView: false })
    })
  }

  async componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', () => this.onBackPress())

    const { params } = this.props.navigation.state
    if(params && params.product && params.product.productId) this.setState({ loading: false })
    else await this.getCartDetails()
  }

  componentWillUnmount() {
    this.blurListener.remove()
    BackHandler.removeEventListener('hardwareBackPress', () => this.onBackPress())
  }

  onBackPress = () => {
    if(this.state.displayOrderSuccessView) {
      this.navigateToHome()

      return true
    }

    return false
  }

  getCartDetails = async () => {
    const token = JSON.parse(await getData('token'))
    if(token) await this.props.getCart()
    else this.props.navigation.navigate('SignUp')
    this.setState({ loading: false })
  }

  renderPaymentOptions = () => {
    const { paymentOptions, paymentType } = this.state
    return (
      <View style={styles.paymentWrapper}>
        <Text style={styles.textStyle}>Sélectionnez les options de paiement</Text>
        {paymentOptions.map((option, index) => (
          <TouchableOpacity
            style={styles.paymentOptionWrapper}
            activeOpacity={0.8}
            onPress={() => this.setState({ paymentType: option.type })}
            key={index}
          >
            <View
              style={[styles.radioWrapper, { borderColor: (paymentType && paymentType == option.type) ? colors.primary : colors.darkGray }]}
            >
              {(paymentType && paymentType == option.type) && <View style={styles.radioInnerWrapper} />}
            </View>
            <View style={styles.paymentOptionInner}>
              <View style={styles.paymentIconWrapper}>
                {option.type === 'stripe' ?
                  <CustomIcon name={option.iconName} size={23} color={colors.red} />
                :
                  <IconSimpleLine name={option.iconName} size={22} color={colors.red} />
                }
              </View>
              <Text style={styles.textStyle}>{option.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  renderOrderSummary = () => {
    const { subTotal, total, discount, freeOrderDeliveryLimit, deliveryCharge } = this.getPaymentInfo()
    const { params } = this.props.navigation.state
    const totalProducts = params && params.product && params.product.productId ? 1 : this.props.cartTotal
    return (
      <View style={styles.summaryWrapper}>
        <View style={styles.row}>
          <Text style={styles.priceText}>{`Prix (${totalProducts} ${totalProducts > 1 ? `articles` : `article`})`}</Text>
          <Text style={styles.priceText}>€{subTotal}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.priceText}>Frais de livraison</Text>
          <Text style={styles.priceText}>{freeOrderDeliveryLimit > subTotal ? deliveryCharge : 0}</Text>
        </View>
        <View style={[styles.row, styles.border]}>
          <Text style={styles.payAmountText}>Montant total a payer</Text>
          <Text style={styles.payAmountText}>€{total}</Text>
        </View>
        {discount > 0 && <Text style={styles.discountText}>Vous économiserez €{discount} sur cette ordre</Text>}
      </View>
    )
  }

  getPaymentInfo = () => {
    const { params } = this.props.navigation.state
    const data = params && params.product && params.product.productId ? { products: [params.product] } : this.props.cart
    const { totalDiscount, payableAmount } = getCartData(data)
    const { freeOrderDeliveryLimit, deliveryCharge } = this.getDeliveryChargeInfo()
    return {
      subTotal: payableAmount,
      total: freeOrderDeliveryLimit > payableAmount ? (deliveryCharge ? payableAmount + deliveryCharge : payableAmount) : payableAmount,
      discount: totalDiscount,
      freeOrderDeliveryLimit,
      deliveryCharge
    }
  }

  getDeliveryChargeInfo = () => {
    const { params } = this.props.navigation.state
    var freeOrderDeliveryLimit = this.props.cart.freeOrderDeliveryLimit || 0, deliveryCharge = this.props.cart.deliveryCharge || 0
    if(params && params.product && params.product) {
      if(!_.isUndefined(params.product.freeOrderDeliveryLimit)) freeOrderDeliveryLimit = params.product.freeOrderDeliveryLimit
      if(!_.isUndefined(params.product.deliveryCharge)) deliveryCharge = params.product.deliveryCharge
    }
    return { freeOrderDeliveryLimit, deliveryCharge }
  }

  onPayPress = () => {
    const { paymentType } = this.state
    this.setState({ disabled: true })
    if(paymentType === 'stripe') this.handleCardPayment()
    if(paymentType === 'paypal') this.handlePaypalPayment()
    if(paymentType === 'cod') this.submit('cod')
  }

  handleCardPayment = async () => {
    try {
      const data = await stripe.paymentRequestWithCardForm({
        theme: {
          accentColor: colors.primary
        }
      })
      if(data && data.tokenId) {
        this.setState({ isPaying: true })
        await this.submit('stripe', data.tokenId)
      } else {
        this.refs.errorToast.show('Impossible de traiter le paiement. Veuillez réessayer')
      }
    } catch (error) {
      console.log(error)
    }
    this.setState({ disabled: false, isPaying: false })
  }

  handlePaypalPayment = async () => {
    const { total } = this.getPaymentInfo()
    const purchaseUnits =  [{'amount': {'currency_code': 'EUR', 'value': total}}]
    const { navigation } = this.props
    if(navigation.state && navigation.state.params && navigation.state.params.address) {
      const { address } = navigation.state.params
      purchaseUnits[0]['shipping'] = {
        name: { full_name: address.firstName + ' ' + (address.lastName ? address.lastName : '')},
        type: 'SHIPPING',
        address: {
          address_line_1: address.address,
          admin_area_1: address.city,
          admin_area_2: address.area,
          postal_code: address.pincode
        }
      }
      const country = _.find(countries, country => country.value === address.country)
      if(country && country.code) purchaseUnits[0]['shipping'].address.country_code = country.code
    }
    const body = {
      'intent': 'CAPTURE',
      'purchase_units': purchaseUnits,
      'application_context': {
        'landing_page': 'LOGIN',
        'return_url': 'https://example.com/return',
        'shipping_preference': 'SET_PROVIDED_ADDRESS'
      }
    }
    await fetchData('v2/checkout/orders', 'POST', 'Basic '+base64.encode(`${config.paypal.accessKeyId}:${config.paypal.secretAccessKey}`), body)
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson && responseJson.links && responseJson.links.length > 0) {
        const approvalUrl = responseJson.links.find(data => data.rel === 'approve')
        if(approvalUrl && approvalUrl.href) this.setState({ displayPaypalPaymentModal: true, approvalUrl: approvalUrl.href })
        else this.paypalPaymentError()
      } else this.paypalPaymentError()
     })
    .catch((error) => {
      this.paypalPaymentError()
    })
  }

  paypalPaymentError = () => {
    this.refs.errorToast.show('Impossible de traiter le paiement. Veuillez réessayer')
    this.setState({ disabled: false, displayPaypalPaymentModal: false, approvalUrl: null })
  }

  renderPaypalPaymentModal = () => {
    const { displayPaypalPaymentModal, approvalUrl } = this.state
    return (
      <Modal
        style={styles.modal}
    		isVisible={displayPaypalPaymentModal}
    		onBackButtonPress={() => this.closePaypalPaymentModal()}
        onModalHide={() => this.closePaypalPaymentModal()}
        useNativeDriver={true}
    	>
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity style={styles.closeContainer} activeOpacity={0.8} onPress={() => this.closePaypalPaymentModal()}>
             <IconAntDesign name={'closecircleo'} size={30} color={colors.black} />
          </TouchableOpacity>
          {approvalUrl ?
            <WebView
              source={{ uri: approvalUrl }}
              onNavigationStateChange={this.onNavigationStateChange}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              renderLoading={() => <ActivityIndicator size='large' style={styles.loading} color={colors.primary} />}
            />
          :
            <ActivityIndicator size={'large'} style={styles.loading} color={colors.primary} />
          }
        </SafeAreaView>
    	</Modal>
    )
  }

  closePaypalPaymentModal = () => {
    this.setState({ displayPaypalPaymentModal: false, approvalUrl: null, disabled: false })
  }

  onNavigationStateChange = async (webViewState) => {
    const url = webViewState.url
    if (url.indexOf('return?token=') != -1) {
      this.setState({ approvalUrl: null })
      var orderId = url.split('token=')[1].split('&')[0]
      if(orderId) await this.submit('paypal', orderId)
      else this.paypalPaymentError()
    }
  }

  submit = async (paymentType, token) => {
    const { cart } = this.props
    const { params } = this.props.navigation.state
    const { subTotal, total, discount, freeOrderDeliveryLimit, deliveryCharge } = this.getPaymentInfo()

    const obj = {
      subTotal,
      totalDiscount: discount,
      paymentType
    }
    obj['deliveryCharge'] = freeOrderDeliveryLimit > subTotal ? deliveryCharge : 0
    obj['totalPrice'] = total

    if(token) obj['tokenId'] = token
    if(params && params.address && params.address._id) obj['addressId'] = params.address._id
    if(params && params.product && params.product.productId) {
      obj['product'] = {
        productId: params.product.productId,
        quantity: params.product.quantity,
        optionValueIds: params.product.optionValueIds
      }
      obj['type'] = 'quickBuyOrder'
    }

    try {
      const result = await this.props.placeOrder({
        variables: {
          ...obj
        }
      });
      if(result && result.data && result.data.placeOrder) {
        await this.setState({ displayOrderSuccessView: true })
        await this.props.getCart()
      }
    } catch (error) {
      try {
        this.refs.errorToast.show(error.graphQLErrors[0].message);
      } catch (e) {
        this.refs.errorToast.show('Impossible de passer la ordre... veuillez réessayer');
      }
    }
    this.setState({ disabled: false, isPaying: false, displayPaypalPaymentModal: false })
  }

  orderSuccessView = () => {
    return (
      <View style={styles.successContainer}>
        <Image source={images.orderSuccess} style={styles.orderSuccessImg} resizeMode={'contain'} />
        <Text style={styles.successText}>Merci!</Text>
        <Text style={styles.msgText}>Ordre passée avec succès. Pour plus de détails, vérifiez vos Ordre.</Text>
        <Button
          title={'Continuer vos achats'}
          onPress={() => this.navigateToHome()}
          style={styles.continueButtonStyle}
          textStyle={styles.continueButtonTextStyle}
        />
      </View>
    )
  }

  navigateToHome = () => {
    let resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Main' })
      ]
    })
    this.props.navigation.dispatch(resetAction)
    this.props.navigation.navigate('Home')
  }

  render() {
    const { props } = this
    const { loading, disabled, isPaying, displayOrderSuccessView,  paymentType, displayPaypalPaymentModal, approvalUrl } = this.state
    const { total } = this.getPaymentInfo()

    if(displayOrderSuccessView) return this.orderSuccessView()

    return (
      <View style={styles.container}>
        <TopNavBar
          title={'Payment'}
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
                <CheckoutSteps currentStep={2} />
                {this.renderPaymentOptions()}
                {this.renderOrderSummary()}
              </View>
              <Button
                title={`Payer € ${Number(total).toFixed(2)}`}
                onPress={() => this.onPayPress()}
                loading={disabled}
                style={styles.buttonStyle}
              />
            </View>
          }
          </ScrollView>
          {(paymentType === 'paypal' && displayPaypalPaymentModal) && this.renderPaypalPaymentModal()}
          {isPaying && <ProgressDialog isVisible={this.state.isPaying} />}
          <Toast ref={'errorToast'}
            position='center'
            positionValue={150}
            style={styles.toastStyle}
            textStyle={styles.toastTextStyle}
          />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  cart: state.cart.cart,
  cartTotal: state.cart.total
});

const mapDispatchToProps = dispatch => ({
  getCart: () => dispatch(getCart())
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(PLACE_ORDER, { name: 'placeOrder' })
)(Payment);
