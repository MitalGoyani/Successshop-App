import { combineReducers } from 'redux';
import loginReducer from './login';
import categoryReducer from './category';
import productReducer from './products';
import sliderReducer from './slider';
import searchProductReducer from './searchProducts';
import cartReducer from './cart';
import addressReducer from './address';
import orderReducer from './order';
import notificationReducer from './notification';

export default combineReducers({
  login: loginReducer,
  category: categoryReducer,
  product: productReducer,
  slider: sliderReducer,
  searchProducts: searchProductReducer,
  cart: cartReducer,
  address: addressReducer,
  order: orderReducer,
  notification: notificationReducer
});
