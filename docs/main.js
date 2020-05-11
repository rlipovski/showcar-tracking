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
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var tracking = __webpack_require__(1);
	window.ut = tracking.ut || [];

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var trackingEnabled = location.hash.indexOf('tracking-off=true') < 0;
	var cmpEnabled = location.href.indexOf('__cmp') >= 0;
	// const alreadyHaveConsent
	
	if (cmpEnabled) {
	    __webpack_require__(2);
	}
	
	var startTracking = function startTracking() {
	    var gtm = __webpack_require__(3);
	    var dealerGtm = __webpack_require__(10);
	
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
	        } else if (data[0] === 'dealer-gtm') {
	            fn = dealerGtm[data[1]];
	            args = data.slice(2);
	            if (typeof fn === 'function') {
	                fn.apply(dealerGtm, args);
	            }
	        }
	    }
	
	    var ut = window.ut || (window.ut = []);
	
	    if (ut.push === Array.prototype.push) {
	        ut.push = function () {
	            Array.prototype.push.apply(window.ut, arguments);
	            processCommand.apply({}, arguments);
	        };
	
	        ut.forEach(processCommand);
	    }
	
	    __webpack_require__(11);
	
	    module.exports = {
	        gtm: gtm,
	        ut: ut
	    };
	};
	
	if (trackingEnabled) {
	    startTracking();
	}
	
	console.log('ABCDEF');

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	'use strict';
	
	if (!window.__cmp || typeof window.__cmp !== 'function') {
	    var faktorCmpStart = window.__cmp ? window.__cmp.start : {};
	
	    window.__cmp = function () {
	        var listen = window.attachEvent || window.addEventListener;
	        listen('message', function (event) {
	            window.__cmp.receiveMessage(event);
	        });
	
	        function addLocatorFrame() {
	            if (!window.frames['__cmpLocator']) {
	                if (document.body) {
	                    var frame = document.createElement('iframe');
	                    frame.style.display = 'none';
	                    frame.name = '__cmpLocator';
	                    document.body.appendChild(frame);
	                } else {
	                    setTimeout(addLocatorFrame, 5);
	                }
	            }
	        }
	
	        addLocatorFrame();
	
	        var commandQueue = [];
	        var cmp = function cmp(command, parameter, callback) {
	            if (command === 'ping') {
	                if (callback) {
	                    callback({
	                        gdprAppliesGlobally: !!(window.__cmp && window.__cmp.config && window.__cmp.config.storeConsentGlobally),
	                        cmpLoaded: false
	                    });
	                }
	            } else {
	                commandQueue.push({
	                    command: command,
	                    parameter: parameter,
	                    callback: callback
	                });
	            }
	        };
	        cmp.commandQueue = commandQueue;
	        cmp.receiveMessage = function (event) {
	            var data = event && event.data && event.data.__cmpCall;
	            if (data) {
	                commandQueue.push({
	                    callId: data.callId,
	                    command: data.command,
	                    parameter: data.parameter,
	                    event: event
	                });
	            }
	        };
	
	        return cmp;
	    }();
	
	    window.__cmp.start = faktorCmpStart;
	}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var merge = __webpack_require__(4);
	
	var gtm = __webpack_require__(7);
	var containerId = __webpack_require__(8)(location.hostname);
	var viewport = __webpack_require__(9);
	
	var pagename;
	
	function setPagename(pn) {
	    pagename = pn;
	}
	
	function generateCommonParams(data) {
	    var mergedPagename = merge({}, pagename, data);
	
	    if (!mergedPagename || !mergedPagename.country || !mergedPagename.market || !mergedPagename.category || !mergedPagename.pageid || !mergedPagename.environment) {
	        if (mergedPagename.environment !== 'test' || mergedPagename.environment !== 'live') {
	            throw new Error('Invalid environment type, ' + JSON.stringify(mergedPagename));
	        }
	        throw new Error('Incorrect pagename, ' + JSON.stringify(mergedPagename));
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
	        common_environment: mergedPagename.environment,
	
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
	    if (params.eventcategory && params.eventaction) {
	        gtm.push({
	            event: 'event_trigger',
	            event_category: params.eventcategory,
	            event_action: params.eventaction,
	            event_label: params.eventlabel || '',
	            event_non_interaction: false
	        });
	    } else {
	        //DEPRECATED
	        gtm.push(generateCommonParams(params));
	        gtm.push({
	            event: 'click'
	        });
	    }
	}
	
	var firstPageview = true;
	
	function trackPageview(data) {
	    if (firstPageview) {
	        gtm.push(viewport);
	    }
	
	    gtm.push(generateCommonParams(data));
	
	    setTimeout(function () {
	        if (firstPageview) {
	            gtm.loadContainer(containerId);
	
	            gtm.push({
	                event: 'common_data_ready'
	            });
	            gtm.push({
	                event: 'data_ready'
	            });
	            firstPageview = false;
	        } else {
	            gtm.push({
	                event: 'pageview'
	            });
	        }
	    }, 10);
	}
	
	module.exports = {
	    setPagename: setPagename,
	    trackClick: trackClick,
	
	    set: gtm.push,
	    pageview: trackPageview,
	    click: trackClick
	};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var extend = __webpack_require__(5);
	
	module.exports = function merge() {
	    var args = [].slice.call(arguments);
	    args.unshift({});
	    return extend.apply(this, args);
	};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var isObject = __webpack_require__(6);
	
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

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	module.exports = function isObject(obj) {
	    var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
	    return !!obj && (type === 'function' || type === 'object');
	};

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	'use strict';
	
	var dataLayer = window.dataLayer = window.dataLayer || [];
	var useNewArrayLogic = window.location.href.indexOf('tracking-arrays=true') >= 0;
	
	module.exports = {
	    loadContainer: function loadContainer(containerId) {
	        var gtmAlreadyLoadedClassName = 'gtm-main-container-load-initiated';
	        var alreadyInitiatedMainGtmContainerLoaded = document.documentElement.className.indexOf(gtmAlreadyLoadedClassName) >= 0;
	
	        if (alreadyInitiatedMainGtmContainerLoaded) {
	            // preventing duplicated load of main GTM container
	            return;
	        }
	
	        document.documentElement.className += ' ' + gtmAlreadyLoadedClassName;
	
	        (function (w, d, s, l, i) {
	            w[l] = w[l] || [];
	            w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
	            var f = d.getElementsByTagName(s)[0],
	                j = d.createElement(s),
	                dl = l != 'dataLayer' ? '&l=' + l : '';
	            j.async = true;
	            j.src = '//www.googletagmanager.com/gtm.js?id=' + i + dl;
	            f.parentNode.insertBefore(j, f);
	        })(window, document, 'script', 'dataLayer', containerId);
	    },
	
	    push: function push() {
	        if (!arguments.length) {
	            return;
	        }
	
	        var args = [].slice.call(arguments);
	
	        args.map(function (data) {
	            for (var key in data) {
	                if (!useNewArrayLogic || typeof data[key] === 'string') {
	                    data[key] = toLower(data[key]);
	                }
	            }
	
	            return data;
	        });
	
	        dataLayer.push.apply(dataLayer, args);
	    }
	};
	
	function toLower(val) {
	    return val && ('' + val).toLowerCase();
	}

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	'use strict';
	
	var containerIdsByTld = {
	    de: 'GTM-MK57H2',
	    at: 'GTM-WBZ87G',
	    be: 'GTM-5BWB2M',
	    lu: 'GTM-NDBDCZ',
	    es: 'GTM-PS6QHN',
	    fr: 'GTM-PD93LD',
	    it: 'GTM-WTCSNR',
	    nl: 'GTM-TW48BJ',
	    com: 'GTM-KWX9NX'
	};
	
	module.exports = function (hostname) {
	    var tld = hostname.split('.').pop();
	    return containerIdsByTld[tld] || containerIdsByTld['com'];
	};

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	'use strict';
	
	var viewportWidth = Math.min(document.documentElement.clientWidth, window.innerWidth || screen.width);
	
	module.exports = {
	    session_viewport: viewportWidth >= 994 ? 'l' : viewportWidth >= 768 ? 'm' : viewportWidth >= 480 ? 's' : 'xs'
	};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	"use strict";
	
	var currentVehicles = [];
	
	function add(data) {
	    currentVehicles.push(data);
	}
	
	function commit() {
	    window.dataLayer = window.dataLayer || [];
	    window.dataLayer.push({
	        list_productidsall: currentVehicles
	    });
	
	    currentVehicles = [];
	}
	
	module.exports = {
	    add: add,
	    commit: commit
	};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var as24tracking = _extends(Object.create(HTMLElement.prototype), {
	    inDev: false,
	    supportedActions: ['set', 'click', 'pageview'],
	    supportedTypes: ['gtm', 'pagename'],
	    reservedWords: ['type', 'action', 'as24-tracking-value', 'as24-tracking-click-target'],
	
	    attachedCallback: function attachedCallback() {
	        var _this = this;
	
	        var values = this.getAdditionalProperties();
	        var type = this.getAttribute('type');
	        var action = this.getAttribute('action');
	        var args = [type, action];
	
	        if (Object.keys(values).length > 0) {
	            args.push(values);
	        }
	
	        if (type === 'pagename') {
	            args.splice(1, 1);
	        }
	
	        var clickTarget = this.getAttribute('as24-tracking-click-target');
	        if (clickTarget) {
	            var elements = document.querySelectorAll(clickTarget);
	
	            for (var i = 0; i < elements.length; i++) {
	                elements[i].addEventListener('click', function () {
	                    return _this.track(args);
	                });
	            }
	        } else {
	            this.track(args);
	        }
	    },
	    getAdditionalProperties: function getAdditionalProperties() {
	        var _this2 = this;
	
	        var trackingValue = this.getAttribute('as24-tracking-value');
	        var values = trackingValue ? JSON.parse(trackingValue) : {};
	
	        if (Array.isArray(values)) {
	            return values;
	        }
	
	        return Array.prototype.slice.call(this.attributes).filter(function (element) {
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
	            window.ut = window.ut || [];
	            window.ut.push(args);
	        }
	    }
	});
	
	try {
	    var ctor = document.createElement('as24-tracking').constructor;
	    if (ctor === HTMLElement || ctor === HTMLUnknownElement) {
	        document.registerElement('as24-tracking', {
	            prototype: as24tracking
	        });
	    }
	} catch (e) {
	    if (window && window.console) {
	        window.console.warn('Failed to register CustomElement "as24-tracking".', e);
	    }
	}

/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map