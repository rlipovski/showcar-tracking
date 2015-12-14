var as24tracking = Object.assign(Object.create(HTMLElement.prototype), {
    el: null,
    debug: true,
    supportedActions: ['set', 'click', 'pageview'],
    supportedTypes: ['gtm', 'pagename'],
    reservedWords: ['as24-tracking-id', 'type', 'action', 'as24-tracking-value', 'as24-tracking-click-target'],

    createdCallback () {
        this.el = $(this);
        var values = this.getAdditionalProperties();

        var type = this.el.attr('type');
        var action = this.el.attr('action');
        var args = [type, action, values];

        if (type === 'gtm' && action === 'click') {
            $(this.el.attr('as24-tracking-click-target')).on('click', () => this.track(...args));
            return;
        }

        if (type === 'pagename') {
            args.splice(1, 1);
        }

        if (!this.dev) {
            this.track(...args);
        }
    },

    getAdditionalProperties() {
        var values = JSON.parse(this.el.attr('as24-tracking-value')) || {};
        return Array.from(this.el[0].attributes)
            .filter((element) => !(this.reservedWords.indexOf(element.nodeName) > -1))
            .reduce((prev, curr) => {
                prev[curr.nodeName] = curr.nodeValue;
                return prev;
            }, values);
    },

    track(...args) {
        if (this.debug) {
            console.log(...args);
        } else {
            ut.push(...args);
        }
    }

});


document.registerElement('as24-tracking', {
    prototype: as24tracking
});
