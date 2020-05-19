// Cards.js
var app = getApp();
var login = require('../../service/loginService.js');
var systemMessage = require('../../SystemMessage.js');
var P = require('../../lib/wxpage.js');

P("index/Cards", {

  /**
   * 页面的初始数据
   */
  data: {
    cards: [],
    current: "",
    preIndex: "",
    currentData: 0,
    defaultHeight: null,
    invalidList: [],
    effectiveList: [],
    isShare: false
  },


  onNavigate: function(res) {
    this.preDataRequest();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.refresh();
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          defaultHeight: res.screenHeight - 110
        })
      }
    })
  },
  //获取当前滑块的index
  bindchange: function(e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function(e) {
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },
  refresh: function() {
    var res = this.$take('cardsList');
    if (res) {
      this.setData({
        cards: res
      })
    } else {
      this.getData();
    }
  },

  getData: function() {
    if (app.globalData.token) {
      var that = this;
      that.dataRequest(function(res) {
        that.setData({
          cards: res
        })
      })
    }
  },
  toCardDeatail: function(e) {
    if (!this.data.isShare) {
      wx.navigateTo({
        url: '/pages/index/cardDetail?id=' + e.currentTarget.dataset.id + '&cardid=' + e.currentTarget.dataset.cardid,
      })
    }
  },
  preDataRequest: function() {
    var that = this;
    that.dataRequest(function(res) {
      that.$put('cardsList', res);
    })
  },
  dataRequest: function(callBack) {
    var that = this;

    login.getUserCardList().then((res) => {
      callBack(res);
    })
  },

  changeCard(event) {
    // console.log(JSON.stringify(e))
    if (event.detail.source == "touch") {
      //防止swiper控件卡死
      if (this.data.current == 0 && this.data.preIndex > 1) { //卡死时，重置current为正确索引
        this.setData({
          current: this.data.preIndex
        });
      } else { //正常轮转时，记录正确页码索引
        this.setData({
          preIndex: this.data.current
        });
      }
    }
  },
  shareEvent(e) {
    this.setData({
      isShare: true
    })
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '/pages/coupon/pages/shareCard/shareCard?contractId=' + e.currentTarget.dataset.contractid + '&count=' + e.currentTarget.dataset.count + '&img=' + e.currentTarget.dataset.img,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    that.setData({
      isShare: false
    })
    var invalidList = [];
    var effectiveList = [];
    login.getUserCardList().then((res) => {
      // console.log(res)
      for (var i = 0; i < res.length; i++) {
        if (res[i].status == 3) {
          invalidList.push(res[i])
        } else {
          effectiveList.push(res[i])
        }
      }
      that.setData({
        invalidList: invalidList,
        effectiveList: effectiveList
      })
    })

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.$take('cardsList');
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      path: "/pages/mine/mine"
    }
  }
})