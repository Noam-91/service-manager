// services/userService.js
// Error handling
const handleError = (error) => {
  console.error('数据库操作失败:', error);
  return { code: -1, error: error.message };
};

// Get UserInfo
const getUserInfoByOpenid = async ()=>{
  try {
    const db = wx.cloud.database();
    const res = await db.collection('users')
      .where({
        _openid: wx.getStorageSync('openid')
      })
      .get();

    if (!res.data.length) {
      throw new Error('用户不存在');
    }

    return { code: 100, data: res.data[0] };
  } catch (error) {
    return { 
      code: 404, 
      data: { 
        message: '用户不存在' 
      }
    };
  }
}

// Add new user
const addUser = async (userInfo) => {
  try {
    const db = wx.cloud.database();
    const res = await db.collection('users').add({
      data: {
        _openid: wx.getStorageSync('openid'), 
        createTime: db.serverDate(), 
        nickName:userInfo.nickName,
        fullName:userInfo.fullName,
        avatarUrl:userInfo.avatarUrl
      }
    });

    return { 
      code: 100, 
      data: { 
        _id: res._id,
        message: '用户创建成功' 
      }
    };
  } catch (error) {
    return handleError(error);
  }
};

// Edit user information
const editUser = async (userInfo) => {
  try {
    const db = wx.cloud.database();
    const openid = wx.getStorageSync('openid');
    
    // 更新操作
    const res = await db.collection('users')
      .where({ _openid: openid })      // locate user by _openid
      .update({
        data: {
          // Update part of userInfo
          fullName:userInfo.fullName,
          avatarUrl:userInfo.avatarUrl,               
          updateTime: db.serverDate()  // record update
        }
      });

    // User not found
    if (res.stats.updated === 0) {
      return { 
        code: 404, 
        data: { 
          message: '用户不存在' 
        } 
      };
    }

    return { 
      code: 100, 
      data: { 
        message: '用户信息更新成功' 
      } 
    };
  } catch (error) {
    return handleError(error);
  }
};

export {
  getUserInfoByOpenid,
  addUser,
  editUser
};