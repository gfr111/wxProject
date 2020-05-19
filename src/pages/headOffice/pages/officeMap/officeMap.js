// pages/headOffice/pages/officeMap/officeMap.js
var amapFile = require('../../libs/amap-wx.js')
var markersData = [];
var headOfficeService = require('../../../../service/headOfficeService.js');
Page({
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    textData: {},
    showDetail:false,
    tips: {},
    showMap:true,
    value:'',
    include:[],
    centerList:[],
    centerDetail:'',
    scale:17
  },
  makertap: function (e) {
    var id = e.markerId;
    var that = this;
    for (var i = 0, len = that.data.centerList.length;i<len;i++){
      if (id == that.data.centerList[i].id){
        that.setData({
          centerDetail: that.data.centerList[i]
        })
      }
    }
    that.setData({
      showDetail:true
    })
  },
  currentLocation(){
    var that=this;
    wx.getSystemInfo({
      success(res) {
        if(res.locationEnabled){
            wx.getLocation({
              type: 'gcj02',
              success: (res) => {
                that.setData({
                  latitude: res.latitude,
                  longitude: res.longitude,
                  scale: 17
                });
              },
              fail: (res) => {
                wx.showToast({
                  title: '您拒绝了定位，无法提供服务',
                  icon: 'none'
                })
              }
            })
        }else{
         wx.showToast({
           title: '手机定位未打开，无法提供服务',
           icon:'none'
         })
        }
      }
    })

  },
  hideCard:function(){
    this.setData({
      showDetail: false
    })
  },
  toDetail(){
    wx.navigateTo({
      url: '/pages/headOffice/pages/officeDetail/officeDetail?clubId=' + this.data.centerDetail.id,
    })
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success(res) {
        // if (res.locationEnabled) {
          wx.getLocation({
            type: 'gcj02',
            success: (res) => {
              that.setData({
                latitude: res.latitude,
                longitude: res.longitude
              });
              headOfficeService.getBranchCenterList({ latitude: res.latitude, longitude: res.longitude }).then((result) => {
                var arr = [];
                for (var i = 0, len = result.length; i < len; i++) {
                  result[i].distance = (result[i].distance * 0.001).toFixed(3)
                  arr.push({
                    address: result[i].address,
                    height: 32,
                    width: 22,
                    iconPath: "../../images/img_index_click.png",
                    id: result[i].id,
                    latitude: result[i].latitude,
                    longitude: result[i].longitude,
                    name: result[i].name
                  })
                }
                that.setData({
                  markers: arr,
                  include: arr,
                  centerList: result
                })
              })
            }
          })
        // }else {
        //   wx.showToast({
        //     title: '手机定位未打开，无法获取分店列表',
        //     icon: 'none'
        //   })
        //   setTimeout(function () {
        //     wx.navigateBack()
        //   }, 1000)
        // }
      }
    })
  },
  navigation:function(){
    wx.openLocation({
      latitude: this.data.centerDetail.latitude,
      longitude: this.data.centerDetail.longitude,
      scale: 18,
      name: this.data.centerDetail.name,
      address: this.data.centerDetail.address
    })
  },
  bindInput: function (e) {
    var that = this;
    var keywords = e.detail.value;
    that.setData({
      showDetail:false
    })
    if (e.detail.value==''){
      that.setData({
        tips: {},
        showMap: true
      });
    }else{
      var myAmapFun = new amapFile.AMapWX({ key: 'bde4f140256fb1366a80aa037eca324e' });
      myAmapFun.getInputtips({
        keywords: keywords,
        location: '',
        success: function (data) {
          if (data && data.tips) {
            if (data.tips.length==0){
              wx.showToast({
                title: '没有查询到该地点',
                icon: 'none'
              })
              that.setData({
                tips: data.tips,
                showMap: true,
              });
            }else{
              that.setData({
                tips: data.tips,
                showMap: false,
              });
            }
            
          }

        }
      })
    }
  
  },
  bindSearch: function (e) {
    var keywords = e.target.dataset.keywords;
    if (keywords.location!=''){
      this.setData({
        longitude: keywords.location.split(',')[0],
        latitude: keywords.location.split(',')[1],
        showMap: true,
        value: keywords.name,
        include:''
      });
    }else{
      this.setData({
        showMap: true,
      });
      wx.showToast({
        title: '该地点无法访问！',
        icon:'none'
      })
    }
  
  }

})