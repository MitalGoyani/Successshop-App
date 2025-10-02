import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import FastImage from 'react-native-fast-image';
import { RectButton } from 'react-native-gesture-handler';
import apolloClient from '../../graphql/client';
import { GET_PRIVACY_POLICY, GET_TERMS } from '../../graphql/queries';
import { CustomIcon } from '../../utils/Icons';
import Spinner from '../../containers/Spinner';
import styles from './styles';
import { colors } from '../../constants/colors';
import { images } from '../../../assets';
import { getActiveRouteName } from '../../utils/navigation';

class Sidebar extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      isPrivacyPolicy: false,
      isTermsandConditions: false
    }
  }

  async componentDidMount() {
    await this.isPrivacyPolicy()
    await this.isTermsandConditions()
    this.setState({ isLoading: false })
  }

  isPrivacyPolicy = async () => {
    try {
      const result = await apolloClient.query({
        query: GET_PRIVACY_POLICY,
        fetchPolicy: 'no-cache'
      })
      if(result && result.data && result.data.getPrivacyPolicy && result.data.getPrivacyPolicy.trim() !== '') this.setState({ isPrivacyPolicy: true })
    } catch (error) {
      console.log(error)
    }
  }

  isTermsandConditions = async () => {
    try {
      const result = await apolloClient.query({
        query: GET_TERMS,
        fetchPolicy: 'no-cache'
      })
      if(result && result.data && result.data.getTerms && result.data.getTerms.trim() !== '') this.setState({ isTermsandConditions: true })
    } catch (error) {
      console.log(error)
    }
  }

  handleNavigation = (screenName) => {
    const { props } = this
    if(screenName) {
      const activeRoute = getActiveRouteName(props.navigation.state)
      if(screenName === activeRoute) this.props.navigation.closeDrawer()
      else {
        if(screenName === 'Notification' || screenName === 'PrivacyPolicy' || screenName === 'Terms') this.props.navigation.closeDrawer()
        this.props.navigation.navigate(screenName)
      }
    }
  }

  renderDrawerItem = (itemName, iconName, screenName) => (
    <RectButton style={styles.itemWrapper} activeOpacity={0.08} onPress={() => this.handleNavigation(screenName)}>
      <CustomIcon name={iconName} size={20} color={colors.darkBlack} />
      <Text style={styles.menuItemText}>{itemName}</Text>
    </RectButton>
  )

  renderOtherItem = (itemName, screenName) => (
    <TouchableOpacity style={styles.otherItemWrapper} activeOpacity={0.8} onPress={() => this.handleNavigation(screenName)}>
      <Text style={styles.otherItemText}>{itemName}</Text>
    </TouchableOpacity>
  )


  render() {
    const { isLoading, isPrivacyPolicy, isTermsandConditions } = this.state
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainerStyle}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        { isLoading ?
          <Spinner style={styles.spinnerStyle} />
        :
          <>
            <View style={styles.logoWrapper}>
              <FastImage source={images.menuLogo} resizeMode={FastImage.resizeMode.contain} style={styles.logo} />
            </View>
            {this.renderDrawerItem('Domicile', 'house', 'Home')}
            {this.renderDrawerItem('Toutes catégories', 'category', 'Category')}
            {this.renderDrawerItem('Mon compte', 'user', 'Profile')}
            {this.renderDrawerItem('Ma ordre', 'sent', 'Order')}
            {this.renderDrawerItem('Mon panier', 'basket', 'Cart')}
            {this.renderDrawerItem('Notification', 'bell', 'Notification')}
            {this.renderDrawerItem('Nous contacter', 'smartphone', 'Contact')}

            {(isPrivacyPolicy || isTermsandConditions) &&
              <View style={styles.otherWrapper}>
                <Text style={styles.otherText}>Autre</Text>
                {isTermsandConditions && this.renderOtherItem('Termes et conditions', 'Terms')}
                {isPrivacyPolicy && this.renderOtherItem('Politique de confidentialité', 'PrivacyPolicy')}
              </View>
            }
          </>
        }
      </ScrollView>
    )
  }
}

export default Sidebar
