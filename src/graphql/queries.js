import gql from "graphql-tag";

/* Auth User */
export const AUTH_USER = gql`
  query authUser($userId: String,$email: String, $password: String) {
    authUser(userId: $userId, email: $email, password: $password) {
      _id
      name
      email
      token
    }
  }
`;

/* Auth User */
export const SOCIAL_LOGIN = gql`
  query socialLogin($type: String, $userId: String, $token: String) {
    socialLogin(type: $type, userId: $userId, token: $token) {
      _id
      name
      email
      token
    }
  }
`;

/* Get Category */
export const CATEGORY_LIST = gql`
  query getCategories($categoryId: ID, $limit: Int, $skip: Int) {
    getCategories(categoryId: $categoryId, limit: $limit, skip: $skip) {
      categories {
        _id
        name
        photo
      }
      totalCategory
    }
  }
`;

/* Get Product */
export const PRODUCT_LIST = gql`
  query getProducts($limit: Int, $skip: Int, $search: String, $categoryId: ID, $sortBy: String, $filter: filterInput, $type: String, $productId: String) {
    getProducts(limit: $limit, skip: $skip, search: $search, categoryId: $categoryId, sortBy: $sortBy, filter: $filter, type: $type, productId: $productId) {
      products {
        _id
        name
        price
        specialPrice
        categories
        photos
      }
      totalProduct
    }
  }
`;

/* Get Product Detail*/
export const GET_PRODUCT_DETAILS = gql`
  query getProductDetails($productId: String!) {
    getProductDetails(productId: $productId) {
      _id
      name
      shortDescription
  		description
      price
      specialPrice
      quantity
      categories
      photos
      similarProducts {
        _id
        name
        price
        specialPrice
        categories
        photos
      }
      options {
        _id
        name
        type
        optionValues {
          _id
          value
          quantity
          price
          pricePrefix
        }
      }
      deliveryCharge
      freeOrderDeliveryLimit
    }
  }
`;

/* Get Slider Photo*/
export const SLIDER_PHOTOS = gql`
  query getBanners {
    getBanners {
      _id
      photo
      visible
    }
  }
`;

/*Get Area*/
export const GET_ADDRESSES = gql`
  query getUserAddresses {
    getUserAddresses {
      _id
      firstName
      lastName
      mobile
      email
      address
      area
      city
      pincode
      country
    }
  }
`;

/* Get temp user id */
export const GET_TEMP_USER_ID = gql`
  query getTempUserId {
    getTempUserId
  }
`

/* Get Cart List */
export const CART_LIST = gql`
  query getCartDetails($userId: ID) {
    getCartDetails(userId: $userId) {
      _id
      userId
      products {
        productId
        quantity
        maxQuantity
        name
        price
        specialPrice
        photos
        optionValues {
          _id
          name
          value
          quantity
          price
          pricePrefix
        }
      }
      deliveryCharge
      freeOrderDeliveryLimit
    }
  }
`

/* Check Cart Products Availability */
export const IS_CART_PRODUCTS_AVAILABLE = gql`
  query isCartProductsAvailable($userId: ID) {
    isCartProductsAvailable(userId: $userId)
  }
`

/* Get User Details */
export const GET_USER_DETAILS = gql`
  query getUserDetails {
    getUserDetails {
      _id
      email
      profile {
        name
        mobile
        photo
      }
    }
  }
`

/* Get Orders */
export const ORDER_LIST = gql`
  query getOrders($limit: Int, $skip: Int, $status: String) {
    getOrders(limit: $limit, skip: $skip, status: $status) {
      orders {
        _id
        userId
        products {
          productId
          photos
          name
          categories
          quantity
          price
          discount
          sellPrice
          options {
            optionValueId
            name
            value
          }
        }
        subTotal
        deliveryCharge
        totalPrice
        totalDiscount
        status
        code
        createdAt
        deliveryAddress {
            _id
          firstName
          lastName
          mobile
          email
          address
          area
          city
          pincode
          country
          createdAt
        }
      }
      totalOrder
    }
  }
`

/* Get Notifications */
export const GET_NOTIFICATIONS = gql`
  query getNotifications($userId: ID, $limit: Int, $skip: Int) {
    getNotifications(userId: $userId, limit: $limit, skip: $skip) {
      notifications {
        _id
        message
        readby
        createdAt
      }
      totalNotification
    }
  }
`

/* Unread Notification count */
export const UNREAD_NOTIFICATION_COUNT = gql`
  query notificationCount($userId: ID) {
    notificationCount(userId: $userId)
  }
`

/* Privacy Policy */
export const GET_PRIVACY_POLICY = gql`
  query getPrivacyPolicy {
    getPrivacyPolicy
  }
`
/* Terms and Conditions */
export const GET_TERMS = gql`
  query getTerms {
    getTerms
  }
`
