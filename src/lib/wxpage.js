module.exports = function(n) {
  function e(o) {
    if (t[o]) return t[o].exports;
    var r = t[o] = {
      i: o,
      l: !1,
      exports: {}
    };
    return n[o].call(r.exports, r, r.exports, e), r.l = !0, r.exports
  }
  var t = {};
  return e.m = n, e.c = t, e.i = function(n) {
    return n
  }, e.d = function(n, t, o) {
    e.o(n, t) || Object.defineProperty(n, t, {
      configurable: !1,
      enumerable: !0,
      get: o
    })
  }, e.n = function(n) {
    var t = n && n.__esModule ? function() {
      return n.default
    } : function() {
      return n
    };
    return e.d(t, "a", t), t
  }, e.o = function(n, e) {
    return Object.prototype.hasOwnProperty.call(n, e)
  }, e.p = "", e(e.s = 7)
}([function(n, e, t) {
  "use strict";

  function o(n, e) {
    var t = new w;
    if (y && y(n, e, k), x.use(e, e.comps, n, t), e.onNavigate) {
      let t = function(n, t) {
        e.onNavigate({
          url: n,
          query: t
        })
      };
      console.log(`Page[${n}] define "onNavigate".`), m.on("navigateTo:" + n, t), m.on("redirectTo:" + n, t), m.on("switchTab:" + n, t), m.on("reLaunch:" + n, t)
    }
    return e.onPreload && (console.log(`Page[${n}] define "onPreload".`), m.on("preload:" + n, function(n, t) {
      e.onPreload({
        url: n,
        query: t
      })
    })), e.$preload = s, e.$name = n, e.$cache = b, e.$session = b.session, e.$emitter = t, e.$state = {
      firstOpen: !1
    }, e.$route = e.$navigate = A, e.$redirect = O, e.$switch = S, e.$launch = E, e.$back = u, e.$bindRoute = e.$bindNavigate = R, e.$bindRedirect = q, e.$bindSwitch = C, e.$bindReLaunch = F, e.$on = function() {
      return m.on.apply(m, arguments)
    }, e.$emit = function() {
      return m.emit.apply(m, arguments)
    }, e.$off = function() {
      return m.off.apply(m, arguments)
    }, e.$put = function(n, e) {
      return _[n] = e, this
    }, e.$take = function(n) {
      var e = _[n];
      return _[n] = null, e
    }, e.$setData = function(n, e) {
      if ("string" == g.type(n)) {
        var t = {};
        return g.objEach(e, function(e, o) {
          t[n + "." + e] = o
        }), this.setData(t)
      }
      if ("object" == g.type(n)) return this.setData(n)
    }, e.$curPage = function() {
      return getCurrentPages().slice(0).pop()
    }, e.onLoad = g.wrapFun(e.onLoad, function() {
      e.onAwake && w.on("app:sleep", function(n) {
        e.onAwake.call(this, n)
      }), T || (T = !0, this.$state.firstOpen = !0)
    }), e.onReady = g.wrapFun(e.onReady, function() {
      $.emit("page:ready")
    }), e.onPageLaunch && e.onPageLaunch(), e.onAppLaunch && (j ? e.onAppLaunch.apply(e, j) : m.on("app:launch", function(n) {
      e.onAppLaunch.apply(e, n)
    })), e.onAppShow && (j ? e.onAppShow.apply(e, j) : m.on("app:show", function(n) {
      e.onAppShow.apply(e, n)
    })), v && v(n, e, k), Page(e), e
  }

  function r() {
    j = [].slice.call(arguments), w.emit("app:launch", j)
  }

  function a() {
    try {
      L || (L = [].slice.call(arguments), w.emit("app:show", L))
    } finally {
      if (!P) return;
      var n = P;
      P = 0, w.emit("app:sleep", new Date - n)
    }
  }

  function i() {
    P = new Date
  }

  function c(n) {
    var e = D[n];
    return function(n) {
      if (n) {
        var t = n.currentTarget.dataset,
          o = t.before,
          r = t.after,
          a = t.url,
          i = this;
        try {
          i && o && i[o] && i[o].call(i, n)
        } finally {
          if (!a) return;
          e(a), i && r && i[r] && i[r].call(i, n)
        }
      }
    }
  }

  function u(n) {
    wx.navigateBack({
      delta: n || 1
    })
  }

  function s(n) {
    var e = p(n);
    e && m.emit("preload:" + e, n, g.queryParse(n.split("?")[1]))
  }

  function f({
    type: n
  }) {
    return function(e, t) {
      var o = e.split(/\?/),
        r = o[0];
      if (/^[\w\-]+$/.test(r) && (r = h(r)), !r) throw new Error("Invalid path:", r);
      (t = t || {}).url = r + (o[1] ? "?" + o[1] : ""), $[n](t)
    }
  }

  function p(n) {
    var e = /^[\w\-]+(?=\?|$)/.exec(n);
    return e ? e[0] : d(n)
  }

  function l(n, e) {
    switch (n) {
      case "extendPageBefore":
        y = e;
        break;
      case "extendPageAfter":
        v = e;
        break;
      case "route":
        "string" == g.type(e) ? (h = function(n) {
          return e.replace("$page", n)
        }, d = function(n) {
          return n.replace("/pages/", "").replace(/\?.*$/g, "")
        }) : console.error("Illegal routes option:", e)
    }
  }
  var h, d, y, v, g = t(1),
    w = t(2),
    $ = t(6),
    b = t(4),
    x = t(5),
    m = new w,
    _ = {},
    T = 0,
    j = 0,
    L = 0,
    P = 0,
    k = [g, $, b, w, m, _];
  ! function(n, e) {
    e.forEach(function(e) {
      n.on(e, function(n) {
        var t = p(n);
        t && m.emit(e + ":" + t, n, g.queryParse(n.split("?")[1]))
      })
    })
  }($, ["navigateTo", "redirectTo", "switchTab", "reLaunch"]);
  var A = f({
      type: "navigateTo"
    }),
    O = f({
      type: "redirectTo"
    }),
    S = f({
      type: "switchTab"
    }),
    E = f({
      type: "reLaunch"
    }),
    D = {
      navigate: A,
      redirect: O,
      switchTab: S,
      reLaunch: E
    },
    R = c("navigate"),
    q = c("redirect"),
    C = c("switchTab"),
    F = c("reLaunch");
  o.C = o.Comp = o.Component = x, o.A = o.App = o.Application = function(n) {
    if (!n.config || !n.config.route) throw new Error("config.route is necessary !");
    n.config && o.config(n.config), n.onShow = n.onShow ? g.wrapFun(n.onShow, a) : a, n.onHide = n.onHide ? g.wrapFun(n.onHide, i) : i, n.onLaunch = n.onLaunch ? g.wrapFun(n.onLaunch, r) : r, n.onAwake && w.on("app:sleep", function(e) {
      n.onAwake.call(this, e)
    }), App(n)
  }, o.config = function(n, e) {
    return "object" == g.type(n) ? g.objEach(n, function(n, e) {
      l(n, e)
    }) : l(n, e), this
  }, n.exports = o
}, function(n, e, t) {
  "use strict";

  function o(n, e) {
    return n && n.hasOwnProperty && n.hasOwnProperty(e)
  }
  var r = {
    type: function(n) {
      if (null === n) return "null";
      if (void 0 === n) return "undefined";
      var e = /\[object (\w+)\]/.exec(Object.prototype.toString.call(n));
      return e ? e[1].toLowerCase() : ""
    },
    extend: function(n) {
      if ("object" != r.type(n) && "function" != r.type(n)) return n;
      for (var e, t, a = 1, i = arguments.length; a < i; a++) {
        e = arguments[a];
        for (t in e) o(e, t) && (n[t] = e[t])
      }
      return n
    },
    objEach: function(n, e) {
      if (n)
        for (var t in n)
          if (o(n, t) && !1 === e(t, n[t])) break
    },
    nextTick: function() {
      var n = this;
      return function() {
        return setTimeout.apply(n, arguments)
      }
    }(),
    lock: function(n) {
      var e;
      return function() {
        if (!e) {
          e = !0;
          var t = [].slice.call(arguments, 0);
          return t.unshift(function() {
            e = !1
          }), n.apply(this, t)
        }
      }
    },
    queue: function(n, e) {
      function t() {
        var n = o.shift();
        if (n) {
          a--;
          var i = n[0],
            c = n[1],
            u = n[2];
          u.unshift(function() {
            a++, t.apply(this, arguments)
          }), r.nextTick(function() {
            return i.apply(c, u)
          })
        } else a = e
      }
      var o = [],
        a = e = e || 1;
      return function() {
        if (o.push([n, this, [].slice.call(arguments, 0)]), a) return t()
      }
    },
    delegator: function(n) {
      var e, t = [];
      return function(o) {
        if (e) return t.push(o);
        e = !0, n.call(this, function() {
          e = !1;
          var n = this,
            r = arguments;
          o && o.apply(n, r), t.forEach(function(e) {
            e && e.apply(n, r)
          })
        })
      }
    },
    once: function(n) {
      var e, t = arguments;
      return function() {
        if (!e && n) return e = !0, n.apply(t.length >= 2 ? t[1] : null, arguments)
      }
    },
    queryParse: function(n, e) {
      if (!n) return {};
      e = e || "&";
      var t = n.replace(/^\?/, ""),
        o = {},
        r = t ? t.split(e) : null;
      return r && r.length > 0 && r.forEach(function(n) {
        var e = (n = n.split("=")).splice(0, 1),
          t = n.join("=");
        o[e] = t
      }), o
    },
    queryJoin: function(n, e, t) {
      var o = r.queryStringify(e, "&", t);
      if (!o) return n;
      var a;
      return a = /[\?&]$/.test(n) ? "" : ~n.indexOf("?") ? "&" : "?", n + a + o
    },
    queryStringify: function(n, e, t) {
      return n ? Object.keys(n).map(function(e) {
        var o = n[e];
        return e + "=" + (t ? o : encodeURIComponent(o))
      }).join(e || "&") : ""
    },
    wrapFun: function(n, e) {
      return function() {
        try {
          e && e.apply(this, arguments)
        } finally {
          n && n.apply(this, arguments)
        }
      }
    }
  };
  n.exports = r
}, function(n, e, t) {
  "use strict";

  function o() {
    this._evtObjs = {}
  }
  o.prototype.on = function(n, e, t) {
    this._evtObjs[n] || (this._evtObjs[n] = []), this._evtObjs[n].push({
      handler: e,
      once: t
    });
    var o = this;
    return function() {
      o.off(n, e)
    }
  }, o.prototype.off = function(n, e) {
    var t = this;
    return (n ? [n] : Object.keys(this._evtObjs)).forEach(function(n) {
      if (e) {
        var o = [];
        (t._evtObjs[n] || []).forEach(function(n) {
          n.handler !== e && o.push(n)
        }), t._evtObjs[n] = o
      } else t._evtObjs[n] = []
    }), this
  }, o.prototype.emit = function(n) {
    var e = Array.prototype.slice.call(arguments, 1);
    (this._evtObjs[n] || []).forEach(function(n) {
      if (!n.once || !n.called) {
        n.called = !0;
        try {
          n.handler && n.handler.apply(null, e)
        } catch (n) {
          console.error(n.stack || n.message || n)
        }
      }
    })
  }, o.prototype.assign = function(n) {
    var e = this;
    ["on", "off", "wait", "emit"].forEach(function(t) {
      var o = e[t];
      n[t] = function() {
        return o.apply(e, arguments)
      }
    })
  }, (new o).assign(o), n.exports = o
}, function(n, e) {
  n.exports = function(n) {
    function e(o) {
      if (t[o]) return t[o].exports;
      var r = t[o] = {
        i: o,
        l: !1,
        exports: {}
      };
      return n[o].call(r.exports, r, r.exports, e), r.l = !0, r.exports
    }
    var t = {};
    return e.m = n, e.c = t, e.i = function(n) {
      return n
    }, e.d = function(n, t, o) {
      e.o(n, t) || Object.defineProperty(n, t, {
        configurable: !1,
        enumerable: !0,
        get: o
      })
    }, e.n = function(n) {
      var t = n && n.__esModule ? function() {
        return n.default
      } : function() {
        return n
      };
      return e.d(t, "a", t), t
    }, e.o = function(n, e) {
      return Object.prototype.hasOwnProperty.call(n, e)
    }, e.p = "", e(e.s = 5)
  }([function(n, e, t) {
    "use strict";

    function o(n, e) {
      return n && n.hasOwnProperty && n.hasOwnProperty(e)
    }
    var r = {
      type: function(n) {
        if (null === n) return "null";
        if (void 0 === n) return "undefined";
        var e = /\[object (\w+)\]/.exec(Object.prototype.toString.call(n));
        return e ? e[1].toLowerCase() : ""
      },
      extend: function(n) {
        if ("object" != r.type(n) && "function" != r.type(n)) return n;
        for (var e, t, a = 1, i = arguments.length; a < i; a++) {
          e = arguments[a];
          for (t in e) o(e, t) && (n[t] = e[t])
        }
        return n
      },
      objEach: function(n, e) {
        if (n)
          for (var t in n)
            if (o(n, t) && !1 === e(t, n[t])) break
      },
      nextTick: function() {
        var n = this;
        return function() {
          return setTimeout.apply(n, arguments)
        }
      }(),
      lock: function(n) {
        var e;
        return function() {
          if (!e) {
            e = !0;
            var t = [].slice.call(arguments, 0);
            return t.unshift(function() {
              e = !1
            }), n.apply(this, t)
          }
        }
      },
      queue: function(n, e) {
        function t() {
          var n = o.shift();
          if (n) {
            a--;
            var i = n[0],
              c = n[1],
              u = n[2];
            u.unshift(function() {
              a++, t.apply(this, arguments)
            }), r.nextTick(function() {
              return i.apply(c, u)
            })
          } else a = e
        }
        var o = [],
          a = e = e || 1;
        return function() {
          if (o.push([n, this, [].slice.call(arguments, 0)]), a) return t()
        }
      },
      delegator: function(n) {
        var e, t = [];
        return function(o) {
          if (e) return t.push(o);
          e = !0, n.call(this, function() {
            e = !1;
            var n = this,
              r = arguments;
            o && o.apply(n, r), t.forEach(function(e) {
              e && e.apply(n, r)
            })
          })
        }
      },
      once: function(n) {
        var e, t = arguments;
        return function() {
          if (!e && n) return e = !0, n.apply(t.length >= 2 ? t[1] : null, arguments)
        }
      },
      queryParse: function(n, e) {
        if (!n) return {};
        e = e || "&";
        var t = n.replace(/^\?/, ""),
          o = {},
          r = t ? t.split(e) : null;
        return r && r.length > 0 && r.forEach(function(n) {
          var e = (n = n.split("=")).splice(0, 1),
            t = n.join("=");
          o[e] = t
        }), o
      },
      queryJoin: function(n, e, t) {
        var o = r.queryStringify(e, "&", t);
        if (!o) return n;
        var a;
        return a = /[\?&]$/.test(n) ? "" : ~n.indexOf("?") ? "&" : "?", n + a + o
      },
      queryStringify: function(n, e, t) {
        return n ? Object.keys(n).map(function(e) {
          var o = n[e];
          return e + "=" + (t ? o : encodeURIComponent(o))
        }).join(e || "&") : ""
      },
      wrapFun: function(n, e) {
        return function() {
          try {
            e && e.apply(this, arguments)
          } finally {
            n && n.apply(this, arguments)
          }
        }
      }
    };
    n.exports = r
  }, function(n, e, t) {
    "use strict";

    function o() {
      this._evtObjs = {}
    }
    o.prototype.on = function(n, e, t) {
      this._evtObjs[n] || (this._evtObjs[n] = []), this._evtObjs[n].push({
        handler: e,
        once: t
      });
      var o = this;
      return function() {
        o.off(n, e)
      }
    }, o.prototype.off = function(n, e) {
      var t = this;
      return (n ? [n] : Object.keys(this._evtObjs)).forEach(function(n) {
        if (e) {
          var o = [];
          (t._evtObjs[n] || []).forEach(function(n) {
            n.handler !== e && o.push(n)
          }), t._evtObjs[n] = o
        } else t._evtObjs[n] = []
      }), this
    }, o.prototype.emit = function(n) {
      var e = Array.prototype.slice.call(arguments, 1);
      (this._evtObjs[n] || []).forEach(function(n) {
        if (!n.once || !n.called) {
          n.called = !0;
          try {
            n.handler && n.handler.apply(null, e)
          } catch (n) {
            console.error(n.stack || n.message || n)
          }
        }
      })
    }, o.prototype.assign = function(n) {
      var e = this;
      ["on", "off", "wait", "emit"].forEach(function(t) {
        var o = e[t];
        n[t] = function() {
          return o.apply(e, arguments)
        }
      })
    }, (new o).assign(o), n.exports = o
  }, function(n, e, t) {
    "use strict";

    function o(n, e) {
      return e ? e.expr ? e.expr < 0 && -1 * e.expr == i ? e.data : e.expr > 0 && new Date < e.expr ? e.data : (wx.removeStorage({
        key: n
      }), null) : e.data : null
    }

    function r() {}
    var a = t(0),
      i = +new Date;
    console.log("[Session] Current ssid:", i);
    var c = {
      session: {
        set: function(n, e, t) {
          return c.set("session_" + n, e, -1 * i, t)
        },
        get: function(n, e) {
          return c.get("session_" + n, e)
        }
      },
      set: function(n, e, t, o) {
        "function" == a.type(t) ? (o = t, t = 0) : o && "function" != a.type(o) && (o = r), (t = t || 0) > 0 && (t += +new Date);
        var i = {
          expr: +t,
          data: e
        };
        o ? wx.setStorage({
          key: "_cache_" + n,
          data: i,
          success: function() {
            o()
          },
          fail: function(e) {
            o(e || `set "${n}" fail`)
          }
        }) : wx.setStorageSync("_cache_" + n, i)
      },
      get: function(n, e) {
        if (!e) return o(n, wx.getStorageSync("_cache_" + n));
        "function" != a.type(e) && (e = r);
        var t = `get "${n}" fail`;
        wx.getStorage({
          key: "_cache_" + n,
          success: function(r) {
            r && r.data ? e(null, o(n, r.data)) : e(r ? r.errMsg || t : t)
          },
          fail: function(n) {
            e(n || t)
          }
        })
      }
    };
    n.exports = c
  }, function(n, e, t) {
    "use strict";

    function o(n, e, t, r) {
      e && e.forEach(function(e) {
        "function" == typeof e && (e = e()), i.objEach(e, function(e, a) {
          if (n.hasOwnProperty(e)) switch (e) {
            case "id":
              return;
            case "comps":
              return void o(n, a, t, r);
            case "onLoad":
            case "onReady":
            case "onShow":
            case "onHide":
            case "onUnload":
            case "onPullDownRefresh":
            case "onReachBottom":
            case "onNavigate":
            case "onPreload":
            case "onLaunch":
            case "onAwake":
            case "onAppLaunch":
            case "onAppShow":
              return void(n[e] = i.wrapFun(n[e], a));
            case "data":
              return void(n[e] = i.extend({}, n.data, a));
            default:
              console.warn(`Property ${e} is already defined by ${t}`)
          }
          n[e] = a
        }), e.__$instance && e.__$instance(r)
      })
    }

    function r(n, e) {
      var t = i.type(n);
      return "function" != t && "object" != t || 1 != arguments.length || (e = n, n = ""),
        function(t) {
          var r, c, u = {},
            s = {
              $set: function(n) {
                t && r && r.$setData(t, n)
              },
              $data: function() {
                return console.log(r.data, u, t), r ? t ? r[t] : void 0 : u
              },
              $on: function(n, e) {
                return c ? c.on(n, e) : a
              },
              $emit: function() {
                c && c.emit.apply(c, arguments)
              }
            },
            f = "function" == i.type(e) ? e.call(this, s) : i.extend({}, e);
          if (f.onLoad = i.wrapFun(f.onLoad, function() {
              r = this
            }), f || (console.error(`Illegal component options [${n||"Anonymous"}]`), f = {}), o(f, f.comps, `Component[${n||"Anonymous"}]`, c), (t = t || f.id || n) || console.error(`Missing "id" property, it is necessary for component: `, f), delete f.comps, delete f.id, t && f.data) {
            var p = {};
            u = p[t] = f.data, p[t].$id = t, f.data = p
          }
          return f.__$instance = function(n) {
            c = n
          }, f
        }
    }

    function a() {}
    var i = t(0);
    r.use = o, n.exports = r
  }, function(n, e, t) {
    "use strict";

    function o(n, e, t) {
      if (!i) return i = !0, clearTimeout(r), clearTimeout(a), r = setTimeout(function() {
        i = !1
      }, 2e3), u.emit("navigateTo", e.url), wx[n] ? wx[n].apply(wx, t) : void 0
    }
    var r, a, i, c = t(1),
      u = n.exports = new c;
    u.on("page:ready", function() {
      a = setTimeout(function() {
        i = !1
      }, 100)
    }), u.navigateTo = function(n) {
      return o("navigateTo", n, arguments)
    }, u.redirectTo = function(n) {
      return o("redirectTo", n, arguments)
    }, u.switchTab = function(n) {
      return o("switchTab", n, arguments)
    }, u.reLaunch = function(n) {
      return o("reLaunch", n, arguments)
    }, u.navigateBack = function() {
      return wx.navigateBack.apply(wx, arguments)
    }
  }, function(n, e, t) {
    "use strict";

    function o(n, e) {
      var t = new w;
      if (y && y(n, e, k), x.use(e, e.comps, `Page[${n}]`, t), e.onNavigate) {
        let t = function(n, t) {
          e.onNavigate({
            url: n,
            query: t
          })
        };
        console.log(`Page[${n}] define "onNavigate".`), m.on("navigateTo:" + n, t), m.on("redirectTo:" + n, t), m.on("switchTab:" + n, t), m.on("reLaunch:" + n, t)
      }
      return e.onPreload && (console.log(`Page[${n}] define "onPreload".`), m.on("preload:" + n, function(n, t) {
        e.onPreload({
          url: n,
          query: t
        })
      })), e.$preload = s, e.$name = n, e.$cache = b, e.$session = b.session, e.$emitter = t, e.$state = {
        firstOpen: !1
      }, e.$route = e.$navigate = A, e.$redirect = O, e.$switch = S, e.$launch = E, e.$back = u, e.$bindRoute = e.$bindNavigate = R, e.$bindRedirect = q, e.$bindSwitch = C, e.$bindReLaunch = F, e.$on = function() {
        return m.on.apply(m, arguments)
      }, e.$emit = function() {
        return m.emit.apply(m, arguments)
      }, e.$off = function() {
        return m.off.apply(m, arguments)
      }, e.$put = function(n, e) {
        return _[n] = e, this
      }, e.$take = function(n) {
        var e = _[n];
        return _[n] = null, e
      }, e.$setData = function(n, e) {
        if ("string" == g.type(n)) {
          var t = {};
          return g.objEach(e, function(e, o) {
            t[n + "." + e] = o
          }), this.setData(t)
        }
        if ("object" == g.type(n)) return this.setData(n)
      }, e.$curPage = function() {
        return getCurrentPages().slice(0).pop()
      }, e.onLoad = g.wrapFun(e.onLoad, function() {
        e.onAwake && w.on("app:sleep", function(n) {
          e.onAwake.call(this, n)
        }), T || (T = !0, this.$state.firstOpen = !0)
      }), e.onReady = g.wrapFun(e.onReady, function() {
        $.emit("page:ready")
      }), e.onLaunch && e.onLaunch(), e.onAppLaunch && (j ? e.onAppLaunch.apply(e, j) : m.on("app:launch", function(n) {
        e.onAppLaunch.apply(e, n)
      })), e.onAppShow && (j ? e.onAppShow.apply(e, j) : m.on("app:show", function(n) {
        e.onAppShow.apply(e, n)
      })), v && v(n, e, k), Page(e), e
    }

    function r() {
      j = [].slice.call(arguments), w.emit("app:launch", j)
    }

    function a() {
      try {
        L || (L = [].slice.call(arguments), w.emit("app:show", L))
      } finally {
        if (!P) return;
        var n = P;
        P = 0, w.emit("app:sleep", new Date - n)
      }
    }

    function i() {
      P = new Date
    }

    function c(n) {
      var e = D[n];
      return function(n) {
        if (n) {
          var t = n.currentTarget.dataset,
            o = t.before,
            r = t.after,
            a = t.url,
            i = this;
          try {
            i && o && i[o] && i[o].call(i, n)
          } finally {
            if (!a) return;
            e(a), i && r && i[r] && i[r].call(i, n)
          }
        }
      }
    }

    function u(n) {
      wx.navigateBack({
        delta: n || 1
      })
    }

    function s(n) {
      var e = p(n);
      e && m.emit("preload:" + e, n, g.queryParse(n.split("?")[1]))
    }

    function f({
      type: n
    }) {
      return function(e, t) {
        var o = e.split(/\?/),
          r = o[0];
        if (/^[\w\-]+$/.test(r) && (r = h(r)), !r) throw new Error("Invalid path:", r);
        (t = t || {}).url = r + (o[1] ? "?" + o[1] : ""), $[n](t)
      }
    }

    function p(n) {
      var e = /^[\w\-]+(?=\?|$)/.exec(n);
      return e ? e[0] : d(n)
    }

    function l(n, e) {
      console.log(741)
      switch (n) {
        case "extendPageBefore":
          y = e;
          break;
        case "extendPageAfter":
          v = e;
          break;
        case "route":
          if ("string" == g.type(e)) {
            new RegExp("^" + e.replace(/^\/?/, "/?").replace(/[\.]/g, "\\.").replace("$page", "([\\w\\-]+)"));
            h = function(n) {
              return e.replace("$page", n)
            }, d = function(n) {
              return n.replace("/pages/", "").replace(/\?.*$/g, "")
            }
          } else console.error("Illegal routes option:", e)
      }
    }
    var h, d, y, v, g = t(0),
      w = t(1),
      $ = t(4),
      b = t(2),
      x = t(3),
      m = new w,
      _ = {},
      T = 0,
      j = 0,
      L = 0,
      P = 0,
      k = {
        fns: g,
        redirector: $,
        cache: b,
        message: w,
        dispatcher: m,
        channel: _
      };
    ! function(n, e) {
      e.forEach(function(e) {
        n.on(e, function(n) {
          var t = p(n);
          t && m.emit(e + ":" + t, n, g.queryParse(n.split("?")[1]))
        })
      })
    }($, ["navigateTo", "redirectTo", "switchTab", "reLaunch"]);
    var A = f({
        type: "navigateTo"
      }),
      O = f({
        type: "redirectTo"
      }),
      S = f({
        type: "switchTab"
      }),
      E = f({
        type: "reLaunch"
      }),
      D = {
        navigate: A,
        redirect: O,
        switchTab: S,
        reLaunch: E
      },
      R = c("navigate"),
      q = c("redirect"),
      C = c("switchTab"),
      F = c("reLaunch");
    o.C = o.Comp = o.Component = x, o.A = o.App = o.Application = function(n) {
      if (!n.config || !n.config.route) throw new Error("config.route is necessary !");
      n.config && o.config(n.config), n.onShow = n.onShow ? g.wrapFun(n.onShow, a) : a, n.onHide = n.onHide ? g.wrapFun(n.onHide, i) : i, n.onLaunch = n.onLaunch ? g.wrapFun(n.onLaunch, r) : r, n.onAwake && w.on("app:sleep", function(e) {
        n.onAwake.call(this, e)
      }), App(n)
    }, o.config = function(n, e) {
      return "object" == g.type(n) ? g.objEach(n, function(n, e) {
        l(n, e)
      }) : l(n, e), this
    }, n.exports = o
  }])
}, function(n, e, t) {
  "use strict";

  function o(n, e) {
    return e ? e.expr ? e.expr < 0 && -1 * e.expr == i ? e.data : e.expr > 0 && new Date < e.expr ? e.data : (wx.removeStorage({
      key: n
    }), null) : e.data : null
  }

  function r() {}
  var a = t(1),
    i = +new Date;
  console.log("[Session] Current ssid:", i);
  var c = {
    session: {
      set: function(n, e, t) {
        return c.set("session_" + n, e, -1 * i, t)
      },
      get: function(n, e) {
        return c.get("session_" + n, e)
      }
    },
    set: function(n, e, t, o) {
      "function" == a.type(t) ? (o = t, t = 0) : o && "function" != a.type(o) && (o = r), (t = t || 0) > 0 && (t += +new Date);
      var i = {
        expr: +t,
        data: e
      };
      o ? wx.setStorage({
        key: "_cache_" + n,
        data: i,
        success: function() {
          o()
        },
        fail: function(e) {
          o(e || `set "${n}" fail`)
        }
      }) : wx.setStorageSync("_cache_" + n, i)
    },
    get: function(n, e) {
      if (!e) return o(n, wx.getStorageSync("_cache_" + n));
      "function" != a.type(e) && (e = r);
      var t = `get "${n}" fail`;
      wx.getStorage({
        key: "_cache_" + n,
        success: function(r) {
          r && r.data ? e(null, o(n, r.data)) : e(r ? r.errMsg || t : t)
        },
        fail: function(n) {
          e(n || t)
        }
      })
    }
  };
  n.exports = c
}, function(n, e, t) {
  "use strict";

  function o(n, e, t, r) {
    e && e.forEach(function(e) {
      "function" == typeof e && (e = e()), i.objEach(e, function(e, a) {
        if (n.hasOwnProperty(e)) switch (e) {
          case "id":
            return;
          case "comps":
            return void o(n, a, t, r);
          case "onLoad":
          case "onReady":
          case "onShow":
          case "onHide":
          case "onUnload":
          case "onPullDownRefresh":
          case "onReachBottom":
          case "onNavigate":
          case "onPreload":
          case "onLaunch":
          case "onAwake":
          case "onAppLaunch":
          case "onAppShow":
            return void(n[e] = i.wrapFun(n[e], a));
          case "data":
            return void(n[e] = i.extend({}, n.data, a));
          default:
            console.warn(`Property ${e} is already defined by ${t}`)
        }
        n[e] = a
      }), e.__$instance && e.__$instance(r)
    })
  }

  function r(n, e) {
    var t = i.type(n);
    return "function" != t && "object" != t || 1 != arguments.length || (e = n, n = ""),
      function(t) {
        var r, c, u = {},
          s = {
            $set: function(n) {
              console.log("---------------"), t && r && r.$setData(t, n)
            },
            $data: function() {
              return console.log(r.data, "######"), r ? t ? r.data[t] : void 0 : u
            },
            $on: function(n, e) {
              return c ? c.on(n, e) : a
            },
            $emit: function() {
              c && c.emit.apply(c, arguments)
            }
          },
          f = "function" == i.type(e) ? e.call(this, s) : i.extend({}, e);
        if (f.onLoad = i.wrapFun(f.onLoad, function() {
            r = this
          }), f || (console.error(`Illegal component options [${n||"Anonymous"}]`), f = {}), o(f, f.comps, `Component[${n||"Anonymous"}]`, c), (t = t || f.id || n) || console.error(`Missing "id" property, it is necessary for component: `, f), delete f.comps, delete f.id, t && f.data) {
          var p = {};
          u = p[t] = f.data, p[t].$id = t, f.data = p
        }
        return f.__$instance = function(n) {
          c = n
        }, f
      }
  }

  function a() {}
  var i = t(1);
  r.use = o, n.exports = r
}, function(n, e, t) {
  "use strict";

  function o(n, e, t) {
    if (!i) return i = !0, clearTimeout(r), clearTimeout(a), r = setTimeout(function() {
      i = !1
    }, 2e3), u.emit("navigateTo", e.url), wx[n] ? wx[n].apply(wx, t) : void 0
  }
  var r, a, i, c = t(2),
    u = n.exports = new c;
  u.on("page:ready", function() {
    a = setTimeout(function() {
      i = !1
    }, 100)
  }), u.navigateTo = function(n) {
    return o("navigateTo", n, arguments)
  }, u.redirectTo = function(n) {
    return o("redirectTo", n, arguments)
  }, u.switchTab = function(n) {
    return o("switchTab", n, arguments)
  }, u.reLaunch = function(n) {
    return o("reLaunch", n, arguments)
  }, u.navigateBack = function() {
    return wx.navigateBack.apply(wx, arguments)
  }
}, function(n, e, t) {
  t(0), t(0), n.exports = t(3)
}]);