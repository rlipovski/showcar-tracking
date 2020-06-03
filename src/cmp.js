const { once } = require('./util');

const consentCacheKey = '__cmp_consent_cache';
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|mobil/i.test(navigator.userAgent);

module.exports.loadCmpStubSync = () => {
    // require('./liveramp-stub');
};

module.exports.loadCmpAsync = once(() => {
    const script = document.createElement('script');
    const ref = document.getElementsByTagName('script')[0];
    ref.parentNode.insertBefore(script, ref);
    script.src = 'https://config-prod.choice.faktor.io/ea93c094-1e43-49f8-8c62-75128f08f70b/faktor.js';

    try {
        var pv = parseInt(localStorage.getItem('as24_cmp_pageview') || '0', 10);
        localStorage.setItem('as24_cmp_pageview', pv + 1);
    } catch (ex) {
        //
    }

    function waitForIframe(cb) {
        const ifr = document.querySelector('iframe#cmp-faktor-io-brand-consent-notice');
        // const ifr = document.querySelector('div#cmp-faktor-io-parent');
        if (ifr) {
            cb(ifr);
            return;
        }

        setTimeout(() => {
            waitForIframe(cb);
        }, 50);
    }

    if (isMobile) {
        window.__cmp('addEventListener', 'consentToolShouldBeShown', () => {
            waitForIframe((ifr) => {
                ifr.parentNode.style =
                    'width: 100%; heigh: 100%; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 1000; background-color: rgba(0, 0, 0, 0.35);';
            });
        });
    }
    // window.__cmp('addEventListener', 'consentToolShouldBeShown', () => {
    //     waitForIframe((ifr) => {
    //         console.log(ifr);
    //         ifr.parentNode.style = 'position: relative';
    //         // 'width: 100%; heigh: 100%; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 1000; background-color: rgba(0, 0, 0, 0.35);';
    //     });
    // });

    sendMetrics('cmp_pageview');
    // sendGAEvent('pageview');
    sendGAPageview();

    try {
        const userMadeDecision = !!localStorage[consentCacheKey];
        if (!userMadeDecision) {
            sendMetrics('cmp_pageview_without_decision');
            sendGAEvent('pageview_without_decision');
        }
    } catch (ex) {
        //
    }
});

module.exports.isCmpEnabled = () => {
    return window.cmpEnabled;
};

module.exports.waitForConsentIfNeeded = () => {
    return new Promise((resolve) => {
        if (trySetDataLayerVariablesFromCache()) {
            resolve();
            return;
        }

        const handler = (e) => {
            window.__cmp('consentDataExist', null, (d) => {
                if (d === true) {
                    window.__cmp('removeEventListener', 'consentChanged', handler);
                    resolve();
                }
            });
        };

        window.__cmp('addEventListener', 'consentChanged', handler);
    });
};

