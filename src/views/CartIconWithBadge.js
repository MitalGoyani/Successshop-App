import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { CustomIcon } from '../utils/Icons';
import CartBack from '../containers/CartBack';

import { colors } from '../constants/colors';

const styles = StyleSheet.create({
  iconWrapper: {
    width: 45,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    position: 'absolute',
    color: colors.white
  },
  badgeWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -9,
    alignItems: 'center'
  },
  badge: {
    backgroundColor: colors.red,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: 'Karla-Regular'
  }
})

class CartIconWithBadge extends React.Component {
  render() {
    const { cartTotal } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <CartBack height={50} width={45} />
          <CustomIcon name={'basket'} size={24} style={styles.icon} />
        </View>
        {cartTotal > 0 &&
          <View style={styles.badgeWrapper}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartTotal}</Text>
            </View>
          </View>
        }
      </View>
    );
  }
}

const mapStateToProps = state => ({
  cartTotal: state.cart.total
});

export default connect(mapStateToProps, null)(CartIconWithBadge);
