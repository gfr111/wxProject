// pages/sign/sign.js
var util = require('../../utils/util.js')
var centerService = require("../../service/centerService.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signList: [{}, {}, {}, {}, {}, {}],
    alldata: [],
    shoeMore: false,
    num: null,
    height: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    centerService.getSignRecord().then((res) => {
      if (res.total > 0) {
        for (var i = 0; i < res.checkInRecords.length; i++) {
          var photo = res.checkInRecords[i].photo
          if (photo) {
            photo = "https://www.forzadata.cn/" + photo
          }
          res.checkInRecords[i].photo = photo
        }
      }
      if (res.checkInRecords&&res.checkInRecords.length>0){
        res.checkInRecords.map(item => {
          if (item.interval && item.interval != null) {
            console.log(item.interval)
            var time = item.interval
            var hour = parseInt(time / 60)
            hour = hour != 0 ? hour + '小时' : ''
            var minute = time % 60
            minute = minute != 0 ? minute + '分钟' : ''
            console.log(hour)
            console.log(minute)
            time = hour + minute
            item.interval = time
          } else {
            item.interval = '--'
          }
        })
      }

      var data = res.total > 10 ? res.checkInRecords.slice(0, 10) : res.checkInRecords

      that.setData({
        signList: data,
        alldata: res.checkInRecords,
        num: res.total
      })
    })
  },
  getList() {
    var len = this.data.signList.length,
      alllen = this.data.num,
      alldata = this.data.alldata,
      some = alllen - len > 10 ? alldata.slice(len, len + 10) : alldata.slice(len, alllen),
      shoeMore = alllen - len > 10 ? false : true

    var data = this.data.signList.concat(some)
    console.log(data)
    this.setData({
      signList: data,
      shoeMore: shoeMore
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (!this.data.shoeMore) {
      this.getList();
    }

  },

})