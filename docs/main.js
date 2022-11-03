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
	
	var startTracking = function startTracking() {
	    var gtm = __webpack_require__(2);
	    var dealerGtm = __webpack_require__(9);
	
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
	        }
	
	        if (data[0] === 'dealer-gtm') {
	            fn = dealerGtm[data[1]];
	            args = data.slice(2);
	            if (typeof fn === 'function') {
	                fn.apply(dealerGtm, args);
	            }
	        }
	
	        if (data[0] === 'cmp' && window.__tcfapi && data[1] === 'onPersonalizedCookiesAllowed' && typeof data[2] === 'function') {
	            var userCallback = data[2];
	
	            var callback = function callback(partialTcData, success) {
	                if (success && (partialTcData.eventStatus === 'tcloaded' || partialTcData.eventStatus === 'useractioncomplete')) {
	                    window.__tcfapi('getFullTCData', 2, function (tcData) {
	                        if (tcData.purpose.legitimateInterests['25'] && tcData.purpose.consents['26']) {
	                            userCallback();
	                        }
	                        window.__tcfapi('removeEventListener', 2, callback);
	                    });
	                }
	            };
	
	            window.__tcfapi('addEventListener', 2, callback);
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
	
	    __webpack_require__(10);
	
	    module.exports = {
	        gtm: gtm,
	        ut: ut
	    };
	};
	
	__webpack_require__(11);
	
	// if (window.location.hostname.split('.').pop() === 'de') {
	//     require('./ivw');
	// }
	
	if (window.location.hostname.split('.').pop() === 'at') {
	    __webpack_require__(12);
	}
	
	var run = function run() {
	    if (!trackingEnabled) {
	        console.log('Tracking disabled');
	        return;
	    }
	
	    startTracking();
	};
	
	run();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var extend = __webpack_require__(4);
	
	module.exports = function merge() {
	    var args = [].slice.call(arguments);
	    args.unshift({});
	    return extend.apply(this, args);
	};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

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

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	module.exports = function isObject(obj) {
	    var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
	    return !!obj && (type === 'function' || type === 'object');
	};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	'use strict';
	
	var dataLayer = window.dataLayer = window.dataLayer || [];
	var useNewArrayLogic = window.location.href.indexOf('tracking-arrays=true') >= 0;
	var domainsThatRequireConsent = ['at', 'fr', 'nl'];
	
	module.exports = {
	    loadContainer: function loadContainer(containerId) {
	        var gtmAlreadyLoadedClassName = 'gtm-main-container-load-initiated';
	        var alreadyInitiatedMainGtmContainerLoaded = document.documentElement.className.indexOf(gtmAlreadyLoadedClassName) >= 0;
	
	        if (alreadyInitiatedMainGtmContainerLoaded) {
	            // preventing duplicated load of main GTM container
	            return;
	        }
	
	        document.documentElement.className += ' ' + gtmAlreadyLoadedClassName;
	
	        var tld = window.location.hostname.split('.').pop();
	        if (domainsThatRequireConsent.includes(tld) && window.__tcfapi) {
	            var callback = function callback(tcData, success) {
	                if (success && (tcData.eventStatus === 'tcloaded' || tcData.eventStatus === 'useractioncomplete')) {
	                    window.__tcfapi('removeEventListener', 2, function () {}, tcData.listenerId);
	                    __tcfapi('getTCData', 2, function (tcData, success) {
	                        if (success && tcData.purpose.consents[1] && tcData.purpose.consents[2] && tcData.purpose.consents[3] && tcData.purpose.consents[4] && tcData.purpose.consents[5] && tcData.purpose.consents[6] && tcData.purpose.consents[7] && tcData.purpose.consents[8] && tcData.purpose.consents[9] && tcData.purpose.consents[10]) {
	                            loadContainer();
	                        }
	                    });
	                }
	            };
	            window.__tcfapi('addEventListener', 2, callback);
	        } else {
	            loadContainer();
	        }
	
	        function loadContainer() {
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
	        }
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
/* 7 */
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
	
	var isIdentityPage = function isIdentityPage(hostname) {
	    return hostname === "accounts.autoscout24.com";
	};
	
	var extractTldFromRedirectUrl = function extractTldFromRedirectUrl(url) {
	    // search for ui_locales=xx in URL
	    var regexp = new RegExp(/ui_locales=([a-z]+)/g);
	    var matches = window.location.href.match(regexp);
	    var tld = 'com';
	
	    if (matches) {
	        var match = matches.join(''); // i.e. ui_locales=de
	        tld = match.split('=')[1];
	    }
	
	    return tld;
	};
	
	module.exports = function (hostname) {
	    var tld = isIdentityPage(hostname) ? extractTldFromRedirectUrl(window.location.href) : hostname.split('.').pop();
	    return containerIdsByTld[tld] || containerIdsByTld['com'];
	};

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	'use strict';
	
	var viewportWidth = Math.min(document.documentElement.clientWidth, window.innerWidth || screen.width);
	
	module.exports = {
	    session_viewport: viewportWidth >= 994 ? 'l' : viewportWidth >= 768 ? 'm' : viewportWidth >= 480 ? 's' : 'xs'
	};

/***/ }),
/* 9 */
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
/* 10 */
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

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	'use strict';
	
	// TODO: this is an experimental feature.
	// If this works well, we have to document it.
	
	window.addEventListener('click', function (e) {
	    window.dataLayer = window.dataLayer || [];
	
	    var node = e.target;
	
	    do {
	        var rawValue = node.getAttribute('data-click-datalayer-push');
	        if (rawValue) {
	            try {
	                // TODO: Check if we can use something like `eval` but more secure to allow JS style objects
	                // aka. objects without quotes around key names or some computation inside
	                // e.g. { event: "event_trigger", event_category: "category", event_action: "action" }
	                // Don't use `eval` or `new Function(...)` directly because they execute anything => XSS attack
	
	                var value = JSON.parse(rawValue);
	                window.dataLayer.push(value);
	            } catch (e) {
	                console.error('Cannot parse tracking value', rawValue, node);
	            }
	        }
	        node = node.parentNode;
	    } while (node && node.getAttribute);
	});

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	'use strict';
	
	var path = window.location.pathname;
	var pixelPath = function () {
	    switch (true) {
	        case RegExp('^\/$').test(path):
	            return 'Service/Homepage/Homepage';
	            break;
	        case RegExp('(^\/promo\/preisbewertung)|(^\/auto\-verkaufen)|(^\/fahrzeugbewertung)|(^\/promo\/preisbewertung)').test(path):
	            return 'Service/Sonstiges/Sonstiges';
	            break;
	        case RegExp('(^\/motorrad)|(^\/lst)').test(path):
	            return 'Service/Rubrikenmaerkte/Automarkt';
	            break;
	        case RegExp('(^\/informieren)|(^\/auto)|(^\/moto)').test(path):
	            return 'RedCont/AutoUndMotor/AutoUndMotor';
	            break;
	        case RegExp('^\/unternehmen').test(path):
	            return 'Service/Unternehmenskommunikation/Unternehmenskommunikation';
	            break;
	        default:
	            return 'not_available';
	            break;
	    }
	}();
	
	function detailPage() {
	    loadScript('https://script-at.iocnt.net/iam.js').then(function () {
	        if (window.iom) {
	            // OEWA VERSION="3.0" 
	            window.oewa_data = {
	                cn: 'at', // country 
	                st: 'at_w_atascout24', // sitename 
	                cp: 'Service/Rubrikenmaerkte/Automarkt', // kategorienpfad  
	                sv: 'mo', // die Befragungseinladung wird im mobilen Format ausgespielt 
	                ps: 'lin' // Privacy setting 
	            };
	            iom.c(window.oewa_data, 1);
	        }
	    });
	}
	
	function allPages() {
	    loadScript('https://script-at.iocnt.net/iam.js').then(function () {
	        if (window.iom) {
	            // OEWA VERSION="3.0" 
	            window.oewa_data = {
	                cn: 'at', // country 
	                st: 'at_w_atascout24', // sitename 
	                cp: pixelPath, // kategorienpfad 
	                sv: 'mo', // die Befragungseinladung wird im mobilen Format ausgespielt 
	                ps: 'lin' // Privacy setting 
	            };
	            iom.c(window.oewa_data, 1);
	        }
	    });
	}
	
	function loadScript(src) {
	    return new Promise(function (resolve) {
	        var script = document.createElement('script');
	        var ref = document.getElementsByTagName('script')[0];
	        ref.parentNode.insertBefore(script, ref);
	        script.onload = resolve;
	        script.src = src;
	    });
	}
	
	var onDetailPage = path.startsWith('/angebote') && document.querySelector('as24-tracking[type=pagename]').getAttribute('pageid') === 'detail';
	
	if (onDetailPage) {
	    detailPage();
	
	    try {
	        document.querySelector('as24-carousel').addEventListener('as24-carousel.slide', function (e) {
	            return detailPage();
	        });
	    } catch (e) {}
	} else {
	    if (pixelPath !== 'not_available') {
	        allPages();
	    }
	}

/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map