var requestUtil = require('../utils/requestUtil.js');
var config = require('../config.js');

var reservationService = (function() {

  function getReservationList(courseType,page, year) {
    var url = config.reservationListUrl(courseType,page, year)
      return requestUtil.getRequest(url)
    }

    function getReservationInfo(id) {
      return requestUtil.getRequest(config.reservationInfoUrl(id))
    }

  function rateReservation(id, level, comments, pictures) {
      let para = {
        level:level,
        comments:comments,
        pictures: pictures
      }
      return requestUtil.putRequest(config.rateReservation(id), para)
    }
    

  function cancelReservation(id, reason, group = null) {
    let para = {
      cancelReason: reason,
    }
    if (group == null) {
      return requestUtil.postRequest(config.cancelReservation(id), para)
    } else {
      return requestUtil.postRequest(config.cancelPrivateReservation(group), para)
    }
  }
    return {
      getReservationList:getReservationList,
      rateReservation:rateReservation,
      cancelReservation: cancelReservation,
      getReservationInfo: getReservationInfo
    }

    
})()

module.exports = reservationService