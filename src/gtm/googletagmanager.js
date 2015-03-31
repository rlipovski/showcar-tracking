var dataLayer = window.dataLayer = window.dataLayer || [];

module.exports = {
    loadContainer: function(containerId) {
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            '//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer',containerId);
    },

    push: function() {
        if (!arguments.length) {
            return;
        }

        var args = [].slice.call(arguments);
        args.map(function(data) {
            for (var key in data) {
                data[key] = toLower(data[key]);
            }

            return data;
        });

        dataLayer.push.apply(dataLayer, args);
    }
};

function toLower(val) {
    return val && ('' + val).toLowerCase();
}