```js
function hasXxxxTagUserConsent() {
  var consent = false;
  var tcf11VendorId = 123; // todo: replace this
  var tcf20VendorId = 102018; // todo: replace this

  if (window.__cmp) {
    window.__cmp('getVendorConsents', null, function (vendorConsents) {
      window.__cmp('getAdditionalVendorConsents', null, function (
        additionalVendorConsents
      ) {
        // todo: adjust condition below
        consent =
          vendorConsents.purposeConsents[1] &&
          vendorConsents.purposeConsents[2] &&
          vendorConsents.purposeConsents[3] &&
          vendorConsents.purposeConsents[4] &&
          vendorConsents.purposeConsents[5] &&
          additionalVendorConsents[tcf11VendorId];
      });
    });
  } else if (window.__tcfapi) {
    __tcfapi(
      'checkConsent',
      2,
      function (data, success) {
        consent = data;
      },
      { data: { vendorId: tcf20VendorId } }
    );
  }

  return consent;
}
```
