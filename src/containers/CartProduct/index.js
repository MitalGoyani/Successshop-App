import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Alert from '../../containers/Alert';
import _ from 'underscore';
import styles from './styles';
import { colors } from '../../constants/colors';
import { images } from '../../../assets';
import { isProductAvailable, updateCartFn } from '../../utils/appUtils';

class CartProduct extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      disabled: false,
      isConfirmationModal: false,
      selectedProduct: null
    }
    this.swipeableRefs = {}
    this.openCellKey = null
  }

  manageQuantity = async (product, quantity, type) => {
    this.setState({ disabled: true })
    if(type && type == 'plus') {
      const { isAvailable, message } = isProductAvailable(quantity, { productId: product.productId, quantity: product.maxQuantity },  product.optionValues, false)
      if(!isAvailable) {
        this.setState({ disabled: false })
        return this.props.showMsg(message)
      }
    }

    const productData = { ...product, quantity }
    const optionValues = product.optionValues && product.optionValues.length > 0 ? _.pluck(product.optionValues, '_id') : []
    const { success, msg } = await updateCartFn(productData, quantity, optionValues)
    this.setState({ disabled: false })
    if(type === 'remove') {
      this.setState({ selectedProduct: null })
      return success ? this.props.showSuccessMsg('Élément supprimé avec succès') : this.props.showMsg(`mpossible de supprimer l'élément`)
    } else {
      if(!success) return this.props.showMsg(msg || 'Impossible de mettre à jour la quantité')
    }
  }

  getProuductInfo = (product) => {
    var optionValuesPriceTotal = 0, isAvailable = true
    if(product.optionValues && product.optionValues.length > 0) {
      _.each(product.optionValues, (value) => {
        if(value.price && value.price > 0) optionValuesPriceTotal = value.pricePrefix && value.pricePrefix == 'minus' ? optionValuesPriceTotal - value.price : optionValuesPriceTotal + value.price
        if(value.quantity <= 0) isAvailable = false
      })
    }
    const sellPrice = product.specialPrice + optionValuesPriceTotal

    if(product.maxQuantity <= 0) isAvailable = false

    return { price: sellPrice > product.price ? sellPrice : product.price, specialPrice: sellPrice > 0 ? sellPrice : 0, isAvailable }
  }

  openConfirmationModal = (product, index) => {
    this.swipeableRefs[index].close()
    this.setState({ isConfirmationModal: true, selectedProduct: product })
  }

  closeConfirmationModal = () => {
    this.setState({ isConfirmationModal: false, selectedProduct: null })
  }

  removeProductFromCart = async (product) => {
    const { selectedProduct } = this.state
    this.setState({ isConfirmationModal: false })
    if(selectedProduct && selectedProduct.productId) await this.manageQuantity(selectedProduct, 0, 'remove')
  }

  renderProduct = (item, index) => {
    if(this.props.from && this.props.from === 'cart') {
      return (
        <Swipeable
          ref={ref => this.swipeableRefs[index] = ref}
          renderLeftActions={() => this.renderRemoveView(item, index)}
          overshootLeft={false}
          onSwipeableLeftOpen={() => this.onSwipeableLeftOpen(index)}
          key={index}
        >
          {this.renderRow(item, index)}
        </Swipeable>
      )
    }
    return this.renderRow(item, index)
  }

  renderRemoveView = (product, index) => {
    return (
      <View style={styles.removeButtonWrapper}>
        <TouchableOpacity style={styles.removeButton} activeOpacity={0.4} onPress={() => this.openConfirmationModal(product, index)}>
          <AntDesignIcon name={'delete'} size={20} color={colors.red} />
        </TouchableOpacity>
      </View>
    )
  }

  renderRow = (item, index) => {
    const { props } = this
    const { price, specialPrice, isAvailable } = this.getProuductInfo(item)
    const { disabled } = this.state
    const productImage = item.photos && item.photos.length > 0 ? { uri: item.photos[0] } : images.placeholder;
    return (
      <TouchableOpacity
        style={[
          styles.productWrapper,
          { paddingTop: index == 0 ? 0 : 16, paddingBottom: index + 1 == props.products.length ? 0 : 16, borderBottomWidth: index + 1 == props.products.length ? 0 : 1 }
        ]}
        key={index}
        onPress={() => props.navigation.push('ProductDetail', { productId: item.productId })}
        activeOpacity={0.9}
      >
        <View style={styles.imageWrapper}>
          <FastImage source={productImage} resizeMode={FastImage.resizeMode.contain} style={styles.productImage} />
        </View>
        <View style={[styles.rightWrapper, props.rightWrapperStyle]}>
          <Text style={[styles.nameText, item.maxQuantity <= 0 ? styles.nameTextWidth : {}]} numberOfLines={1} ellipsizeMode={'tail'}>{item.name}</Text>
          {this.renderOptions(item)}
          <View style={styles.infoWrapper}>
            <Text style={styles.priceText}>€{specialPrice} {(price > specialPrice) && <Text style={styles.oldPriceText}>€<Text style={styles.strikeText}>{price}</Text></Text>}</Text>
            {(props.from && props.from === 'cart') ? (
              isAvailable ?
                <View style={[styles.quantityWrapper, { marginRight: props.from && props.from === 'cart' ? 3 : 0}]}>
                  <TouchableOpacity
                    style={styles.minusQuantityView}
                    activeOpacity={0.6}
                    onPress={() => this.manageQuantity(item, item.quantity - 1, 'minus')}
                    disabled={item.quantity <= 0 || disabled}
                  >
                    <MaterialIcon name={'remove'} size={20} color={colors.darkBlack} />
                  </TouchableOpacity>
                  <View style={styles.quantityView}>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.plusQuantityView}
                    activeOpacity={0.6}
                    onPress={() => this.manageQuantity(item, item.quantity + 1, 'plus')}
                    disabled={disabled}
                  >
                    <MaterialIcon name={'add'} size={20} color={colors.white} />
                  </TouchableOpacity>
                </View>
               :
                <Text style={styles.comingSoonText}>À venir</Text>
            )
          :
            <Text style={styles.quantityTitleText}>Quantité: <Text style={styles.colorBlack}>{item.quantity}</Text></Text>
          }
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderOptions = (item) => {
    if(item && item.optionValues && item.optionValues.length > 0) {
      return (
        <View style={styles.optionsWrapper}>
          {item.optionValues.map((option, index) => {
            return (
              <React.Fragment key={index}>
                <Text style={styles.optionTitleText}>{option.name !== undefined && `${option.name}:`} <Text style={styles.optionValueText}>{option.value !== undefined && option.value}</Text></Text>
                {index + 1 !== item.optionValues.length && <View style={styles.optionBorder}></View>}
              </React.Fragment>
            )
          })}
        </View>
      )
    }
    return null
  }

  onSwipeableLeftOpen = (key) => {
    if (this.openCellKey !== key) {
      const rowRef = this.swipeableRefs[this.openCellKey]
      if(rowRef) this.swipeableRefs[this.openCellKey].close()
    }
    this.openCellKey = key
  }

  render() {
    const { props } = this
    const { products } = this.props
    const { isConfirmationModal } = this.state

    if(products && products.length > 0) {
      return (
        <View style={[styles.wrapper, props.wrapperStyle]}>
          {products.map((item, index) => this.renderProduct(item, index))}
          {isConfirmationModal &&
            <Alert
              isVisible={isConfirmationModal}
              message={'Voulez-vous vraiment supprimer cet élément ?'}
              cancelText={'Annuler'}
              confirmText={'Supprimer'}
              onConfirm={() => this.removeProductFromCart()}
              onClosed={() => this.closeConfirmationModal()}
            />
          }
        </View>
      )
    }
    return null
  }
}

export default CartProduct
