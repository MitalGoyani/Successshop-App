import gql from "graphql-tag";

/* Sign Up */
export const ADD_USER = gql`
  mutation addUser($name: String, $email: String, $password: String, $mobile: String) {
    addUser(
      name: $name,
      email: $email,
      password: $password,
      mobile: $mobile
    ) {
      _id
      profile {
        name
        mobile
        photo
      }
      email
    }
  }
`;

/* Upadte cart */
export const UPDATE_CART = gql`
  mutation updateCart($userId: ID, $productId: ID!, $quantity: Int, $optionValueIds: [String]) {
    updateCart(userId: $userId, productId: $productId, quantity: $quantity, optionValueIds: $optionValueIds)
  }
`;

/* Place Order */
export const PLACE_ORDER = gql`
  mutation placeOrder($subTotal: Int!, $deliveryCharge: Int!, $totalPrice: Int!, $totalDiscount: Int, $paymentType: String!, $tokenId: String, $addressId: String, $type: String, $product: productInput) {
    placeOrder(subTotal: $subTotal, deliveryCharge: $deliveryCharge, totalPrice: $totalPrice, totalDiscount: $totalDiscount, paymentType: $paymentType, tokenId: $tokenId, addressId: $addressId, type: $type, product: $product)
  }
`;

/* Cancel Order */
export const CANCEL_ORDER = gql`
  mutation cancelOrder($orderId: String!) {
    cancelOrder(orderId: $orderId)
  }
`;

/* Edit User */
export const EDIT_USER = gql`
  mutation editUser($name: String, $email: String, $mobile: String, $photo: String) {
    editUser(
      name: $name,
      email: $email,
      mobile: $mobile,
      photo: $photo
    ) {
      _id
      email
      profile {
        name
        mobile
        photo
      }
    }
  }
`;

/* Add Address */
export const ADD_ADDRESS = gql`
  mutation addAddress($firstName: String, $lastName: String, $mobile: String, $email: String, $address: String, $area: String, $city: String, $pincode: String, $country: String) {
    addAddress(
      firstName: $firstName,
      lastName: $lastName,
      mobile: $mobile,
      email: $email,
      address: $address,
      area: $area,
      city: $city,
      pincode: $pincode,
      country: $country
    ) {
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

/* Add Address */
export const EDIT_ADDRESS = gql`
  mutation editAddress($addressId: String!, $firstName: String, $lastName: String, $mobile: String, $email: String, $address: String, $area: String, $city: String, $pincode: String, $country: String) {
    editAddress(
      addressId: $addressId,
      firstName: $firstName,
      lastName: $lastName,
      mobile: $mobile,
      email: $email,
      address: $address,
      area: $area,
      city: $city,
      pincode: $pincode,
      country: $country
    ) {
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

/* delete Address */
export const REMOVE_ADDRESS = gql`
  mutation removeAddress($addressId: String!) {
    removeAddress(addressId: $addressId)
  }
`;

/* add contact request */
export const ADD_CONTACT_REQUEST = gql`
  mutation addContactRequest($name: String, $email: String, $mobile: String, $subject: String, $message: String) {
    addContactRequest(
      name: $name,
      email: $email,
      mobile: $mobile,
      subject: $subject,
      message: $message
    )
  }
`;

/* change password */
export const CHANGE_PASSWORD = gql`
  mutation changePassword($currentPassword: String, $newPassword: String) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword)
  }
`;

/* Forgot Password */
export const FORGOT_PASSWORD = gql`
  mutation sendNewPassword($email: String!) {
    sendNewPassword(email: $email)
  }
`;