module.exports.waitForFirstCmpDecision = () => {
    return new Promise((resolve) => {
        const handler = (e) => {
            window.__cmp('consentDataExist', null, (d) => {
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
    return Promise.all([
        new Promise((resolve) => window.__cmp('getVendorConsents', null, resolve)),
        new Promise((resolve) => window.__cmp('getAdditionalVendorConsents', null, resolve)),
    ]);
}

module.exports.updateDataLayerAndCacheOnConsentChange = () => {
    window.__cmp('addEventListener', 'consentChanged', (e) => {
        getAllConsents().then(([vendorConsents, additionalVendorConsents]) => {
            setDataLayerConsents(vendorConsents, additionalVendorConsents);
            localStorage.setItem(consentCacheKey, JSON.stringify({ vendorConsents, additionalVendorConsents }));
        });
    });

    // For safety we update the cache and the dataLayer every time when the cmp loads
    cmpReady().then(() => {
        consentDataExists().then((exists) => {
            if (exists) {
                getAllConsents().then(([vendorConsents, additionalVendorConsents]) => {
                    setDataLayerConsents(vendorConsents, additionalVendorConsents);
                    localStorage.setItem(consentCacheKey, JSON.stringify({ vendorConsents, additionalVendorConsents }));
                });
            }
        });
    });
};

module.exports.trySetDataLayerVariablesFromCache = () => {
    try {
        const cache = JSON.parse(localStorage.getItem(consentCacheKey));
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
        const cache = JSON.parse(localStorage.getItem(consentCacheKey));
        setDataLayerConsents(cache.vendorConsents, cache.additionalVendorConsents);
        return true;
    } catch (e) {
        return false;
    }
}

function cmpReady() {
    return new Promise((resolve) => {
        const handler = (e) => {
            window.__cmp('removeEventListener', 'cmpReady', handler);
            resolve(e);
        };

        window.__cmp('addEventListener', 'cmpReady', handler);
    });
}

function consentDataExists() {
    return new Promise((resolve) => {
        window.__cmp('consentDataExist', null, (x) => {
            resolve(x);
        });
    });
}

module.exports.sendMetricsOnEvents = () => {
    const events = [
        'faktorIdChanged',
        'acceptAllButtonClicked',
        'rejectAllButtonClicked',
        'exitButtonClicked',
        'privacySettingsButtonClicked',
        'disabledCookies',
        'consentManagerDisplayed',
        'consentManagerClosed',
        // 'consentWallDisplayed',
        'consentWallClosed',
        'consentToolShouldBeShown',
        'cmpReady',
        'brandConsentNoticeDisplayed',
    ];

    events.forEach((event) => window.__cmp('addEventListener', event, () => sendMetrics(event)));
    events.forEach((event) => window.__cmp('addEventListener', event, () => sendGAEvent(event)));
};

function setDataLayerConsents(vendorConsents, additionalVendorConsents) {
    const facebookConsent =
        vendorConsents &&
        vendorConsents.purposeConsents[1] &&
        vendorConsents.purposeConsents[2] &&
        vendorConsents.purposeConsents[3] &&
        vendorConsents.purposeConsents[5] &&
        additionalVendorConsents.vendorConsents[16];

    const googleAnalyticsConsent =
        vendorConsents &&
        vendorConsents.purposeConsents[1] &&
        vendorConsents.purposeConsents[5] &&
        additionalVendorConsents.vendorConsents[4];

    const googleAdsConsent =
        vendorConsents &&
        vendorConsents.purposeConsents[1] &&
        vendorConsents.purposeConsents[2] &&
        vendorConsents.purposeConsents[3] &&
        vendorConsents.purposeConsents[5] &&
        additionalVendorConsents.vendorConsents[91];

    const bingConsent =
        vendorConsents &&
        vendorConsents.purposeConsents[1] &&
        vendorConsents.purposeConsents[2] &&
        vendorConsents.purposeConsents[3] &&
        vendorConsents.purposeConsents[4] &&
        vendorConsents.purposeConsents[5] &&
        additionalVendorConsents.vendorConsents[21];

    const mouseFlowConsent =
        vendorConsents &&
        vendorConsents.purposeConsents[1] &&
        vendorConsents.purposeConsents[5] &&
        additionalVendorConsents.vendorConsents[223];

    const kruxConsent =
        vendorConsents &&
        vendorConsents.purposeConsents[1] &&
        vendorConsents.purposeConsents[2] &&
        vendorConsents.purposeConsents[3] &&
        vendorConsents.purposeConsents[4] &&
        vendorConsents.purposeConsents[5] &&
        additionalVendorConsents.vendorConsents[25];

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        cmp_facebook_consent: facebookConsent,
        cmp_googleAnalytics_consent: googleAnalyticsConsent,
        cmp_googleAds_consent: googleAdsConsent,
        cmp_bing_consent: bingConsent,
        cmp_mouseFlow_consent: mouseFlowConsent,
        cmp_krux_consent: kruxConsent,
    });
}

function sendMetrics(name) {
    var pv = parseInt(localStorage.getItem('as24_cmp_pageview'), 10);

    fetch('/frontend-metrics/timeseries', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            metrics: [
                {
                    type: 'increment',
                    name: 'showcar-tracking-cmp-' + name,
                    value: 1,
                    tags: {
                        service: 'showcar-tracking',
                        device: isMobile ? 'mobile' : 'desktop',
                        pageview: pv > 5 ? 5 : pv,
                    },
                },
            ],
        }),
    });
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

const getcid = () => {
    const cid = localStorage.getItem('__cmp_experiment_cid') || uuidv4();
    localStorage.setItem('__cmp_experiment_cid', cid);
    return cid;
};

const serialize = (obj) => {
    return Object.keys(obj)
        .map((key) => `${key}=${encodeURIComponent(obj[key])}`)
        .join('&');
};

function sendGAEvent(name) {
    const doc = document;
    const params = {
        z: Math.random(),
        aip: 1,
        v: 1,
        ds: 'web',
        t: 'event',
        dt: doc.title,
        dl: doc.location.origin + doc.location.pathname + doc.location.search,
        ul: navigator.language.toLowerCase(),
        de: doc.characterSet,
        sr: (screen && `${screen.width}x${screen.height}`) || '',
        vp: `${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`,
        cid: getcid(),
        ec: 'CMP',
        ea: name,
    };

    const url = 'https://www.google-analytics.com/collect';
    new Image().src = `${url}?${serialize(params)}`;
}

function sendGAPageview() {
    const doc = document;
    const params = {
        z: Math.random(),
        aip: 1,
        v: 1,
        ds: 'web',
        t: 'pageview',
        dt: doc.title,
        dl: doc.location.origin + doc.location.pathname + doc.location.search,
        ul: navigator.language.toLowerCase(),
        de: doc.characterSet,
        sr: (screen && `${screen.width}x${screen.height}`) || '',
        vp: `${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`,
        cid: getcid(),
    };

    const url = 'https://www.google-analytics.com/collect';
    new Image().src = `${url}?${serialize(params)}`;
}
