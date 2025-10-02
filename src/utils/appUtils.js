import _ from 'underscore';
import store from '../store';
import { getData, setData } from './storage';
import apolloClient from '../graphql/client';
import { GET_TEMP_USER_ID } from '../graphql/queries';
import { UPDATE_CART } from '../graphql/mutations';
import { updateCart } from '../actions/cart';

export const getCartData = (cart) => {
  var totalDiscount = 0, payableAmount = 0

  if(cart.products && cart.products.length > 0) {
    _.each(cart.products, (product) => {
      const optionsQuantity = product.optionValues && product.optionValues.length ? _.pluck(product.optionValues, 'quantity') : []
      if(product.maxQuantity > 0 && !_.contains(optionsQuantity, 0)) {
        var optionValuesPriceTotal = 0
        if(product.optionValues && product.optionValues.length > 0) {
          _.each(product.optionValues, (value) => {
            if(value.price && value.price > 0) optionValuesPriceTotal = value.pricePrefix && value.pricePrefix == 'minus' ? optionValuesPriceTotal - value.price : optionValuesPriceTotal + value.price
          })
        }
        const productSellPrice = product.specialPrice + optionValuesPriceTotal
        payableAmount = payableAmount + (productSellPrice > 0 ? (productSellPrice * product.quantity) : 0)
        totalDiscount = totalDiscount + (productSellPrice > product.price ? 0 : (product.price - (productSellPrice > 0 ? productSellPrice : 0)) * product.quantity)
      }
    })
  }

  return { totalDiscount, payableAmount }
}

export const isProductAvailable = (quantity, product, option, isCheckCartQuantity, type) => {
  var selectedQuantity = quantity, cartProductQty = 0, optionValues = JSON.parse(JSON.stringify(option));
  const { cart } = store.getState().cart

  for(let i = 0; i < cart.products.length; i++) {
    if(cart.products[i].productId === product.productId) {
       if(isCheckCartQuantity) cartProductQty = cartProductQty + cart.products[i].quantity

      const productOptions = _.pluck(cart.products[i].optionValues, '_id')
      if(!type || (type && type !== 'buyNow')) {
        if(cart.products[i].optionValues && cart.products[i].optionValues.length > 0) {
          optionValues.map((optionValue) => {
            const isOption = _.contains(productOptions, optionValue._id)
            if(isOption) {
              if(isCheckCartQuantity) {
                optionValue.quantity = optionValue.quantity - cart.products[i].quantity > 0 ? optionValue.quantity - cart.products[i].quantity : 0
              } else {
                if(!_.isEqual(_.pluck(optionValues, '_id'), productOptions)) optionValue.quantity = optionValue.quantity - cart.products[i].quantity > 0 ? optionValue.quantity - cart.products[i].quantity : 0
              }
            }
          })
        }
      }

      if(isCheckCartQuantity) {
        if(option && option.length > 0) {
          if(_.isEqual(_.pluck(optionValues, '_id'), productOptions)) selectedQuantity = selectedQuantity + cart.products[i].quantity
        } else selectedQuantity = selectedQuantity + cart.products[i].quantity
      }
    }
  }

  var minOptQty = undefined
  if(optionValues && optionValues.length > 0) minOptQty = _.min(_.pluck(optionValues, 'quantity'))

  if((cartProductQty + quantity > product.quantity) || (!_.isUndefined(minOptQty) && minOptQty < quantity)) {
    const availableProQty = product.quantity - cartProductQty > 0 ? product.quantity - cartProductQty : 0
    return { isAvailable: false, message: `${!_.isUndefined(minOptQty) && minOptQty < availableProQty ? minOptQty : availableProQty} quantités disponibles` }
  }

  return { isAvailable: true, message: `produit disponible`, quantity: selectedQuantity }
}

export const updateCartFn = async (product, quantity, optionValueIds) => {
  async function handleUpdateCart(userId) {
    const args = { productId: product.productId, quantity }
    if(optionValueIds && optionValueIds.length > 0) args['optionValueIds'] = optionValueIds
    if(userId) args['userId'] = userId
    try {
      const result = await apolloClient.mutate({
        mutation: UPDATE_CART,
        variables: {
          ...args
        }
      });
      if (result && result.data && result.data.updateCart) {
        await store.dispatch(updateCart(product))
        return { success: true, msg: 'Article ajouté au panier avec succès' }
      }
      return { success: false, msg: 'Impossible de mettre à jour la quantité' }
    } catch (error) {
      return { success: false, msg: 'Impossible de mettre à jour la quantité' }
    }
  }

  const token = JSON.parse(await getData('token'))
  if(token) return await handleUpdateCart()
  else {
    const tempUserId = JSON.parse(await getData('tempUserId'))
    if(tempUserId) {
      return await handleUpdateCart(tempUserId)
    } else {
      try {
        const result = await apolloClient.query({
          query: GET_TEMP_USER_ID,
          fetchPolicy: 'no-cache'
        })
        if (result && result.data && result.data.getTempUserId) {
          await setData('tempUserId', result.data.getTempUserId)
          return await handleUpdateCart(result.data.getTempUserId)
        } else {
          return { success: false, msg: 'Impossible de mettre à jour la quantité' }
        }
      } catch (error) {
        return { success: false, msg: 'Impossible de mettre à jour la quantité' }
      }
    }
  }
}
