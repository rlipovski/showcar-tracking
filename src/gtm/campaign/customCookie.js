var exports = module.exports = function (doc) {
    if (!doc) doc = {};
    if (typeof doc === 'string') doc = { cookie: doc };
    if (doc.cookie === undefined) doc.cookie = '';

    var self = {};
    self.get = function (key) {
        var splat = doc.cookie.split(/;\s*/);
        try {
            for (var i = 0; i < splat.length; i++) {
                var ps = splat[i].split('=');
                var k = decodeURIComponent(ps[0]);
                if (k === key) {
                    return decodeURIComponent(ps[1]);
                }                    
            }
        } catch (e) { }

        for (var j = 0; j < splat.length; j++) {
            var ps1 = splat[j].split('=');
            var k1 = unescape(ps1[0]);
            if (k1 === key) {
                return unescape(ps1[1]);
            }
        }
        return undefined;
    };

    self.set = function (key, value, opts) {
        if (!opts) opts = {};
        try {
            var s = encodeURIComponent(key) + '=' + encodeURIComponent(value);
            if (opts.expires) s += '; expires=' + opts.expires;
            if (opts.path) s += '; path=' + encodeURIComponent(opts.path);
            doc.cookie = s;
            return s;
        } catch (e) {}        

        var s1 = escape(key) + '=' + escape(value);
        if (opts.expires) s1 += '; expires=' + opts.expires;
        if (opts.path) s1 += '; path=' + escape(opts.path);
        doc.cookie = s1;
        return s1;
    };
    return self;
};

if (typeof document !== 'undefined') {
    var cookie = exports(document);
    exports.get = cookie.get;
    exports.set = cookie.set;
}