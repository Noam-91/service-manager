import * as timeNoteService from "../../services/timeNoteService"
Page({
  data: {
    shipName: '',
    location: '',
    timeNotes: [],
    names: [
      { name: 'departureFlight', chineseName: '去程飞行', enabled: true },
      { name: 'waitingTime', chineseName: '等待时间', enabled: true },
      { name: 'hotelToShip', chineseName: '宾馆到船', enabled: true },
      { name: 'workingTime', chineseName: '工作时间', enabled: true },
      { name: 'shipToHotel', chineseName: '下船到宾馆', enabled: true },
      { name: 'returnFlight', chineseName: '返程飞行', enabled: true },
    ],
  },

  onLoad: async function () {
    try{
      const {data:jsonData, code} = await timeNoteService.getTimeNote();
      if(code===404){
        this.initTimeNotes();
      }else{
        this.setData({
          shipName: jsonData.vessel_name,
          location: jsonData.location,
          timeNotes: jsonData.time_notes
        });
      }
    }catch(err){
      console.error(err);
    }
    
  },

  initTimeNotes: function () {
    const today = this.formatDate(new Date());
    const timeNotes = this.data.names.map((item) => ({
      name: item.name,
      chineseName: item.chineseName,
      enabled: item.enabled,
      date: today,
      startTime: '08:00',
      endTime: '17:00',
    }));
    this.setData({
      timeNotes: timeNotes,
    });
  },

  onShipNameChange: function (e) {
    this.setData({
      shipName: e.detail.value,
    });
  },

  onLocationChange: function (e) {
    this.setData({
      location: e.detail.value,
    });
  },

  onDateChange: function (e) {
    const index = e.currentTarget.dataset.index;
    const date = e.detail.value;
    const timeNotes = [...this.data.timeNotes];
    timeNotes[index].date = date;
    this.setData({
      timeNotes: timeNotes,
    });
  },

  onStartTimeChange: function (e) {
    const index = e.currentTarget.dataset.index;
    const startTime = e.detail.value;
    const timeNotes = [...this.data.timeNotes];
    timeNotes[index].startTime = startTime;
    this.setData({
      timeNotes: timeNotes,
    });
  },

  onEndTimeChange: function (e) {
    const index = e.currentTarget.dataset.index;
    const endTime = e.detail.value;
    const timeNotes = [...this.data.timeNotes];
    timeNotes[index].endTime = endTime;
    this.setData({
      timeNotes: timeNotes,
    });
  },

  addTimeNote: function (e) {
    const index = e.currentTarget.dataset.index;
    const name = this.data.timeNotes[index].name;
    const chineseName = this.data.timeNotes[index].chineseName;
    const today = this.formatDate(new Date());
    const newTimeNote = {
      name: name,
      chineseName: chineseName,
      enabled: true,
      date: today,
      startTime: '08:00',
      endTime: '17:00',
    };
    const timeNotes = [...this.data.timeNotes];
    timeNotes.splice(index + 1, 0, newTimeNote);
    this.setData({
      timeNotes: timeNotes,
    });
  },

  saveData: function () {
    const jsonData = {
      vessel_name: this.data.shipName,
      location: this.data.location,
      time_notes: this.data.timeNotes
    }
    
    try{
      wx.showLoading({ title: '保存中...' })
      timeNoteService.saveTimeNote(jsonData);
      wx.showToast({
        title: '保存成功',
        icon: 'success',
      });
    }catch(err){
      console.error(err);
      wx.hideLoading()
    }
  },

  resetData: function () {
    wx.showModal({
      title: '确认重置',
      content: '确定要重置所有数据吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            shipName: '',
            location: '',
          });
          this.initTimeNotes();
          wx.showToast({
            title: '重置成功',
            icon: 'success',
          });
        }
      },
    });
  },

  exportData: function () {
    console.log('导出数据:', this.data);
    wx.showToast({
      title: '导出成功',
      icon: 'success',
    });
  },

  formatDate: function (date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  },

  onToggleChange: function (e) {
    const index = e.currentTarget.dataset.index;
    const enabled = e.detail.value;
    const timeNotes = [...this.data.timeNotes];
    timeNotes[index].enabled = enabled;
    this.setData({
      timeNotes: timeNotes,
    });
  },

});