const { loadCmpAsync } = require('./cmp');

const tld = window.location.hostname.split('.').pop();

function loadGTM() {
    const containerIdsByTld = {
        de: 'GTM-MK57H2',
        at: 'GTM-WBZ87G',
        be: 'GTM-5BWB2M',
        lu: 'GTM-NDBDCZ',
        es: 'GTM-PS6QHN',
        fr: 'GTM-PD93LD',
        it: 'GTM-WTCSNR',
        nl: 'GTM-TW48BJ',
        com: 'GTM-KWX9NX',
    };

    const containerId = containerIdsByTld[tld] || containerIdsByTld['com'];

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

function loadCMPStub() {
    if (!window.__cmp || typeof window.__cmp !== 'function') {
        var faktorCmpStart = window.__cmp ? window.__cmp.start : {};

        window.__cmp = (function () {
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
            var cmp = function (command, parameter, callback) {
                if (command === 'ping') {
                    if (callback) {
                        callback({
                            gdprAppliesGlobally: !!(
                                window.__cmp &&
                                window.__cmp.config &&
                                window.__cmp.config.storeConsentGlobally
                            ),
                            cmpLoaded: false,
                        });
                    }
                } else {
                    commandQueue.push({
                        command: command,
                        parameter: parameter,
                        callback: callback,
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
                        event: event,
                    });
                }
            };

            return cmp;
        })();

        window.__cmp.start = faktorCmpStart;
    }
}

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

if (window.cmpEnabled) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ cmp_enabled: true });

    loadCMPStub();

    loadCmpAsync();

    window.__cmp('getVendorConsents', null, function (vendorConsents) {
        window.__cmp('getAdditionalVendorConsents', null, function (additionalVendorConsents) {
            setDataLayerConsents(vendorConsents, additionalVendorConsents);

            // In NL we need all 5 purposes to load GTM
            if (tld === 'nl') {
                if (
                    vendorConsents.purposeConsents[1] &&
                    vendorConsents.purposeConsents[2] &&
                    vendorConsents.purposeConsents[3] &&
                    vendorConsents.purposeConsents[4] &&
                    vendorConsents.purposeConsents[5]
                ) {
                    loadGTM();
                }
            } else {
                loadGTM();
            }
        });
    });
}
