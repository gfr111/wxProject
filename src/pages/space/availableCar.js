// pages/space/availableCar.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPop: false,
    carList: null,
    sites: null,
    usefulCar: [],
    unusefulCar: [],
    allPrice: null,
    selectedId: null,
    discount: null,
    planDate: null,
    spaceMess: null,
    showSumbit: false,
    discountType: null,
    showPrice: null,
    curr: 22,
    currIdx: 0,//nav当前标识
    defaultHeight: null,
    noUseCard: null,//不可用的会员卡
    groundId: null,//预订的场地id
    buckle: [],
    preferential: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          defaultHeight: res.screenHeight - 110 - 55
        })
      }
    })
    console.log('---卡数据---', options)
    
    that.setData({
      carList: JSON.parse(options.carList),
      noUseCard: JSON.parse(options.noUseCard),
      sites: JSON.parse(options.list),
      allPrice: options.price,
      planDate: options.planDate,
      spaceMess: JSON.parse(options.spaceMess),
      showPrice: options.price,
      groundId: options.groundId
    })
    console.log('---noUseCard---', that.data.noUseCard)
    var arr1 = [];
    var arr2 = [];
    var carList = that.data.carList
    var buckle = []//扣卡
    var preferential = []//优惠
    for (var i = 0, len = carList.length; i < len; i++) {
      // carList[i].checked = false;
      //循环计算储值卡扣卡余额是否足够
      if (carList[i].cardType == 5 && carList[i].discountType == 1) {
        carList[i].counts = util.mul(carList[i].deductionAmount, that.data.sites.length)
      } else {
        carList[i].counts = null;
      }
      if (carList[i].objectId > 0) {
        arr1.push(carList[i])
        if (carList[i].discountType == 1){
          buckle.push(carList[i])
        }else{
          preferential.push(carList[i])
        }
      } else {
        arr2.push(carList[i])
      }
    }
    for (var x = 0, len = arr1.length; x < len; x++) {
      if (arr1[x].checked == true) {
        that.setData({
          showSumbit: true
        })
      }
    }
    console.log('---aii1---', arr1)
    console.log('---arr2---', arr2)
    that.setData({
      usefulCar: arr1,
      unusefulCar: arr2,
      carList: carList,
      buckle: buckle,
      preferential: preferential
    })
  },
  needPay: function() {
    var that = this;
    if (that.data.curr == 22) {
      var pages = getCurrentPages()
      if (pages.length > 1) {
        var prePage = pages[pages.length - 2];
        wx.navigateBack({});
      }
      return
    }
    var data = {};
    data.planDate = that.data.planDate;
    data.sites = that.data.sites;
    data.total = Number(that.data.allPrice);
    if (that.data.discount != null) {
      data.realAmount = util.mul(util.mul(that.data.allPrice, that.data.discount), 0.1);
    } else {
      data.realAmount = Number(that.data.allPrice);
    }
    for (var i = 0, len = that.data.carList.length; i < len; i++) {
      if (that.data.selectedId == that.data.carList[i].objectId) {
        data.payType = that.data.carList[i].payType;
        data.cardType = that.data.carList[i].cardType;
        data.objectId = that.data.carList[i].objectId;
        data.name = that.data.carList[i].objectName;
        data.discountType = that.data.carList[i].discountType;
        if (that.data.carList[i].discountType == null) {
          data.discountRatio = 10;
        } else {
          if (that.data.carList[i].discountType == 2) {
            data.discountRatio = that.data.carList[i].discountRatio;
          } else {
            if (that.data.carList[i].cardType == 4) {
              if (that.data.carList[i].discountType == 1) {
                data.deductionCount = that.data.carList[i].deductionCount * that.data.sites.length;
              } else {
                data.deductionCount = that.data.carList[i].deductionCount;
              }
              console.log(data.deductionCount)
            } else if (that.data.carList[i].cardType == 5) {
              if (that.data.carList[i].discountType == 1) {
                data.deductionAmount = util.mul(that.data.carList[i].deductionAmount, that.data.sites.length)
              } else {
                data.deductionAmount = that.data.carList[i].deductionAmount;
              }
            }
          }
        }

      }
    }
    console.log(data)
    //  wx.navigateTo({
    //    url: '/pages/space/bookingsure?data=' + JSON.stringify(data) + '&spaceMess=' + JSON.stringify(that.data.spaceMess),
    //   })
    console.log('---carList---', that.data.carList)
    var pages = getCurrentPages()
    if (pages.length > 1) {
      var prePage = pages[pages.length - 2];
      prePage.changePeferData(that.data.carList, data, that.data.spaceMess);
      wx.navigateBack({});
    }
  },

  //购买会员卡
  toBuyCar: function() {
    // wx.navigateTo({
    //   url: '/pages/courseAndCar/courseAndCar',
    // })
    wx.navigateTo({
      url: '/pages/space/buyCarList?groundId=' + this.data.groundId,
    })
  },
  returnBook: function() {
    wx.navigateBack({});
  },
  chooseCar: function(e) {
    var that = this;
    that.setData({
      curr: 33
    })
    var carList = that.data.carList
    var arr = [];
    var arr1 = that.data.usefulCar;
    for (var i = 0, len = carList.length; i < len; i++) {
      if (carList[i].objectId < 0) {
        carList[i].checked = false;
        arr.push(carList[i])
      }
      if (carList[i].objectId == e.currentTarget.dataset.id) {
        carList[i].checked = true;
      }else {
        carList[i].checked = false;
      }
    }
    for (var i = 0, len = arr1.length; i < len; i++) {
      if (arr1[i].objectId == e.currentTarget.dataset.id) {
        that.setData({
          discountType: arr1[i].discountType
        })
        if (!arr1[i].checked) {
          that.setData({
            showSumbit: true
          })
        }
        arr1[i].checked = true;
      } else {
        arr1[i].checked = false;
      }
    }
    console.log('---选卡---', that.data.carList)
    that.setData({
      carList: carList,
      unusefulCar: arr,
      usefulCar: arr1,
      discount: e.currentTarget.dataset.discount,
      selectedId: e.currentTarget.dataset.id
    })
    if (e.currentTarget.dataset.discount == null) {
      that.setData({
        showPrice: util.mul(that.data.allPrice, 1)
      })
    } else {
      that.setData({
        showPrice: util.mul(util.mul(that.data.allPrice, 0.1), e.currentTarget.dataset.discount)
      })
    }
    that.needPay()//选中之后，就返回
  },
  hidePage: function() {

  },
  chooseDisableCar: function(e) {
    var that = this;
    that.setData({
      curr: 33
    })
    var arr = [];
    var arr1 = that.data.unusefulCar;
    var carList = that.data.carList
    for (var i = 0, len = carList.length; i < len; i++) {
      if (carList[i].objectId > 0) {
        carList[i].checked = false;
        arr.push(carList[i])
      }
      if (carList[i].objectId == e.currentTarget.dataset.id) {
        carList[i].checked = true;
      } else {
        carList[i].checked = false;
      }
    }
    for (var i = 0, len = arr1.length; i < len; i++) {
      if (arr1[i].objectId == e.currentTarget.dataset.id) {
        that.setData({
          discountType: arr1[i].discountType
        })
        if (!arr1[i].checked) {
          that.setData({
            showSumbit: true
          })
        }
        arr1[i].checked = true;
      } else {
        arr1[i].checked = false;
      }
    }
    console.log('---其他---', carList)
    that.setData({
      carList: carList,
      unusefulCar: arr1,
      usefulCar: arr,
      discount: e.currentTarget.dataset.discount,
      selectedId: e.currentTarget.dataset.id
    })
    if (e.currentTarget.dataset.discount == null) {
      that.setData({
        showPrice: util.mul(that.data.allPrice, 1)
      })
    } else {
      that.setData({
        showPrice: util.mul(util.mul(that.data.allPrice, 0.1), e.currentTarget.dataset.discount)
      })
    }
    that.needPay()//选中之后，就返回
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

  },



  /*********页面点击事件*********/
  //切换nav
  checkCurrent: function(e){
    const that = this;
    if (that.data.currIdx === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currIdx: e.target.dataset.current
      })
    }
  },

  //获取当前滑块的index
  bindchange: function (e) {
    const that = this;
    that.setData({
      currIdx: e.detail.current
    })
  },

  //卡详情
  toCardDeatail: function (e) {
    wx.navigateTo({
      url: '/pages/index/cardDetail?id=' + e.currentTarget.dataset.id + '&cardid=' + e.currentTarget.dataset.cardid,
    })
  },

})