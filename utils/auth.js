// utils/auth.js
const login = () => {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'login',
      success: res => {
        // return OPENID
        resolve(res.result.openid);
      },
      fail: err => reject(err)
    });
  });
};

export { login };