var as24tracking = Object.assign(Object.create(HTMLElement.prototype), {
    el: null,
    inDev: false,
    supportedActions: ['set', 'click', 'pageview'],
    supportedTypes: ['gtm', 'pagename'],
    reservedWords: ['type', 'action', 'as24-tracking-value', 'as24-tracking-click-target'],

    createdCallback () {
        this.el = $(this);
        var values = this.getAdditionalProperties();

        var type = this.el.attr('type');
        var action = this.el.attr('action');
        var args = [type, action];

        if (Object.keys(values).length > 0) {
            args.push(values);
        }

        if (type === 'pagename') {
            args.splice(1, 1);
        }

        var clickTarget = this.el.attr('as24-tracking-click-target')
        if (clickTarget !== null && clickTarget !== '') {
            $(this.el.attr('as24-tracking-click-target')).on('click', () => this.track(args));
        } else {
            this.track(args);
        }
    },

    getAdditionalProperties() {
        var values = JSON.parse(this.el.attr('as24-tracking-value')) || {};
        if (Array.isArray(values)) {
            return values;
        }
        return Array.from(this.el[0].attributes)
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


document.registerElement('as24-tracking', {
    prototype: as24tracking
});
