var __map;

function initialize() {
    var isDraggable = $(document).width() > 480 ? true : false;

    var bounds = new google.maps.LatLngBounds();
    var infowindow = new google.maps.InfoWindow();

    var map_canvas = document.getElementById('map_canvas');
    __map = new google.maps.Map(map_canvas, {
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        draggable: isDraggable,
        scrollwheel: false,
        panControl: false,
        rotateControl: false,
        streetViewControl: false,
        navigationControl: false,
        mapTypeControl: false
    });

    __map.fitBounds(bounds);

    var markers = [
        {
            "title": "Kennewick",
            "position": [
                "46.10007",
                "-119.11692"
            ]
        },
        {
            "title": "Seven Mile",
            "position": [
                "45.633598",
                "-121.26680"
            ]
        },
        {
            "title": "Goodnoe Hills",
            "position": [
                "45.783358",
                "-120.55023"
            ]
        },
        {
            "title": "Butler Grade",
            "position": [
                "45.950084",
                "-118.68341"
            ]
        },
        {
            "title": "Wasco",
            "position": [
                "45.500263",
                "-120.76687"
            ]
        },
        {
            "title": "Chinook",
            "position": [
                "45.83334",
                "-119.53361"
            ]
        },
        {
            "title": "Augspurger",
            "position": [
                "45.736263",
                "-121.68086"
            ]
        },
        {
            "title": "Biddle Butte",
            "position": [
                "45.580749",
                "-122.20745"
            ]
        },
        {
            "title": "Forest Grove",
            "position": [
                "45.524249",
                "-123.08855"
            ]
        },
        {
            "title": "Hood River",
            "position": [
                "45.688002",
                "-121.52391"
            ]
        },
        {
            "title": "Horse Heaven",
            "position": [
                "45.933771",
                "-119.63422"
            ]
        },
        {
            "title": "Mary's Peak",
            "position": [
                "44.504299",
                "-123.55246"
            ]
        },
        {
            "title": "Megler",
            "position": [
                "46.266005",
                "-123.87728"
            ]
        },
        {
            "title": "Mt. Hebo",
            "position": [
                "45.213434",
                "-123.75538"
            ]
        },
        {
            "title": "Naselle Ridge",
            "position": [
                "46.421801",
                "-123.79690"
            ]
        },
        {
            "title": "Roosevelt",
            "position": [
                "45.764636",
                "-120.24008"
            ]
        },
        {
            "title": "Shaniko",
            "position": [
                "45.02515",
                "-120.83532"
            ]
        },
        {
            "title": "Sunnyside",
            "position": [
                "46.485693",
                "-119.99256"
            ]
        },
        {
            "title": "Tillamook",
            "position": [
                "45.457724",
                "-123.82864"
            ]
        },
        {
            "title": "Troutdale",
            "position": [
                "45.558324",
                "-122.40173"
            ]
        }
    ];

    _.map(markers, function(mark, k){
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(parseFloat(mark.position[0]),parseFloat(mark.position[1])),
            map: __map,
            title: mark.title,
            icon: '/img/wind.png'
        });
        bounds.extend(marker.position);
        google.maps.event.addListener(marker, 'click', (function (marker) {
            return function () {
                infowindow.setContent(mark.title);
                infowindow.open(__map, marker);
            }
        })(marker));
        return marker;
    });


}

$(document).ready(function(){
    $(window).resize(function(){
        __map.setOptions({
            draggable: $(document).width() > 480
        })
    });
})