import React from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import sharedStyles from '../../styles';
import styles from './styles';
import { CATEGORY_LIST } from '../../graphql/queries';
import apolloClient from '../../graphql/client';
import { colors } from '../../constants/colors';
import TopNavBar from '../../containers/TopNavBar/index';
import Spinner from '../../containers/Spinner';
import { windowWidth } from '../../utils/deviceInfo';

class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      loading: true,
      loadMore: false,
      refreshing: false,
      pagination: { skip: 0, limit: 25, total: 0 }
    }
    this.focusListener = this.props.navigation.addListener('willFocus', async () => {
      await this.setState({
        categories: [],
        loading: true,
        loadMore: false,
        refreshing: false,
        pagination: { skip: 0, limit: 25, total: 0 }
      })
      await this.getCategories()
    })
  }

  componentWillUnmount() {
    this.focusListener.remove()
  }

  getCategories = async () => {
    const { pagination } = this.state
    const args = { skip: pagination.skip, limit: pagination.limit }
    try {
      const { data } = await apolloClient.query({
        query: CATEGORY_LIST,
        variables: {
          ...args
        },
        fetchPolicy: 'no-cache'
      });
      if(data && data.getCategories && data.getCategories.categories) {
        const { pagination } = this.state
        pagination['total'] = data.getCategories.totalCategory || 0
        this.setState({ categories: pagination.skip > 0 ? [...this.state.categories, ...data.getCategories.categories] : data.getCategories.categories, pagination })
      }
    } catch (error) {
      console.log(error)
    }
    this.setState({ loading: false })
  }

  handleLoadMore = async () => {
    const { categories, pagination, loadMore, refreshing } = this.state;

    if (categories.length >= pagination.total || loadMore || refreshing) {
      return;
    }

    pagination['skip'] = categories.length
    this.setState({ loadMore: true, pagination })
    await this.getCategories()
    this.setState({ loadMore: false })
  }

  handleRefresh = async () => {
    const { pagination } = this.state
    pagination['skip'] = 0
    await this.setState({ refreshing: true, pagination })
    await this.getCategories()
    await this.setState({ refreshing: false })
  }

  renderFooter = () => {
    if (!this.state.loadMore) return null;
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator size={'large'} color={colors.primary} />
      </View>
    )
  }

  navigateToCategory = (category) => {
    this.props.navigation.push('Products', { categoryId: category._id, title: category.name })
  }

  renderCategory = ({ item, index }) => (
    <TouchableOpacity
      style={styles.categoryWrapper}
      activeOpacity={0.8}
      onPress={() => this.navigateToCategory(item)}
    >
      <View style={styles.categoryImageWrapper}>
        {(item.photo && item.photo !== '') ?
          <FastImage source={{ uri: item.photo }} style={styles.categoryImage} resizeMode={FastImage.resizeMode.contain} />
        :
          <Text style={styles.categoryText}>C</Text>
        }
      </View>
      <Text style={styles.categoryName} numberOfLines={1} ellipsizeMode={'tail'}>{item.name}</Text>
    </TouchableOpacity>
  )

  render() {
    const { props } = this
    const { loading, categories, refreshing } = this.state

    return (
      <View style={sharedStyles.container}>
        <TopNavBar
          title={'Toutes catégories'}
          onBackPress={() => this.props.navigation.goBack()}
        />
        <View style={styles.contentWrapper}>
          {loading ?
            <Spinner style={sharedStyles.spinner} />
          :
            (categories && categories.length > 0 ?
              <FlatList
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                style={styles.flatList}
                contentContainerStyle={styles.contentContainerStyle}
                data={categories}
                renderItem={item => this.renderCategory(item)}
                ListFooterComponent={() => this.renderFooter()}
                onEndReached={() => this.handleLoadMore()}
                onEndReachedThreshold={0.2}
                refreshControl={<RefreshControl enabled={true} refreshing={refreshing} colors={[colors.primary]} onRefresh={() => this.handleRefresh()} />}
                numColumns={4}
              />
            :
              (!refreshing && <Text style={styles.notFoundText}>Aucune catégorie trouvée</Text>)
            )
          }
        </View>
      </View>
    );
  }
}

export default Categories
