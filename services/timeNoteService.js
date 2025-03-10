// services/timeNoteService.js

// Error handling
const handleError = (error) => {
  console.error('数据库操作失败:', error);
  return { code: -1, error: error.message };
};

// Get time note
const getTimeNote = async () => {
  try {
    const db = wx.cloud.database();
    const openid = wx.getStorageSync('openid'); 
    const timeNotesCollection = db.collection('time_notes');

    const result = await timeNotesCollection
      .where({
        _openid: openid,
      })
      .get();

    if (result.data.length > 0) {
      // if exists, return data
      return { code: 0, data: result.data[0], message: '记录查询成功' };
    } else {
      // if not, return null
      return { code: 404, data: null, message: '记录不存在' };
    }
  } catch (error) {
    return handleError(error);
  }
};

// Add/Edit time note
const saveTimeNote = async (data) => {
  try {
    const db = wx.cloud.database();
    const openid = wx.getStorageSync('openid'); 
    const timeNotesCollection = db.collection('time_notes');

    const existingRecord = await timeNotesCollection
      .where({
        _openid: openid,
      })
      .get();

    if (existingRecord.data.length > 0) {
      // If exists, edit
      const recordId = existingRecord.data[0]._id;
      await timeNotesCollection.doc(recordId).update({
        data: {
          ...data, 
          updateTime: db.serverDate(), // Update time
        },
      });
      return { code: 0, message: '记录更新成功' };
    } else {
      // If not exists, add
      await timeNotesCollection.add({
        data: {
          ...data, 
          createTime: db.serverDate(), 
          updateTime: db.serverDate(), 
        },
      });
      return { code: 0, message: '记录添加成功' };
    }
  } catch (error) {
    return handleError(error);
  }
};

module.exports = {
  getTimeNote,
  saveTimeNote,
};