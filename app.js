// app.js
App({
  onLaunch() {
    // Initiate cloud environment
    wx.cloud.init({
      env: 'service-manager-8gmqx1il4b088769', 
      traceUser: true,    
    });
    
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

  },
  globalData: {
    userInfo: null
  }
})
