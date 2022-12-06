(function () {
    // TCF stub
    // prettier-ignore
    !function(){if("function"!=typeof window.__tcfapi||window.__tcfapi&&"function"!=typeof window.__tcfapi.start){var t,a=[],e=window,i=e.document,c=e.__tcfapi?e.__tcfapi.start:function(){};if(!e.__tcfapi&&function t(){var a=!!e.frames.__tcfapiLocator;if(!a){if(i.body){var c=i.createElement("iframe");c.style.cssText="display:none",c.name="__tcfapiLocator",i.body.appendChild(c)}else setTimeout(t,5)}return!a}()||e.__tcfapi&&!e.__tcfapi.start){var f=e.__tcfapi?e.__tcfapi():[];a.push.apply(a,f),e.__tcfapi=function(...e){var i=[...e];if(!e.length)return a;if("setGdprApplies"===i[0])i.length>3&&2===parseInt(i[1],10)&&"boolean"==typeof i[3]&&(t=i[3],"function"==typeof i[2]&&i[2]("set",!0));else if("ping"===i[0]){var c={gdprApplies:t,cmpLoaded:!1,apiVersion:"2.0"};"function"==typeof i[2]&&i[2](c,!0)}else a.push(i)},e.__tcfapi.commandQueue=a,e.__tcfapi.start=c,e.addEventListener("message",function(t){var a="string"==typeof t.data,i={};try{i=a?JSON.parse(t.data):t.data}catch(c){}var f=i.__tcfapiCall;f&&e.__tcfapi(f.command,f.version,function(e,i){if(t.source){var c={__tcfapiReturn:{returnValue:e,success:i,callId:f.callId,command:f.command}};a&&(c=JSON.stringify(c)),t.source.postMessage(c,"*")}},f.parameter)},!1)}}}();

    const callback = (tcData, success) => {
        if (success && (tcData.eventStatus === 'tcloaded' || tcData.eventStatus === 'useractioncomplete')) {
            window.__tcfapi('removeEventListener', 2, () => {}, tcData.listenerId);

            (function (w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
                var f = d.getElementsByTagName(s)[0],
                    j = d.createElement(s),
                    dl = l != 'dataLayer' ? '&l=' + l : '';
                j.async = true;
                j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', 'GTM-KPJB2BN');
        }
    };

    window.__tcfapi('addEventListener', 2, callback);

    var script = document.createElement('script');
    var ref = document.getElementsByTagName('script')[0];
    ref.parentNode.insertBefore(script, ref);
    script.src = 'https://gdpr-wrapper.privacymanager.io/gdpr/f73dc3fe-0cd5-4f7a-9406-73f3ea6d94de/gdpr-liveramp.js';
})();
