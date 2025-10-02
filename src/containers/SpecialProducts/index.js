import React from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import {graphql, compose} from 'react-apollo';
import FastImage from 'react-native-fast-image';
import styles from './styles';
import { colors } from '../../constants/colors';
import { images } from '../../../assets';
import { CustomIcon } from '../../utils/Icons';
import Spinner from '../Spinner';

class SpecialProducts extends React.Component {
  renderHeader = () => {
    const { props } = this
    if(props.from && (props.from === 'Home' || props.from === 'ProductDetail') && props.title) {
      return (
        <View style={styles.titleWrapper}>
          <Text style={styles.titleText}>{props.title}</Text>
          <TouchableOpacity
            style={styles.seeAllWrapper}
            activeOpacity={0.8}
            onPress={() => this.props.onAllPress && this.props.onAllPress()}
          >
            <Text style={styles.seeAllText}>Voir tout</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  renderFooter = () => {
    if (!this.props.loading) return null;
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator size={'large'} color={colors.primary} />
      </View>
    )
  }

  handleLoadMore = () => {
    if(this.props.loadMore) this.props.loadMore()
  }

  renderProduct = ({ item, index }) => {
    const productImage = item.photos && item.photos.length > 0 ? { uri: item.photos[0] } : images.placeholder;
    const offer = item.price > item.specialPrice ? Math.floor(100 - ((100 * item.specialPrice) / item.price)) : 0
    return (
      <TouchableOpacity activeOpacity={0.8} style={styles.productWrapper} onPress={() => this.props.navigation.push('ProductDetail', { productId: item._id })}>
        <View style={styles.productImgWrapper}>
          <FastImage source={productImage} style={styles.productImg} resizeMode={FastImage.resizeMode.contain} />
        </View>
        <View style={styles.productInfoWrapper}>
          <Text
            ellipsizeMode={'tail'}
            numberOfLines={1}
            style={styles.productName}
          >
            {item.name}
          </Text>
          <Text style={styles.priceText}>€{item.specialPrice}  {(item.price > item.specialPrice) && <Text style={styles.oldPriceText}>€<Text style={styles.strikeText}>{item.price}</Text></Text>}</Text>
        </View>
        {offer > 0 &&
          <View style={styles.offerWrapper}>
            <Text style={styles.offerText}>-{offer}%</Text>
          </View>
        }
      </TouchableOpacity>
    )
  }

  render() {
    const { props } = this
    return (
      <View style={[styles.wrapper, props.wrapperStyle]}>
        {this.renderHeader()}
        {props.displayFilter && (
          <View style={[styles.filterWrapper, { justifyContent: props.totalItems > 0 ? 'space-between' : 'flex-end' }]}>
            {props.totalItems > 0 && <Text style={styles.totalText}>{props.totalItems} Articles</Text>}
            <TouchableOpacity activeOpacity={0.8} style={styles.filterBtn} onPress={() => props.handleFilterPress && props.handleFilterPress()}>
              <CustomIcon name={'equalizer'} size={18} style={styles.filterIcon}/>
              <Text style={styles.productName}>Filtre</Text>
            </TouchableOpacity>
          </View>
        )}
        {props.products && props.products.length > 0 ?
          <FlatList
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            style={styles.flatList}
            data={props.products}
            renderItem={item => this.renderProduct(item)}
            ListFooterComponent={() => this.renderFooter()}
            onEndReached={() => this.handleLoadMore()}
            onEndReachedThreshold={0.2}
            refreshControl={props.pullToRefresh ? <RefreshControl refreshing={props.refreshing} colors={[colors.primary]} onRefresh={() => props.handleRefresh()} /> : null}
            numColumns={2}
          />
        :
          <Text style={styles.emptyText}>Aucun produit trouvé</Text>
        }
      </View>
    )
  }
}

export default SpecialProducts
