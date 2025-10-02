import React from 'react';
import { Text, Image } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';

import Sidebar from './views/Sidebar';
import SignUp from './views/SignUp';
import Login from './views/Login';
import ForgotPassword from './views/ForgotPassword';
import Home from './views/Home';
import Categories from './views/Categories';
import Order from './views/Order';
import OrderDetail from './views/OrderDetail';
import Cart from './views/Cart';
import SelectAddress from './views/SelectAddress';
import AddEditAddress from './views/AddEditAddress';
import OrderSummary from './views/OrderSummary';
import Payment from './views/Payment';
import Search from './views/Search';
import Products from './views/Products';
import ProductDetail from './views/ProductDetail';
import AuthLoading from './views/AuthLoading';
import Profile from './views/Profile';
import EditProfile from './views/EditProfile';
import Notification from './views/Notification';
import Addressess from './views/Addressess';
import PrivacyPolicy from './views/PrivacyPolicy';
import Terms from './views/Terms';
import Contact from './views/Contact';
import ChangePassword from './views/ChangePassword';
import CartIconWithBadge from './views/CartIconWithBadge';
import { CustomIcon } from './utils/Icons';
import styles from './styles';
import { colors } from './constants/colors';
import { getData } from './utils/storage';
import { windowWidth } from './utils/deviceInfo';
import { getActiveRouteName } from './utils/navigation';

const AuthStack = createStackNavigator(
  {
    SignUp: SignUp,
    Login: Login,
    ForgotPassword: ForgotPassword
  },
  {
    headerMode: 'none',
    mode: 'modal'
  }
);

const ProfileStack = createStackNavigator(
  {
    Profile: Profile,
    EditProfile: EditProfile
  },
  {
    headerMode: 'none',
    mode: 'modal'
  }
);

const AccountStack = createSwitchNavigator(
    {
      AuthLoading: AuthLoading,
      Profile: ProfileStack,
      Auth: AuthStack
    },
    {
      initialRouteName: 'AuthLoading',
      navigationOptions: ({ navigation }) => {
        const activeRouteName = getActiveRouteName(navigation.state)
        return ({
          tabBarVisible: activeRouteName && activeRouteName === 'Profile' ? true : false
        })
      }
    }
)

const OrderStack = createStackNavigator(
  {
    Order: Order,
    OrderDetail: OrderDetail
  },
  {
    headerMode: 'none',
    navigationOptions: ({ navigation }) => ({
      tabBarVisible: navigation.state.routes[navigation.state.index].routeName === 'Order' ? true : false
    })
  }
);

const CartStack = createStackNavigator(
  {
    Cart: Cart,
    SelectAddress: SelectAddress,
    AddEditAddress: AddEditAddress,
    OrderSummary: OrderSummary,
    Payment: Payment
  },
  {
    headerMode: 'none',
    initialRouteName: 'Cart',
    navigationOptions: ({ navigation }) => ({
      tabBarVisible: false
    })
  }
);

const TabStack = createBottomTabNavigator(
  {
    Home: Home,
    Order: OrderStack,
    Cart: CartStack,
    Category: Categories,
    Account: AccountStack
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state;
      return ({
        tabBarIcon: ({ tintColor }) => {
          let iconName, size = 23;
          if (routeName === 'Home') iconName = 'house'
          else if (routeName === 'Order') iconName = 'order', size = 30
          else if (routeName === 'Cart') return <CartIconWithBadge />
          else if (routeName === 'Category') iconName = 'category'
          else if (routeName === 'Account') iconName = 'user'
          console.log(iconName, 'ICON')
          return <CustomIcon name={iconName} size={size} color={tintColor} />
        },
        tabBarLabel: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state;
          let title;
          if (routeName === 'Home') title = 'Domicile'
          else if (routeName === 'Order') title = 'Ordres'
          else if (routeName === 'Cart') title = ''
          else if (routeName === 'Category') title = 'Catégories'
          else if (routeName === 'Account') title = 'Le profil'
          return title ? <Text style={[styles.tabLabelStyle, { color: tintColor }]}>{title}</Text> : null
        },
        tabBarOptions: {
          activeTintColor: colors.primary,
          inactiveTintColor: colors.gray,
          safeAreaInset: { bottom: 'never', top: 'never' },
          style: styles.tabBarStyle,
          tabStyle: styles.tabStyle
        }
      })
    }
  }
);

const MainNavigator = createDrawerNavigator({
  Tab: TabStack,
}, {
  drawerWidth: windowWidth * 0.82,
	contentComponent: Sidebar
});

const RootNavigator = createStackNavigator(
  {
      Main: MainNavigator,
      ProductDetail: ProductDetail,
      Search: Search,
      Products: Products,
      Notification: Notification,
      Addressess: Addressess,
      PrivacyPolicy: PrivacyPolicy,
      Terms: Terms,
      Contact: Contact,
      ChangePassword: ChangePassword
  },
  {
    headerMode: 'none'
  }
);

export const AppNavigator = createAppContainer(RootNavigator);
