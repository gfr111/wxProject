// pages/headOffice/pages/personalData/personalData.js
var headOfficeService = require('../../../../service/headOfficeService.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['男', '女'],
    arrayId:['身份证'],
    idIndex:0,
    sexIndex:0,
    date: '',
    multiArray: [],
    multiIndex: [0, 0, 0],
    idNumber:'',
    poiTotalList:'',
    messageData:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      date: new Date().getFullYear() + '-' + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + '-' + (new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate())
    })
    this.getCommunityList();
    
  },
  bindPickerChange: function (e) {
    this.setData({
      sexIndex: e.detail.value
    })
  },
  bindPickerIdChange:function(e){
    this.setData({
      idIndex: e.detail.value
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  idNumInput(e) {
    console.log(e.detail.value)
    this.setData({
      idNumber: e.detail.value
    })
  },
  //获取个人信息
  getPersonalMess() {
    var a=[0,0,0];
    var poiTotalList = this.data.poiTotalList;
    headOfficeService.getPersonalMess().then((res) => {
      for (var i = 0, len = poiTotalList.length;i<len;i++){
        if (res.districtId == poiTotalList[i].id){
          a[0] = i;
          var e={
            detail:{
              column:0,
              value:i
            }
          }
          this.bindMultiPickerColumnChange(e)
          for (var j = 0, jen = poiTotalList[i].childs.length; j < jen;j++) {
            if (res.streetId!=-1){
              if (res.streetId == poiTotalList[i].childs[j].id) {
                a[1] = j;
                var e = {
                  detail: {
                    column: 1,
                    value: j
                  }
                }
                this.bindMultiPickerColumnChange(e)
                for (var k = 0, ken = poiTotalList[i].childs[j].childs.length; k < ken; k++) {
                  if (res.communityId != -1) {
                    if (res.communityId == poiTotalList[i].childs[j].childs[k].id) {
                      a[2] = k;
                      var e = {
                        detail: {
                          column: 2,
                          value: k
                        }
                      }
                      this.bindMultiPickerColumnChange(e)
                    }
                  }
                }
              }
            }
            
          }
        }
      }
      console.log(a)
      this.setData({
        messageData:res,
        sexIndex:res.sex,
        date: res.birthday,
        idNumber: res.idNumber,
        multiIndex:a
      })
      wx.hideLoading();
    })
  },
  //获取社区信息
  getCommunityList() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    headOfficeService.getCommunity().then((res) => {
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
      let itemArr = [];
      totalPoiArr[0].childs.forEach(item => {
        itemArr.push(item.name);
      })
      that.setData({
        poiTotalList: res,
        multiArray: [cityArr, poiArr, itemArr]
      })
      that.getPersonalMess();
    })
  },
  bindMultiPickerChange: function (e) {
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
    this.computerList(e.detail.column, e.detail.value);
  },
  computerList(num, i) {
    //num为改变的是第几列，i是选择的第几个
    let poiTotalList = this.data.poiTotalList;
    let cityArr = poiTotalList.map(item => {
      return item.name;
    })
    //给picker读取的店铺数组里的城市数组（一级选项）赋值
    if (num == 0) {
      let totalPoiArr = poiTotalList[i].childs;
      let poiArr = [];
      totalPoiArr.forEach(item => {
        poiArr.push(item.name);
      })
      let itemArr = [];
      if (poiTotalList[i].childs.length <= this.data.multiIndex[1]) {
        console.log(poiTotalList[i].childs.length - 1)
        totalPoiArr[poiTotalList[i].childs.length-1].childs.forEach(item => {
          itemArr.push(item.name);
        })
        this.setData({
          multiIndex: [this.data.multiIndex[0], poiTotalList[i].childs.length - 1, this.data.multiIndex[2]]
        })
      }else{
        totalPoiArr[this.data.multiIndex[1]].childs.forEach(item => {
          itemArr.push(item.name);
        })
      }
     
      this.setData({
        multiArray: [cityArr, poiArr, itemArr]
      })
    } else if (num == 1) {
      let totalPoiArr = poiTotalList[this.data.multiIndex[0]].childs;
      if (totalPoiArr.length > 0) {
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
  submitMess() {
    if (this.data.idNumber == '') {
      return wx.showToast({
        title: '请完善信息',
        icon: 'none'
      });
    }
    var data = {
      districtId: this.data.poiTotalList[this.data.multiIndex[0]].id,
      streetId: this.data.poiTotalList[this.data.multiIndex[0]].childs[this.data.multiIndex[1]] ? this.data.poiTotalList[this.data.multiIndex[0]].childs[this.data.multiIndex[1]].id : -1,
      communityId: this.data.poiTotalList[this.data.multiIndex[0]].childs[this.data.multiIndex[1]].childs[this.data.multiIndex[2]] ? this.data.poiTotalList[this.data.multiIndex[0]].childs[this.data.multiIndex[1]].childs[this.data.multiIndex[2]].id : -1,
      idType: '身份证',
      idNumber: this.data.idNumber,
      birthday:this.data.date,
      sex: this.data.sexIndex
    }
    headOfficeService.putPersonalMess(data).then((res) => {
      if (res) {
        wx.showToast({
          title: '信息保存成功！',
          icon: 'none'
        });
        wx.navigateBack();
      } else {
        wx.showToast({
          title: '信息保存失败！',
          icon: 'none'
        });
        wx.navigateBack();
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
  onShow: function () {

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
  onShareAppMessage: function () {

  }
})