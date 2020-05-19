// pages/index/BindPhone.js
var app = getApp();
var login = require('../../service/loginService.js');
var config = require('../../config.js')
var requestUtil = require('../../utils/requestUtil.js')
var systemMessage = require('../../SystemMessage.js');
var authenticationUtil = require('../../utils/authenticationUtil.js');
var promiseUtil = require('../../utils/promiseUtil');
var notificationCenter = require('../../WxNotificationCenter.js');
var notifConstant = require('../../utils/notifConstant.js');
var authenticationUtil = require('../../utils/authenticationUtil.js');
var headOfficeService = require('../../service/headOfficeService.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeButtonTitle: "获取验证码",
    phone: "",
    code: "",
    second: 60,
    unionId: "",
    appInfo: null,
    userInfo: null,
    step: 0,
    agree: false,
    model: 0,
    agreecontent: null,
    isLogin:false,
    enableParent:false,
    poiTotalList:[],
    haveMess:true,
    multiArray: [],
    multiIndex: [0, 0, 0],
    idNumber:''
  },
  //获取社区信息
  getCommunityList(){
    var that=this;
    headOfficeService.getCommunity().then((res)=>{
      console.log(res)
      let poiTotalList = res;
      //获取第一个数组
      //给picker读取的店铺数组里的城市数组（一级选项）赋值
      let cityArr = poiTotalList.map(item => {
        return item.name;
      })
      let totalPoiArr = poiTotalList[0].childs;
      let poiArr = [];
      totalPoiArr.forEach(item => {
        poiArr.push(item.name);
      })
      let itemArr=[];
      totalPoiArr[0].childs.forEach(item => {
        itemArr.push(item.name);
      })
      that.setData({
        poiTotalList:res,
        multiArray: [cityArr, poiArr, itemArr]
      })
    })
  },
  //获取个人信息

  idNumInput(e){
    console.log(e.detail.value)
    this.setData({
      idNumber: e.detail.value
    })
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
    this.computerList(e.detail.column,e.detail.value);
  },
  computerList(num,i) {
    //num为改变的是第几列，i是选择的第几个
    
    let poiTotalList = this.data.poiTotalList;
    let cityArr = poiTotalList.map(item => {
      return item.name;
    })
    //给picker读取的店铺数组里的城市数组（一级选项）赋值
    if(num==0){
      let totalPoiArr = poiTotalList[i].childs;
      let poiArr = [];
      totalPoiArr.forEach(item => {
        poiArr.push(item.name);
      })
      let itemArr = [];
      if (poiTotalList[i].childs.length <= this.data.multiIndex[1]) {
        totalPoiArr[poiTotalList[i].childs.length - 1].childs.forEach(item => {
          itemArr.push(item.name);
        })
        this.setData({
          multiIndex: [this.data.multiIndex[0], poiTotalList[i].childs.length - 1, this.data.multiIndex[2]]
        })
      } else {
        totalPoiArr[this.data.multiIndex[1]].childs.forEach(item => {
          itemArr.push(item.name);
        })
      }
      this.setData({
        multiArray: [cityArr, poiArr, itemArr]
      })
    } else if (num == 1){
      let totalPoiArr = poiTotalList[this.data.multiIndex[0]].childs;
      if (totalPoiArr.length>0){
        let poiArr = [];
        totalPoiArr.forEach(item => {
          poiArr.push(item.name);
        })
        let itemArr = [];
        totalPoiArr[i].childs.forEach(item => {
          itemArr.push(item.name);
        })
        this.setData({
          multiArray: [cityArr, poiArr, itemArr]
        })
      }
  
    }
  },
  selectAgree() {
    this.setData({
      agree: !this.data.agree
    })
  },
  agreement() {
    this.setData({
      agree: true,
      model: 0
    })
  },
  changename(e) {
    this.data.userInfo.nickName = e.detail.value
    this.setData({
      userInfo: this.data.userInfo
    })
  },
  showmodel(e) {
    this.setData({
      model: e.currentTarget.id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getagree();
    if (app.globalData.headCenterId == 1) {
      this.setData({
        appInfo: {
          img: '/images/bocai.png',
          name: '菠菜+'
        }
      })
    } else {
      var url = config.getAppInfo();
      requestUtil.getRequest(url).then(res => {
        this.setData({
          appInfo: res
        })
      })
    }
  },
  canclegetuserInfo() {
    wx.navigateBack({})
  },
  changesex(e) {
    this.data.userInfo.gender = e.currentTarget.id
    this.setData({
      userInfo: this.data.userInfo
    })

  },
  //通过button获取用户信息授权
  getUserInfoByButton: function(e) {
    console.log(e);
    if (typeof(e.detail) != 'undefined' && null != e.detail && e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo
      })
    } else {
      var that = this;
      wx.showModal({
        title: '获取个人信息失败',
        confirmText: '设置',
        success: (res) => {
          console.log(res);
          if (res.confirm) {
            that.openSettings();
          } else {
            wx.navigateBack({});
          }
        }
      })
    }
  },
  getWxUserInfo: function(doNext) {
    var that = this;
    wx.getUserInfo({
      success: (res) => {
        that.data.userInfo = res.userInfo;
        if (typeof(doNext) == 'function') {
          doNext();
        }
      },
      fail: (err) => {
        wx.showModal({
          title: '获取个人信息失败',
          confirmText: '设置',
          success: (res) => {
            console.log(res);
            if (res.confirm) {
              that.openSettings();
            } else {
              wx.navigateBack({});
            }
          }
        })

      }
    })
  },



  openSettings: function() {
    var that = this;
    wx.openSetting({
      success: (res) => {
        console.log(res);
        let isUserInfoAuthorized = res.authSetting['scope.userInfo'];
        if (isUserInfoAuthorized) {
          console.log('userInfoAuthorized');
        } else {
          wx.navigateBack({});
        }
      },
      fail: (err) => {
        console.log(err);
      }
    })
  },

  // 倒计时
  countdown: function() {
    var that = this;
    var second = that.data.second
    if (second == 0) {
      that.setData({
        second: 60,
        codeButtonTitle: "重新发送"
      });
      return;
    }
    var timer = setTimeout(function() {
      that.setData({
        second: second - 1,
        codeButtonTitle: "发送(" + second + ")"
      });
      that.countdown();
    }, 1000)
  },

  phoneBindInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  codeBindInput: function(e) {
    this.setData({
      code: e.detail.value
    })
  },


  // 发送验证码
  getCode: function(e) {
    var that = this;
    if (that.data.codeButtonTitle == "获取验证码" || that.data.codeButtonTitle == "重新发送") {
      if (that.data.phone.length < 11) {
        systemMessage.showModal('', '手机号码不合法')
      } else {

        login.requestSmsCode(that.data.phone).then((result) => {
          that.countdown();
          var msg = result
          wx.showToast({
            title: msg,
            icon: "none"
          })
        })
      }
    }
  },


  // 手机号授权
  getPhoneNumber: function(e) {
    var that = this;
    if (that.data.userInfo) {
      that.bindUserWxPhone(e);
     
    } else {
      this.setData({
        userInfo: e.detail.userInfo
      });

    }
  },

  // 绑定手机号
  didTapGreenBtn: function() {
    var that = this;
    if (that.data.userInfo) {
      // that.bindUserPhone();
      that.setData({
        step: 2
      })
    } else {
      this.setData({
        userInfo: e.detail.userInfo
      });

    }
  },

  bindUserPhone: function() {
    var that = this;
    if (that.data.userInfo) {
      if (this.data.step == 2) {
        if (that.data.phone.length < 11) {
          systemMessage.showModal('', '手机号码不合法')
          return
        } else if (that.data.code.length == 0) {
          systemMessage.showModal('', '验证码不能为空')
          return
        }
        if (this.data.agreecontent&&this.data.agreecontent.showWxAppProtocol) {
          if (!this.data.agree) {
            systemMessage.showModal('', '请阅读并同意服务协议')
            return
          }
        }
        wx.showLoading();
        login.bindPhone(that.data.phone, that.data.code, app.globalData.openId, that.data.userInfo.gender, that.data.userInfo.nickName, that.data.userInfo.avatarUrl).then((result) => {
          that.tryLogin();
        })
      }


    }
  },
  loginbind() {
    var that = this
    var url = config.loginbind()
    var data = {
      openId: app.globalData.openId,
      sex: that.data.userInfo.gender,
      name: that.data.userInfo.nickName,
      encryptedData: that.data.encryptedData,
      iv: that.data.iv,
      phone: this.data.phone
    }
    requestUtil.postRequest(url, data).then(res => {
      that.tryLogin();
    })
  },

  bindUserWxPhone: function(e) {
    var that = this;
    if (this.data.agreecontent&&this.data.agreecontent.showWxAppProtocol) {
      if (!this.data.agree) {
        systemMessage.showModal('', '请阅读并同意服务协议')
        return
      }
    }
    console.log(that.data.userInfo)
    if (that.data.userInfo && e.detail.encryptedData) {
      login.bindWXPhone(app.globalData.openId, that.data.userInfo.gender, that.data.userInfo.nickName, e.detail.encryptedData, e.detail.iv, that.data.userInfo.avatarUrl).then((result) => {
        this.tryLogin()
      })
    }
  },

  tryLogin: function() {
    var that=this;
    systemMessage.showToast('手机绑定成功', 'success', 1000);
    app.globalData.receive = true
    authenticationUtil.tryLogin(app.globalData.receive ? function() {
      //判断是否为衢州版本并且信息不完善
      headOfficeService.getPersonalMess().then((res) => {
        console.log(res)
        if (!res.districtStreetInfo || !res.idNumber) {
          if (that.data.enableParent) {
            wx.setNavigationBarTitle({
              title: '完善个人资料'  //修改title
            })
            that.setData({
              isLogin: true
            })
          } else {
            wx.navigateBack();
          }
        }
      })
      app.globalData.receive = false;

 
    } : null, true);
  },
  getagree() {
    var url = config.loginwxAppProtocol()
    requestUtil.getRequest(url).then(res => {
      this.setData({
        agreecontent: res
      })
    })
  },
  submitMess(){

    if (this.data.idNumber==''){
      return  wx.showToast({
        title: '请完善信息',
        icon:'none'
      });
    }
    var data={
      districtId:this.data.poiTotalList[this.data.multiIndex[0]].id,
      streetId: this.data.poiTotalList[this.data.multiIndex[0]].childs[this.data.multiIndex[1]] ? this.data.poiTotalList[this.data.multiIndex[0]].childs[this.data.multiIndex[1]].id:-1,
      communityId: this.data.poiTotalList[this.data.multiIndex[0]].childs[this.data.multiIndex[1]].childs[this.data.multiIndex[2]] ? this.data.poiTotalList[this.data.multiIndex[0]].childs[this.data.multiIndex[1]].childs[this.data.multiIndex[2]].id:-1,
      idType:'身份证',
      idNumber:this.data.idNumber
    }
    console.log(data)
    headOfficeService.putPersonalMess(data).then((res)=>{
      if(res){
        wx.navigateBack();
      }else{
        wx.showToast({
          title: '信息保存失败！',
          icon: 'none'
        });
        wx.navigateBack();
      }
    })
  },
  onShow(){
    this.getCommunityList();
    wx.getExtConfig({
      success: res => {
        if (res.extConfig.enableParent) {
          this.setData({
            enableParent: res.extConfig.enableParent
          })
        }

      }
    })
  }

})