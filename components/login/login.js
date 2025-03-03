// login.js
import { login } from '../../utils/auth';
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Component({
  properties:{},
  data: {
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
      fullName: '' 
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
  },
  observers:{
    'userInfo.**' : function(){
      console.log(this.data.userInfo);
      wx.setStorageSync('userInfo', this.data.userInfo);
    }
  },
  methods:{
    onLoad: function() {
      wx.login
    },
    onInputChange: function(e) {
      const fullName = e.detail.value
      const { avatarUrl } = this.data.userInfo
      this.setData({
        "userInfo.fullName": fullName,
        hasUserInfo: fullName && avatarUrl && avatarUrl !== defaultAvatarUrl,
      })
    },
    // call cloud service 'login'
    handleLogin: async function() {
      try {
        const openid = await login();
        console.log('登录成功，openid:', openid);
        wx.setStorageSync('openid', openid);
      } catch (err) {
        console.error('登录失败详情:', err);
        wx.showToast({ title: '登录失败', icon: 'none' });
      }
    },
    // deprecated temporarily
    getUserProfile: function(e) {
      // 先获取临时 code
      let code;
      console.log("Trigger");
      wx.login({
        success: (loginRes) => {
          code = loginRes.code; // 临时凭证，有效期5分钟
          console.log("Login success.   "+code);
          // 再获取用户信息
        },
        fail:()=>{
          console.log("login fail");
        }
      });

      wx.getUserProfile({
        desc: '用于登录验证',
        success: (res) => {
          // 将 code + 用户信息发送到后端
          console.log("GetUserProfile success");
          wx.request({
            url: 'http://localhost:8080/login',
            method: 'POST',
            data: {
              code: code,
              userInfo: res.userInfo
            },
            success: (apiRes) => {
              // 后端返回的 token 存入本地
              console.log(apiRes.data.openid);
              wx.setStorageSync('token', apiRes.data.token);
              console.log('登录成功');
            }
          });
        },
        fail:(e)=>{
          console.error(e);
        }
      });
    }
  }
})
