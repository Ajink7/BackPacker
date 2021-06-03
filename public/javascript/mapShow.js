

mapboxgl.accessToken = mapToken;
var map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: JSON.parse(camp).geometry.coordinates, // starting position [lng, lat]
zoom: 9 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(JSON.parse(camp).geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
            .setHTML(
                `<h3>${JSON.parse(camp).title}</h3><p>${JSON.parse(camp).location}</p>`
            )
    )
    .addTo(map)

