const app = getApp()
const DBuserInfo = wx.cloud.database({
  env: 'jmtest-uu7na'
}).collection('userInfo')
Page({
    data:{
        sign:"",
        useropenid:""
    },
    onLoad:function(options){
        this.data.useropenid=options.id
    },
    addsign(e){
        this.setData({
            sign:e.detail.value
        })
        console.log("11111",e.detail.value)
    },
    confirm:function(){
        var that=this;
        if(that.data.sign==""){
            wx.showToast({
                title: '修改失败，不能为空',
                icon: 'none',
                //duration: 2000
              })
        }else{
            console.log("444444")
            var pages=getCurrentPages();
            var prevPage=pages[pages.length-2];
            prevPage.setData({
                usermessage:that.data.sign          
            }),
            DBuserInfo.where({
               userOpenId:that.data.userOpenId
            }).update({
              data: {
                usermessage:that.data.sign 
              },
              success: function(res) {
                console.log("更新成功",res)
              }
            })
            wx.navigateBack({
               delta: 1,
            })
        }
    }
})