import React from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import apolloClient from '../../graphql/client';
import { IS_CART_PRODUCTS_AVAILABLE } from '../../graphql/queries';
import { CustomIcon } from '../../utils/Icons';
import styles from './styles';
import sharedStyles from '../../styles';
import { colors } from '../../constants/colors';
import { getData } from '../../utils/storage';
import { getCart } from '../../actions/cart';
import { getCartData } from '../../utils/appUtils';
import TopNavBar from '../../containers/TopNavBar/index';
import CartProduct from '../../containers/CartProduct';
import CartBack from '../../containers/CartBack';
import Button from '../../containers/Button';
import Spinner from '../../containers/Spinner';
import Toast from '../../containers/Toast';

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isUserLogin: false,
      disabled: false,
      refreshing: false
    }
    this.focusListener = this.props.navigation.addListener('willFocus', async () => {
      this.setState({ loading: true, isUserLogin: false, disabled: false, refreshing: false })
      await this.getCartDetails()
    })
  }

  componentWillUnmount() {
    this.focusListener.remove()
  }

  getCartDetails = async () => {
    const token = JSON.parse(await getData('token'))

    if(token) {
      await this.props.getCart()
      this.setState({ isUserLogin: true })
    } else {
      const tempUserId = JSON.parse(await getData('tempUserId'))
      if(tempUserId) await this.props.getCart(tempUserId)
      this.setState({ isUserLogin: false })
    }
    this.setState({ loading: false })
  }

  handleRefresh = async () => {
    this.setState({ refreshing: true })
    await this.getCartDetails()
    this.setState({ refreshing: false })
  }

  emptyCartView = () => (
    <View style={sharedStyles.containerWrapper}>
      <TopNavBar title={'Mon panier'} onBackPress={() => this.props.navigation.navigate('Home')} />
      <View style={[sharedStyles.contentWrapper, styles.emptyWrapper]}>
      <View>
        <CartBack />
        <CustomIcon name={'basket'} size={40} color={colors.white} style={styles.emptyCartIcon}/>
      </View>
        <Text style={styles.emptyText}>Aucun article dans le panier pour le moment!</Text>
        <Button
          title={'Continuer vos achats'}
          onPress={() => this.props.navigation.navigate('Home')}
          style={styles.continueButtonStyle}
          textStyle={styles.continueButtonTextStyle}
        />
      </View>
    </View>
  )

  submit = async () => {
    var { isUserLogin } = this.state, data = {}
    this.setState({ disabled: true })
    if(!isUserLogin) {
      const tempUserId = JSON.parse(await getData('tempUserId'))
      if(tempUserId) data = { userId: tempUserId }
    }

    const response = await apolloClient.query({
      query: IS_CART_PRODUCTS_AVAILABLE,
      variables: {
        ...data
      },
      fetchPolicy: 'no-cache'
    }).then((result) => {
      if(result && result.data && result.data.isCartProductsAvailable) {
        if(isUserLogin) this.props.navigation.navigate('SelectAddress')
        else this.props.navigation.navigate('SignUp', { from: 'cartScreen' })
      }
    })
    .catch((error) => {
      try {
        this.refs.errorToast.show(error.graphQLErrors[0].message);
      } catch (e) {
        console.log(e);
      }
    })
    this.setState({ disabled: false })
  }

  render() {
    const { props } = this
    const { cart } = props
    const { isUserLogin, loading, disabled } = this.state

    if(!loading && cart.products && cart.products.length === 0) return this.emptyCartView()
    const { totalDiscount, payableAmount } = getCartData(cart)

    return (
      <View style={sharedStyles.containerWrapper}>
        <TopNavBar
          title={'Mon panier'}
          subTitle={props.cartTotal > 0 ? `(${props.cartTotal})` : ``}
          onBackPress={() => this.props.navigation.navigate('Home')}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.handleRefresh()}
              colors={[colors.primary]}
            />
          }
          style={styles.scrollViewStyle}
          contentContainerStyle={[styles.scrollViewContainerStyle, loading && styles.spinnerWrapper]}
        >
          {loading ?
            <Spinner />
          :
            <View style={styles.innerWrapper}>
              <CartProduct
                products={cart.products}
                showMsg={(msg) => this.refs.errorToast.show(msg)}
                showSuccessMsg={(msg) => this.refs.successToast.show(msg)}
                from={'cart'}
                navigation={props.navigation}
              />
              <View style={styles.summaryWrapper}>
                <Text style={styles.summaryTitle}>Soustotal:</Text>
                <View style={styles.payAmountWrapper}>
                  <Text style={styles.payAmountText}>€{payableAmount}</Text>
                  <Text style={styles.discountText}>Enregistrée €{totalDiscount}</Text>
                </View>
              </View>
            </View>
          }
        </ScrollView>
        {!loading &&
          <>
            <View style={[styles.bottomWrapper, sharedStyles.shadow]}>
              <Button
                title={'Vérifier'}
                onPress={() => this.submit()}
                loading={disabled}
              />
            </View>
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
          </>
        }
      </View>
    );
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
)(Cart);
