import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, ScrollView, RefreshControl
} from 'react-native';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import sharedStyles from '../../styles';
import styles from './styles';
import { colors } from '../../constants/colors';
import { images } from '../../../assets';
import apolloClient from '../../graphql/client';
import { UNREAD_NOTIFICATION_COUNT } from '../../graphql/queries';
import { getCategories } from '../../actions/category';
import { getProducts } from '../../actions/products';
import { getSliderPhotos } from '../../actions/slider';
import { setNotificationCount } from '../../actions/notification';
import { getCart } from '../../actions/cart';
import { getData } from '../../utils/storage';
import Spinner from '../../containers/Spinner';
import TopNavBar from '../../containers/TopNavBar/index';
import SpecialProducts from '../../containers/SpecialProducts/index';
import Toast from '../../containers/Toast';
import { windowWidth, SLIDER_ITEM_WIDTH } from '../../utils/deviceInfo';
import { CustomIcon } from '../../utils/Icons';

const categoriesLimit = 10
const specialProductsLimit = 4
const bestSellingProductsLimit = 2
const popularProductsLimit = 50

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      loading: true,
      activeSlide: 0
    }
    this.focusListener = this.props.navigation.addListener('willFocus', async () => {
      await this.props.getCategories({ skip: 0, limit: categoriesLimit })
      await this.props.getSliderPhotos()
      await this.load()
      this.setState({ loading: false })
    })
  }

  async componentDidMount() {
    await this.getCartDetails()
    await this.getUnreadNotificationsCount()
  }

  async componentWillReceiveProps(nextProps) {
    if (this.props.userToken !== nextProps.userToken) await this.getUnreadNotificationsCount();
  }

  componentWillUnmount() {
    this.focusListener.remove()
    if (this.observableQuery && this.observableQuery._state !== 'closed') this.observableQuery.unsubscribe();
  }

  load = async () => {
		await this.props.getProducts({ limit: specialProductsLimit, skip: 0, type: 'special' })
    await this.props.getProducts({ limit: bestSellingProductsLimit, skip: 0, type: 'bestSelling' })
    await this.props.getProducts({ limit: popularProductsLimit, skip: 0, type: 'popular' })
	}

  getCartDetails = async () => {
    const token = JSON.parse(await getData('token'))
    if(token) {
      await this.props.getCart()
    } else {
      const tempUserId = JSON.parse(await getData('tempUserId'))
      if(tempUserId) await this.props.getCart(tempUserId)
    }
  }

  getUnreadNotificationsCount = async () => {
    if (this.observableQuery && this.observableQuery._state !== 'closed') {
      this.observableQuery.unsubscribe();
    }
    const token = JSON.parse(await getData('token'))
    if(token) {
      this.setNotificationObservable()
    } else {
      const tempUserId = JSON.parse(await getData('tempUserId'))
      if(tempUserId) this.setNotificationObservable(tempUserId)
    }
  }

  setNotificationObservable = (userId) => {
    const data = {}
    if(userId) data['userId'] = userId

    try {
      this.observableQuery = apolloClient.watchQuery({
        query: UNREAD_NOTIFICATION_COUNT,
        variables: {
          ...data
        },
        pollInterval: 500
      }).subscribe({
        next: ({ data }) => {
          if(data) this.props.setNotificationCount(data.notificationCount)
        },
        error: (error) => {
          console.log(error)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }


  handleRefresh = async () => {
    this.setState({ refreshing: true })
    await this.load()
    this.setState({ refreshing: false })
  }

  renderSlider = () => {
    const { sliderPhotos } = this.props
    const photos = sliderPhotos && sliderPhotos.length > 0 ? sliderPhotos : [{ photo: images.slider1 }, { photo: images.slider2 }, { photo: images.slider3 }]

    return (
      <View style={styles.slideShowWrapper}>
        <Carousel
          data={photos}
          renderItem={this.SliderCardItem}
          sliderWidth={windowWidth - 30}
          itemWidth={SLIDER_ITEM_WIDTH}
          autoplay={true}
          loop={true}
          autoplayInterval={2000}
          inactiveSlideOpacity={1}
          inactiveSlideScale={1}
          onSnapToItem={(index) => this.setState({ activeSlide: index })}
        />
        <Pagination
          dotsLength={photos.length}
          activeDotIndex={this.state.activeSlide}
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

  SliderCardItem = ({ item, index }) => (
    <View style={styles.slideImageWrapper}>
      <FastImage
        source={this.getSliderImage(item)}
        style={styles.slideImage}
        resizeMode={FastImage.resizeMode.stretch}
      />
    </View>
  )

  getSliderImage = (slider) => {
    return this.props.sliderPhotos && this.props.sliderPhotos.length > 0 ? { uri: slider.photo } : slider.photo
  }

  renderCategory = () => {
    const categories = [...this.props.categories, { name: 'Toutes catégories' }]
    if(this.props.categories.length > 0) {
      return (
        <View style={styles.categoriesWrapper}>
          <FlatList
            ref={ref => this.categoryList = ref}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            removeClippedSubviews
            style={styles.flatList}
            contentContainerStyle={{ flexGrow: 1 }}
            data={categories}
            renderItem={item => this.renderCategoryCircle(item)}
            bounces={false}
          />
        </View>
      )
    } else {
      return (
        <View style={styles.emptyCategoryWrapper}>
          <Text style={styles.emptyCategoryText}>Aucune catégorie trouvée</Text>
        </View>
      )
    }
  }

  renderCategoryCircle = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={1}
        onPress={() => this.handleCategoryPress(item, index == this.props.categories.length)}
      >
        <View style={[styles.categoryWrapper, { marginLeft: index == 0 ? 16 : 8, marginRight: index == this.props.categories.length ? 16 : 8 }]}>
          {index != this.props.categories.length ?
            <View style={styles.categoryImageWrapper}>
              {(item.photo && item.photo !== '') ?
                <FastImage source={{ uri: item.photo }} style={styles.categoryImage} resizeMode={FastImage.resizeMode.contain} />
              :
                <Text style={styles.categoryText}>C</Text>
              }
            </View>
          :
            <View style={[styles.categoryImageWrapper, styles.bgPrimary]}>
              <CustomIcon name={'options-lines'} size={36} color={colors.white} />
            </View>
          }
          <Text
            style={styles.categoryName}
            numberOfLines={1}
            ellipsizeMode={'tail'}
          >
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  handleCategoryPress = (category, isAllCategory) => {
    const { navigation } = this.props
    if(isAllCategory) navigation.navigate('Category')
    else navigation.navigate('Products', { categoryId: category._id, title: category.name })
  }

  loadingView = () => (
    <View style={sharedStyles.container}>
      <TopNavBar navigation={this.props.navigation} from={'home'}/>
      <Spinner />
    </View>
  )

  handleAllPress = (type, title) => {
    this.props.navigation.navigate('Products', { type, title })
  }

  render() {
    const { navigation, unreadNotificationCount, categories, specialDealProducts, bestSellingProducts, popularProducts } = this.props
    const { loading } = this.state

    return (
      <View style={sharedStyles.container}>
        <TopNavBar navigation={navigation} from={'home'} notificationCount={unreadNotificationCount} />
        <View style={styles.scrollViewWraper}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => this.handleRefresh()}
                colors={[colors.primary]}
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={loading && styles.scrollViewContainerStyle}
          >
            {loading ?
              <Spinner />
            :
              <>
                {this.renderCategory()}
                {this.renderSlider()}
                {specialDealProducts && specialDealProducts.length > 0 &&
                  <>
                    <SpecialProducts
                      products={specialDealProducts.slice(0, specialProductsLimit)}
                      from={'Home'}
                      title={'Offres spéciales'}
                      wrapperStyle={styles.productsWrapper}
                      onAllPress={() => this.handleAllPress('special', 'Offres spéciales')}
                      navigation={navigation}
                    />
                    <FastImage
                      source={images.offerBanner1}
                      style={styles.offerBannerImage}
                      resizeMode={FastImage.resizeMode.stretch}
                    />
                  </>
                }
                {bestSellingProducts && bestSellingProducts.length > 0 &&
                  <>
                    <SpecialProducts
                      products={bestSellingProducts.slice(0, bestSellingProductsLimit)}
                      from={'Home'}
                      title={'Meilleure vente'}
                      wrapperStyle={styles.productsWrapper}
                      onAllPress={() => this.handleAllPress('bestSelling', 'Meilleure vente')}
                      navigation={navigation}
                    />
                    <FastImage
                      source={images.offerBanner2}
                      style={styles.offerBanner2Image}
                      resizeMode={FastImage.resizeMode.stretch}
                    />
                  </>
                }
                {popularProducts && popularProducts.length > 0 &&
                  <SpecialProducts
                    products={popularProducts.slice(0, popularProductsLimit)}
                    from={'Home'}
                    title={'Produits populaires'}
                    wrapperStyle={styles.productsWrapper}
                    onAllPress={() => this.handleAllPress('popular', 'Produits populaires')}
                    navigation={navigation}
                  />
                }
              </>
            }
          </ScrollView>
        </View>
        <Toast ref="msgToast" position='center' positionValue={170} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  categories: state.category.categories,
  specialDealProducts: state.product.special.products,
  bestSellingProducts: state.product.bestSelling.products,
  popularProducts: state.product.popular.products,
  totalProduct: state.product.total,
  sliderPhotos: state.slider.photos,
  userToken: state.login.user.token,
  unreadNotificationCount: state.notification.unreadNotification
});

const mapDispatchToProps = dispatch => ({
  getCategories: (data) => dispatch(getCategories(data)),
  getProducts: (data) => dispatch(getProducts(data)),
  getSliderPhotos: () => dispatch(getSliderPhotos()),
  getCart: (userId) => dispatch(getCart(userId)),
  setNotificationCount: (count) => dispatch(setNotificationCount(count))
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
