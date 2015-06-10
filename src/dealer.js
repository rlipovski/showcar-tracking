var cookies = require('./gtm/campaign/customCookie');
var visitorId = cookies.get('as24Visitor');

function sendRequest(params) {
    if (!visitorId) { return; }

    params.visitorId = visitorId;
    params.ticks = +new Date();

    var paramsStr = Object.keys(params).map(function(key) {
        return key + '=' + encodeURIComponent(params[key]);
    }).join('&');

    new Image().src = 'http://tracking.autoscout24.com/parser.ashx?' + paramsStr;
}

module.exports = {
    listview: function(ids) {
        sendRequest({
            id: ids.join('|'),
            source: 'lv',
            url: '/'
        });
    },

    detailview: function(url) {
        sendRequest({
            source: 'pv',
            url: url || location.href
        });
    },

    topcarview: function() {
        sendRequest({
            source: 'ha',
            url: location.href
        });
    },

    phone: function() {
        sendRequest({
            source: 'mc',
            url: location.href
        });
    }
};