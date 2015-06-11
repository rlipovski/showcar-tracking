var doc = document;

function readCookie(name, options) {
    if (!name) { return null; }

    var decodingFunction = (options && options.decodingFunction) || decodeURIComponent;

    return decodingFunction(doc.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
}

function setCookie(name, value, options) {
    if (!name || /^(?:expires|max\-age|path|domain|secure)$/i.test(name)) { return false; }

    var expiresString = "";

    if (options.expires) {
        var date = new Date();
        date.setTime(+date + options.expires);
        expiresString = "; expires=" + date.toGMTString();
    }

    options.encodingFunction = options.encodingFunction || encodeURIComponent;

    document.cookie = encodeURIComponent(name) + "=" + options.encodingFunction(value) + expiresString + (options.domain ? "; domain=" + options.domain : "") + (options.path ? "; path=" + options.path : "") + (options.secure ? "; secure" : "");

    return true;
}

function removeCookie(name, options) {
    if (hasCookie(name)) { return false; }
    document.cookie = encodeURIComponent(name) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (name ? "; domain=" + options.domain : "") + (options.path ? "; path=" + options.path : "");
    return true;
}

function hasCookie(name) {
    if (!name) { return false; }
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
}

module.exports = {
    read: readCookie,
    set: setCookie,
    remove: removeCookie
};
