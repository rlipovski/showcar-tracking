const isMobile = window.innerWidth < 789;
const iamScript = 'https://script.ioam.de/iam.js';
const market = (() => {
    try {
        return document.querySelector('as24-tracking[type=pagename]').getAttribute('market');
    } catch (e) {
        return 'vm';
    }
})();

const category = (() => {
    try {
        return document.querySelector('as24-tracking[type=pagename]').getAttribute('category');
    } catch (e) {
        return 'uc';
    }
})();

function pageview() {
    loadScript(iamScript).then(() => {
        window.iam_data = {
            st: isMobile ? 'mobaus24' : 'aus24',
            cp: `as24/de/${market}/${category}`.toLowerCase(),
            sv: isMobile ? 'mo' : 'i2',
            co: '',
        };

        iom.c(window.iam_data, 1);
    });
}

function identity() {
    loadScript(iamScript).then(() => {
        window.iam_data = {
            st: isMobile ? 'mobaus24' : 'aus24',
            cp: `as24/de/${market}/${category}`.toLowerCase(),
            sv: 'ke',
            co: '',
        };

        iom.c(window.iam_data, 1);
    });
}

function home() {
    loadScript(iamScript).then(() => {
        window.iam_data = {
            st: isMobile ? 'mobaus24' : 'aus24',
            cp: `as24/de/${market}/home`.toLowerCase(),
            sv: 'ke',
            co: '',
        };

        iom.c(window.iam_data, 1);
    });
}

function detailGallery() {
    loadScript(iamScript).then(() => {
        window.iam_data = {
            st: isMobile ? 'mobaus24' : 'aus24',
            cp: `as24/de/${market}/${category}`.toLowerCase(),
            sv: isMobile ? 'mo' : 'i2',
            co: '',
        };

        iom.c(window.iam_data, 1);
    });
}

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        const ref = document.getElementsByTagName('script')[0];
        ref.parentNode.insertBefore(script, ref);
        script.onload = resolve;
        script.src = src;
    });
}

document.addEventListener('list-items:changed', (e) => pageview());

if (window.location.pathname.startsWith('/angebote')) {
    try {
        document.querySelector('as24-carousel').addEventListener('as24-carousel.slide', (e) => detailGallery());
    } catch (e) {}
}

const onHomepage = window.location.pathname === '/' || window.location.pathname === '/motorrad';

const onIdentity = window.location.pathname === '/entry/auth';

// On the dealer info list page the `list-items:changed` event is fired even on the first pageview.
// This causes the pageview  to be double tracked.
// To prevent this we don't track the real pageview on the dealer info list pages.
const onDealerInfoListPage = /\/haendler\/.+\/fahrzeuge/.test(window.location.pathname);

if (onHomepage) {
    home();
} else if(onIdentity) {
    identity();
} else if (!onDealerInfoListPage) {
    pageview();
}
