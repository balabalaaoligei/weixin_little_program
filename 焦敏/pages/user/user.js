const app=getApp()
Page({
  data:{
    message:'Hey ~ Cool guys，这里是游戏攻略分享平台，希望在这里你可以放飞自我，自由翱翔，愿你打游戏把把赢，玩的好不要忘记与我们分享您的游戏攻略哦! ',
    userImg:""
  },
  //页面初次加载时运行
  onLoad:function(){
    this.setData({
      userImg:app.globalData.userImg
    })
  },
  //修改用户头像
  touchUserImg:function(){
    let that=this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log("选择成功", res)
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime()+'.png', // 上传至云端的路径
          filePath: res.tempFilePaths[0], // 小程序临时文件路径
          success: res=> {
            console.log("上传成功",res)
            that.setData({
              userImg:res.fileID
            })
            app.globalData.userImg=res.fileID;
          },
          fail: console.error
        })
      },
      fail: function (res) {
        console.log("失败", res)
      }
    })
  }
})
