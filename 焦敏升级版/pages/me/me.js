// miniprogram/pages/me/me.js
var app = getApp();
const db=wx.cloud.database();
const back_end=db.collection('back_end');
Page({

  actioncnt: function() {        
    wx.showActionSheet({            
      itemList:  ['群聊',  '好友',  '朋友圈'],
      success: function(res)  {
        console.log(res.tapIndex)
      },
      fail: function(res)  {
        console.log(res.errMsg)
      }
    })   
  },
  data: {
    task:{},
    flag:null
  },
  onLoad: function(options) {
    app.getOpenId().then(res=>{
      this.getUserInfo()
    })
  },
  onShow:function(){
    back_end.where({
      userOpenId:app.globalData.useropenid
    }).get().then(res=>{
      this.setData({
        task:res.data[0]
      })
    })
  },
  //根据openid查询数据库用户信息
  getUserInfo:function(){
    console.log('2',app.globalData.useropenid)
    back_end.where({
      userOpenId:app.globalData.useropenid
    }).get().then(res=>{
      //如果数据库没有用户信息，自动添加
      if(res.data.length==0){   
        back_end.add({
          data:{
            userImgFileId:"",//头像fileid
            userName:"",//昵称
            userCountry:"",//国家
            userAutograph:"",//签名
            userOpenId:app.globalData.useropenid//openid
          }
        })
      //否则把用户信息返回来
      }else{
        this.setData({
          task:res.data[0]
        })
      }
    })
  },
  onCollectClick:function(event){
    wx.navigateTo({
      url: '../collect/collect',
    })
  },
  /**
   * 发布历史
   */
  onHistoryClick:function(event){
    wx.navigateTo({
      url: '../history/history',
    })
  },

  /**
   * 提交意见
   */
  onAdvanceClick:function(event){
    wx.navigateTo({
      url: '../advance/advance',
    })
  },


  clickInvitivation: function(event) {
    this.actioncnt();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(event) {
    console.log(event);
  },
  /**
   * 修改用户资料
   */
  modifyUserInfo:function(){
    wx.navigateTo({
      url: '/pages/modify/modify?userImgFileId='+this.data.task.userImgFileId,
    })
  }
})