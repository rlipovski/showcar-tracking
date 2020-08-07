```js
function hasGoogleAnalyticsConsent() {
  var consent = false;

  if (window.__tcfapi) {
    __tcfapi(
      'checkConsent',
      2,
      function (data, success) {
        consent = data;
      },
      { data: { vendorId: 10211 } }
    );
  } else if (window.__cmp && window.cmpEnabled) {
    window.__cmp('getVendorConsents', null, function (vendorConsents) {
      window.__cmp('getAdditionalVendorConsents', null, function (additionalVendorConsents) {
        consent =
          vendorConsents.purposeConsents[1] &&
          vendorConsents.purposeConsents[5] &&
          additionalVendorConsents.vendorConsents[4];
      });
    });
  } else {
    return true;
  }

  return consent;
}
```

```js
function hasGoogleAdsConsent() {
  var consent = false;

  if (window.__tcfapi) {
    __tcfapi(
      'checkConsent',
      2,
      function (data, success) {
        consent = data;
      },
      { data: { vendorId: 10211 } }
    );
  } else if (window.__cmp && window.cmpEnabled) {
    window.__cmp('getVendorConsents', null, function (vendorConsents) {
      window.__cmp('getAdditionalVendorConsents', null, function (additionalVendorConsents) {
        consent =
          vendorConsents.purposeConsents[1] &&
          vendorConsents.purposeConsents[2] &&
          vendorConsents.purposeConsents[3] &&
          vendorConsents.purposeConsents[5] &&
          additionalVendorConsents.vendorConsents[91];
      });
    });
  } else {
    return true;
  }

  return consent;
}
```

```js
function hasBingConsent() {
  var consent = false;

  if (window.__tcfapi) {
    __tcfapi(
      'checkConsent',
      2,
      function (data, success) {
        consent = data;
      },
      { data: { vendorId: 10012 } }
    );
  } else if (window.__cmp && window.cmpEnabled) {
    window.__cmp('getVendorConsents', null, function (vendorConsents) {
      window.__cmp('getAdditionalVendorConsents', null, function (additionalVendorConsents) {
        consent =
          vendorConsents.purposeConsents[1] &&
          vendorConsents.purposeConsents[2] &&
          vendorConsents.purposeConsents[3] &&
          vendorConsents.purposeConsents[4] &&
          vendorConsents.purposeConsents[5] &&
          additionalVendorConsents.vendorConsents[21];
      });
    });
  } else {
    return true;
  }

  return consent;
}
```
