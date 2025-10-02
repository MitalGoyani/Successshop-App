import _ from 'underscore';

const intialState = {
  cart: {products: [], deliveryCharge: 0},
  loading: false,
  error: null,
  total: 0
}

export default function cartReducer(state = intialState, action) {
  switch (action.type) {
    case 'GET_CART':
      return { ...state, cart: action.data, total: action.data.products.length };
    case 'CART_LOADING':
      return { ...state, loading: action.isLoading };
    case 'UPDATE_CART':
      let products = state.cart.products
      var index = -1;
      for(let i = 0; i < products.length; i++) {
        if(products[i].productId === action.product.productId) {
          if(action.product.optionValues && action.product.optionValues.length > 0) {
            if(products[i].optionValues && products[i].optionValues.length > 0 && _.isEqual(_.pluck(action.product.optionValues, '_id'), _.pluck(products[i].optionValues, '_id'))) {
              index = i
              break;
            }
          } else {
            index = i
            break;
          }
        }
      }
      if(index !== -1) {
        if(action.product.quantity > 0) products[index] = action.product
        else products.splice(index,1);
      } else {
        products.push(action.product)
      }
      return { ...state, cart: { ...state.cart, products }, total: products.length }
    case 'CART_ERROR':
      return { cart: { products: [], deliveryCharge: 0 }, loading: false, error: action.error, total: 0 };
    case 'RESET_CART':
      return { cart: { products: [], deliveryCharge: 0 }, loading: false, error: null, total: 0 };
    default:
      return state;
  }
};
