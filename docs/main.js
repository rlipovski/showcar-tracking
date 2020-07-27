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
	    var dealerGtm = __webpack_require__(11);
	
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
	
	    __webpack_require__(12);
	
	    module.exports = {
	        gtm: gtm,
	        ut: ut
	    };
	};
	
	if (window.location.hostname.split('.').pop() === 'de') {
	    __webpack_require__(13);
	}
	
	var cmp = __webpack_require__(7);
	
	var run = function run() {
	    if (!trackingEnabled) {
	        console.log('Tracking disabled');
	        return;
	    }
	
	    if (!cmp.isCmpEnabled()) {
	        window.dataLayer = window.dataLayer || [];
	        window.dataLayer.push({ cmp_enabled: false });
	        startTracking();
	        return;
	    }
	
	    window.dataLayer = window.dataLayer || [];
	    window.dataLayer.push({ cmp_enabled: true });
	
	    // We load the CMP and do some magic here
	    cmp.loadCmpAsync();
	
	    // window.__cmp('addEventListener', 'cmpReady', () => {
	    // When consent changes we update dataLayer and localStorage.__as24_cached_cmp_consent
	    cmp.updateDataLayerAndCacheOnConsentChange();
	
	    cmp.sendMetricsOnEvents();
	
	    // !!! We don't load GTM in NL without consent !!!
	    if (cmp.isCmpEnabled() && window.location.hostname.split('.').pop() === 'nl') {
	        cmp.waitForConsentAgreementIfNeeded().then(function (hasGivenConsent) {
	            if (hasGivenConsent) {
	                startTracking();
	            }
	        });
	    } else {
	        cmp.waitForConsentIfNeeded().then(function () {
	            return startTracking();
	        });
	    }
	
	    // if (cmp.trySetDataLayerVariablesFromCache()) {
	    //     // We have consent data in cache so we can proceed loading GTM
	    //     startTracking();
	    // } else {
	    //     // We don't have previous consent in cache therefore we are waiting for getting one
	    //     // This is to avoid losing important conversion tracking events: Google Ads, Facebook
	    //     // which are fired directly in the pageview
	    //     cmp.waitForFirstCmpDecision().then(() => {
	    //         startTracking();
	    //     });
	    // }
	};
	
	run();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var merge = __webpack_require__(3);
	
	var gtm = __webpack_require__(6);
	var containerId = __webpack_require__(9)(location.hostname);
	var viewport = __webpack_require__(10);
	
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
	            // !!! We don't load GTM in NL without consent !!!
	            if (window.cmpEnabled && window.location.hostname.split('.').pop() === 'nl') {
	                gtm.loadContainerOnlyWidthConsent(containerId);
	            } else {
	                gtm.loadContainer(containerId);
	            }
	
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
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var cmp = __webpack_require__(7);
	
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
	
	    loadContainerOnlyWidthConsent: function loadContainerOnlyWidthConsent(containerId) {
	        var _this = this;
	
	        cmp.waitForConsentAgreementIfNeeded().then(function (hasGivenConsent) {
	            if (hasGivenConsent) {
	                _this.loadContainer(containerId);
	            }
	        });
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
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _require = __webpack_require__(8),
	    once = _require.once;
	
	var consentCacheKey = '__cmp_consent_cache';
	var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|mobil/i.test(navigator.userAgent);
	
	var optimizelyEnabled = window.location.href.indexOf('__cmp-optimizely') >= 0;
	
	var cmpSiteIds = {
	    at: 'c8515c6b-cf35-47d8-8078-15cc075b3207',
	    be: 'a9a510e9-b6b9-4499-99f6-131880e92aaa',
	    de: '769b8c9a-14d7-4f0f-bc59-2748c96ec403',
	    es: '052e7f91-7b7c-432a-bb9e-d99911139da7',
	    fr: 'f6a34410-a99a-4e8d-836c-f19620914569',
	    it: '7dc55efc-b43a-4ab6-a31b-d084591ee853',
	    lu: '3f009a85-9789-4acc-a4a3-a6c45994c3ca',
	    nl: '11590dc9-3700-43b4-aacd-731ef5261fdf'
	};
	
	module.exports.loadCmpAsync = once(function () {
	    var script = document.createElement('script');
	    var ref = document.getElementsByTagName('script')[0];
	    ref.parentNode.insertBefore(script, ref);
	
	    try {
	        if (optimizelyEnabled && !localStorage.getItem('__as24_cmp_userid')) {
	            // delete decision cookies when user gets into an experiment where they haven't been before
	
	            deleteCookie('769b8c9a-14d7-4f0f-bc59-2748c96ec403faktorId');
	            deleteCookie('769b8c9a-14d7-4f0f-bc59-2748c96ec403faktorChecksum');
	            deleteCookie('769b8c9a-14d7-4f0f-bc59-2748c96ec403cconsent');
	            deleteCookie('769b8c9a-14d7-4f0f-bc59-2748c96ec403euconsent');
	
	            deleteCookie('ea93c094-1e43-49f8-8c62-75128f08f70bfaktorChecksum');
	            deleteCookie('ea93c094-1e43-49f8-8c62-75128f08f70beuconsent');
	            deleteCookie('ea93c094-1e43-49f8-8c62-75128f08f70bcconsent');
	            deleteCookie('ea93c094-1e43-49f8-8c62-75128f08f70bfaktorId');
	
	            deleteCookie('lastConsentChange');
	        }
	
	        getCmpVariationData().then(function (_ref) {
	            var userid = _ref.userid,
	                variation = _ref.variation;
	
	            window.__as24_cmp_userid = userid;
	            window.__as24_cmp_variation = variation;
	
	            loadCmp(variation);
	
	            if (variation) {
	                localStorage.setItem('__as24_cmp_userid', userid);
	                localStorage.setItem('__as24_cmp_variation', variation);
	
	                window.__as24_cmp_opt_sendevent = function (event) {
	                    var url = 'https://cmp-optimizely-fs.as24-media.eu-west-1.infinity.as24.tech/sendevent/' + userid + '/' + event;
	
	                    if ('sendBeacon' in navigator) {
	                        navigator.sendBeacon(url);
	                    } else {
	                        new Image().src = 'https://cmp-optimizely-fs.as24-media.eu-west-1.infinity.as24.tech/sendevent/' + userid + '/' + event;
	                    }
	                };
	            }
	        });
	
	        console.log(window.__as24_cmp_userid, window.__as24_cmp_variation);
	    } catch (ex) {
	        //
	    }
	
	    function getCmpVariationData() {
	        if (!optimizelyEnabled) {
	            return Promise.resolve({ variation: null, userid: '' });
	        }
	
	        if (localStorage.getItem('__as24_cmp_userid') && localStorage.getItem('__as24_cmp_variation')) {
	            return Promise.resolve({
	                variation: localStorage.getItem('__as24_cmp_variation'),
	                userid: localStorage.getItem('__as24_cmp_userid')
	            });
	        }
	
	        var userid = uuidv4();
	
	        return fetch('https://cmp-optimizely-fs.as24-media.eu-west-1.infinity.as24.tech/activate/cmp_classic_vs__nextgen/' + userid).then(function (r) {
	            return r.json();
	        });
	    }
	
	    function loadCmp(variation) {
	        var tld = window.location.hostname.split('.').pop();
	        if (tld === 'de') {
	            if (variation === 'classic') {
	                script.src = 'https://config-prod.choice.faktor.io/769b8c9a-14d7-4f0f-bc59-2748c96ec403/faktor.js';
	            } else {
	                script.src = 'https://config-prod.choice.faktor.io/ea93c094-1e43-49f8-8c62-75128f08f70b/faktor.js';
	            }
	        } else {
	            var cmpSiteId = cmpSiteIds[tld] || cmpSiteIds['de'];
	            script.src = 'https://config-prod.choice.faktor.io/' + cmpSiteId + '/faktor.js';
	        }
	    }
	
	    function waitForIframe(cb) {
	        var ifr = document.querySelector('iframe#cmp-faktor-io-brand-consent-notice');
	        // const ifr = document.querySelector('div#cmp-faktor-io-parent');
	        if (ifr) {
	            cb(ifr);
	            return;
	        }
	
	        setTimeout(function () {
	            waitForIframe(cb);
	        }, 50);
	    }
	
	    function isOnPrivacyInfoPage() {
	        return window.location.href.indexOf('__cmp_privacy') >= 0 || document.querySelector('as24-tracking[pageid="au-company-privacy"]');
	    }
	
	    // if (isMobile) {
	    window.__cmp('addEventListener', 'consentToolShouldBeShown', function () {
	        if (isOnPrivacyInfoPage()) {
	            window.__cmp('showConsentTool', false);
	        } else {
	            waitForIframe(function (ifr) {
	                ifr.parentNode.style = 'width: 100%; heigh: 100%; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 1000; background-color: rgba(0, 0, 0, 0.35);';
	            });
	        }
	    });
	    // }
	
	    // window.__cmp('addEventListener', 'consentToolShouldBeShown', () => {
	    //     waitForIframe((ifr) => {
	    //         console.log(ifr);
	    //         ifr.parentNode.style = 'position: relative';
	    //         // 'width: 100%; heigh: 100%; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 1000; background-color: rgba(0, 0, 0, 0.35);';
	    //     });
	    // });
	
	    sendMetrics('cmp_pageview');
	
	    try {
	        var userMadeDecision = !!localStorage[consentCacheKey];
	        if (!userMadeDecision) {
	            sendMetrics('cmp_pageview_without_decision');
	        }
	    } catch (ex) {
	        //
	    }
	});
	
	module.exports.isCmpEnabled = function () {
	    return window.cmpEnabled;
	};
	
	module.exports.waitForConsentIfNeeded = function () {
	    return new Promise(function (resolve) {
	        if (trySetDataLayerVariablesFromCache()) {
	            resolve();
	            return;
	        }
	
	        var handler = function handler(e) {
	            window.__cmp('consentDataExist', null, function (d) {
	                if (d === true) {
	                    window.__cmp('removeEventListener', 'consentChanged', handler);
	                    resolve();
	                }
	            });
	        };
	
	        window.__cmp('addEventListener', 'consentChanged', handler);
	    });
	};
	
	function hasGivenConsent(vendorConsents) {
	    var hasGivenConsent = !!(vendorConsents.purposeConsents[1] && vendorConsents.purposeConsents[2] && vendorConsents.purposeConsents[3] && vendorConsents.purposeConsents[4] && vendorConsents.purposeConsents[5]);
	    return hasGivenConsent;
	}
	
	function hasGivenConsentGtm(vendorConsents, additionalVendorConsents) {
	    var hasGivenConsent = !!(vendorConsents.purposeConsents[1] && vendorConsents.purposeConsents[2] && vendorConsents.purposeConsents[3] && vendorConsents.purposeConsents[4] && vendorConsents.purposeConsents[5] && additionalVendorConsents.vendorConsents[6]);
	    console.log('Has agreed to GTM ' + additionalVendorConsents.vendorConsents[6]);
	    return hasGivenConsent;
	}
	
	module.exports.waitForConsentAgreementIfNeeded = function () {
	    if (window.location.href.indexOf('__cmp_gtm_check') > -1) {
	        return new Promise(function (resolve) {
	            window.__cmp('consentDataExist', null, function (consentDataExists) {
	                if (consentDataExists === true) {
	                    window.__cmp('getVendorConsents', undefined, function (vendorData) {
	                        window.__cmp('getAdditionalVendorConsents', undefined, function (additionalVendorConsents) {
	                            window.__cmp('removeEventListener', 'consentChanged', handler);
	                            resolve(hasGivenConsentGtm(vendorData, additionalVendorConsents));
	                        });
	                    });
	                }
	            });
	
	            var handler = function handler(e) {
	                window.__cmp('getVendorConsents', undefined, function (vendorData) {
	                    window.__cmp('getAdditionalVendorConsents', undefined, function (additionalVendorConsents) {
	                        window.__cmp('removeEventListener', 'consentChanged', handler);
	                        resolve(hasGivenConsentGtm(vendorData, additionalVendorConsents));
	                    });
	                });
	            };
	            window.__cmp('addEventListener', 'consentWallClosed', handler);
	            window.__cmp('addEventListener', 'consentManagerClosed', handler);
	        });
	    } else {
	        return new Promise(function (resolve) {
	            window.__cmp('consentDataExist', null, function (consentDataExists) {
	                if (consentDataExists === true) {
	                    window.__cmp('getVendorConsents', undefined, function (vendorData) {
	                        window.__cmp('removeEventListener', 'consentChanged', handler);
	                        resolve(hasGivenConsent(vendorData));
	                    });
	                }
	            });
	
	            var handler = function handler(e) {
	                window.__cmp('getVendorConsents', undefined, function (vendorData) {
	                    window.__cmp('removeEventListener', 'consentChanged', handler);
	                    resolve(hasGivenConsent(vendorData));
	                });
	            };
	            window.__cmp('addEventListener', 'consentChanged', handler);
	        });
	    }
	};
	
	module.exports.waitForFirstCmpDecision = function () {
	    return new Promise(function (resolve) {
	        var handler = function handler(e) {
	            window.__cmp('consentDataExist', null, function (d) {
	                if (d === true) {
	                    window.__cmp('removeEventListener', 'consentChanged', handler);
	                    resolve();
	                }
	            });
	        };
	
	        window.__cmp('addEventListener', 'consentChanged', handler);
	    });
	};
	
	function getAllConsents() {
	    return Promise.all([new Promise(function (resolve) {
	        return window.__cmp('getVendorConsents', null, resolve);
	    }), new Promise(function (resolve) {
	        return window.__cmp('getAdditionalVendorConsents', null, resolve);
	    })]);
	}
	
	module.exports.updateDataLayerAndCacheOnConsentChange = function () {
	    window.__cmp('addEventListener', 'consentChanged', function (e) {
	        getAllConsents().then(function (_ref2) {
	            var _ref3 = _slicedToArray(_ref2, 2),
	                vendorConsents = _ref3[0],
	                additionalVendorConsents = _ref3[1];
	
	            setDataLayerConsents(vendorConsents, additionalVendorConsents);
	            localStorage.setItem(consentCacheKey, JSON.stringify({ vendorConsents: vendorConsents, additionalVendorConsents: additionalVendorConsents }));
	        });
	    });
	
	    // For safety we update the cache and the dataLayer every time when the cmp loads
	    cmpReady().then(function () {
	        consentDataExists().then(function (exists) {
	            if (exists) {
	                getAllConsents().then(function (_ref4) {
	                    var _ref5 = _slicedToArray(_ref4, 2),
	                        vendorConsents = _ref5[0],
	                        additionalVendorConsents = _ref5[1];
	
	                    setDataLayerConsents(vendorConsents, additionalVendorConsents);
	                    localStorage.setItem(consentCacheKey, JSON.stringify({ vendorConsents: vendorConsents, additionalVendorConsents: additionalVendorConsents }));
	                });
	            }
	        });
	    });
	};
	
	module.exports.trySetDataLayerVariablesFromCache = function () {
	    try {
	        var cache = JSON.parse(localStorage.getItem(consentCacheKey));
	        setDataLayerConsents(cache.vendorConsents, cache.additionalVendorConsents);
	        return true;
	    } catch (e) {
	        return false;
	    }
	};
	
	function trySetDataLayerVariablesFromCache() {
	    if (!/faktorid/i.test(document.cookie)) {
	        // We do not use cached data if faktor cookies are missing
	        // (e.g. cookies were deleted by a extension which keeps localStorage)
	        return false;
	    }
	
	    try {
	        var cache = JSON.parse(localStorage.getItem(consentCacheKey));
	        setDataLayerConsents(cache.vendorConsents, cache.additionalVendorConsents);
	        return true;
	    } catch (e) {
	        return false;
	    }
	}
	
	function cmpReady() {
	    return new Promise(function (resolve) {
	        var handler = function handler(e) {
	            window.__cmp('removeEventListener', 'cmpReady', handler);
	            resolve(e);
	        };
	
	        window.__cmp('addEventListener', 'cmpReady', handler);
	    });
	}
	
	function consentDataExists() {
	    return new Promise(function (resolve) {
	        window.__cmp('consentDataExist', null, function (x) {
	            resolve(x);
	        });
	    });
	}
	
	module.exports.sendMetricsOnEvents = function () {
	    var events = ['faktorIdChanged', 'acceptAllButtonClicked', 'rejectAllButtonClicked', 'exitButtonClicked', 'privacySettingsButtonClicked', 'disabledCookies', 'consentManagerDisplayed', 'consentManagerClosed',
	    // 'consentWallDisplayed',
	    'consentWallClosed', 'consentToolShouldBeShown', 'cmpReady', 'brandConsentNoticeDisplayed'];
	
	    events.forEach(function (event) {
	        return window.__cmp('addEventListener', event, function () {
	            return sendMetrics(event);
	        });
	    });
	
	    window.__cmp('addEventListener', 'acceptAllButtonClicked', function () {
	        window.__as24_cmp_opt_sendevent && window.__as24_cmp_opt_sendevent('cmpAcceptAll');
	    });
	
	    window.__cmp('addEventListener', 'rejectAllButtonClicked', function () {
	        window.__as24_cmp_opt_sendevent && window.__as24_cmp_opt_sendevent('cmpRejectAll');
	    });
	
	    window.__cmp('addEventListener', 'exitButtonClicked', function () {
	        window.__as24_cmp_opt_sendevent && window.__as24_cmp_opt_sendevent('cmpExit');
	    });
	
	    window.__cmp('addEventListener', 'consentToolShouldBeShown', function () {
	        window.__as24_cmp_opt_sendevent && window.__as24_cmp_opt_sendevent('cmpShown');
	
	        var interaction = false;
	        var interactionEvents = ['acceptAllButtonClicked', 'rejectAllButtonClicked', 'exitButtonClicked', 'privacySettingsButtonClicked'];
	
	        interactionEvents.forEach(function (event) {
	            return window.__cmp('addEventListener', event, function () {
	                return interaction = true;
	            });
	        });
	
	        window.addEventListener('unload', function () {
	            if (!interaction) {
	                // track if user navigates to a new AS24 page without interacting with the page
	                window.__as24_cmp_opt_sendevent && window.__as24_cmp_opt_sendevent('cmpNavigationWithoutInteraction');
	            }
	        });
	    });
	};
	
	function setDataLayerConsents(vendorConsents, additionalVendorConsents) {
	    var facebookConsent = vendorConsents && vendorConsents.purposeConsents[1] && vendorConsents.purposeConsents[2] && vendorConsents.purposeConsents[3] && vendorConsents.purposeConsents[5] && additionalVendorConsents.vendorConsents[16];
	
	    var googleAnalyticsConsent = vendorConsents && vendorConsents.purposeConsents[1] && vendorConsents.purposeConsents[5] && additionalVendorConsents.vendorConsents[4];
	
	    var googleAdsConsent = vendorConsents && vendorConsents.purposeConsents[1] && vendorConsents.purposeConsents[2] && vendorConsents.purposeConsents[3] && vendorConsents.purposeConsents[5] && additionalVendorConsents.vendorConsents[91];
	
	    var bingConsent = vendorConsents && vendorConsents.purposeConsents[1] && vendorConsents.purposeConsents[2] && vendorConsents.purposeConsents[3] && vendorConsents.purposeConsents[4] && vendorConsents.purposeConsents[5] && additionalVendorConsents.vendorConsents[21];
	
	    var mouseFlowConsent = vendorConsents && vendorConsents.purposeConsents[1] && vendorConsents.purposeConsents[5] && additionalVendorConsents.vendorConsents[223];
	
	    var kruxConsent = vendorConsents && vendorConsents.purposeConsents[1] && vendorConsents.purposeConsents[2] && vendorConsents.purposeConsents[3] && vendorConsents.purposeConsents[4] && vendorConsents.purposeConsents[5] && additionalVendorConsents.vendorConsents[25];
	
	    var criteoConsent = vendorConsents && vendorConsents.purposeConsents[1] && vendorConsents.purposeConsents[2] && vendorConsents.vendorConsents[91];
	
	    var rtbConsent = vendorConsents && vendorConsents.purposeConsents[1] && vendorConsents.purposeConsents[2] && vendorConsents.vendorConsents[16];
	
	    window.dataLayer = window.dataLayer || [];
	    window.dataLayer.push({
	        cmp_facebook_consent: facebookConsent,
	        cmp_googleAnalytics_consent: googleAnalyticsConsent,
	        cmp_googleAds_consent: googleAdsConsent,
	        cmp_bing_consent: bingConsent,
	        cmp_mouseFlow_consent: mouseFlowConsent,
	        cmp_krux_consent: kruxConsent,
	        cmp_criteo_consent: criteoConsent,
	        cmp_rtb_consent: rtbConsent
	    });
	}
	
	function sendMetrics(name) {
	    var isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
	    if (isBot) {
	        return;
	    }
	
	    fetch('/frontend-metrics/timeseries', {
	        method: 'POST',
	        headers: {
	            Accept: 'application/json',
	            'Content-Type': 'application/json'
	        },
	        body: JSON.stringify({
	            metrics: [{
	                type: 'increment',
	                name: 'showcar-tracking-cmp-' + name,
	                value: 1,
	                tags: {
	                    service: 'showcar-tracking',
	                    device: isMobile ? 'mobile' : 'desktop'
	                }
	            }]
	        })
	    });
	}
	
	function uuidv4() {
	    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	        var r = Math.random() * 16 | 0,
	            v = c == 'x' ? r : r & 0x3 | 0x8;
	        return v.toString(16);
	    });
	}
	
	var getcid = function getcid() {
	    var cid = localStorage.getItem('__cmp_experiment_cid') || uuidv4();
	    localStorage.setItem('__cmp_experiment_cid', cid);
	    return cid;
	};
	
	var serialize = function serialize(obj) {
	    return Object.keys(obj).map(function (key) {
	        return key + '=' + encodeURIComponent(obj[key]);
	    }).join('&');
	};
	
	function deleteCookie(name) {
	    var domain = location.hostname.replace('www.', '.').replace('local.', '.');
	    document.cookie = name + '=; path=/; domain=' + domain + '; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	}

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	"use strict";
	
	module.exports.once = function (fn) {
	    var executed = false;
	    return function () {
	        if (!executed) {
	            executed = true;
	            fn();
	        }
	    };
	};

/***/ }),
/* 9 */
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
/* 10 */
/***/ (function(module, exports) {

	'use strict';
	
	var viewportWidth = Math.min(document.documentElement.clientWidth, window.innerWidth || screen.width);
	
	module.exports = {
	    session_viewport: viewportWidth >= 994 ? 'l' : viewportWidth >= 768 ? 'm' : viewportWidth >= 480 ? 's' : 'xs'
	};

/***/ }),
/* 11 */
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
/* 12 */
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
/* 13 */
/***/ (function(module, exports) {

	'use strict';
	
	var isMobile = window.innerWidth < 789;
	
	var market = function () {
	    try {
	        return document.querySelector('as24-tracking[type=pagename]').getAttribute('market');
	    } catch (e) {
	        return 'vm';
	    }
	}();
	
	var category = function () {
	    try {
	        return document.querySelector('as24-tracking[type=pagename]').getAttribute('category');
	    } catch (e) {
	        return 'uc';
	    }
	}();
	
	function pageview() {
	    loadScript('https://script.ioam.de/iam.js').then(function () {
	        window.iam_data = {
	            st: isMobile ? 'mobaus24' : 'aus24',
	            cp: ('as24/de/' + market + '/' + category).toLowerCase(),
	            sv: isMobile ? 'mo' : 'i2',
	            co: ''
	        };
	
	        iom.c(window.iam_data, 1);
	    });
	}
	
	function home() {
	    loadScript('https://script.ioam.de/iam.js').then(function () {
	        window.iam_data = {
	            st: isMobile ? 'mobaus24' : 'aus24',
	            cp: ('as24/de/' + market + '/home').toLowerCase(),
	            sv: 'ke',
	            co: ''
	        };
	
	        iom.c(window.iam_data, 1);
	    });
	}
	
	function detailGallery() {
	    loadScript('https://script.ioam.de/iam.js').then(function () {
	        window.iam_data = {
	            st: isMobile ? 'mobaus24' : 'aus24',
	            cp: ('as24/de/' + market + '/' + category).toLowerCase(),
	            sv: isMobile ? 'mo' : 'i2',
	            co: ''
	        };
	
	        iom.c(window.iam_data, 1);
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
	
	document.addEventListener('list-items:changed', function (e) {
	    return pageview();
	});
	
	if (window.location.pathname.startsWith('/angebote')) {
	    try {
	        document.querySelector('as24-carousel').addEventListener('as24-carousel.slide', function (e) {
	            return detailGallery();
	        });
	    } catch (e) {}
	}
	
	var onHomepage = window.location.pathname === '/' || window.location.pathname === '/motorrad';
	
	if (onHomepage) {
	    home();
	} else {
	    pageview();
	}

/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map