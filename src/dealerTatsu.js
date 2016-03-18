var cookies = require('./cookieHelper');
var visitorId = cookies.read('as24Visitor');

function sendRequest(params) {
    if (!visitorId) { return; }

    params.visitor = visitorId;
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

    detailview: function(id) {
        sendRequest({
            id: id,
            source: 'pv',
            url: location.href
        });
    },

    topcarview: function(id) {
        sendRequest({
            id: id,
            source: 'ha',
            url: location.href
        });
    },

    phone: function(id) {
        sendRequest({
            id: id,
            source: 'mc',
            url: location.href
        });
    }
};
