// login.js
import { login } from '../../utils/auth';
import * as userService from "../../services/userService"

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Component({
  properties:{},
  data: {
    userInfo: {
      openid:'',
      avatarUrl: defaultAvatarUrl,
      nickName: '',
      fullName: '' 
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
  },
  observers:{
    'userInfo.**' : function(){
      wx.setStorageSync('userInfo', this.data.userInfo);
    }
  },
  methods:{
    onLoad: function() {
      wx.login
    },
    onInputChange: function(e) {
      const fullName = e.detail.value;
      this.setData({
        "userInfo.fullName": fullName,
      });
    },
    onChooseAvatar(e) {
      const { avatarUrl } = e.detail 
      this.setData({
        userInfo:{
          ...this.data.userInfo,
          avatarUrl
        }
      })
    },
    onSave: function(){
      userService.editUser(this.data.userInfo);
    },
    // call auth.login to trigger the cloud function
    handleLogin: async function() {
      try {
        wx.showLoading({
          title: '登录中',
        })
        const openid = await login();
        wx.setStorageSync('openid', openid);
        const {code,data:userInfo} = await userService.getUserInfoByOpenid();
        if(code===404){
          // openid not found in DB
          // Create new account
          wx.showModal({
            title: '创建新用户',
            content: '是否创建新用户',
            complete: (res) => {
              if (res.cancel) {
                console.log("用户拒绝创建新用户");
              }
              if (res.confirm) {
                userService.addUser(this.data.userInfo);
                this.setData({
                  hasUserInfo:true
                });
              }
            }
          })
        }else if (code===100){
          // User found
          this.setData({
            hasUserInfo:true
          });
        }

        this.setData({
          userInfo
        })
      } catch (err) {
        console.error('登录失败详情:', err);
        wx.showToast({ title: '登录失败', icon: 'none' });
      }finally{
        wx.hideLoading();
      }
    },
    
    navigateToDocument:function(){
      wx.navigateTo({
        url: "/pages/document/document",
      })
    }
  }
})
