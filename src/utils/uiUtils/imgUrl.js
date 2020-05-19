var imgUrl = (function() {

  function getUrl(url) {
    if (url) {
      if (url.indexOf("http") >= 0) {
        return url;
      } else {
        return "https://www.forzadata.cn/static/images/course.png";
      }
    } else {
      return "https://www.forzadata.cn/static/images/course.png";

    }
  }

  function getDefaultAvatar(url) {
    if (url) {
      if (url.indexOf("http") >= 0) {
        return url;
      } else {
        return "https://www.forzadata.cn/" + url
      }
    } else {
      return "https://www.forzadata.cn/static/images/default_user.png"

    }
  }

  function getDefaultSpace(url) {
    if (url) {
      if (url.indexOf("http") >= 0) {
        return url;
      } else {
        return "https://www.forzadata.cn/" + url
      }
    }
  }

  return {
    getUrl: getUrl,
    getDefaultAvatar: getDefaultAvatar,
    getDefaultSpace: getDefaultSpace
  }

})();

module.exports = imgUrl;