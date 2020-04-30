const app = getApp()
const DBuserInfo = wx.cloud.database({
  env: 'jmtest-uu7na'
}).collection('userInfo')
Page({
  data: {
    usermessage: '',
    userImg: "", //用户头像地址
    userOpenId: "", //用户openid唯一标识
    userName: ""
  },
  //页面初次加载时运行
  onLoad: function () {
    var that = this;
    //云函数获取用户openid
    wx.cloud.callFunction({
      name: 'getuserOpenId',
      success: function(res) {
        console.log("openid获取成功", res.result.openid)
        that.setData({
          userOpenId: res.result.openid
        });
        //console.log(that.data.userOpenId)
        DBuserInfo.where({
          userOpenId: that.data.userOpenId
        }).get({
          success: function (res) {
            console.log("9999999",res.data[0])
            if(res.data[0]!=undefined){
            that.setData({
              userImg:res.data[0].userImg,
              userName:res.data[0].userName,
              usermessage:res.data[0].usermessage
            })}
            //console.log("that.data.userName")
            //console.log("这里这里这里");
            if (res.data[0] == undefined) {
              DBuserInfo.add({
                data: {
                  userOpenId: that.data.userOpenId,
                  userImg: "",
                  userName: "",
                  usermessage:""
                },
                success: function (res) {
                  console.log("添加成功", res.data)
                }
              })
            }
            console.log("1111")
          },
          fail: function (res) {
            console.log("获取用户头像失败", res.data.userOpenId)
          }
        })

      },
      fail: function(err) {
        console.log("失败", err)
      }
    })
  },

  //修改用户头像
  touchUserImg: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log("选择成功", res)
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + '.png', // 上传至云端的路径
          filePath: res.tempFilePaths[0], // 小程序临时文件路径
          success: res => {
            console.log("上传成功", res)
            that.setData({
              userImg: res.fileID
            })
            DBuserInfo.where({
              userOpenId: that.data.userOpenId
            }).update({
              data: {
                userImg: res.fileID
              },
              success: function (res) {
                console.log("更新成功", res.data)
              }
            })
          },
          fail: err => {
            console.log("上传失败", err)
          }
        })
      },
      fail: function (res) {
        console.log("失败", res)
      }
    })
  },

  //修改用户昵称
  updateUserName:function(){
    var that=this;
    wx.navigateTo({
      url: 'user_name/user_?id={{that.data.userOpenId}}',
    })
  // DBuserInfo.where({
  //   userOpenId:that.data.userOpenId
  // }).update({
  //   data: {
  //     userName: res.fileID
  //   },
  //   success: function(res) {
  //     console.log("更新成功",res.data)
  //   }
  // })
  },
  //修改用户个性签名
  updateUserSign:function(){
    var that=this;
    wx.navigateTo({
      url: 'user_sign/user_?id={{that.data.userOpenId}}',
    })
  }
})