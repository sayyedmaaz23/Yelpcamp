maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
    container: 'cluster-map',
    style: maptilersdk.MapStyle.BRIGHT,
    center: campsite.geometry.coordinates, 
    zoom: 10 
});



new maptilersdk.Marker()
    .setLngLat(campsite.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campsite.title}</h3><p>${campsite.location}</p>`
            )
    )
    .addTo(map)

    