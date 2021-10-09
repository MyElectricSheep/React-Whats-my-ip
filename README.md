#  🌎 What's My IP ?

This is an application to display your current IP address, as well as a map of your current location, and some extra time/place info (in case you don't remember where you are 🧭😉) !

Click on the IP to copy it to your clipboard.

The app calls 2 separate APIs:

- [Geo Ipify](https://geo.ipify.org) for the IP address itself and the timezone/location data
- [A public GraphQL API for information about countries, continents, and languages](https://github.com/trevorblades/countries) for additional country info
- [Flagpedia](https://flagpedia.net/download/api) to embed country flag images over CDN

The user will also be prompted for access to the more precise geolocation of the browser. If the prompt is refused 💁, the app will just fallback to the slightly less precise location data derived from the IP address ✅

# 🗺️ How about the map?

[Leaflet](https://leafletjs.com/) + [OpenStreetMap](https://www.openstreetmap.org/) are used to show a map of the user's current location.

*Fun fact:* While the app loads your data; you are in the middle of the dreaded Bermuda Triangle ⚓⛵🏴‍☠️ !

# 🚀 Live version

A [live version of the app](https://whatsmy-ip.netlify.app/) can be found here!
