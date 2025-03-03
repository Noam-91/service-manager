// services/serviceReport.js
const db = wx.cloud.database();

// 按时间倒序分页查询
const getReports = async (page = 1, pageSize = 10) => {
  const db = wx.cloud.database();
  const skip = (page - 1) * pageSize;

  return db.collection('service_reports')
    .where({ _openid: wx.getStorageSync('openid') })
    .orderBy('boarding_time', 'desc')
    .skip(skip)
    .limit(pageSize)
    .get();
};

const addReport = (data) => {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'manage-report',
      success: res => {
        resolve(res.result.openid);
      },
      fail: err => reject(err)
    });
  });
};

export { getReports, addReport };