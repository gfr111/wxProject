// pages/groupCourse/groupCourseList.js
var util = require('../../utils/util.js');
var groupCourse = require('../../service/groupCourse.js');
var systemMessage = require('../../SystemMessage.js');
var buyCardService = require('../../service/buyCardService.js')
var requestUtil = require('../../utils/requestUtil.js')
var config = require('../../config.js')
var authenticationUtil = require('../../utils/authenticationUtil.js');
var centerService = require("../../service/centerService.js");
var loginService = require('../../service/loginService.js');
var app = getApp();
var isShow=false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    days: [], // 总天数
    currentShowDays: [], // 当前一周内的天数
    currentShowDaysIndex: 0, // 当前显示第几周的日期
    daysScrollViewCurrentIndex: 0, // 当前显示一周内第几天的数据
    validCourseList: [], // 有效的课程
    invalidCourseList: [], // 无效的课程
    showCourseList: [], // 显示出来的课程
    allValidCourseList:[],//所有的有效课程列表
    allInvalidCourseList:[],//所以的无效课程
    showInvalidCourse: false, // 显示无效课程
   // 培训班
    showTrainingInvalidCourse: false,
    validTrainingCourseList: [],
    invalidTrainingCourseList: [],
    showTrainingCourseList: [],

    selectedTrainer: null,
    privateCourse: null,
    trainers: null,
    isLogin: false,
    selectCenter: null,
    showGroup: 1, //显示团课还是私教课,
    today: null,
    spaceList: [], //场地
    otherTrainers: [],
    centerId: '',
    allowTrainingModule:false,
    nav:[{
        name:'团课',
        valname:'showReservationGroupCourse'
      }, {
        name: '私教',
        valname: 'showReservationPersonalCourse'
      }, {
        name: '场地',
        valname: 'showReservationGround'
      }, {
        name: '培训',
        valname: 'showReservationTrainingCourse'
      },]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.centerId || options.scene) {
      var id=options.centerId?options.centerId:options.scene
      // 外部带入团队Id,赋值团队信息
      app.globalData.selectCenter = {
        id: id
      }
      this.setData({
        centerId: id
      })

    }
    // 获取团课选择天数
    var days = groupCourse.getDaysWithDayCount(28);
    this.setData({
      days: days,
      currentShowDays: days[0],
      today: new Date().getMonth() + 1 + '.' + new Date().getDate()
    });
  },

  getTrainers: function() {
    var that = this;
    buyCardService.getTrainerList(-1).then((res) => {
      var trainers = res.trainers;
      if (app.globalData.selectCenter.clubType != 4) {
        if (!res.courseTrainers) {
          that.setData({
            trainers: res
          });
        }else{
          for (var j = 0; j < res.courseTrainers.length; j++) {
            for (var i = 0; i < res.trainers.length; i++) {
              if (res.trainers[i].id == res.courseTrainers[j].id) {
                trainers.splice(i, 1)
              }
            }
          }
          res.trainers = trainers
          that.setData({
            trainers: res
          });
        }

      } else {
        var otherTrainers = res.trainers;;
        if (res.myTrainers) {
          for (var j = 0; j < res.myTrainers.length; j++) {
            for (var i = 0; i < res.trainers.length; i++) {
              if (res.trainers[i].id == res.myTrainers[j].id) {
                otherTrainers.splice(i, 1)
              }
            }
          }
          that.setData({
            trainers: res,
            otherTrainers: otherTrainers
          });
        }else{
          that.setData({
            otherTrainers: res.trainers
          });
        }


      }

    })
  },
  goCenterList: function() {
    wx.navigateTo({
      url: '/pages/centers/centerList',
    });
  },

  selectTrainer: function(evt) {
    wx.navigateTo({
      url: './trainercourse/trainercourse?trainerId=' + evt.currentTarget.dataset.trainer,
    })

  },
  // 改变当前显示周
  changeCurrentWeek: function(event) {
    var index = 0;
    if (event.currentTarget.id == 'left') {
      index = this.data.currentShowDaysIndex - 1;
    } else {
      index = this.data.currentShowDaysIndex + 1;
    }
    this.setData({
      currentShowDays: this.data.days[index],
      currentShowDaysIndex: index,
      daysScrollViewCurrentIndex: 0,
    });
    this.getGroupCourseList(0);
    this.getTrainerCourseList(0);

  },

  // 点击选择日期
  dayBindTap: function(event) {
    var index = event.currentTarget.id.substring(3);
    // console.log(index)
    this.setData({
      daysScrollViewCurrentIndex: index
    });
    this.getGroupCourseList(index);
    this.getTrainerCourseList(index);
  },

  // 获取团课列表数据 并分离出有效以及无效课程
  getGroupCourseList: function(index) {
    var item = this.data.currentShowDays[index];
    var that = this;
    groupCourse.getGroupCourseList(item.dateStr).then((result) => {
      loginService.getCenterList().then((res) => {
        for (var i = 0,len = result.length;i<len;i++){
          for (var j = 0, jen = res.length; j < jen; j++) {
            if(result[i].centerId==res[j].id){
              result[i].centerName=res[j].name;
            }
          }
        }
      groupCourse.getInvaildArrayAndVaildArray(result, index, that.data.currentShowDaysIndex, item, function (vaildArray, invaildArray) {
          //有效课程门店分离
          var mp1 = {}
          var ret1 = []
          vaildArray.forEach(item => {
            if (typeof mp1[item.centerId] === 'number') {
              ret1[mp1[item.centerId]].push(item);

            } else {
              mp1[item.centerId] = ret1.length
              ret1.push([item])
            }
          })
          //无效课程门店分离
          var mp2 = {};
          var ret2 = [];
          invaildArray.forEach(item => {
            if (typeof mp2[item.centerId] === 'number') {
              ret2[mp2[item.centerId]].push(item)
            } else {
              mp2[item.centerId] = ret2.length
              ret2.push([item])
            }
          })
          var map1 = [];
          for (var i = 0, len = ret1.length; i < len; i++) {
            map1[i] = { centerName: ret1[i][0].centerName, list: ret1[i] };//二维数组
          }
          var map2=[];
          for (var i = 0, len = ret2.length; i < len; i++) {
            map2[i] = { centerName: ret2[i][0].centerName, list: ret2[i] };//二维数组
          }
        //   console.log(map1);
        // console.log(map2);
          that.setData({
            showInvalidCourse: false,
            validCourseList: vaildArray,
            invalidCourseList: invaildArray,
            showCourseList: vaildArray,
            allValidCourseList: map1,
            allInvalidCourseList: map2,
          })
        })
      })
    })
  },

  selectMore: function() {
    this.setData({
      selectedTrainer: null
    })
  },

  // 显示无效课程
  showInvaildCourse: function() {
    var vaildCourse = this.data.validCourseList;
    var invaildCourse = this.data.invalidCourseList;
    vaildCourse.push.apply(vaildCourse, invaildCourse);
    this.setData({
      showInvalidCourse: true,
      showCourseList: vaildCourse
    })
  },


  // 去预约页面
  groupCourseAppointment: function(event) {
    // if(this.data.showGroup==1){
    //   var item = this.data.showCourseList[event.currentTarget.id];
    // }else if(this.data.showGroup==4){
    //   var item = this.data.showTrainingCourseList[event.currentTarget.id];
    // }
    var item;
    if (this.data.showGroup == 1) {
      for (var i = 0, len = this.data.showCourseList.length; i < len; i++) {
        if (event.currentTarget.dataset.instanceid === this.data.showCourseList[i].instanceId) {
          item = this.data.showCourseList[i];
        }
      }
    } else if (this.data.showGroup == 4) {
      for (var i = 0, len = this.data.showTrainingCourseList.length; i < len; i++) {
        if (event.currentTarget.dataset.instanceid === this.data.showTrainingCourseList[i].instanceId) {
          item = this.data.showTrainingCourseList[i];
        }
      }
    }
  
    let itemStr = JSON.stringify(item);
 
    if (util.compareWithCurrentTime(item.startTime) || this.data.daysScrollViewCurrentIndex != 0 || this.data.currentShowDaysIndex != 0) {
      // console.log(itemStr)
      if (app.globalData.token) {
        wx.navigateTo({
          url: '../groupCourse/groupCourseAppointment?item=' + itemStr,
        });
      } else {
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        })
        app.checkAuthToken()
      }
    } else {
// 不可预约 并刷新页面
      if (this.data.showGroup == 1) {
        this.getGroupCourseList(this.data.daysScrollViewCurrentIndex);
        systemMessage.showModal('', "当前课程已不可预约");
      } else if (this.data.showGroup == 4) {
        this.getTrainerCourseList(this.data.daysScrollViewCurrentIndex);
        systemMessage.showModal('', "当前课程已不可预约");
      }
    }
  },

  // 点击未开放，已预约
  gocoursedetail: function(e) {
    var instanceid = e.currentTarget.dataset.instanceid
    wx.navigateTo({
      url: '../groupclassDetail/groupclassDetail?instance=' + instanceid
    })

  },
  // 获取场地
  getspaceList() {
    centerService.getOrderSpaceList().then((res) => {
      this.setData({
        spaceList: res
      })
    })
  },
