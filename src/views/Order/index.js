import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'underscore';
import { getOrders, clearOrders } from '../../actions/order';
import apolloClient from '../../graphql/client';
import { CANCEL_ORDER } from '../../graphql/mutations';
import sharedStyles from '../../styles';
import styles from './styles';
import { colors } from '../../constants/colors';
import { getData } from '../../utils/storage';
import TopNavBar from '../../containers/TopNavBar/index';
import Spinner from '../../containers/Spinner';
import Alert from '../../containers/Alert';
import Button from '../../containers/Button';
import Toast from '../../containers/Toast';

class Order extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isProcessingLoading: true,
      isDeliveredLoading: true,
      isCancelledLoading: true,
      refreshing: false,
      orderStatus: [{ text: 'Livré', value: 'Delivered' }, { text: 'Traitement', value: 'Placed' }, { text: 'Annulé', value: 'Cancelled' }],
      selectedStatus: 'Delivered',
      isConfirmationModal: false,
      orderId: null
    }
    this.focusListener = this.props.navigation.addListener('willFocus', async () => {
      await this.setState({
        isProcessingLoading: true,
        isDeliveredLoading: true,
        isCancelledLoading: true,
        refreshing: false,
        selectedStatus: 'Delivered'
      })
      await this.props.clearOrders()
      await this.load(0)
    })
  }

  componentWillUnmount() {
    this.focusListener.remove()
  }

  handleRefresh = async () => {
    this.setState({ refreshing: true })
    await this.load(0)
    this.setState({ refreshing: false })
  }

  load = async (skip) => {
    const token = JSON.parse(await getData('token'))
    if(token) {
      const { props } = this
      const { selectedStatus } = this.state
      var orders = [], totalOrder = 0, orderLoading = false
      if(selectedStatus === 'Delivered') {
        orders = props.delivered.orders
        totalOrder = props.delivered.total
        orderLoading = props.delivered.loading
      } else if(selectedStatus === 'Placed') {
        orders = props.processing.orders
        totalOrder = props.processing.total
        orderLoading = props.processing.loading
      } else if(selectedStatus === 'Cancelled') {
        orders = props.cancelled.orders
        totalOrder = props.cancelled.total
        orderLoading = props.cancelled.loading
      }

      if ((skip !== 0 && orders.length >= totalOrder) || orderLoading) return;

      const args = { limit: 8, skip: _.isUndefined(skip) ? orders.length : skip, status: selectedStatus }

      await this.props.getOrders(args)

      if(selectedStatus === 'Delivered') this.setState({ isDeliveredLoading: false })
      else if(selectedStatus === 'Placed') this.setState({ isProcessingLoading: false })
      else if(selectedStatus === 'Cancelled') this.setState({ isCancelledLoading: false })
    } else {
      await this.props.clearOrders()
      this.setState({ isDeliveredLoading: false, isProcessingLoading: false, isCancelledLoading: false })
    }
  }

  renderOrderStatusButton = () => {
    const { orderStatus, selectedStatus } = this.state
    return (
      <View style={styles.statusBtnWrapper}>
        {orderStatus.map((status, index) => (
          <Button
            title={status.text}
            onPress={() => this.handleStatusChange(status.value)}
            style={[styles.statusBtn, { backgroundColor: status.value === selectedStatus ? colors.white : 'transparent', marginRight: index + 1 === orderStatus.length ? 0 : 15 }]}
            textStyle={[styles.statusBtnText, { color: status.value === selectedStatus ? colors.red : colors.darkBlack }]}
            key={index}
          />
        ))}
      </View>
    )
  }

  handleStatusChange = async (status) => {
    if(status === 'Delivered') await this.setState({ selectedStatus: status, isDeliveredLoading: true })
    else if(status === 'Placed') await this.setState({ selectedStatus: status, isProcessingLoading: true })
    else if(status === 'Cancelled') await this.setState({ selectedStatus: status, isCancelledLoading: true })
    await this.load(0)
  }

  renderOrder = ({ item, index }) => {
    const orders = this.getOrdersByStatus()
    const { selectedStatus } = this.state
    return (
      <View style={[styles.orderWrapper, { borderBottomWidth: index + 1 !== orders.length ? 1 : 0 }]}>
        <View style={styles.row}>
          <Text style={styles.numberText}>Ordre #{item.code}</Text>
          <Text style={styles.textStyle}>{moment(item.createdAt).format('DD/MM/YYYY')}</Text>
        </View>
        <View style={[styles.row, styles.infoWrapper]}>
          <Text style={styles.textStyle}>Articles: <Text style={styles.infoText}>{item.products.length}</Text></Text>
          <Text style={styles.textStyle}>Prix ​​total: <Text style={styles.infoText}>€{item.totalPrice}</Text></Text>
       </View>
       <View style={styles.btnWrapper}>
         <Button
           title={'Détails'}
           onPress={() => this.props.navigation.navigate('OrderDetail', { order: item })}
           style={styles.detailButtonStyle}
           textStyle={styles.detailButtonText}
         />
         {selectedStatus === 'Placed' &&
           <Button
             title={'Annuler'}
             onPress={() => this.openConfirmationModal(item._id)}
             style={[styles.detailButtonStyle, styles.cancelButtonStyle]}
             textStyle={styles.detailButtonText}
           />
         }
       </View>
      </View>
    )
  }

  renderFooter = () => {
    const { selectedStatus, refreshing } = this.state
    var orderLoading = false
    if(selectedStatus === 'Delivered') orderLoading = this.props.delivered.loading
    else if(selectedStatus === 'Placed') orderLoading = this.props.processing.loading
    else if(selectedStatus === 'Cancelled') orderLoading = this.props.cancelled.loading

    if (!orderLoading || refreshing) return null;
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator size={'large'} color={colors.primary} />
      </View>
    )
  }

  getOrdersByStatus = () => {
    const { selectedStatus } = this.state
    if(selectedStatus === 'Delivered') return this.props.delivered.orders
    else if(selectedStatus === 'Placed') return this.props.processing.orders
    else if(selectedStatus === 'Cancelled') return this.props.cancelled.orders
    return []
  }

  isLoading = () => {
    const { selectedStatus } = this.state
    if(selectedStatus === 'Delivered') return this.state.isDeliveredLoading
    else if(selectedStatus === 'Placed') return this.state.isProcessingLoading
    else if(selectedStatus === 'Cancelled') return this.state.isCancelledLoading
    return false
  }

  openConfirmationModal = (orderId) => {
    this.setState({ isConfirmationModal: true, orderId })
  }

  closeConfirmationModal = () => {
    this.setState({ isConfirmationModal: false, orderId: null })
  }

  cancelOrder = async () => {
    const { orderId } = this.state
    this.setState({ isConfirmationModal: false })
    if(orderId) {
      try {
        const result = await apolloClient.mutate({
          mutation: CANCEL_ORDER,
          variables: {
            orderId
          }
        });
        if (result && result.data && result.data.cancelOrder) {
          await this.load(0)
          this.refs.successToast.show('ordre annulée avec succès')
        } else this.refs.errorToast.show(`Impossible d'annuler la ordre`)
      } catch (error) {
        this.refs.errorToast.show(`Impossible d'annuler la ordre`)
      }
      this.setState({ orderId: null })
    }
  }

  getMsgText = () => {
    const { selectedStatus } = this.state
    if(selectedStatus === 'Delivered') return `Pas encore de ordres livrées!`
    else if(selectedStatus === 'Placed') return `Aucune ordres en cours de traitement pour le moment!`
    else if(selectedStatus === 'Cancelled') return `Aucune ordres annulée pour le moment!`
    return 'Pas encore de ordres!'
  }

  render() {
    const { props } = this
    const { selectedStatus, isConfirmationModal } = this.state
    const isLoading = this.isLoading()
    const orders = this.getOrdersByStatus()

    return (
      <View style={sharedStyles.container}>
        <TopNavBar onBackPress={() => props.navigation.navigate('Home')} title={'Mes ordre'} />
        <View style={styles.ordersWrapper}>
          {this.renderOrderStatusButton()}
          {isLoading ?
            <Spinner />
          :
            orders && orders.length > 0 ?
              (
                <View style={styles.orderInnerWrapper}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.flatList}
                    data={orders}
                    renderItem={item => this.renderOrder(item)}
                    onEndReached={() => this.load()}
                    onEndReachedThreshold={0.2}
                    ListFooterComponent={() => this.renderFooter()}
                    refreshControl={
                      <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.handleRefresh()}
                        colors={[colors.primary]}
                      />
                    }
                  />
                </View>
              )
            :
              (!this.state.refreshing &&
                <Text style={styles.emptyText}>{this.getMsgText()}</Text>
              )
          }
        </View>
        <Toast
          ref={'errorToast'}
          position={'center'}
          positionValue={150}
          style={styles.errorToast}
          textStyle={styles.errorToastText}
        />
        <Toast
          ref={'successToast'}
          position={'center'}
          positionValue={150}
        />
        {isConfirmationModal &&
          <Alert
            isVisible={isConfirmationModal}
            message={'Voulez-vous vraiment annuler cette ordre?'}
            cancelText={'Non'}
            confirmText={'Oui'}
            onConfirm={() => this.cancelOrder()}
            onClosed={() => this.closeConfirmationModal()}
          />
        }
      </View>
    )
  }
}

const mapStateToProps = state => ({
  processing: state.order.processing,
  delivered: state.order.delivered,
  cancelled: state.order.cancelled
});

const mapDispatchToProps = dispatch => ({
  getOrders: (args) => dispatch(getOrders(args)),
  clearOrders: () => dispatch(clearOrders())
});

export default connect(mapStateToProps, mapDispatchToProps)(Order);
