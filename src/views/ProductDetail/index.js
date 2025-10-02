import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, PixelRatio, Image, ActivityIndicator
} from 'react-native';
import _ from 'underscore';
import AutoHeightWebView from 'react-native-autoheight-webview'
import FastImage from 'react-native-fast-image';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Collapsible from 'react-native-collapsible';
import { RectButton } from 'react-native-gesture-handler';
import { StackActions, NavigationActions } from 'react-navigation';
import Spinner from '../../containers/Spinner';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import TopNavBar from '../../containers/TopNavBar/index';
import SpecialProducts from '../../containers/SpecialProducts/index';
import Toast from '../../containers/Toast';
import store from '../../store';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import apolloClient from '../../graphql/client';
import { GET_PRODUCT_DETAILS } from '../../graphql/queries';
import { getProducts } from '../../actions/products';
import { getData } from '../../utils/storage';
import styles from './styles';
import sharedStyles from '../../styles';
import { colors } from '../../constants/colors';
import { CustomIcon } from '../../utils/Icons';
import { images } from '../../../assets';
import { windowWidth } from '../../utils/deviceInfo';
import { isProductAvailable, updateCartFn } from '../../utils/appUtils';

const similarProductsLimit = 2

class ProductDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      product: {},
      activePhoto: 0,
      collapsible: { isDetailsCollapsed: true },
      similarProducts: [],
      selectedProduct: { quantity: 0, options: [] },
      isDisabledCartBtn: false,
      isDisabledBuyNowBtn: false
    }

    this.focusListener = this.props.navigation.addListener('willFocus', async () => {
      const productId = this.props.navigation.state.params.productId
      if(productId) await this.getProductDetails(productId)
      this.setState({ loading: false })
    })
  }

  componentWillUnmount() {
    this.focusListener.remove()
  }

  getProductDetails = async (productId) => {
    try {
      const { data } = await apolloClient.query({
        query: GET_PRODUCT_DETAILS,
        variables: {
          productId
        },
        fetchPolicy: 'no-cache'
      });
      if(data && data.getProductDetails && data.getProductDetails._id) {
        this.setState({ product: data.getProductDetails })
        await this.props.getProducts({ type: 'similar', productId: data.getProductDetails._id, skip: 0, limit: similarProductsLimit })
        this.setSimilarProducts()
      } else this.setState({ product: {} })
    } catch (error) {
      console.log(error)
    }
  }

  setSimilarProducts = () => {
    const { product } = store.getState()
    this.setState({ similarProducts: product.similar.products })
  }

  manageQuantity = (type) => {
    const { selectedProduct } = this.state
    const quantity = type && type === 'add' ? selectedProduct.quantity + 1 : (selectedProduct.quantity - 1 > 0 ? selectedProduct.quantity - 1 : 0)
    selectedProduct['quantity'] = quantity
    this.setState({ selectedProduct })
  }

  checkProductAvailability = (type) => {
    type === 'cart' ? this.setState({ isDisabledCartBtn: true }) : this.setState({ isDisabledBuyNowBtn: true })
    const { product, selectedProduct } = this.state
    if(product && product.options && product.options.length > 0) {
      for(let i = 0; i < product.options.length; i++) {
        const index = _.findIndex(selectedProduct.options, item => item.optionId && item.optionId == product.options[i]._id && item.optionValueId)
        if(index == -1) {
          type === 'cart' ? this.setState({ isDisabledCartBtn: false }) : this.setState({ isDisabledBuyNowBtn: false })
          return this.refs.errorToast.show(`Veuillez sélectionner un ${product.options[i].name} pour continuer`)
          break;
        }
      }
    }
    if(selectedProduct.quantity <= 0) {
      type === 'cart' ? this.setState({ isDisabledCartBtn: false }) : this.setState({ isDisabledBuyNowBtn: false })
      return this.refs.errorToast.show(`Veuillez sélectionner la quantité pour continuer`)
    }

    var options = []
    const optionValueIds = _.pluck(selectedProduct.options, 'optionValueId')
    if(product && product.options && product.options.length > 0) {
      options = _.filter(_.flatten(_.pluck(product.options, 'optionValues')), opValue => _.contains(optionValueIds, opValue._id))
    }
    const { isAvailable, message, quantity } = isProductAvailable(selectedProduct.quantity, { productId: product._id, quantity: product.quantity }, options, type === 'cart', type)
    if(!isAvailable) {
      type === 'cart' ? this.setState({ isDisabledCartBtn: false }) : this.setState({ isDisabledBuyNowBtn: false })
      return this.refs.errorToast.show(message)
    }
    return { isAvailable: true, quantity: type === 'cart' ? quantity : selectedProduct.quantity, optionValueIds, options }
  }

  handleAddToCartPress = async () => {
    const res = await this.checkProductAvailability('cart')
    if(res && res.isAvailable && res.quantity) {
      const { product } = this.state

      const productData = {
        productId: product._id,
        quantity: res.quantity,
        name: product.name || '',
        price: product.price || 0,
        specialPrice: product.specialPrice || 0,
        photos: product.photos || [],
        maxQuantity: product.quantity || 0,
        optionValues: res.options ? res.options : []
      }
      const { success, msg } = await updateCartFn(productData, res.quantity, res.optionValueIds ? res.optionValueIds : [])
      this.setState({ isDisabledCartBtn: false })
      if(success) return this.refs.successToast.show(msg)
      else return this.refs.errorToast.show(msg || 'Impossible de mettre à jour la quantité')
    }
  }

  handleBuyNowPress = async () => {
    const res = await this.checkProductAvailability('buyNow')
    if(res && res.isAvailable) {
      const { product } = this.state
      const productData = {
        productId: product._id,
        quantity: res.quantity,
        name: product.name || '',
        price: product.price || 0,
        specialPrice: product.specialPrice || 0,
        photos: product.photos || [],
        maxQuantity: product.quantity || 0,
        optionValues: res.options ? res.options : [],
        optionValueIds: res.optionValueIds ? res.optionValueIds : [],
        deliveryCharge: product.deliveryCharge || 0,
        freeOrderDeliveryLimit: product.freeOrderDeliveryLimit || 0
      }
      const token = JSON.parse(await getData('token'))
      if(token) {
        this.props.navigation.dispatch(
          StackActions.push({
            routeName: 'Main',
            action: NavigationActions.navigate({
              routeName: 'SelectAddress',
              params: { product: productData }
            })
          })
        )
      } else {
        this.props.navigation.navigate('SignUp', { from: 'buyNow', product: productData })
      }
    }
  }

  renderRightButton = () => {
    const { cartTotal } = this.props
    return (
      <View style={styles.row}>
        <TouchableOpacity style={styles.topBarButton} activeOpacity={0.8} onPress={() => this.props.navigation.push('Search')}>
          <CustomIcon name={'search'} size={20} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.topBarButton} activeOpacity={0.8} onPress={() => this.props.navigation.navigate('Cart')}>
          <CustomIcon name={'basket'} size={20} color={colors.white} />
          {cartTotal > 0 &&
            <View style={[styles.cartTotalWrapper, cartTotal > 99 && styles.cartTotal]}>
              <Text style={styles.cartTotalText}>{cartTotal > 99 ? '99+' : cartTotal}</Text>
            </View>
          }
        </TouchableOpacity>
      </View>
    )
  }

  renderProductImageSlider = (product) => {
    const { activePhoto } = this.state
    var photos = []

    if(product && product.photos && product.photos.length > 0) _.each(product.photos, (photo) => photos.push({ photo }))
    else photos = [{ photo: images.placeholder }]

    return (
      <View style={styles.productSlideWrapper}>
        <Carousel
          data={photos}
          renderItem={this.ProductSliderItem}
          sliderWidth={windowWidth - 30}
          itemWidth={windowWidth - 30}
          autoplay={false}
          loop={true}
          autoplayInterval={2000}
          inactiveSlideOpacity={1}
          inactiveSlideScale={1}
          onSnapToItem={(index) => this.setState({ activePhoto: index })}
        />
        <Pagination
          dotsLength={photos.length}
          activeDotIndex={activePhoto}
          dotColor={colors.primary}
          inactiveDotColor={colors.placeholder}
          inactiveDotOpacity={1}
          containerStyle={styles.sliderContainerStyle}
          dotContainerStyle={{ marginHorizontal: 3 }}
          dotStyle={styles.dotStyle}
          inactiveDotScale={1}
        />
      </View>
    )
  }

  ProductSliderItem = ({ item, index }) => (
    <View style={styles.slideImageWrapper}>
      <FastImage
        source={this.getProductImage(item)}
        style={styles.slideImage}
        resizeMode={FastImage.resizeMode.stretch}
      />
    </View>
  )

  getProductImage = (slider) => {
    const { product } = this.state
    return product && product.photos && product.photos.length > 0 ? { uri: slider.photo } : slider.photo
  }

  toggleCollapsible = (key) => {
    const { collapsible } = this.state
    collapsible[key] = !collapsible[key]
    this.setState({ collapsible })
  }

  toggleOptionCollapsible = (options, id) => {
    const { product } = this.state
    _.filter(options, option => {
      if(option._id === id) option.isOpen = !option.isOpen
    })
    product['options'] = options
    this.setState({ product })
  }

  handleOptionValueChange = (optionId, optionValueId) => {
    const { selectedProduct } = this.state
    if(selectedProduct && selectedProduct.options && Array.isArray(selectedProduct.options)) {
      const index = _.findIndex(selectedProduct.options, (option) => option.optionId === optionId)
      if(index == -1) selectedProduct.options.push({ optionId, optionValueId })
      else selectedProduct.options[index] = { optionId, optionValueId }
      this.setState({ selectedProduct })
    }
  }

  isOptionValueSelected = (optionId, optionValueId) => {
    const { selectedProduct } = this.state
    if(selectedProduct && selectedProduct.options && Array.isArray(selectedProduct.options)) {
      const index = _.findIndex(selectedProduct.options, (option) => option.optionId === optionId && option.optionValueId === optionValueId)
      return index != -1
    }
    return false
  }

  renderOption = (option) => {
    if(option.type && option.optionValues && option.optionValues.length > 0) {
      if(option.type === 'radio' || option.type === 'color') {
        return (
          <View style={styles.optionWrapper}>
            {option.optionValues.map((optionValue, index) => {
              const isSelected = this.isOptionValueSelected(option._id, optionValue._id)
              return(
                <TouchableOpacity
                  style={styles.optionInner}
                  key={index}
                  activeOpacity={0.8}
                  onPress={() => this.handleOptionValueChange(option._id, optionValue._id)}
                >
                  <View style={[styles.radioWrapper, { borderColor: isSelected ? colors.primary : colors.darkGray }]}>
                    {isSelected && <View style={styles.radioInnerWrapper} />}
                  </View>
                  <Text style={styles.optionNameText}>{optionValue.value} {(optionValue.price > 0 && optionValue.pricePrefix != null) ?
                    <Text style={styles.optionPriceText}>({optionValue.pricePrefix == 'plus' ? '+' : '-'}€{optionValue.price})</Text> : null}
                  </Text>
                </TouchableOpacity>
              )}
            )}
          </View>
        )
      } else {
        return (
          <View style={styles.selectOptionWrapper}>
            {option.optionValues.map((optionValue, index) => {
              const isOptionSelected = this.isOptionValueSelected(option._id, optionValue._id)
              return (
                <View style={styles.selectOptionInner} key={index}>
                  <TouchableOpacity
                    style={[styles.selectOptionNameWrapper, { backgroundColor: isOptionSelected ? colors.primary : colors.paleGray }]}
                    activeOpacity={0.8}
                    onPress={() => this.handleOptionValueChange(option._id, optionValue._id)}
                  >
                    <Text
                      style={[styles.selectOptionText, { color: isOptionSelected ? colors.white : colors.darkBlack }]}
                    >
                      {optionValue.value}
                    </Text>
                  </TouchableOpacity>
                  {(optionValue.price > 0 && optionValue.pricePrefix !== null) ?
                    <Text style={styles.optionPriceText}>({optionValue.pricePrefix == 'plus' ? '+' : '-'}€{optionValue.price})</Text>
                  : null}
                </View>
              )
            })}
          </View>
        )
      }
    }
    return null
  }

  renderOptions = (product) => {
    if(product && product.options && product.options.length > 0) {
      return (
        product.options.map((option, index) => {
          return (
            <View style={styles.outerWrapper} key={index}>
              <TouchableOpacity style={styles.collapsibleBtn} activeOpacity={0.8} onPress={() => this.toggleOptionCollapsible(product.options, option._id)}>
                <Text style={[styles.textStyle, styles.textCaptitalize]}>{option.name}</Text>
                <MaterialIcon name={option.isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={22} color={colors.darkBlack} />
              </TouchableOpacity>
              <Collapsible collapsed={!option.isOpen}>
                <View style={styles.optionValuesWrapper}>
                  {this.renderOption(option)}
                </View>
              </Collapsible>
            </View>
          )
        })
      )
    }
  }

  renderQuantity = (product) => {
    const { selectedProduct } = this.state
    return (
      <View style={[styles.outerWrapper, styles.quantityWrapper]}>
        <Text style={styles.textStyle}>Quantité</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.quantityButton} activeOpacity={0.8} onPress={() => this.manageQuantity('minus')} disabled={selectedProduct.quantity <= 0}>
            <MaterialIcon name={'remove'} size={20} color={colors.darkBlack} />
          </TouchableOpacity>
          <View style={styles.quantityTextWrapper}>
            <Text style={[styles.textStyle, styles.fontRegular]}>{selectedProduct.quantity}</Text>
          </View>
          <TouchableOpacity style={styles.quantityButton} activeOpacity={0.8} onPress={() => this.manageQuantity('add')}>
            <MaterialIcon name={'add'} size={20} color={colors.darkBlack} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderDescription = (product) => {
    const { collapsible, webViewHeight } = this.state
    if(product && product.description && product.description != undefined) {
      return (
        <View style={styles.outerWrapper}>
          <TouchableOpacity style={styles.collapsibleBtn} activeOpacity={0.8} onPress={() => this.toggleCollapsible('isDetailsCollapsed')}>
            <Text style={styles.textStyle}>Détails du produit</Text>
            <MaterialIcon name={collapsible.isDetailsCollapsed ? 'keyboard-arrow-down' : 'keyboard-arrow-up'} size={22} color={colors.darkBlack} />
          </TouchableOpacity>
          <Collapsible collapsed={collapsible.isDetailsCollapsed}>
            <View style={styles.innerWrapper}>
              <AutoHeightWebView
                source={{ html: `
                  <head><link href="https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,400;0,500;0,700;1,500;1,600&display=swap" rel="stylesheet"></head>
                  ${product.description}
                ` }}
                style={styles.webView}
                viewportContent={'width=device-width, user-scalable=no'}
                customStyle={`
                  * {
                    font-family: 'Karla', sans-serif;
                    font-size: 14px;
                    color: #222222;
                    max-width: 100%;
                  }
                `}
                zoomable={false}
                scrollEnabled={false}
                nestedScrollEnabled={false}
              />
            </View>
          </Collapsible>
        </View>
      )
    }
  }

  renderSimilarProducts = (product) => {
    const { navigation } = this.props
    const { similarProducts } = this.state
    if(similarProducts && similarProducts.length > 0) {
      return (
        <SpecialProducts
          products={similarProducts}
          from={'ProductDetail'}
          title={'Produits similaires'}
          wrapperStyle={styles.productsWrapper}
          onAllPress={() => navigation.navigate('Products', { type: 'similar', skip: similarProductsLimit, title: 'Produits similaires', productId: product._id })}
          navigation={navigation}
        />
      )
    }
  }

  renderActionButton = () => {
    const { isDisabledCartBtn, isDisabledBuyNowBtn } = this.state
    return (
      <View style={styles.bottomWrapper}>
        <TouchableOpacity
          style={[styles.actionButton, styles.cartButton]}
          activeOpacity={0.8}
          onPress={() => this.handleAddToCartPress()}
          disabled={isDisabledCartBtn || isDisabledBuyNowBtn}
        >
          {isDisabledCartBtn ?
            <ActivityIndicator color={colors.white} size={'small'} />
          :
            <Text style={styles.actionButtonText}>AJOUTER AU PANIER</Text>
          }
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.buyNowButton]}
          activeOpacity={0.8}
          onPress={() => this.handleBuyNowPress()}
          disabled={isDisabledCartBtn || isDisabledBuyNowBtn}
        >
          {isDisabledBuyNowBtn ?
            <ActivityIndicator color={colors.white} size={'small'} />
          :
            <Text style={styles.actionButtonText}>ACHETER MAINTENANT</Text>
          }
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { navigation } = this.props
    const { loading, product } = this.state
    const discount = product && product.price && product.price > product.specialPrice ? Math.floor(100 - ((100 * product.specialPrice) / product.price)) : 0
    return (
      <View style={sharedStyles.containerWrapper}>
        <TopNavBar navigation={navigation} buttonRight={() => this.renderRightButton()} />
        <View style={styles.scrollViewWraper}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={loading && styles.scrollViewContainerStyle}
          >
            {loading ?
              <Spinner />
            :
              ((product && product._id !== undefined) &&
                <>
                  <View style={styles.infoWrapper}>
                    {this.renderProductImageSlider(product)}
                    <Text style={styles.productName}>{product.name}</Text>
                    {product.shortDescription !== null && <Text style={styles.shortDescriptionText}>{product.shortDescription}</Text>}
                    <View style={styles.row}>
                      <Text style={styles.priceText}>€{product.specialPrice}</Text>
                      {(product.price > product.specialPrice) &&
                        <View style={styles.row}>
                          <Text style={styles.oldPriceText}>€{product.price}</Text>
                          <Text style={styles.discountText}>- {discount}% À L'ARRÊT</Text>
                        </View>
                      }
                    </View>
                    <Text style={styles.taxText}>Incl. de tous les impôts</Text>
                  </View>
                  {this.renderOptions(product)}
                  {this.renderQuantity(product)}
                  {this.renderDescription(product)}
                  {this.renderSimilarProducts(product)}
                </>
              )
            }
          </ScrollView>
        </View>
        {(!loading && product && product._id !== undefined) && this.renderActionButton()}
        <Toast
          ref={'errorToast'}
          position={'center'}
          positionValue={150}
          style={styles.errorToast}
          textStyle={styles.errorToastText}
        />
        <Toast ref={'successToast'} position={'center'} positionValue={150} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  cartTotal: state.cart.total
});

const mapDispatchToProps = dispatch => ({
  getProducts: (data) => dispatch(getProducts(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
