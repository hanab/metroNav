var gmarkers = [];

$(document).ready(function() {
    // execute
    (function() {
        /* map options, there are 4 types of maps available in Google maps API, for our project ROADMAP type is 
        the best. Zoom sets up how wide the map will be shown, center sets up map center with latitude and langi-
        tude.*/
        var options = {
            zoom: 15,
            center: new google.maps.LatLng(60.2208035, 24.8052071), // centered Metropolia UAS
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false
        };

        // initialize map
        var map = new google.maps.Map(document.getElementById('map_canvas'), options);

        //array of important locations that will be displayed in the page.
        var locations = [
            //shopping
            ['Lidl', 60.2181546, 24.807762, 'Ratsukatu 3 02600 Espoo', 'A small supermarket.', 'shopping'],
            ['Sello', 60.2171639, 24.811738, 'Albergagatan 3-9, 02600 Esbo, Finland', 'A shopping mall', 'shopping'],
            ['Alepa Leppävaara:', 60.2206539, 24.8123775, 'Läkkisepänkuja 3, 02600 Espoo', 'A small supermarket', 'shopping'],
            ['R kioski Leppävaara:', 60.2190809, 24.8137141, 'Leppävaaranaukio, 02600 Espoo', 'A kiosk', 'shopping'],

            //living
            ['Immigration office: Western Uusimaa Police Department ', 60.2082939, 24.7587307, 'Nihtisillankuja 4, 02630 Espoo', 'The police station and immigration office for forigeners, where international students living in espoo update their residence permits annually.', 'living'],
            ['post office Leppävaara', 60.217287, 24.811306, 'Kauppakeskus Sello 02600 Espoo Finland', 'Post office', 'living'],
            ['HOAS Leppävaara office', 60.2230089, 24.8142281, 'Harakantie 7, 02650 ESPOO', 'Student apartment rental service', 'living'],
            ['MEHILÄINEN LEPPÄVAARA (hospital)', 60.2180086, 24.814505, 'Hevosenkenkä 3, 02600 Espoo', 'A hospital', 'living'],
            ['Sellon Apteekki:', 60.2171639, 24.811738, 'Leppävaarankatu 3-9 FIN 02600 Espoo', 'A pharmacy', 'living'],
            ['Hesburger Leppävaara', 60.2182652, 24.8083333, 'Kauppakeskus Sello, Sello Rex, Ratsukatu 3, 02600 Espoo', 'A burger house', 'living'],

            //entertainment
            ['Finnkino leppävaara', 60.2181546, 24.807762, 'Ratsukatu 3 02600 Espoo', 'A cinema', 'entertainment'],

            //finance
            ['Nordea Bank Leppävaara', 60.2171101, 24.8102652, 'Leppävaarankatu 7, 02600 Espoo', 'A bank', 'finance']
        ];

                     /*The following is the function for displaying user's geolocation in the center of the map,function
                is triggered when "go to my location" button is clicked.*/
                function getlocation() {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(position) {
                            var pos = new google.maps.LatLng(position.coords.latitude,
                                position.coords.longitude);

                            var infowindow = new google.maps.InfoWindow({
                                map: map,
                                position: pos,
                                content: "I'm here!"
                            });
                            map.setCenter(pos);
                        }, function() {
                            handleNoGeolocation(true);
                        });
                    } else {
                        // Browser doesn't support Geolocation
                        handleNoGeolocation(false);
                    }
                };

                //function for setting center of map back to metropolia.
                function gotoMetropolia(){
                    var metroLatLng = new google.maps.LatLng(60.2208035, 24.8052071);
                    map.setCenter(metroLatLng);

                    var infowindow = new google.maps.InfoWindow({
                        map: map,
                        position: metroLatLng,
                        content: "Metropolia ICT campus"
                    });
                };

        // set multiple marker that recursively adds marker using information stored in the array thats defined earlier.
        for (var i = 0; i < locations.length; i++) {
            // initialize markers
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                map: map,
                title: 'Description ' + i

            });

            marker.mycategory = locations[i][5];
            gmarkers.push(marker);

            // process multiple info windows, similar to adding multiple markers.
            (function(marker, i) {
                // add click event
                google.maps.event.addListener(marker, 'click', function() {
                    infowindow = new google.maps.InfoWindow({
                        content: locations[i][0] + ' Adrress:' + locations[i][3] + '</br>' + locations[i][4]
                    });
                    infowindow.open(map, marker);
                });

                /*function show and hide are used to toggle markers on the map, based on user selection of location.
                When a location category is selected, markers inside that category will display. When the category 
                is unchecked, markers in the category will bi hidden.*/
                function show(category) {
                    for (var i = 0; i < gmarkers.length; i++) {
                        if (gmarkers[i].mycategory == category) {
                            gmarkers[i].setVisible(true);
                        }
                    }
                    document.getElementById(category).checked = true;
                }

                function hide(category) {
                    for (var i = 0; i < gmarkers.length; i++) {
                        if (gmarkers[i].mycategory == category) {
                            gmarkers[i].setVisible(false);
                        }
                    }
                    document.getElementById(category).checked = false;
                }

                function boxclick(box, category) {
                    if (box.checked) {
                        show(category);
                    } else {
                        hide(category);
                    }
                }



                /*function for handling error if geolocation function is not supported or not working properly.*/
                function handleNoGeolocation(errorFlag) {
                    if (errorFlag) {
                        var content = 'Error: The Geolocation service failed.';
                    } else {
                        var content = 'Error: Your browser doesn\'t support geolocation.';
                    }

                    var options = {
                        map: map,
                        position: new google.maps.LatLng(60, 105),
                        content: content
                    };

                    var infowindow = new google.maps.InfoWindow(options);
                    map.setCenter(options.position);
                }

                $('#metroICTPos').click(function() {
                    gotoMetropolia();
                });

                $('#myPos').click(function() {
                    getlocation();
                });

                $('#living').click(function() {
                    boxclick(this, 'living');
                });

                $('#shopping').click(function() {
                    boxclick(this, 'shopping');
                });

                $('#finance').click(function() {
                    boxclick(this, 'finance');
                });

                $('#entertainment').click(function() {
                    boxclick(this, 'entertainment');
                });

            })(marker, i);
        }
    })();
});

