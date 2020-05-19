const originalPage = Page
Page = function (config) {
  const { onLoad } = config
  config.onLoad = function (onLoadOptions) {
    // 打 log、埋点……
    if(onLoadOptions.centerId){
      console.log(onLoadOptions.centerId)
      onLoadOptions.centerId=null
      wx.setStorageSync("selectCenterKey", {id:'23',name:'瑞博'})

    }
    if (onLoadOptions.scene){

    }
    if (typeof onLoad === 'function') {
      onLoad.call(this, onLoadOptions)
    }
  }
  return originalPage(config)
}
