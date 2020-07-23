const { once } = require('./util');

const consentCacheKey = '__cmp_consent_cache';
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|mobil/i.test(navigator.userAgent);

const optimizelyEnabled = window.location.href.indexOf('__cmp-optimizely') >= 0;

const cmpSiteIds = {
    at: 'c8515c6b-cf35-47d8-8078-15cc075b3207',
    be: 'a9a510e9-b6b9-4499-99f6-131880e92aaa',
    de: '769b8c9a-14d7-4f0f-bc59-2748c96ec403',
    es: '052e7f91-7b7c-432a-bb9e-d99911139da7',
    fr: 'f6a34410-a99a-4e8d-836c-f19620914569',
    it: '7dc55efc-b43a-4ab6-a31b-d084591ee853',
    lu: '3f009a85-9789-4acc-a4a3-a6c45994c3ca',
    nl: '11590dc9-3700-43b4-aacd-731ef5261fdf',
};

module.exports.loadCmpAsync = once(() => {
    const script = document.createElement('script');
    const ref = document.getElementsByTagName('script')[0];
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

        getCmpVariationData().then(({ userid, variation }) => {
            window.__as24_cmp_userid = userid;
            window.__as24_cmp_variation = variation;

            loadCmp(variation);

            if (variation) {
                localStorage.setItem('__as24_cmp_userid', userid);
                localStorage.setItem('__as24_cmp_variation', variation);

                window.__as24_cmp_opt_sendevent = function (event) {
                    const url =
                        'https://cmp-optimizely-fs.as24-media.eu-west-1.infinity.as24.tech/sendevent/' +
                        userid +
                        '/' +
                        event;

                    if ('sendBeacon' in navigator) {
                        navigator.sendBeacon(url);
                    } else {
                        new Image().src =
                            'https://cmp-optimizely-fs.as24-media.eu-west-1.infinity.as24.tech/sendevent/' +
                            userid +
                            '/' +
                            event;
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
                userid: localStorage.getItem('__as24_cmp_userid'),
            });
        }

        const userid = uuidv4();

        return fetch(
            'https://cmp-optimizely-fs.as24-media.eu-west-1.infinity.as24.tech/activate/cmp_classic_vs__nextgen/' +
                userid
        ).then((r) => r.json());
    }

    function loadCmp(variation) {
        const tld = window.location.hostname.split('.').pop();
        if (tld === 'de') {
            if (variation === 'classic') {
                script.src = 'https://config-prod.choice.faktor.io/769b8c9a-14d7-4f0f-bc59-2748c96ec403/faktor.js';
            } else {
                script.src = 'https://config-prod.choice.faktor.io/ea93c094-1e43-49f8-8c62-75128f08f70b/faktor.js';
            }
        } else {
            const cmpSiteId = cmpSiteIds[tld] || cmpSiteIds['de'];
            script.src = `https://config-prod.choice.faktor.io/${cmpSiteId}/faktor.js`;
        }
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

    function isOnPrivacyInfoPage() {
        return (
            window.location.href.indexOf('__cmp_privacy') >= 0 ||
            document.querySelector('as24-tracking[pageid="au-company-privacy"]')
        );
    }

    // if (isMobile) {
    window.__cmp('addEventListener', 'consentToolShouldBeShown', () => {
        if (isOnPrivacyInfoPage()) {
            window.__cmp('showConsentTool', false);
        } else {
            waitForIframe((ifr) => {
                ifr.parentNode.style =
                    'width: 100%; heigh: 100%; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 1000; background-color: rgba(0, 0, 0, 0.35);';
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
        const userMadeDecision = !!localStorage[consentCacheKey];
        if (!userMadeDecision) {
            sendMetrics('cmp_pageview_without_decision');
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

function hasGivenConsent(vendorConsents) {
    const hasGivenConsent = !!(
        vendorConsents.purposeConsents[1] &&
        vendorConsents.purposeConsents[2] &&
        vendorConsents.purposeConsents[3] &&
        vendorConsents.purposeConsents[4] &&
        vendorConsents.purposeConsents[5]
    );
    return hasGivenConsent;
}

function hasGivenConsentGtm(vendorConsents, additionalVendorConsents) {
    const hasGivenConsent = !!(
        vendorConsents.purposeConsents[1] &&
        vendorConsents.purposeConsents[2] &&
        vendorConsents.purposeConsents[3] &&
        vendorConsents.purposeConsents[4] &&
        vendorConsents.purposeConsents[5] &&
        additionalVendorConsents.vendorConsents[6]
    );
    console.log('Has agreed to GTM ' + additionalVendorConsents.vendorConsents[6]);
    return hasGivenConsent;
}

module.exports.waitForConsentAgreementIfNeeded = () => {
    if(window.location.href.indexOf('__cmp_gtm_check') > -1) {
        return new Promise((resolve) => {
            window.__cmp('consentDataExist', null, (consentDataExists) => {
                if (consentDataExists === true) {
                    window.__cmp('getVendorConsents', undefined, (vendorData) => {
                        window.__cmp('getAdditionalVendorConsents', undefined, function(additionalVendorConsents) {
                            window.__cmp('removeEventListener', 'consentChanged', handler);
                            resolve(hasGivenConsentGtm(vendorData, additionalVendorConsents));
                        });
                    });
                }
            });

            const handler = (e) => {
                window.__cmp('getVendorConsents', undefined, (vendorData) => {
                    window.__cmp('getAdditionalVendorConsents', undefined, function(additionalVendorConsents) {
                        window.__cmp('removeEventListener', 'consentChanged', handler);
                        resolve(hasGivenConsentGtm(vendorData, additionalVendorConsents));
                    });
                });                    
            };
            window.__cmp('addEventListener', 'consentWallClosed', handler);
        });
    } else {
        return new Promise((resolve) => {
            window.__cmp('consentDataExist', null, (consentDataExists) => {
                if (consentDataExists === true) {
                    window.__cmp('getVendorConsents', undefined, (vendorData) => {
                        window.__cmp('removeEventListener', 'consentChanged', handler);
                        resolve(hasGivenConsent(vendorData));
                    });
                }
            });

            const handler = (e) => {
                window.__cmp('getVendorConsents', undefined, (vendorData) => {
                    window.__cmp('removeEventListener', 'consentChanged', handler);
                    resolve(hasGivenConsent(vendorData));
                });
            };
            window.__cmp('addEventListener', 'consentChanged', handler);
        });
    }
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

    window.__cmp('addEventListener', 'acceptAllButtonClicked', () => {
        window.__as24_cmp_opt_sendevent && window.__as24_cmp_opt_sendevent('cmpAcceptAll');
    });

    window.__cmp('addEventListener', 'rejectAllButtonClicked', () => {
        window.__as24_cmp_opt_sendevent && window.__as24_cmp_opt_sendevent('cmpRejectAll');
    });

    window.__cmp('addEventListener', 'exitButtonClicked', () => {
        window.__as24_cmp_opt_sendevent && window.__as24_cmp_opt_sendevent('cmpExit');
    });

    window.__cmp('addEventListener', 'consentToolShouldBeShown', () => {
        window.__as24_cmp_opt_sendevent && window.__as24_cmp_opt_sendevent('cmpShown');

        var interaction = false;
        const interactionEvents = [
            'acceptAllButtonClicked',
            'rejectAllButtonClicked',
            'exitButtonClicked',
            'privacySettingsButtonClicked',
        ];

        interactionEvents.forEach((event) => window.__cmp('addEventListener', event, () => (interaction = true)));

        window.addEventListener('unload', () => {
            if (!interaction) {
                // track if user navigates to a new AS24 page without interacting with the page
                window.__as24_cmp_opt_sendevent && window.__as24_cmp_opt_sendevent('cmpNavigationWithoutInteraction');
            }
        });
    });
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

    const criteoConsent =
        vendorConsents &&
        vendorConsents.purposeConsents[1] &&
        vendorConsents.purposeConsents[2] &&
        vendorConsents.vendorConsents[91];

    const rtbConsent =
        vendorConsents &&
        vendorConsents.purposeConsents[1] &&
        vendorConsents.purposeConsents[2] &&
        vendorConsents.vendorConsents[16];

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        cmp_facebook_consent: facebookConsent,
        cmp_googleAnalytics_consent: googleAnalyticsConsent,
        cmp_googleAds_consent: googleAdsConsent,
        cmp_bing_consent: bingConsent,
        cmp_mouseFlow_consent: mouseFlowConsent,
        cmp_krux_consent: kruxConsent,
        cmp_criteo_consent: criteoConsent,
        cmp_rtb_consent: rtbConsent,
    });
}

function sendMetrics(name) {
    const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
    if (isBot) {
        return;
    }

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

function deleteCookie(name) {
    const domain = location.hostname.replace('www.', '.').replace('local.', '.');
    document.cookie = name + '=; path=/; domain=' + domain + '; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
