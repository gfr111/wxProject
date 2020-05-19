// 显示提示框
function showModal(title, content) {
  wx.showModal({
    title: title,
    content: content,
    showCancel: false,
    confirmText: '确定'
  })
}

// 显示状态栏
function showToast(title, icon, duration) {
  wx.showToast({
    title: title,
    icon: icon,
    duration: duration
  })
}

function showLoading(title) {
  wx.showLoading({
    title: title,
  })
}

function hideLoading() {
  wx.hideLoading()
}

// 打开用户设置页面
function openSetting() {
  var that = this;
  wx.openSetting({
    success: function (res) {

    },
    fail: function () {

    }
  })
}

module.exports = {
  showModal: showModal,
  showToast: showToast,
  showLoading: showLoading,
  hideLoading: hideLoading,
  openSetting: openSetting
}