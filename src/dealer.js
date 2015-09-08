var cookies = require('./cookieHelper');
var visitorId = cookies.read('as24Visitor');

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

    detailview: function(url, id) {
        sendRequest({
            source: 'pv',
            url: url || location.href,
            id: id
        });
    },

    topcarview: function(id) {
        sendRequest({
            source: 'ha',
            url: location.href,
            id: id
        });
    },

    phone: function(id) {
        sendRequest({
            source: 'mc',
            url: location.href,
            id: id
        });
    }
};