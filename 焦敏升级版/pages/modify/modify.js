// pages/modify/modify.js
const app = getApp();
const db = wx.cloud.database();
const back_end = db.collection('back_end');
Page({
    data: {
        array: ['美国', '中国', '巴西', '日本'],
        index: null,
        userImg: '',
        userImgFileId: '',
        userName: '',
        userCountry: '',
        userAutograph: "",
        userOpenId: ''
    },
    onLoad: function (options) {
        back_end.where({
            userOpenId: app.globalData.useropenid
        }).get().then(res => {
            this.setData({
                userImgFileId: res.data[0].userImgFileId,
                userName: res.data[0].userName,
                userAutograph: res.data[0].userAutograph
            })
        })


        // this.setData({
        //     index:null,
        //     userImg:null,
        //     userImgFileId:null,
        //     userName:null,
        //     userCountry:null,
        //     userAutograph:"",
        //     userOpenId:null
        // })
    },
    onReady: function () {

    },
    onShow: function () {

    },
    //修改用户头像
    modify_AvatarUrl: function (e) {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
                console.log(res)
                var tempFilePaths = res.tempFilePaths
                this.setData({
                    userImg: tempFilePaths[0]
                })
            }
        })
    },
    //修改用户所在国家
    bindPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            userCountry: this.data.array[e.detail.value],
            index: e.detail.value
        })
    },
    //提交
    submit: function (e) {
        var that = this;
        if (!this.data.userImg) {
            back_end.where({
                userOpenId: app.globalData.useropenid
            }).update({
                data: {
                    userName: e.detail.value.Name,
                    userAutograph: e.detail.value.Autograph,
                    userCountry: this.data.userCountry,
                }
            })
            wx.showToast({
                title: '修改成功',
                icon: 'none'
            }).then(res => {
                setTimeout(() => {
                    wx.navigateBack({})
                }, 1500);
            })
        } else {
            wx.cloud.uploadFile({
                filePath: that.data.userImg,
                cloudPath: new Date().getTime() + '.png'
            }).then(res => {
                back_end.where({
                    userOpenId: app.globalData.useropenid
                }).update({
                    data: {
                        userImgFileId: res.fileID
                    }
                }).then(res => {
                    back_end.where({
                        userOpenId: app.globalData.useropenid
                    }).update({
                        data: {
                            userName: e.detail.value.Name,
                            userAutograph: e.detail.value.Autograph,
                            userCountry: this.data.userCountry,
                        }
                    })
                    wx.showToast({
                        title: '修改成功',
                        icon: 'none'
                    }).then(res => {
                        wx.navigateBack({})
                        // setTimeout(() => {
                        //     wx.navigateBack({})
                        // }, 500);
                    })
                })


            }).catch(err => {
                console.log(err)
            })
        }

    }

})