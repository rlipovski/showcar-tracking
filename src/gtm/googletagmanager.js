var dataLayer = (window.dataLayer = window.dataLayer || []);
var useNewArrayLogic = window.location.href.indexOf('tracking-arrays=true') >= 0;

module.exports = {
    loadContainer: function (containerId) {
        var gtmAlreadyLoadedClassName = 'gtm-main-container-load-initiated';
        var alreadyInitiatedMainGtmContainerLoaded =
            document.documentElement.className.indexOf(gtmAlreadyLoadedClassName) >= 0;

        if (alreadyInitiatedMainGtmContainerLoaded) {
            // preventing duplicated load of main GTM container
            return;
        }

        document.documentElement.className += ' ' + gtmAlreadyLoadedClassName;

        var tld = window.location.hostname.split('.').pop();
        if (tld === 'nl' && window.__tcfapi) {
            const callback = (tcData, success) => {
                if (success && (tcData.eventStatus === 'tcloaded' || tcData.eventStatus === 'useractioncomplete')) {
                    window.__tcfapi('removeEventListener', 2, () => {}, tcData.listenerId);
                    __tcfapi('getTCData', 2, function (tcData, success) {
                        if (
                            success &&
                            tcData.purpose.consents[1] &&
                            tcData.purpose.consents[2] &&
                            tcData.purpose.consents[3] &&
                            tcData.purpose.consents[4] &&
                            tcData.purpose.consents[5] &&
                            tcData.purpose.consents[6] &&
                            tcData.purpose.consents[7] &&
                            tcData.purpose.consents[8] &&
                            tcData.purpose.consents[9] &&
                            tcData.purpose.consents[10]
                        ) {
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

    push: function () {
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
    },
};

function toLower(val) {
    return val && ('' + val).toLowerCase();
}
