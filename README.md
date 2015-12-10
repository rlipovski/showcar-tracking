# showcar-tracking

Tracking library for ShowCar-based pages


## Track actions that cause page loads
If you need to track a click on an element that will cause the browser to load another page, you should use
the query parameters ipl and ipc. As you can see here:

    http://www.autoscout24.de/auto-verkaufen/?ipc=cc:insertion-home&ipl=teaser

* ipc:
* ipl:

GTM will automatically take care of tracking the given values. You just have to insert the two parameters into the URL of the
target of the action. e.g. in the href-attribute of a link.
