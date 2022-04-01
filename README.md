![](http://img.badgesize.io/AutoScout24/showcar-tracking/master/dist/showcar-tracking.js?label=js_size_gzip&compression=gzip)

# showcar-tracking

Tracking library for ShowCar-based pages.

## How to contribute

- To check you changes run `npm run build`
- To run test `npm run test`
- To run localy testing page `serve docs` and open `http://localhost:3000`

## Track actions that cause page loads

If you need to track a click on an element that will cause the browser to load another page, you should use
the query parameters ipl and ipc. As you can see here:

    http://www.autoscout24.de/auto-verkaufen/?ipc=cc:insertion-home&ipl=teaser

- ipc: Group or positioning of a feature under test;
- ipl: Describes the feature itself.

Example: Tracking of the CMS box containing price estimation IPC: `home-cmsbox` IPL: `vehicle-evaluation`

GTM will automatically take care of tracking the given values. You just have to insert the two parameters into the URL of the
target of the action. e.g. in the href-attribute of a link.

## Tracking with custom elements

It's possible to do all the tracking with custom HTML elements. In order to accomplish that, you'll have to use the `<as24-tracking>` element.
To control tracking you use a set of attributes.

There are a couple of common attributes that are used to control the behavior of the custom element:

- type: type of tracking. Possible values are: `pagename`, `gtm` or `dealer`;
- action: specific type of tracking. Possible values are: `click`, `set`, `pageview`, `listview`;
- as24-tracking-value: JSON object with key-value pairs to use as bulk set (can be used in combination with attributes);
- as24-tracking-click-target: target selector for click tracking.

All other attributes are used as key-value pairs for tracking. They override values given by the `as24-tracking-value` attribute.

If you need to use upper case characters (according to the gtm variable) inside an attribute name, you need to escape them with a leading dash.
Example: `group_myTestAttribute` is written as `<as24-tracking group_my-test-attribute="value">`

### Page view

Custom element way:

```html
<as24-tracking type="pagename" country="de" market="all-webapp" category="all"></as24-tracking>
<as24-tracking type="gtm" action="pageview"></as24-tracking>
```

JavaScript way:

```javascript
ut.push([
  'pagename',
  {
    country: 'de',
    market: 'all-webapp',
    category: 'all',
    pageid: 'home',
    layer: '',
    attribute: null,
    group: null,
    environment: 'live',
    language: 'de',
  },
]);
ut.push(['gtm', 'pageview']);
```

### Click tracking (without page load)

Custom element way:

```html
<as24-tracking
  type="gtm"
  action="click"
  as24-tracking-click-target="#myButton"
  eventcategory="myProject"
  eventaction="Login"
  eventlabel="B2C"
></as24-tracking>
```

JavaScript way:

```javascript
ut.push([
  'gtm',
  'click',
  {
    eventcategory: 'myProject',
    eventaction: 'Login',
    eventlabel: 'B2C',
  },
]);
```

### DEPRECATED click tracking

Custom element way:

```html
<as24-tracking
  type="gtm"
  action="click"
  as24-tracking-click-target="#myButton"
  linkgroup="HackList"
  linkid="V1 (abundance)"
></as24-tracking>
```

JavaScript way:

```javascript
ut.push([
  'gtm',
  'click',
  {
    linkgroup: 'HackList',
    linkid: 'V1 (abundance): ' + itemId + '|' + abundance,
  },
]);
```

### Extended click tracking (e.g. for page load)

Click tracking is possible for any `as24-tracking` tag, simply add the attribute `as24-tracking-click-target`.
Its value needs to be a valid selector.

### Setting values

Custom element way:

```html
<as24-tracking type="gtm" action="set" test_experiments.tt5="NetGross:Variation1" />
```

JavaScript way:

```javascript
ut.push(['gtm', 'set', { 'test_experiments.tt5': 'NetGross:Variation1' }]);
```

### Dealer tracking

Custom element way:

```html
<as24-tracking
  type="dealer"
  action="listview"
  as24-tracking-value="[281705316,281702707,281462097,281725748,237276348,281667368,281673373,281661776,281555953,281095563]"
/>
```

JavaScript way:

```javascript
ut.push([
  'dealer',
  'listview',
  [281705316, 281702707, 281462097, 281725748, 237276348, 281667368, 281673373, 281661776, 281555953, 281095563],
]);
```

Aggregated Dealer Tracking (e.g. on list page):

If you want to make sure to only send out one request for more than one tracking item you can use the dealer tracking this way:

```html
<as24-tracking
  type="dealer-gtm"
  action="add"
  as24-tracking-value='{ "id": 123, "guid": "asdsad-sd-f23-4-2", "tier": "t20" }'
></as24-tracking>
<as24-tracking
  type="dealer-gtm"
  action="add"
  as24-tracking-value='{ "id": 123, "guid": "asdsad-sd-f23-4-2", "tier": "t20" }'
></as24-tracking>
<as24-tracking
  type="dealer-gtm"
  action="add"
  as24-tracking-value='{ "id": 123, "guid": "asdsad-sd-f23-4-2", "tier": "t20" }'
></as24-tracking>
<as24-tracking
  type="dealer-gtm"
  action="add"
  as24-tracking-value='{ "id": 123, "guid": "asdsad-sd-f23-4-2", "tier": "t20" }'
></as24-tracking>
<as24-tracking
  type="dealer-gtm"
  action="add"
  as24-tracking-value='{ "id": 123, "guid": "asdsad-sd-f23-4-2", "tier": "t20" }'
></as24-tracking>
<as24-tracking
  type="dealer-gtm"
  action="add"
  as24-tracking-value='{ "id": 123, "guid": "asdsad-sd-f23-4-2", "tier": "t20" }'
></as24-tracking>
<as24-tracking
  type="dealer-gtm"
  action="add"
  as24-tracking-value='{ "id": 123, "guid": "asdsad-sd-f23-4-2", "tier": "t20" }'
></as24-tracking>
<as24-tracking type="dealer-gtm" action="commit"></as24-tracking>
```

## CMP - Consent Management Platform

The CMP takes care of collecting user consent for storing information on their device in the form of cookies.

The CMP is implemented in showcar-tracking because we needed a way to get it delivered to the users on all webpages across AS24 (also cashstack), GWAT and ATNL even without GTM. Right now on most domains (but not on .NL) we always load GTM but this can change in the future.

### How we load the CMP

The CMP itself is implemented by our partner, LiveRamp. We only have to load a script tag from them. Besides that we add some logic for doing A/B tests and collecting some metrics.

The implementation can be found in [dist/index.html](dist/index.html).

The most interesting parts are the following:

- The CMP can be disabled with a cookie or url parameter for automated tests, performance measurments, etc.

```js
if (/disable-cmp=true/.test(document.cookie) || location.href.indexOf('disable-cmp=true') > -1) {
  return false;
}
```

- If there is no `as24Visitor` cookie then we generate one. We need this as a fallback for pages without a backend. We need the cookie for A/B tests (this is the user id).

```js
ensureVisitorId();
```

- If a page is opened inside an app in a web-view then the apps pass on the user consent in the query params. We need this to not show the cookie banner if the user already accepted or declined cookies in the apps. The vendors and purposes are roughly the same in apps and web.

```js
setCmpCookiesIfProvidedAsQueryStrings();
```

- TCF stub code. This defines `window.__tcfapi` for requests which come before the LiveRamp script finishes loading. This stub code must be defined before any ads and other 3rd party code is executed.

```js
// TCF stub
// prettier-ignore
!function(e){....
```

- We try to show the cookie banner in the same language as the website or in english.

```js
setCmpLanguage(tld, window.location.pathname);
```

- We have to hide the CMP on some pages, e.g. on privacy pages. Those pages must be readable for the user even without making any decision about accepting cookies.

```js
hideCmpIfNeeded();
```

- At the moment we always load Google Analytics. We track the important CMP events, e.g. accept all, banner shown, etc.

```js
trackCmpEvents();
```

- In DE we are experimenting with multiple wording variations. On other domains we just load the script.

```js
if (tld === 'de') {
  loadCmpWithAbTest();
} else {
  loadCmpWithoutAbTest();
}
```

### The TCF 2.0 API

- The standard TCF 2.0 JS API and consent-string can be found in [this IAB GitHub repo](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/tree/master/TCFv2)
- The LiveRamp documentation with the added functionality can be found here: https://faktor.atlassian.net/wiki/spaces/LPM/pages/1014169601/GDPR+for+Web

**Some examples:**

Check if we have consent for vendorId 10012 (this is non-standard API, it is a LiveRamp extension to the API)

```js
__tcfapi(
  'checkConsent',
  2,
  function (data, success) {
    consent = data;
  },
  { data: { vendorId: 10012 } }
);
```

React on acceptAllButtonClicked CMP event:

```js
window.__tcfapi(
  'addEventListener',
  2,
  function () {
    trackInGA(event);
  },
  'acceptAllButtonClicked'
);
```

Only do some action if we have full consent:

```js
const callback = (tcData, success) => {
if (success && (tcData.eventStatus === 'tcloaded' || tcData.eventStatus === 'useractioncomplete')) {
  window.__tcfapi('removeEventListener', 2, () => {}, tcData.listenerId);

  __tcfapi('getTCData', 2, function (tcData, success) {
    if (
      tcData.purpose.consents[1] &&
      tcData.purpose.consents[2] &&
      tcData.purpose.consents[3] &&
      tcData.purpose.consents[4] &&
      tcData.purpose.consents[5] &&
      tcData.purpose.consents[6] &&
      tcData.purpose.consents[7] &&
      tcData.purpose.consents[8] &&
      tcData.purpose.consents[9] &&
      tcData.purpose.consents[10]
    ) {
      // Do some action which need consent to all purposes
    }
  });
}
};

window.__tcfapi('addEventListener', 2, callback);
```

## How to check for user consent for personalized cookies

```js
window.ut.push([
    'cmp',
    'onPersonalizedCookiesAllowed',
    function () {
        console.log('set-cookie');
    },
]);
```

### Things to improve

- Move inline CMP code from <dist/index.html> to its own file and generate minified code into <dist/index.html>, <dist/test.html> and <dist/cashstack.min.js>.
- For CMP tests use Optimizely feature tests instead of A/B tests (lower costs)

### Further resources for the CMP

- [LiveRamp docs](https://faktor.atlassian.net/wiki/spaces/LPM/pages/1014169601/GDPR+for+Web)
- [IAB TCF 2.0 standard (consent string, standard CMP API, etc.)](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/tree/master/TCFv2)

## How to work on showcar-tracking locally (incl. CMP implementation)

Open two terminals:

- `npx webpack --config config/webpack.conf.js -w`
- `npx serve dist/`

Go to `http://local.autoscout24.de:3000/test.html`

- For the CMP first make the changes in <dist/test.html> and then copy them over to <dist/index.html>
- For changes in cashtack CMP: copy the changes from <dist/test.html> to <src/cashstack.js>
