const emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
const mobileRegex = /^\d{10}$/

export const validateEmail = email => emailRegex.test(email);
export const validateMobile = mobile => mobileRegex.test(mobile);
export const validatePassword = password => password.length >= 6;
