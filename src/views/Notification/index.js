import React from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'underscore';
import TopNavBar from '../../containers/TopNavBar/index';
import Spinner from '../../containers/Spinner';
import styles from './styles';
import { colors } from '../../constants/colors';
import { getNotifications, clearNotifications } from '../../actions/notification';
import { getData } from '../../utils/storage';
import { CustomIcon } from '../../utils/Icons';


class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      refreshing: false
    }
  }

  async componentDidMount() {
    await this.load(0)
    this.setState({ loading: false })
  }

  handleRefresh = async () => {
    this.setState({ refreshing: true })
    await this.load(0)
    this.setState({ refreshing: false })
  }

  load = async (skip) => {
		const {
			notifications, totalNotification, notificationLoading
		} = this.props;

		if ((skip !== 0 && notifications.length >= totalNotification) || notificationLoading) {
			return;
		}

    const token = JSON.parse(await getData('token'))
    const args = {
      limit: 10,
      skip: _.isUndefined(skip) ? notifications.length : skip
    }
    if(token) await this.props.getNotifications(args)
    else {
      const tempUserId = JSON.parse(await getData('tempUserId'))
      if(tempUserId) {
        args['userId'] = tempUserId
        await this.props.getNotifications(args)
      }
    }
	}

  renderNotification = ({ item, index }) => {
    return (
      <View key={`item-${index}`} style={styles.notificationView}>
        <View style={styles.iconWrapper}>
          <CustomIcon name={'notification-o'} size={19} color={colors.white} />
        </View>
        <View style={[styles.textViewStyle , { borderBottomWidth: index + 1 === this.props.notifications.length ? 0 : 1 }]}>
          <View style={styles.row}>
            <Text style={styles.dateStyle}>{moment(item.createdAt).format('DD/MM/YYYY  h:mm A')}</Text>
            <View style={styles.dotStyle}></View>
          </View>
          <Text style={styles.textStyle}>{item.message}</Text>
        </View>
      </View>
    )
  }

  renderFooter = () => {
    if (!this.props.notificationLoading) return null;
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator size={'large'} color={colors.primary} />
      </View>
    )
  }

  render() {
    const { props } = this
    const { loading, refreshing } = this.state

    return (
      <View style={styles.container}>
        <TopNavBar navigation={props.navigation} title={'Notifications'} />
        {loading ?
          <Spinner style={styles.spinnerStyle} />
        :
          props.notifications && props.notifications.length > 0 ? (
            <FlatList
    					keyExtractor={(notification, index) => index.toString()}
    		      data={props.notifications}
    		      renderItem={notification => this.renderNotification(notification)}
    		      style={styles.flatList}
              contentContainerStyle={styles.contentContainerStyle}
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
              showsVerticalScrollIndicator={false}
    		    />
          )
          :
            (<View style={styles.emptyWrapper}>
              <CustomIcon name={'bell'} size={80} color={colors.lightGray} />
              <Text style={styles.emptyText}>Aucune notification pour le moment</Text>
            </View>)
        }
      </View>
    )
  }
}

const mapStateToProps = state => ({
  notificationLoading: state.notification.loading,
  notifications: state.notification.notifications,
  totalNotification: state.notification.totalNotification
});

const mapDispatchToProps = dispatch => ({
  getNotifications: (args) => dispatch(getNotifications(args)),
  clearNotifications: () => dispatch(clearNotifications())
});

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