//获取培训班排课
  getTrainerCourseList(index){
  var item = this.data.currentShowDays[index];
  var that = this;
  centerService.getTrainingClassCourse(item.dateStr).then((res)=>{
    groupCourse.getInvaildArrayAndVaildArray(res, index, that.data.currentShowDaysIndex, item, function (vaildArray, invaildArray) {
      that.setData({
        showTrainingInvalidCourse: false,
        validTrainingCourseList: vaildArray,
        invalidTrainingCourseList: invaildArray,
        showTrainingCourseList: vaildArray
      })
    })
  })
},

  // 场地预定
  toBook: function(e) {
    var id = e.currentTarget.dataset.id;
    for (var i = 0, len = this.data.spaceList.length; i < len; i++) {
      if (id == this.data.spaceList[i].id) {
        var data = this.data.spaceList[i]
        wx.navigateTo({
          url: '/pages/space/book?spaceMess=' + JSON.stringify(data)
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (app.globalData.token == null) {
      this.setData({
        isLogin: true
      })
    } else {
      this.setData({
        isLogin: false
      })
    }
    this.setData({
      selectCenter: app.globalData.selectCenter,
      selectedTrainer: null
    })
    authenticationUtil.checkAuth(res => {
      if (this.data.centerId) {
        loginService.getCenterList().then((res) => {
          res.map(item => {
            if (item.id == this.data.centerId) {
              app.globalData.selectCenter = item
              wx.setStorageSync('selectCenterKey', item)
              this.setData({
                selectCenter: item
              })
            }
          })
          this.getspaceList();
          this.getTrainers();
          this.getwxAppSetting();
          if (this.data.days.length != 0) {
            this.getGroupCourseList(this.data.daysScrollViewCurrentIndex);
            this.getTrainerCourseList(this.data.daysScrollViewCurrentIndex);
          }
        })
      } else {
        this.getspaceList();
        this.getTrainers();
        this.getwxAppSetting();
        if (this.data.days.length != 0) {
          this.getGroupCourseList(this.data.daysScrollViewCurrentIndex);
          this.getTrainerCourseList(this.data.daysScrollViewCurrentIndex);
        }
      }
    })
 

    // 教练详情点进私教课程预约界面
    var id = getApp().globalData.showCourseId
    if (id != undefined && id != null) {
      this.setData({
        showGroup: 2
      })
      var url = config.getTrainerCourse(id)
      requestUtil.getRequest(url).then(res => {
        this.setData({
          privateCourse: res.courses,
          selectedTrainer: res.trainer
        })
      })
      getApp().globalData.showCourseId = null
    }

  },
  // 获取小程序的配置信息
  getwxAppSetting() {
    var url = config.getwxAppSetting()
    requestUtil.getRequest(url).then(res => {
      var data = ['showReservationGroupCourse', 'showReservationPersonalCourse', 'showReservationGround']
      var num=0;
      if(!isShow){
        isShow=true;
        var index = res.wxAppSetting[data[0]] ? 1 : res.wxAppSetting[data[1]] ? 2 : res.wxAppSetting[data[2]] ? 3 : 4;
        this.setData({
          showGroup: index
        })
      }
      data.map((item,index)=>{
        if(res[item]){
          num++
        }
      })
      this.setData({
        wxAppSetting: res.wxAppSetting,
          allowTrainingModule: res.featureSetting.allowTrainingModule,
        isshort:num>2?true:false,
        // showGroup:index

      })
    })
  },
  selectType: function(evt) {
    var group = evt.target.dataset.type
    if (group == 2 && !app.globalData.token) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      app.checkAuthToken()
      return
    }
    this.setData({
      showGroup: evt.target.dataset.type
    })

  },

  goLogin: function() {
    if (app.globalData.token == null) {
      app.globalData.receive = true
      authenticationUtil.checkAuthToken();
    }
  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      path: "/pages/index/index"
    }
  },
  onHide() {
    this.setData({
      centerId: ''
    })
  }

})