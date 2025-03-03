// cloud-functions/login/index.js
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  // Check OPENID
  if (!wxContext.OPENID) {
    throw new Error('未授权用户');
  }

  // Return OPENID
  return {
    openid: wxContext.OPENID
  };
};