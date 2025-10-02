export const fetchData = async (endPoint, method, token, body) => {
  var params = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  }
  if(token) params.headers['Authorization'] = token
  if(body) {
    params['body'] = JSON.stringify({
      ...body
    })
  }
  // live: https://api.paypal.com
  return fetch(`https://api.sandbox.paypal.com/${endPoint}`, { ...params })
};
