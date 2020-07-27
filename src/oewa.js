const path = window.location.pathname;
const pixelPath = (() => {
    switch(true){
        case RegExp('^\/$').test(path):
            return 'Service/Homepage/Homepage';
            break;
        case RegExp('(^\/promo\/preisbewertung)|(^\/auto\-verkaufen)|(^\/fahrzeugbewertung)|(^\/promo\/preisbewertung)').test(path):
            return 'Service/Sonstiges/Sonstiges';
            break;
        case RegExp('^\/motorrad').test(path):
            return 'Service/Rubrikenmaerkte/Automarkt';
            break;
        case RegExp('(^\/informieren)|(^\/auto)|(^\/moto)').test(path):
            return 'RedCont/AutoUndMotor/AutoUndMotor';
            break;
        case RegExp('^\/unternehmen').test(path):
            return 'Service/Unternehmenskommunikation/Unternehmenskommunikation';
            break;
        default:
            return 'not_available';
            break;
    }
})();

function detailPage(){
    loadScript('https://script-at.iocnt.net/iam.js').then(() => {
        if(window.iom){
            // OEWA VERSION="3.0" 
            window.oewa_data = {
                cn: 'at', // country 
                st: 'at_w_atascout24', // sitename 
                cp: "Service/Rubrikenmaerkte/Automarkt", // kategorienpfad  
                sv: 'mo', // die Befragungseinladung wird im mobilen Format ausgespielt 
                ps: 'lin' // Privacy setting 
            };
            iom.c(window.oewa_data,1); 
        }
    });
}

function allPages() {
    loadScript('https://script-at.iocnt.net/iam.js').then(() => {
        if(window.iom){
            // OEWA VERSION="3.0" 
            window.oewa_data = {
                cn: 'at', // country 
                st: 'at_w_atascout24', // sitename 
                cp: pixelPath, // kategorienpfad 
                sv: 'mo', // die Befragungseinladung wird im mobilen Format ausgespielt 
                ps: 'lin' // Privacy setting 
            };
            iom.c(window.oewa_data,1); 
        }
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


const onDetailPage = path.startsWith('/angebote') && document.querySelector('as24-tracking[type=pagename]').getAttribute('pageid') === 'detail';


if (onDetailPage) {
    detailPage();

    try {
        document.querySelector('as24-carousel').addEventListener('as24-carousel.slide', (e) => detailPage());
    } catch(e) {}

} else {
    if(pixelPath !== 'not_available'){
        allPages();
    }   
}