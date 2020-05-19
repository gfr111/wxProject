// pages/myReservations/reservationDetail/reservationEvaluation/evaluateCourse.js
var reservService = require('../../../../service/reservationService.js');
var centerService = require('../../../../service/centerService.js');
var notificationCenter = require('../../../../WxNotificationCenter.js');
var notifConstant = require('../../../../utils/notifConstant.js');
var authenticationUtil = require('../../../../utils/authenticationUtil.js');
var config = require('../../../../config.js');
var submiting = false;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stars: [1, 1, 1, 1, 1],
    id: "",
    comments: "",
    levelStr: "非常满意",
    index:0,
    photo: [],
    photoUrl: [],
    uploadImgs: [],
    isShow:false,
    courseMessData:'',
    optionsData:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(!wx.getStorageSync("tokenKey")) {
      authenticationUtil.checkAuthToken();
    }
    let data = null;
    if (options.id) {
      data = {
        id: options.id
      }
    } else {
      data = JSON.parse(options.data);
    }
    this.data.id = data.id;
    this.data.index = data.index ? data.index : '';
    this.setData({
      optionsData: data
    })
    console.log(data)
  },
  selectPhoto: function () {
    this.setData({
      isShow: true
    })
  },
  hideUpload() {
    this.setData({
      isShow: false
    })
  },
  chooseImg(e){
    var that = this;
    var sourceType = [];
    if (e.currentTarget.dataset.type == 1) {
      sourceType = ['camera']
    } else {
      sourceType = ['album']
    };
    wx.chooseImage({
      count: 3 - that.data.photo.length, // 默认9
      sourceType: sourceType,
      success: function (res) {
        that.setData({
          isShow: false,
          photo: that.data.photo.concat(res.tempFiles),
          photoUrl: that.data.photoUrl.concat(res.tempFilePaths)
        })
        console.log(that.data.photoUrl)
      }
    })
  },
  uploadImg: function (i) {
    var header = {
      'WXAPPCHATID': getApp().globalData.token
    };
    var that = this;
    console.log(that.data.photoUrl);
    wx.uploadFile({
      url: config.uploadImgUrl(),
      filePath: that.data.photoUrl[i],
      header: header,
      name: 'file',
      success: function (res) {
        console.log(JSON.stringify(res))
        console.log(JSON.stringify(res["data"]))
        var data = res["data"]
        var a = JSON.parse(data);
        if (a.status == 0) {
          that.data.uploadImgs.push(a.data)
        }
        else {
          wx.showToast({
            title: '第' + i + '张照片上传失败',
            icon: 'none'
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '第' + i + '张照片上传失败',
          icon: 'none'
        })
        console.log(JSON.stringify(res))
      },
      complete: function () {

        if (i + 1 < that.data.photoUrl.length) {
          that.uploadImg(i + 1)
        } else {
          that.didTapGreenBtn();
        }
      }
    })
  },
  deleteImg: function (e) {
    this.data.photoUrl.splice(e.target.dataset.index, 1)
    this.data.photo.splice(e.target.dataset.index, 1)
    this.setData({
      photo: this.data.photo,
      photoUrl: this.data.photoUrl
    })
  },

  didTapGreenBtn: function () {
    console.log("aahaha, confirm");
    var that = this;

    function checkRated(num) {
      return num == 1;
    }
    let currentLevel = that.data.stars.filter(checkRated).length;

    reservService.rateReservation(that.data.id, currentLevel, that.data.comments, that.data.uploadImgs).then((res) => {
      if (res)
      {
        // notificationCenter.postNotificationName(notifConstant.refreshReservationListNotif, { index: that.data.index, name: "rate" });
        wx.showToast({
          title: '评价成功',
        })
        if (that.data.index!=''){
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.data.list[that.data.index].rated = true;
          prevPage.setData({
            list: prevPage.data.list
          })
          setTimeout(function () {
            wx.navigateBack();
          }, 1000)
        }else{
          setTimeout(function () {
            console.log('成功')
            wx.redirectTo({
              url: '/pages/myReservations/reservationList/reservationList',
            })
          }, 1000)
        }

      }
      submiting = false;
    }).catch(err => {
      submiting = false
    })

  },
  uploadEvaluation: function () {
    wx.showLoading({
      title: '提交中',
    })
    if (submiting) {
      return;
    }
    submiting = true
    if (this.data.photoUrl.length > 0) {
      this.uploadImg(0);
    } else {
      this.didTapGreenBtn();
    }
    wx.hideLoading();
  },
  starTapped: function (target) {

    var index = parseInt(target.target.id);
    var temp = [];

    for (var i = 0; i <= index; i++) {
      temp[i] = 1
    }
    for (var j = index + 1; j < 5; j++) {
      temp[j] = 0
    }
    this.setData({
      stars: temp,
      levelStr: this.getLevelStr(index)
    })
  },

  bindCommentsInput: function (e) {
    this.data.comments = e.detail.value;
  },



  getLevelStr: function (index) {
    switch (index) {
      case 0: return "非常不满意，各方面都很差";
      case 1: return "不满意，比较差";
      case 2: return "一般，还需改善";
      case 3: return "比较满意，仍可改善";
      case 4: return "非常满意，无可挑剔";
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    centerService.getJudgeCourseMess(this.data.optionsData.id).then((res) => {
      var club = res.center
      var center = {
        "id": club.id,
        "name": club.name,
        "address": club.displayAddress,
        "phone": club.phone,
        "clubType": club.clubType,
        "photo": club.photo,
        'fullNumber': club.fullNumber ? club.fullNumber : ''

      }
      wx.setStorageSync('selectCenterKey', center)
      app.globalData.selectCenter=center
      this.setData({
        courseMessData: res
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})