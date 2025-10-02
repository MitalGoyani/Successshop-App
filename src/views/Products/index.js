import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, RefreshControl, SafeAreaView
} from 'react-native';
import _ from 'underscore';
import { RectButton } from 'react-native-gesture-handler';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import Collapsible from 'react-native-collapsible';
import CheckBox from '@react-native-community/checkbox';
import store from '../../store';
import { connect } from 'react-redux';
import apolloClient from '../../graphql/client';
import { CATEGORY_LIST } from '../../graphql/queries';
import { getProducts } from '../../actions/products';
import { colors } from '../../constants/colors';
import sharedStyles from '../../styles';
import styles from './styles';
import Spinner from '../../containers/Spinner';
import StatusBar from '../../containers/StatusBar';
import TopNavBar from '../../containers/TopNavBar/index';
import SpecialProducts from '../../containers/SpecialProducts/index';

class Products extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      refreshing: false,
      loadMore: false,
      products: [],
      pagination: { skip: 0, limit: 10, total: 1 },
      filterModalVisible: false,
      selectedFilterType: 'refine',
      filterTypes: {
        refine: [
          { title: 'Prix',
            name: 'price',
            options: [
              { title: '€249 et moins', value: { maxPrice: 249 } },
              { title: '€250 - €499', value: { minPrice: 250, maxPrice: 499 } },
              { title: '€500 - €999', value: { minPrice: 500, maxPrice: 999 } },
              { title: '€1000 - €1499', value: { minPrice: 1000, maxPrice: 1499 } },
              { title: '€1500 - €1999', value: { minPrice: 1500, maxPrice: 1999 } },
              { title: '€2000 - €2499', value: { minPrice: 2000, maxPrice: 2499 } },
              { title: '€2500 et plus', value: { minPrice: 2500 } },
            ],
            isCollapsed: true
          },
          { title: 'Remise',
            name: 'discount',
            options: [
              { title: '10% et moins', value: { type: 'maximum', value: 10 } },
              { title: '10% et plus', value: { type: 'minimum', value: 10 } },
              { title: '20% et plus', value: { type: 'minimum', value: 20 } },
              { title: '30% et plus', value: { type: 'minimum', value: 30 } },
              { title: '40% et plus', value: { type: 'minimum', value: 40 } },
              { title: '50% et plus', value: { type: 'minimum', value: 50 } },
              { title: '60% et plus', value: { type: 'minimum', value: 60 } },
            ],
            isCollapsed: true
          }
        ],
        sort: [
          { title: 'Popularité', value: 'popularity' },
          { title: 'Prix ​​croissant', value: 'LTH' },
          { title: 'Prix ​​- Élevé à bas', value: 'HTL' },
          { title: 'Alphabétique', value: 'alphabetical' }
        ]
      },
      oldFilter: { price: [], discount: {}, sortBy: 'popularity' },
      filter: { price: [], discount: {}, sortBy: 'popularity' },
      subCategories: []
    }
  }

  async componentDidMount() {
    const { params } = this.props.navigation.state
    if(params && params.categoryId) await this.getSubCategories(params.categoryId)
    await this.load()
    this.setState({ loading: false })
  }

  getSubCategories = async (categoryId) => {
    try {
      const { data } = await apolloClient.query({
        query: CATEGORY_LIST,
        variables: {
          categoryId
        },
        fetchPolicy: 'no-cache'
      });
      if(data && data.getCategories && data.getCategories.categories) this.setState({ subCategories: data.getCategories.categories })
    } catch (error) {
      console.log(error)
    }
  }

  load = async () => {
    const { filter, pagination } = this.state
    const { params } = this.props.navigation.state
    const args = { limit: pagination.limit, skip: pagination.skip, filter: {} }

    if(params && params.type) args['type'] = params.type
    if(params && params.productId) args['productId'] = params.productId
    if(params && params.search) args['search'] = params.search
    if(params && params.categoryId) args['categoryId'] = params.categoryId

    if(filter && filter.sortBy) args['sortBy'] = filter.sortBy
    if(filter && filter.discount && filter.discount.type && filter.discount.value) args['filter']['discount'] = filter.discount
    if(filter && filter.price && filter.price.length > 0) args['filter']['priceRange'] = filter.price
    await this.props.getProducts(args)
    this.setProducts()
  }

  loadMore = async () => {
    const { products, pagination, loadMore } = this.state

    if (products.length >= pagination.total || loadMore) {
      return;
    }

    pagination['skip'] = products.length
    this.setState({ loadMore: true, pagination })
    await this.load()
    this.setState({ loadMore: false })
  }

  handleRefresh = async () => {
    this.setState({ refreshing: true })

    const { pagination } = this.state
    pagination['skip'] = 0
    this.setState({ pagination })

    await this.load()
    this.setState({ refreshing: false })
  }

  setProducts = () => {
    const { params } = this.props.navigation.state
    const { product } = store.getState()
    const { pagination } = this.state

    if(params) {
      if(params.type) {
        if(params.type === 'special') {
          pagination['total'] = product.special.total
          this.setState({ products: product.special.products, pagination })
        } else if(params.type === 'popular') {
          pagination['total'] = product.popular.total
          this.setState({ products: product.popular.products, pagination })
        } else if(params.type === 'similar') {
          pagination['total'] = product.similar.total
          this.setState({ products: product.similar.products, pagination })
        } else if(params.type === 'bestSelling') {
          pagination['total'] = product.bestSelling.total
          this.setState({ products: product.bestSelling.products, pagination })
        }
      } else if (params.search) {
        pagination['total'] = product.search.total
        this.setState({ products: product.search.products, pagination })
      } else if (params.categoryId) {
        pagination['total'] = product.category.total
        this.setState({ products: product.category.products, pagination })
      }
    }
  }

  handleFilterPress = async () => {
    const { filter } = this.state
    await this.setState({ filterModalVisible: true, oldFilter: { price: _.map(filter.price, (item) => _.extend({}, item)), discount: _.extend({}, filter.discount), sortBy: filter.sortBy } })
  }

  closeFilterModal = () => {
    this.setState({ filterModalVisible: false, selectedFilterType: 'refine' })
  }

  handleFilterChange = (key, value) => {
    const { oldFilter } = this.state
    const index = oldFilter[key].findIndex(val => JSON.stringify(val) === JSON.stringify(value))
    if(index != -1) oldFilter[key].splice(index, 1)
    else oldFilter[key].push(value)
    this.setState({ oldFilter })
  }

  isPriceSelected = (value, selectedValues) => {
    if(selectedValues.length > 0) return selectedValues.find(item => _.isEqual(item, value)) ? true : false
    return false
  }

  toggleFilterView = (filterType, filter) => {
    const { filterTypes } = this.state
    filterTypes[filterType].map(item => {
      if(item.name == filter) item.isCollapsed = !item.isCollapsed
      return filter
    })
    this.setState({ filterTypes })
  }

  handleSortTypeChange = (sortBy) => {
    const { oldFilter } = this.state
    oldFilter['sortBy'] = sortBy
    this.setState({ oldFilter })
  }

  handleDiscountChange = (value) => {
    const { oldFilter } = this.state
    oldFilter.discount = value
    this.setState({ oldFilter })
  }

  applyFilter = async () => {
    const { pagination, oldFilter } = this.state
    pagination['skip'] = 0
    await this.setState({ pagination, filter: { price: _.map(oldFilter.price, (item) => _.extend({}, item)), discount: _.extend({}, oldFilter.discount), sortBy: oldFilter.sortBy }, filterModalVisible: false, selectedFilterType: 'refine' })
    await this.load()
  }

  isDiscountSelected = (discount, selectedDiscount) => {
    return discount.type && discount.value && selectedDiscount.type && selectedDiscount.value && discount.type == selectedDiscount.type && discount.value == selectedDiscount.value
  }

  renderFilterButton = () => {
    const { filterTypes, selectedFilterType, oldFilter } = this.state

    if(selectedFilterType && selectedFilterType == 'refine') {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollViewStyle}
        >
          {filterTypes[selectedFilterType].map((filter, index) => (
            <View style={styles.filterTypeWrapper} key={index}>
              <TouchableOpacity style={styles.filterTypeInner} activeOpacity={0.8} onPress={() => this.toggleFilterView(selectedFilterType, filter.name)}>
                <Text style={styles.filterTypeText}>{filter.title}</Text>
                <MaterialIcon name={filter.isCollapsed ? 'keyboard-arrow-down' : 'keyboard-arrow-up'} size={22} color={colors.darkBlack} />
              </TouchableOpacity>
              {filter.options && filter.options.length > 0 && (
                <Collapsible collapsed={filter.isCollapsed}>
                  {filter.options.map((option, i) => {
                    if(filter.name === 'price') {
                      return (
                        <TouchableOpacity style={styles.row} key={i} activeOpacity={0.8} onPress={() => this.handleFilterChange(filter.name, option.value)}>
                          <CheckBox
                            disabled={true}
                            value={this.isPriceSelected(option.value, oldFilter.price)}
                            boxType={'square'}
                            style={styles.checkBoxStyle}
                            tintColor={colors.darkGray}
                            onFillColor={colors.primary}
                            onTintColor={colors.primary}
                            onCheckColor={colors.white}
                            onAnimationType={'fade'}
                            offAnimationType={'fade'}
                            tintColors={{ true: colors.primary, false: colors.darkGray }}
                          />
                          <Text style={styles.valueText}>{option.title}</Text>
                        </TouchableOpacity>
                      )
                    } else if (filter.name === 'discount') {
                      return (
                        <TouchableOpacity style={styles.row} key={i} activeOpacity={0.8} onPress={() => this.handleDiscountChange(option.value)}>
                          <View
                            style={[
                              styles.radioWrapper,
                              { borderColor: this.isDiscountSelected(option.value, oldFilter.discount) ? colors.primary : colors.darkGray }
                            ]}
                          >
                            {this.isDiscountSelected(option.value, oldFilter.discount) && <View style={styles.radioInnerWrapper}></View>}
                          </View>
                          <Text style={styles.valueText}>{option.title}</Text>
                        </TouchableOpacity>
                      )
                    } else {
                      return null
                    }
                  })}
                </Collapsible>
              )}
            </View>
          ))}
        </ScrollView>
      )
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollViewStyle}
      >
        {filterTypes[selectedFilterType].map((filter, index) => (
          <View style={styles.filterTypeWrapper} key={index}>
            <TouchableOpacity style={styles.filterTypeInner} activeOpacity={0.8} onPress={() => this.handleSortTypeChange(filter.value)}>
              <Text style={styles.filterTypeText}>{filter.title}</Text>
              <View style={[styles.radioWrapper, { borderColor: oldFilter.sortBy == filter.value ? colors.primary : colors.darkGray }]}>
                {oldFilter.sortBy == filter.value && <View style={styles.radioInnerWrapper}></View>}
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    )
  }

  filterApplyButton = () => {
    return (
      <TouchableOpacity
        style={styles.applyBtn}
        activeOpacity={0.8}
        onPress={() => this.applyFilter()}
      >
        <MaterialIcon name={'check'} size={22} color={colors.white} />
      </TouchableOpacity>
    )
  }

  renderFilterModal = () => {
    const { filterModalVisible, selectedFilterType } = this.state
    return (
      <Modal
    		style={styles.modal}
    		isVisible={this.state.filterModalVisible}
    		onBackButtonPress={() => this.closeFilterModal()}
    	>
        <View style={styles.container}>
          <StatusBar />
          <SafeAreaView style={styles.safeAreaView}>
            <TopNavBar
              title={'Filtre'}
              IconLeft={() => <MaterialIcon name={'close'} size={22} color={colors.white} />} onBackPress={() => this.closeFilterModal()}
              buttonRight={() => this.filterApplyButton()}
            />
            <View style={styles.innerWrapper}>
              <View style={styles.filterWrapper}>
                <TouchableOpacity
                  style={[styles.filterBtn, selectedFilterType == 'refine' && styles.activeFilterBtn]}
                  activeOpacity={0.8}
                  onPress={() => this.setState({ selectedFilterType: 'refine' })}
                >
                  <Text style={[styles.filterBtnText, { color: selectedFilterType == 'refine' ? colors.red : colors.black }]}>Affiner par</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterBtn, selectedFilterType == 'sort' && styles.activeFilterBtn]}
                  activeOpacity={0.8}
                  onPress={() => this.setState({ selectedFilterType: 'sort' })}
                >
                  <Text style={[styles.filterBtnText, { color: selectedFilterType == 'sort' ? colors.red : colors.black }]}>Trier par</Text>
                </TouchableOpacity>
              </View>
              {this.renderFilterButton()}
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    )
  }

  renderSubCategories = () => {
    const { params } = this.props.navigation.state
    if(params && params.categoryId) {
      const { subCategories } = this.state
      if(subCategories && subCategories.length > 0) {
        return (
          <View style={styles.categoriesWrapper}>
            {subCategories.map((subCategory, index) => (
              <TouchableOpacity
                style={styles.categoryWrapper}
                activeOpacity={0.8}
                onPress={() => this.props.navigation.push('Products', { categoryId: subCategory._id, title: subCategory.name })}
                key={index}
              >
                <Text style={styles.categoryText}>{subCategory.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )
      }
    }
    return null
  }

  render() {
    const { navigation } = this.props
    const { loading, products, loadMore, refreshing, filterModalVisible, pagination } = this.state

    return (
      <View style={sharedStyles.containerWrapper}>
        <TopNavBar navigation={navigation} title={navigation.state.params.title ? navigation.state.params.title : 'Des produits'} />
        <View style={styles.contentWrapper}>
          <ScrollView
            contentContainerStyle={styles.contentContainerStyle}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => this.handleRefresh()}
                colors={[colors.primary]}
              />
            }
            showsVerticalScrollIndicator={false}
          >
            {loading ?
              <Spinner style={sharedStyles.spinner} />
            :
              <>
                {this.renderSubCategories()}
                <SpecialProducts
                  products={products}
                  loading={loadMore}
                  loadMore={() => this.loadMore()}
                  pullToRefresh={false}
                  wrapperStyle={styles.productsWrapper}
                  displayFilter={true}
                  handleFilterPress={() => this.handleFilterPress()}
                  totalItems={pagination.total}
                  navigation={navigation}
                />
              </>
            }
          </ScrollView>
        </View>
        {filterModalVisible && this.renderFilterModal()}
      </View>
    );
  }
}


const mapDispatchToProps = dispatch => ({
  getProducts: (data) => dispatch(getProducts(data))
});

export default connect(null, mapDispatchToProps)(Products);
