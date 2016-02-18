/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var tracking = __webpack_require__(1);
	window.ut = tracking.ut || [];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var gtm = __webpack_require__(2);
	var dealer = __webpack_require__(19);
	
	function processCommand(data) {
	    var fn, args;
	
	    if (data[0] === 'pagename') {
	        gtm.setPagename(data[1]);
	    }
	
	    if (data[0] === 'gtm') {
	        fn = gtm[data[1]];
	        args = data.slice(2);
	        if (typeof fn === 'function') {
	            fn.apply(gtm, args);
	        }
	    } else if (data[0] === 'dealer') {
	        fn = dealer[data[1]];
	        args = data.slice(2);
	        if (typeof fn === 'function') {
	            fn.apply(dealer, args);
	        }
	    }
	}
	
	var ut = window.ut || (window.ut = []);
	
	ut.push = function () {
	    Array.prototype.push.apply(window.ut, arguments);
	    processCommand.apply({}, arguments);
	};
	
	ut.forEach(processCommand);
	
	var isRegistered = function isRegistered(name) {
	    var registered = document.createElement(name).constructor !== HTMLElement;
	    if (registered && window && window.console) {
	        window.console.warn('CustomElement "' + name + '" is already registered.');
	    }
	    return registered;
	};
	
	if (!isRegistered('as24-tracking')) {
	    __webpack_require__(20);
	}
	
	module.exports = {
	    gtm: gtm,
	    dealer: dealer,
	    ut: ut
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var merge = __webpack_require__(3);
	
	var gtm = __webpack_require__(6);
	var containerId = __webpack_require__(7)(location.hostname);
	var viewport = __webpack_require__(8);
	
	var pagename;
	
	function setPagename(pn) {
	    pagename = pn;
	}
	
	function generateCommonParams(data) {
	    var mergedPagename = merge({}, pagename, data);
	
	    if (!mergedPagename || !mergedPagename.country || !mergedPagename.market || !mergedPagename.category || !mergedPagename.pageid) {
	        throw new Error('Incorrect pagename');
	    }
	
	    var commonPageName = [mergedPagename.country, mergedPagename.market, mergedPagename.category, mergedPagename.group, mergedPagename.pageid].filter(function (x) {
	        return x;
	    }).join('/');
	
	    if (mergedPagename.layer) {
	        commonPageName += '|' + mergedPagename.layer;
	    }
	
	    var commonData = {
	        common_country: mergedPagename.country,
	        common_market: mergedPagename.market,
	        common_category: mergedPagename.category,
	        common_pageid: mergedPagename.pageid,
	        common_pageName: commonPageName,
	
	        common_environment: mergedPagename.environment || '',
	        common_language: mergedPagename.language || '',
	        common_group: mergedPagename.group || '',
	        common_layer: mergedPagename.layer || '',
	        common_attribute: mergedPagename.attribute || '',
	
	        common_linkgroup: mergedPagename.linkgroup || '',
	        common_linkid: mergedPagename.linkid || '',
	
	        common_techState: mergedPagename.techState || ''
	    };
	
	    return commonData;
	}
	
	function trackClick(params) {
	    gtm.push(generateCommonParams(params));
	    gtm.push({ event: 'click' });
	}
	
	var firstPageview = true;
	
	function trackPageview(data) {
	    if (firstPageview) {
	        gtm.push(viewport);
	    }
	
	    gtm.push(generateCommonParams(data));
	
	    if (firstPageview) {
	        gtm.loadContainer(containerId);
	        __webpack_require__(9).updateCampaignCookie();
	        gtm.push({ event: 'common_data_ready' });
	        gtm.push({ event: 'data_ready' });
	        firstPageview = false;
	    } else {
	        gtm.push({ event: 'pageview' });
	    }
	}
	
	module.exports = {
	    setPagename: setPagename,
	    trackClick: trackClick,
	
	    set: gtm.push,
	    pageview: trackPageview,
	    click: trackClick
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var extend = __webpack_require__(4);
	
	module.exports = function merge() {
	    var args = [].slice.call(arguments);
	    args.unshift({});
	    return extend.apply(this, args);
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var isObject = __webpack_require__(5);
	
	module.exports = function (obj) {
	    if (!isObject(obj)) return obj;
	    var source, prop;
	    for (var i = 1, length = arguments.length; i < length; i++) {
	        source = arguments[i];
	        for (prop in source) {
	            obj[prop] = source[prop];
	        }
	    }
	    return obj;
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }
	
	module.exports = function isObject(obj) {
	    var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
	    return !!obj && (type === 'function' || type === 'object');
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	var dataLayer = window.dataLayer = window.dataLayer || [];
	
	module.exports = {
	    loadContainer: function loadContainer(containerId) {
	        (function (w, d, s, l, i) {
	            w[l] = w[l] || [];w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });var f = d.getElementsByTagName(s)[0],
	                j = d.createElement(s),
	                dl = l != 'dataLayer' ? '&l=' + l : '';j.async = true;j.src = '//www.googletagmanager.com/gtm.js?id=' + i + dl;f.parentNode.insertBefore(j, f);
	        })(window, document, 'script', 'dataLayer', containerId);
	    },
	
	    push: function push() {
	        if (!arguments.length) {
	            return;
	        }
	
	        var args = [].slice.call(arguments);
	        args.map(function (data) {
	            for (var key in data) {
	                data[key] = toLower(data[key]);
	            }
	
	            return data;
	        });
	
	        dataLayer.push.apply(dataLayer, args);
	    }
	};
	
	function toLower(val) {
	    return val && ('' + val).toLowerCase();
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	var containerIdsByTld = {
	    'de': 'GTM-MK57H2',
	    'at': 'GTM-WBZ87G',
	    'be': 'GTM-5BWB2M',
	    'lu': 'GTM-NDBDCZ',
	    'es': 'GTM-PS6QHN',
	    'fr': 'GTM-PD93LD',
	    'it': 'GTM-WTCSNR',
	    'nl': 'GTM-TW48BJ',
	    'ru': 'GTM-PDC65Z',
	    'com': 'GTM-KWX9NX'
	};
	
	module.exports = function (hostname) {
	    var tld = hostname.split('.').pop();
	    return tld === 'localhost' ? '' : containerIdsByTld[tld] || containerIdsByTld['com'];
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	var viewportWidth = Math.min(document.documentElement.clientWidth, window.innerWidth || screen.width);
	
	module.exports = {
	    session_viewport: viewportWidth >= 994 ? 'l' : viewportWidth >= 768 ? 'm' : viewportWidth >= 480 ? 's' : 'xs'
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var gtm = __webpack_require__(6);
	var cookieHandler = __webpack_require__(10);
	
	function updateCampaignCookie() {
	    var cookiename = 'cmpatt';
	    var campaignCookie = cookieHandler.read(cookiename);
	    campaignCookie.updateCurrentVisit();
	    gtm.push(campaignCookie.getGtmData());
	    cookieHandler.write(campaignCookie);
	}
	
	module.exports = {
	    updateCampaignCookie: updateCampaignCookie
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var cookies = __webpack_require__(11);
	var isValidDate = __webpack_require__(12);
	
	var utm = __webpack_require__(13);
	
	var cAge = 90;
	var oneDay = 24 * 60 * 60 * 1000;
	
	function readCookie(name) {
	    // format of the cookie:
	    // timeStamp(no separator here)firstVisit#lastPaidCampaign#currentVisit
	    // cookieDate(0-13)medium,source,campaign,timestamp#medium,source,campaign,timestamp#medium,source,campaign,timestamp
	
	    var now = +new Date();
	
	    var cookie = {
	        name: name,
	        date: new Date(0),
	        content: [],
	
	        firstVisit: null,
	        currentVisit: null,
	        lastPaidVisit: null,
	
	        isValid: function isValid() {
	            return isValidDate(this.date) && this.content && this.content.length === 3;
	        },
	        getGtmData: function getGtmData() {
	            var ret = {};
	            ret.campaign_directMedium = this.currentVisit[0];
	            ret.campaign_directSource = this.currentVisit[1];
	            ret.campaign_directCampaign = this.currentVisit[2];
	
	            if (this.lastPaidVisit && this.lastPaidVisit[3] > now - cAge * oneDay) {
	                ret.campaign_lastPaidMedium = this.lastPaidVisit[0];
	                ret.campaign_lastPaidSource = this.lastPaidVisit[1];
	                ret.campaign_lastPaidCampaign = this.lastPaidVisit[2];
	            }
	
	            return ret;
	        },
	
	        updateCurrentVisit: function updateCurrentVisit() {
	            var utmParams = utm.getParameters(location.search);
	            this.currentVisit = [utmParams.medium, utmParams.source, utmParams.campaign, now];
	            this.firstVisit = this.firstVisit || this.currentVisit;
	
	            if (utm.isPaidChannel(utmParams.medium)) {
	                this.lastPaidVisit = this.currentVisit;
	            }
	
	            this.content = [this.firstVisit, this.lastPaidVisit, this.currentVisit];
	        }
	    };
	
	    try {
	        var rawValue = cookies.read(name);
	
	        if (!rawValue) {
	            return cookie;
	        }
	
	        var date = new Date(+rawValue.substring(0, 13));
	
	        if (!isValidDate(date)) {
	            return cookie;
	        }
	
	        cookie.date = date;
	
	        var content = rawValue.substring(13).split('#').map(function (part) {
	            if (!part) {
	                return null;
	            }
	
	            var parts = part.split(',');
	            parts[3] = parts[3] && parseInt(parts[3], 10);
	            return parts;
	        });
	
	        if (!content || content.length !== 3) {
	            content = [];
	        }
	
	        cookie.firstVisit = content[0];
	        cookie.lastPaidVisit = content[1];
	        cookie.currentVisit = content[2];
	
	        cookie.content = content;
	
	        return cookie;
	    } catch (ex) {
	        return cookie;
	    }
	}
	
	function writeCookie(cookie) {
	    var now = +new Date();
	    var domain = '.' + location.hostname.split('.').slice(-2).join('.');
	
	    var formattedValue = now + '' + cookie.content.slice(0, 3).join('#');
	    var options = {
	        expires: cAge * 24 * 60 * 60,
	        path: '/',
	        domain: location.hostname.indexOf('localhost') >= 0 ? '' : domain
	    };
	
	    cookies.set(cookie.name, formattedValue, options);
	}
	
	module.exports = {
	    read: readCookie,
	    write: writeCookie
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";
	
	var doc = document;
	
	function readCookie(name, options) {
	    if (!name) {
	        return null;
	    }
	
	    var decodingFunction = options && options.decodingFunction || decodeURIComponent;
	
	    return decodingFunction(doc.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
	}
	
	function setCookie(name, value, options) {
	    if (!name || /^(?:expires|max\-age|path|domain|secure)$/i.test(name)) {
	        return false;
	    }
	
	    var expiresString = "";
	
	    if (options.expires) {
	        var date = new Date();
	        date.setTime(+date + options.expires);
	        expiresString = "; expires=" + date.toGMTString();
	    }
	
	    options.encodingFunction = options.encodingFunction || encodeURIComponent;
	
	    document.cookie = encodeURIComponent(name) + "=" + options.encodingFunction(value) + expiresString + (options.domain ? "; domain=" + options.domain : "") + (options.path ? "; path=" + options.path : "") + (options.secure ? "; secure" : "");
	
	    return true;
	}
	
	function removeCookie(name, options) {
	    if (hasCookie(name)) {
	        return false;
	    }
	    document.cookie = encodeURIComponent(name) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (name ? "; domain=" + options.domain : "") + (options.path ? "; path=" + options.path : "");
	    return true;
	}
	
	function hasCookie(name) {
	    if (!name) {
	        return false;
	    }
	    return new RegExp("(?:^|;\\s*)" + encodeURIComponent(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=").test(document.cookie);
	}
	
	module.exports = {
	    read: readCookie,
	    set: setCookie,
	    remove: removeCookie
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';
	
	var toString = Object.prototype.toString;
	
	module.exports = function isFunction(obj) {
	    return toString.call(obj) === '[object Date]';
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var qs = __webpack_require__(14);
	var indexOf = __webpack_require__(17);
	
	module.exports = {
	    getParameters: function getParameters(locationSearch) {
	        var queryParams = qs.parse(locationSearch.replace('?', '')) || {};
	        var utm = {
	            medium: queryParams.gclid ? 'gclid' : queryParams.utm_medium || '',
	
	            source: queryParams.utm_source || '',
	
	            campaign: queryParams.utm_campaign || ''
	        };
	
	        if (!utm.medium) {
	            utm.medium = 'direct';
	            utm.source = 'direct';
	            utm.campaign = 'direct';
	        }
	
	        return utm;
	    },
	
	    isPaidChannel: function isPaidChannel(medium) {
	        var paidChannels = ['aff', 'co', 'med', 'email', 'ret', 'cpc', 'print', 'gclid'];
	        return !!(medium && indexOf(paidChannels, medium) >= 0);
	    }
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.decode = exports.parse = __webpack_require__(15);
	exports.encode = exports.stringify = __webpack_require__(16);

/***/ },
/* 15 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	'use strict';
	
	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}
	
	module.exports = function (qs, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  var obj = {};
	
	  if (typeof qs !== 'string' || qs.length === 0) {
	    return obj;
	  }
	
	  var regexp = /\+/g;
	  qs = qs.split(sep);
	
	  var maxKeys = 1000;
	  if (options && typeof options.maxKeys === 'number') {
	    maxKeys = options.maxKeys;
	  }
	
	  var len = qs.length;
	  // maxKeys <= 0 means that we should not limit keys count
	  if (maxKeys > 0 && len > maxKeys) {
	    len = maxKeys;
	  }
	
	  for (var i = 0; i < len; ++i) {
	    var x = qs[i].replace(regexp, '%20'),
	        idx = x.indexOf(eq),
	        kstr,
	        vstr,
	        k,
	        v;
	
	    if (idx >= 0) {
	      kstr = x.substr(0, idx);
	      vstr = x.substr(idx + 1);
	    } else {
	      kstr = x;
	      vstr = '';
	    }
	
	    k = decodeURIComponent(kstr);
	    v = decodeURIComponent(vstr);
	
	    if (!hasOwnProperty(obj, k)) {
	      obj[k] = v;
	    } else if (Array.isArray(obj[k])) {
	      obj[k].push(v);
	    } else {
	      obj[k] = [obj[k], v];
	    }
	  }
	
	  return obj;
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	'use strict';
	
	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }
	
	var stringifyPrimitive = function stringifyPrimitive(v) {
	  switch (typeof v === 'undefined' ? 'undefined' : _typeof(v)) {
	    case 'string':
	      return v;
	
	    case 'boolean':
	      return v ? 'true' : 'false';
	
	    case 'number':
	      return isFinite(v) ? v : '';
	
	    default:
	      return '';
	  }
	};
	
	module.exports = function (obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }
	
	  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
	    return Object.keys(obj).map(function (k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (Array.isArray(obj[k])) {
	        return obj[k].map(function (v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);
	  }
	
	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var isNumber = __webpack_require__(18);
	
	module.exports = function indexOf(arr, item, from) {
	    var i = 0;
	    var l = arr && arr.length;
	    if (isNumber(from)) {
	        i = from < 0 ? Math.max(0, l + from) : from;
	    }
	    for (; i < l; i++) {
	        if (arr[i] === item) return i;
	    }
	    return -1;
	};

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';
	
	var toString = Object.prototype.toString;
	
	module.exports = function isNumber(obj) {
	    return toString.call(obj) === '[object Number]';
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var cookies = __webpack_require__(11);
	var visitorId = cookies.read('as24Visitor');
	
	function sendRequest(params) {
	    if (!visitorId) {
	        return;
	    }
	
	    params.visitor = visitorId;
	    params.ticks = +new Date();
	
	    var paramsStr = Object.keys(params).map(function (key) {
	        return key + '=' + encodeURIComponent(params[key]);
	    }).join('&');
	
	    new Image().src = 'http://tracking.autoscout24.com/parser.ashx?' + paramsStr;
	}
	
	module.exports = {
	    listview: function listview(ids) {
	        sendRequest({
	            id: ids.join('|'),
	            source: 'lv',
	            url: '/'
	        });
	    },
	
	    detailview: function detailview(url) {
	        var parser = document.createElement('a');
	        parser.href = url || location.href;
	        var matches = parser.pathname.match(/-([\d]+)$/i);
	
	        if (matches && matches.length === 2) {
	            var id = matches[1];
	            sendRequest({
	                source: 'pv',
	                url: url || location.href,
	                id: id
	            });
	        }
	    },
	
	    topcarview: function topcarview() {
	        var matches = location.pathname.match(/-([\d]+)$/i);
	        if (matches && matches.length === 2) {
	            var id = matches[1];
	            sendRequest({
	                source: 'ha',
	                url: location.href,
	                id: id
	            });
	        }
	    },
	
	    phone: function phone() {
	        var matches = location.pathname.match(/-([\d]+)$/i);
	        if (matches && matches.length === 2) {
	            var id = matches[1];
	            sendRequest({
	                source: 'mc',
	                url: location.href,
	                id: id
	            });
	        }
	    }
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var as24tracking = _extends(Object.create(HTMLElement.prototype), {
	    el: null,
	    inDev: true,
	    supportedActions: ['set', 'click', 'pageview'],
	    supportedTypes: ['gtm', 'pagename'],
	    reservedWords: ['type', 'action', 'as24-tracking-value', 'as24-tracking-click-target'],
	
	    createdCallback: function createdCallback() {
	        var _this = this;
	
	        this.el = $(this);
	        var values = this.getAdditionalProperties();
	
	        var type = this.el.attr('type');
	        var action = this.el.attr('action');
	        var args = [type, action];
	
	        if (Object.keys(values).length > 0) {
	            args.push(values);
	        }
	
	        if (type === 'pagename') {
	            args.splice(1, 1);
	        }
	
	        var clickTarget = this.el.attr('as24-tracking-click-target');
	        if (clickTarget !== null && clickTarget !== '') {
	            $(this.el.attr('as24-tracking-click-target')).on('click', function () {
	                return _this.track(args);
	            });
	        } else {
	            this.track(args);
	        }
	    },
	    getAdditionalProperties: function getAdditionalProperties() {
	        var _this2 = this;
	
	        var values = JSON.parse(this.el.attr('as24-tracking-value')) || {};
	        if (Array.isArray(values)) {
	            return values;
	        }
	        return Array.prototype.slice.call(this.el[0].attributes).filter(function (element) {
	            return !(_this2.reservedWords.indexOf(element.nodeName) > -1);
	        }).reduce(function (prev, curr) {
	            var attrName = _this2.decodeAttributeName(curr.nodeName);
	            prev[attrName] = curr.nodeValue;
	            return prev;
	        }, values);
	    },
	    decodeAttributeName: function decodeAttributeName(attrName) {
	        if (attrName.indexOf('-') > -1) {
	            attrName = attrName.replace(/-([a-z])/g, function (g) {
	                return g[1].toUpperCase();
	            });
	        }
	        return attrName;
	    },
	    track: function track(args) {
	        if (this.inDev) {
	            console.log(args);
	        } else {
	            ut.push(args);
	        }
	    }
	});
	
	document.registerElement('as24-tracking', {
	    prototype: as24tracking
	});

/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map