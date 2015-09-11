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

    detailview: function(url) {
        var parser = document.createElement('a');
        parser.href = url;
        var matches = parser.pathname.match(/-([\d]+)$/i);

        if (matches && matches.length === 2) {
            var id = matches[1];
            sendRequest({
                source: 'pv',
                url: url || location.href,
                id: id
            });
        }
    },

    topcarview: function() {
        var matches = location.pathname.match(/-([\d]+)$/i);
        if (matches && matches.length === 2) {
            var id = matches[1];
            sendRequest({
                source: 'ha',
                url: location.href,
                id: id
            });
        }
    },

    phone: function() {
        var matches = location.pathname.match(/-([\d]+)$/i);
        if (matches && matches.length === 2) {
            var id = matches[1];
            sendRequest({
                source: 'mc',
                url: location.href,
                id: id
            });
        }
    }
};