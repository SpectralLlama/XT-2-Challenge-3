document.addEventListener("DOMContentLoaded", function () {
  mapboxgl.accessToken =
    "pk.eyJ1IjoicGVuY2lsaW5rIiwiYSI6ImNrOHpwc2UyajBrc2MzZGw2dnJkcTZkbTUifQ.aYyVpkxa0nsrIgn4aw-OeA";

    // ongeveer amsterdam als startlocatie
  var startPos = [4.89, 52.35];

  var map = new mapboxgl.Map({
    container: "landing-map",
    style: "mapbox://styles/mapbox/streets-v11",
    // center op de marker
    center: startPos,
    zoom: 2,
  });

	// voeg draggable marker toe
  var marker = new mapboxgl.Marker({
    // de moeilijke code regel om het sleepbaar te maken
    draggable: true,
  })
    .setLngLat(startPos)
    .on("dragend", onDragEnd)
    .addTo(map);
});

function onDragEnd(obj) {
	var table = document.getElementById("tableYN");
	var elevationTD = table.querySelector("td.elevation");
	var wspeedTD = table.querySelector("td.wspeed");
	var rainTD = table.querySelector("td.rain");
	var okTxt = document.querySelector(".verificationtxt");

	elevationTD.innerHTML = "-";
	wspeedTD.innerHTML = "-";
	rainTD.innerHTML = "-";

	var lngLat = obj.target.getLngLat();
	elevationLookup(lngLat.lng, lngLat.lat, function(data) {
		var el = obj.target.getElement();
		var ok = true;

		elevationTD.innerHTML = data.elevation + "m";

		// landen in de zee en op bergen is illegaal
		if (data.elevation >= 1 && data.elevation <= 500) {
			elevationTD.classList.remove("no");

			// weersinformatie opvragen
			weatherLookup(lngLat.lng, lngLat.lat, function(data) {
				// hier komt de data binnen van de weer API
				// console.dir(data);

				wspeedTD.innerHTML = data.wind.speed + "km/h";

				if (data.wind.speed < 38) {
					wspeedTD.classList.remove("no");
				}
				else {
					wspeedTD.classList.add("no");
					ok = false;
				}
				
				if (!data.rain && !data.snow) {
					rainTD.classList.remove("no");
					rainTD.innerHTML = "OK";
				}
				else {
					if (data.rain) {
						rainTD.innerHTML = "It's Raining.";
					}
					else if (data.snow) {
						rainTD.innerHTML = "It's Snowing.";
					}

					rainTD.classList.add("no");
					ok = false;
				}

				if (ok) {
					el.classList.remove("disallowed");
					okTxt.innerHTML = "You are good to go! Enjoy your landing, subscribe and leave a like.";
				}
				else {
					el.classList.add("disallowed");
					okTxt.innerHTML = "No-bueno, amigo.";
				}
			});
		}
		else {
			elevationTD.classList.add("no");
			el.classList.add("disallowed");
			okTxt.innerHTML = "No-bueno, amigo.";
		}
	});
}

function elevationLookup(lon, lat, callback) {
	var req = new Request(`https://elevation-api.io/api/elevation?points=${lat},${lon}`);

	fetch(req)
		.then(function(response) {
			if(!response.ok) throw Error(response.statusText);
			return response.json();
		})
		.then(function(data) {
			if (data && data.elevations && data.elevations.length > 0) {
				callback(data.elevations[0]);
			}
		}).catch(function(err) {
			console.error(err);
		});
}

function weatherLookup(lon, lat, callback) {
	var openWeatherMapUrl = 'https://api.openweathermap.org/data/2.5/weather';
	var openWeatherMapUrlApiKey = '6a719e3c4dfb752cbb9fe577d9c14591';
	var request = new Request(`${openWeatherMapUrl}?appid=${openWeatherMapUrlApiKey}&lon=${lon}&lat=${lat}&units=metric`);

	// Get current weather based on cities' coordinates
	fetch(request)
		.then(function(response) {
			if(!response.ok) throw Error(response.statusText);
			return response.json();
		})
		.then(function(response) {
			callback(response);
		})
		.catch(function(err) {
			console.error(err);
		});
}