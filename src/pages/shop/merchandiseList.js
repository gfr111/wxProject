// pages/shop/merchandiseList.js
var buyCardService = require('../../service/buyCardService.js');
var util = require('../../utils/util.js')
var app = getApp();
var storageUtil = require('../../utils/storageUtil.js');
var promiseUtil = require('../../utils/promiseUtil.js');
var counting = false;
var requestUtil = require('../../utils/requestUtil.js');
var config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stock: "",
    type: 1,
    count: 0,
    amount: 0,
    buyItems: [],
    showCar: false,
    selectTypeId: 'item1',
    centerName: "",
    scene: "",
    isopen:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.data.scene = options.scene;

  },
    getwxAppSetting() {
        var url = config.getwxAppSetting();
        requestUtil.getRequest(url).then(res => {
            console.log(res.wxAppSetting.showOtherMerchandise)
            if (!res.wxAppSetting.showOtherMerchandise) {
                this.setData({
                    isopen:false
                })
            }else{
                this.setData({
                    isopen: true
                })
            }
        })
    },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    if (app.globalData.isAppOnShow) {
      app.globalData.isAppOnShow = false;
      if (that.data.scene != null) {
        let info = {
          id: decodeURIComponent(that.data.scene)
        }
        app.globalData.selectCenter = info;
        storageUtil.saveSelectCenter(info);
      }
      if (!app.globalData.token && that.data.scene != null) {
        var wxGetExtConfig = promiseUtil.wxPromisify(wx.getExtConfig);
        wxGetExtConfig().then((res) => {
          if (JSON.stringify(res.extConfig) != '{}') {
            wx.setNavigationBarTitle({
              title: res.extConfig.centerName
            });
          }
        })
      }

    } else {
      if (that.data.scene != null) {
        let info = {
          id: decodeURIComponent(that.data.scene)
        }
        app.globalData.selectCenter = info;
        storageUtil.saveSelectCenter(info);

        var wxGetExtConfig = promiseUtil.wxPromisify(wx.getExtConfig);
        wxGetExtConfig().then((res) => {
          if (JSON.stringify(res.extConfig) != '{}') {
            wx.setNavigationBarTitle({
              title: res.extConfig.centerName
            });
          }
        })
      }
    }

    if (app.globalData.token == null) {
      app.globalData.receive = true
    }
    app.checkAuthToken(()=> {
      buyCardService.getStockList(that.data.scene).then(res => {
        for (var i in res) {
          if (res[i].length > 0 && i != 'centerName') {
            console.log(res[i])
            res[i].map((item,index)=>{
              item.index=index
            })
          }
        }
        that.setData({
          stock: res,
          centerName: res.centerName
        })
        if (that.data.scene != null) {
          let info = {
            id: decodeURIComponent(that.data.scene),
            name: res.centerName
          }
          app.globalData.selectCenter = info;
          storageUtil.saveSelectCenter(info);
          that.data.scene == null
        }
      })
      this.getwxAppSetting()
    });
  },

  selectType:function(e){

    this.setData({
      type: e.currentTarget.dataset.type,
      selectTypeId: 'item' + e.currentTarget.dataset.type
    })

  },
  addBuy: function(e) {
    if (counting) {
      return
    }
    counting = true
     var item = e.currentTarget.dataset.item
     var index = e.currentTarget.dataset.index

    if (typeof(index) == "undefined") {
      index = item.index
    }

    if (item.countInStock == null || item.countInStock < 1) {
      counting = false
      return
    }

    if (item.buyCount) {
      if (item.countInStock <= item.buyCount) {
        counting = false
        return
      }
      item.buyCount = item.buyCount + 1
    } else {
      item.buyCount = 1
    }
    item.index = index
    if (this.data.buyItems.length > 0) {
      var haveItem = false
      this.data.buyItems.forEach(v => {
        if (v.id == item.id) {
          v.buyCount = v.buyCount + 1
          haveItem = true
        }
      })
      if (!haveItem) {
        this.data.buyItems.push(item)
      }
    } else {
      this.data.buyItems.push(item)
    }
    this.setData({
      buyItems: this.data.buyItems,
      count: this.data.count + 1,
      amount: util.floatAdd(this.data.amount, item.priceOnSale)
    })
    var stocks
    if (item.categoryId == 1) {
      stocks = 'stock.drink[' + index + ']'
    } else if (item.categoryId == 2) {
      stocks = 'stock.dress[' + index + ']'
    } else if (item.categoryId == 3) {
      stocks = 'stock.tonic[' + index + ']'
    } else if (item.categoryId == 4) {
      stocks = 'stock.place[' + index + ']'
    } else if (item.categoryId == 5) {
      stocks = 'stock.gift[' + index + ']'
    } else if (item.categoryId == 6) {
      stocks = 'stock.serve[' + index + ']'
    } else {
      stocks = 'stock.other[' + index + ']'
    }
    this.setData({
      [stocks]: item
    }, res => {
      counting = false
    })

  },
  subBuy: function(e) {
    if (counting) {
      return
    }
    counting = true
    if (this.data.count <= 0) {
      counting = false
      return
    }
    var item = e.currentTarget.dataset.item
    var index = e.currentTarget.dataset.index
    if (typeof(index) == "undefined") {
      index = item.index
    }
    if (item.buyCount < 1 || item.buyCount == null) {
      counting = false
      return
    }
    item.buyCount = item.buyCount - 1
    item.index = index
    //this.data.buyItems.push(item)/////////////////////////
    if (this.data.buyItems.length > 0) {
      var length = this.data.buyItems.length
      for (var i = 0; i < length; i++) {
        if (this.data.buyItems[i].id == item.id) {
          if (this.data.buyItems[i].buyCount > 1) {
            this.data.buyItems[i].buyCount = this.data.buyItems[i].buyCount - 1
            break
          } else {
            this.data.buyItems.splice(i, 1)
            break
          }
        }
      }
    }


    this.setData({
      buyItems: this.data.buyItems,
      count: this.data.count - 1,
      amount: util.floatSub(this.data.amount, item.priceOnSale)
    })
    console.log(this.data.buyItems.length)
    if (this.data.buyItems.length < 1) {
      this.setData({
        openCar: false
      })
    }


    var stocks
    if (item.categoryId == 1) {
      stocks = 'stock.drink[' + index + ']'
    } else if (item.categoryId == 2) {
      stocks = 'stock.dress[' + index + ']'
    } else if (item.categoryId == 3) {
      stocks = 'stock.tonic[' + index + ']'
    } else if (item.categoryId == 4) {
      stocks = 'stock.place[' + index + ']'
    } else if (item.categoryId == 5) {
      stocks = 'stock.gift[' + index + ']'
    } else if (item.categoryId == 6) {
      stocks = 'stock.serve[' + index + ']'
    } else {
      stocks = 'stock.other[' + index + ']'
    }
    this.setData({
      [stocks]: item
    }, res => {
      counting = false
    })
  },
  goClear: function() {
    var that = this
    wx.showModal({
      title: '温馨提示',
      content: '清空购物车所有商品？',
      success(res) {
        if (res.confirm) {
          that.clearCar()
        } else if (res.cancel) {

        }
      }
    })
  },

  clearCar: function() {
    var length = this.data.buyItems.length
    var item, stocks;
    for (var i = 0; i < length; i++) {
      item = this.data.buyItems[i]
      item.buyCount = 0
      var stocks
      if (item.categoryId == 1) {
        stocks = 'stock.drink[' + item.index + ']'
      } else if (item.categoryId == 2) {
        stocks = 'stock.dress[' + item.index + ']'
      } else if (item.categoryId == 3) {
        stocks = 'stock.tonic[' + item.index + ']'
      } else if (item.categoryId == 4) {
        stocks = 'stock.place[' + item.index + ']'
      } else if (item.categoryId == 5) {
        stocks = 'stock.gift[' + item.index + ']'
      } else if (item.categoryId == 6) {
        stocks = 'stock.serve[' + item.index + ']'
      } else {
        stocks = 'stock.other[' + item.index + ']'
      }
      this.setData({
        [stocks]: item
      })

    }

    this.setData({
      openCar: false,
      buyItems: [],
      count: 0,
      amount: 0
    })

  },
  openCars: function() {
    this.setData({
      openCar: !this.data.openCar
    })
  },
  goBuy: function() {
    console.log(1)
    if (this.data.count <= 0) {
      wx.showToast({
        title: '购买数量不能小于1',
        icon: 'none'
      })
      return
    }


    var that = this;
    var orderItems = []
    for (var i = 0; i < this.data.buyItems.length; i++) {
      var item = {}
      item.count = this.data.buyItems[i].buyCount
      item.itemId = this.data.buyItems[i].id
      orderItems.push(item)
    }
    wx.navigateTo({
      url: '/pages/shop/submitOrder/submitOrder?item=' + JSON.stringify(orderItems) + '&price=' + this.data.amount,
    })

  },
  tochange(e) {
    console.log(e.currentTarget.dataset.idx)
    var data = e.currentTarget.dataset.idx
    var item = [{
      count: 1,
      itemId: data.id,
    }]
    wx.navigateTo({
      url: '/pages/shop/submitOrder/submitOrder?item=' + JSON.stringify(item) + '&price=' + data.exchangeScore + '&ischange=true',
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})