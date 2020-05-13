const { once } = require('./util');

const consentCacheKey = '__cmp_consent_cache';

module.exports.loadCmpStubSync = () => {
    require('./liveramp-stub');
};

module.exports.loadCmpAsync = once(() => {
    const script = document.createElement('script');
    const ref = document.getElementsByTagName('script')[0];
    ref.parentNode.insertBefore(script, ref);
    script.src = 'https://config-prod.choice.faktor.io/ea93c094-1e43-49f8-8c62-75128f08f70b/faktor.js';
});

module.exports.isCmpEnabled = () => {
    return location.href.indexOf('__cmp') >= 0;
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
                console.log('Consent data exists');
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
        'consentWallDisplayed',
        'consentWallClosed',
    ];

    events.forEach((event) => window.__cmp('addEventListener', event, () => sendMetrics(event)));
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

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        cmp_facebook_consent: facebookConsent,
        cmp_googleAnalytics_consent: googleAnalyticsConsent,
        cmp_googleAds_consent: googleAdsConsent,
        cmp_bing_consent: bingConsent,
        cmp_mouseFlow_consent: mouseFlowConsent,
    });
}

function sendMetrics(name) {
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
                    tags: { service: 'showcar-tracking' },
                },
            ],
        }),
    });
}
