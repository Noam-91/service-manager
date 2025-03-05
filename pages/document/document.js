// pages/document/document.js
import * as reportService from '../../services/reportService';

Page({
  data: {
    userInfo:{},
    pagedReports:{},
    page:0,
    totalPage:0
  },

  async onLoad(options) {
    // TEST
    wx.setStorageSync('openid', 'oWNMK0VLqH58lQ5E1BeJXIp4WmO4');

    const result = await reportService.getAllReports(1, 10);
    try{
      if (result.code !== 0) {
        throw new Error(result.error || '获取数据失败');
      }
      const { page, total, list: reports } = result.data;
      console.log(result.data);
      this.setData({
        pagedReports: reports,
        page,
        totalPage: Math.ceil(total / 10) 
      });
      console.log(this.data)

    }catch (error) {
      console.error('数据加载失败:', error);
      wx.showToast({
        title: '数据加载失败',
        icon: 'none'
      });
    }
    
  },

  getReportsByPage(page) {
    const reports = reportService.getAllReports(page, 10);

    this.setData({
      pagedReports:reports
    })
  },

  formatDate(timestamp) {
    console.log(timestamp);
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  },

    // Navigate to report
    navigateToDetail(e) {
      const reportId = e.currentTarget.dataset.id;
      const url = `/pages/serviceReport/serviceReport?id=${reportId}`;
      wx.navigateTo({
        url: url,
        success: (res) => {
          console.log('跳转成功:', res)
        },
        fail: (err) => {
          console.error('跳转失败:', err)
          wx.showToast({ title: '跳转失败', icon: 'none' })
        }
      })
    },

})