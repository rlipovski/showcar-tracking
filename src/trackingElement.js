var as24tracking = Object.assign(Object.create(HTMLElement.prototype), {
    /**
     * @type {Element}
     */
    el: null,
    inDev: false,
    supportedActions: ['set', 'click', 'pageview'],
    supportedTypes: ['gtm', 'pagename'],
    reservedWords: ['type', 'action', 'as24-tracking-value', 'as24-tracking-click-target'],

    createdCallback () {
        var values = this.getAdditionalProperties();

        var type = this.el.getAttribute('type');
        var action = this.el.getAttribute('action');
        var args = [type, action];

        if (Object.keys(values).length > 0) {
            args.push(values);
        }

        if (type === 'pagename') {
            args.splice(1, 1);
        }

        var clickTarget = this.el.getAttribute('as24-tracking-click-target'); 
        if (clickTarget !== null && clickTarget !== '') {
            document.querySelector(clickTarget).addEventListener('click', _ => this.track(args));
        } else {
            this.track(args);
        }
    },

    getAdditionalProperties() {
        var values;

        try {
            values = JSON.parse(this.el.getAttribute('as24-tracking-value'));
        } catch(e) {
            console.error('Failed to retrieve tracking values');
            return [];
        }

        if (Array.isArray(values)) {
            return values;
        }

        return Array.prototype.slice.call(this.el.attributes)
            .filter(element => this.reservedWords.indexOf(element.nodeName) === -1)
            .reduce((prev, curr) => {
                var attrName = this.decodeAttributeName(curr.nodeName);
                prev[attrName] = curr.nodeValue;
                return prev;
            }, values);
    },

    decodeAttributeName(attrName) {
        return attrName.indexOf('-') > -1
            ? attrName.replace(/-([a-z])/g, g => g[1].toUpperCase())
            : attrName;
    },

    track(args) {
        return this.inDev ? console.log(args) : ut.push(args);
    }

});

try {
    document.registerElement('as24-tracking', {
        prototype: as24tracking
    });
} catch (e) {
    if (window && window.console) {
        window.console.warn('Failed to register CustomElement "as24-tracking".', e);
    }
}
