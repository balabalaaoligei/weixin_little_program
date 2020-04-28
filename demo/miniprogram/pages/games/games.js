//index.js
//获取应用实例

Page({
  data: {
    
  },
  onLoad:function()
  {
    this.onQuery();
  },
  onAdd: function () {
    const db = wx.cloud.database()
    db.collection('games').add({
      data: {
        user:"王同洋",
        game_name:"王者荣耀"
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
          count: "王者荣耀",
          user:"王同洋"
        })
        wx.showToast({
          title: '添加游戏成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id,this.data.user)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  onQuery: function() {
    const db = wx.cloud.database()
    // 查询当前games所有的 游戏数据
    db.collection('games').get({
      success: res => {
        this.setData({
          queryResult: JSON.parse(JSON.stringify(res.data, null, 2))
        })
        console.log('[数据库] [查询记录] 成功: ', this.data.queryResult)

      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
})
