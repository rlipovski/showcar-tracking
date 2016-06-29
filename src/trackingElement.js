var as24tracking = Object.assign(Object.create(HTMLElement.prototype), {
    el: null,
    inDev: false,
    supportedActions: ['set', 'click', 'pageview'],
    supportedTypes: ['gtm', 'pagename'],
    reservedWords: ['type', 'action', 'as24-tracking-value', 'as24-tracking-click-target'],

    createdCallback () {
        var values = this.getAdditionalProperties();
        var type = this.getAttribute('type');
        var action = this.getAttribute('action');
        var args = [type, action];

        if (Object.keys(values).length > 0) {
            args.push(values);
        }

        if (type === 'pagename') {
            args.splice(1, 1);
        }

        var clickTarget = this.getAttribute('as24-tracking-click-target');
        if (clickTarget) {
            var elements = document.querySelectorAll(clickTarget);
            for (let element of elements) {
                element.addEventListener('click', () => this.track(args));
            }
        } else {
            this.track(args);
        }
    },

    getAdditionalProperties() {
        var trackingValue = this.getAttribute('as24-tracking-value');
        var values = trackingValue ? JSON.parse(trackingValue) : {};

        if (Array.isArray(values)) {
            return values;
        }

        return Array.prototype.slice.call(this.attributes)
            .filter((element) => !(this.reservedWords.indexOf(element.nodeName) > -1))
            .reduce((prev, curr) => {
                var attrName = this.decodeAttributeName(curr.nodeName);
                prev[attrName] = curr.nodeValue;
                return prev;
            }, values);
    },

    decodeAttributeName (attrName) {
        if (attrName.indexOf('-') > -1) {
            attrName = attrName.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
        }
        return attrName;
    },

    track(args) {
        if (this.inDev) {
            console.log(args);
        } else {
            ut.push(args);
        }
    }

});

try {
    var ctor = document.createElement('as24-tracking').constructor;
    if (ctor === HTMLElement || ctor === HTMLUnknownElement) {
        document.registerElement('as24-tracking', { prototype: as24tracking });
    }
} catch (e) {
    if (window && window.console) {
        window.console.warn('Failed to register CustomElement "as24-tracking".', e);
    }
}
