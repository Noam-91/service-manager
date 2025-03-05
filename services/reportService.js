// services/reportService.js

// Error handling
const handleError = (error) => {
  console.error('数据库操作失败:', error);
  return { code: -1, error: error.message };
};

// Get reports related to the account, paged
const getAllReports = async (page = 1, pageSize = 10) => {
  try {
    const db = wx.cloud.database();
    const skip = (page - 1) * pageSize;
    
    const [dataRes, countRes] = await Promise.all([
      db.collection('service_reports')
        .where({ _openid: wx.getStorageSync('openid') })
        .orderBy('onboard_time', 'desc')
        .skip(skip)
        .limit(pageSize)
        .get(),
      db.collection('service_reports')
        .where({ _openid: wx.getStorageSync('openid') })
        .count()
    ]);

    return { 
      code: 0, 
      data: {
        list: dataRes.data,
        total: countRes.total,
        page,
        pageSize
      }
    };
  } catch (error) {
    return handleError(error);
  }
};

// Get report by id
const getReportById = async (reportId) => {
  try {
    const db = wx.cloud.database();
    const res = await db.collection('service_reports')
      .where({
        _id: reportId,
        _openid: wx.getStorageSync('openid')  // check authorization
      })
      .get();

    if (!res.data.length) {
      throw new Error('报告不存在或无权访问');
    }

    return { code: 0, data: res.data[0] };
  } catch (error) {
    return handleError(error);
  }
};

// Add new report
const addReport = async (jsonData) => {
  try {
    const db = wx.cloud.database();
    const res = await db.collection('service_reports').add({
      data: {
        ...jsonData,
        _openid: wx.getStorageSync('openid'), 
        createTime: db.serverDate(), 
        updateTime: db.serverDate()
      }
    });

    return { 
      code: 0, 
      data: { 
        _id: res._id,
        message: '报告创建成功' 
      }
    };
  } catch (error) {
    return handleError(error);
  }
};

// Edit report
const editReport = async (reportId, jsonData) => {
  try {
    const db = wx.cloud.database();

    await db.collection('service_reports')
      .doc(reportId)
      .update({
        data: {
          ...jsonData,
          updateTime: db.serverDate()
        }
      });

    return { code: 0, data: { message: '报告更新成功' } };
  } catch (error) {
    return handleError(error);
  }
};

// Delete report (REAL REMOVAL!)
const deleteReport = async (reportId) => {
  try {
    const db = wx.cloud.database();
    await db.collection('service_reports')
      .doc(reportId)
      .remove();

    return { code: 0, data: { message: '报告删除成功' } };
  } catch (error) {
    return handleError(error);
  }
};

export { 
  getAllReports, 
  getReportById,
  addReport,
  editReport,
  deleteReport
};