(function () {
    // TCF stub
    // prettier-ignore
    !function(e){var t={};function n(r){if(t[r])return t[r].exports;var a=t[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,n),a.l=!0,a.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)n.d(r,a,function(t){return e[t]}.bind(null,a));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="https://gdpr.privacymanager.io/1.0.10/",n(n.s=38)}({38:function(e,t){!function(){if("function"!=typeof window.__tcfapi){var e,t=[],n=window,r=n.document,a=n.__tcfapi?n.__tcfapi.start:function(){};!n.__tcfapi&&function e(){var t=!!n.frames.__tcfapiLocator;if(!t)if(r.body){var a=r.createElement("iframe");a.style.cssText="display:none",a.name="__tcfapiLocator",r.body.appendChild(a)}else setTimeout(e,5);return!t}()&&(n.__tcfapi=function(n,r,a,o){var i=[n,r,a,o];if(!i.length)return t;if("setGdprApplies"===i[0])i.length>3&&2===parseInt(i[1],10)&&"boolean"==typeof i[3]&&(e=i[3],"function"==typeof i[2]&&i[2]("set",!0));else if("ping"===i[0]){var c={gdprApplies:e,cmpLoaded:!1,apiVersion:"2.0"};"function"==typeof i[2]&&i[2](c,!0)}else t.push(i)},n.__tcfapi.commandQueue=t,n.__tcfapi.start=a,n.addEventListener("message",(function(e){var t="string"==typeof e.data,r={};try{r=t?JSON.parse(e.data):e.data}catch(e){}var a=r.__tcfapiCall;a&&n.__tcfapi(a.command,a.version,(function(n,r){if(e.source){var o={__tcfapiReturn:{returnValue:n,success:r,callId:a.callId,command:a.command}};t&&(o=JSON.stringify(o)),e.source.postMessage(o,"*")}}),a.parameter)}),!1))}}()}});

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
