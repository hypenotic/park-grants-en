<template v-if="this.$store.state.locationList != null">
    <div>
        <app-filter></app-filter>
        <div class="map-container" v-bind:class="{ 'list-open': this.$store.state.listViewState }">
            <section class="google-map" id="grants-map"></section>
            <app-map-list></app-map-list>
            <div class="loading" v-bind:class="{ 'active-loader': showLoader }">Loading&#8230;</div>
            <input id="pac-input" class="controls" type="text" placeholder="Enter your address to find park events near you." style="position: absolute; top: 0; z-index: 15;">
            <button id="reset-location" class="button hidden-reset-loc" style="position: absolute; z-index: 1;">Reset Location</button>
        </div>
    </div>
</template>

<script>
    import Filter from './Filter.vue';
    import MapList from './MapList.vue';
    export default {
        components: {
            appFilter: Filter,
            appMapList: MapList
        },
        props: {
            'latitude': {
                type: Number,
                default: function(){
                return 43.52385109999999
                }
            },
            'longitude': {
                type: Number,
                default: function(){
                return -79.71254299999998
                }
            },
            'zoom': {
                type: Number,
                default: function(){
                return 4
                }
            }
        },
        data() {
            return {
                mapName: "grants-map",
                // markerCoordinates: [],
                // bounds: null,
                filters: [],
                markers: [],
                infoWindows: [],
                posts: [],
                showLoader: false,
                showList: false,
                bluePin: 'https://parkpeople.ca/listings/custom/uploads/2018/04/blue_marker_svg.svg',
                orangePin: 'https://parkpeople.ca/listings/custom/uploads/2018/04/orange_marker_svg.svg',
                greenPin: 'https://parkpeople.ca/listings/custom/uploads/2018/04/green_marker_small.svg'
            }
        },
        mounted() {
            this.bounds     = new google.maps.LatLngBounds();
            const element   = document.getElementById('grants-map');
            // const mapCentre = this.markerCoordinates[0]
            const options   = {
                // How zoomed in you want the map to start at (always required)
                zoom: 4,

                scrollwheel:  false,
                // draggable: isDraggable,

                // The latitude and longitude to center the map (always required)
                center: {lat: this.latitude, lng: this.longitude}, 

                // How you would like to style the map. 
                // This is where you would paste any style found on Snazzy Maps.
                styles: [{"featureType": 'poi.park', "elementType": 'geometry',"stylers": [{"color": '#137E23'},{ "visibility": "on" }]},{"featureType":"poi.business","stylers": [{ "visibility": "off" }]},{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}]
            }

            let input = document.getElementById('pac-input');
            this.searchBox = new google.maps.places.SearchBox(input);
            
            // Store 'this' in a variable, so you can referecne 'this' properly in
            // the following fucntions
            let app = this;
            // Listen for the event fired when the user selects a prediction and retrieve more details for that place.
            this.searchBox.addListener('places_changed', function() {
                // app.triggerSearch();
                app.chooseFilter();
            });
            // Listen for when the reset location button is pressed
            document.getElementById("reset-location").onclick = function() {
                app.triggerSearchReset();
                // app.chooseFilter();
            };
            // Listen for when the filter submit button is pressed
            document.getElementById("apply-search").onclick = function() {
                // app.applyFilters();
                app.chooseFilter();
            };

            this.map = new google.maps.Map(element, options);
            
            // Add a couple map listeners for the searchbox
            this.map.addListener('zoom_changed', function() {  
                if (input.classList.contains('small-search')) {
                } else {
                    input.classList.add('small-search');
                }
            });
            this.map.addListener('drag', function() {  
                if (input.classList.contains('small-search')) {
                } else {
                    input.classList.add('small-search');
                }
            });

            this.oms = new OverlappingMarkerSpiderfier(this.map, {
                markersWontMove: true,
                markersWontHide: true,
                basicFormatEvents: true
            });

            this.buildMarkers();
        },
        methods: {
            chooseFilter() {
                let app = this;
                // Check if there is a value in the searchbox and checked checkboxes
                let input = document.getElementById('pac-input');
                let value = input.value;
                let checkboxes = document.getElementsByClassName('ck-box');
                let check = [];
                for(var i = 0; i < checkboxes.length; i++) {
                    if (checkboxes[i].checked == true) {
                        check.push(i);
                    }
                }

                if (value.length==0 && check.length > 0) {
                    // If search bar is empty, and activities are checked 
                    console.log(1, 'no search, yes activities');
                    app.applyFilters();
                } else if (value.length>0 && check.length > 0) {
                    // If both search bar and activities are full
                    console.log(2, 'yes search, yes activities');
                    app.applyFilters();
                } else if (value.length>0 && check.length == 0) {
                    // If search bar is not empty, and activities are not checked
                    console.log(3, 'yes search, no activities');
                    
                    // app.hideOutsideRadius();
                    app.triggerSearch();

                } else {
                    console.log(4, 'catch all - initial render?');
                    // Fire this in mounted()

                    app.resetMarkers();
                }
                
            },
            showAll() {
                console.log('showAll');
                let app = this;
                
                // send all locations to activeList prop in state
                // Make sure activeList is what buildMarkers uses

                // app.buildMarkers();

            },
            showAllMarkers() {
                console.log('showAllMarkers');

                let app = this;
                let bounds = new google.maps.LatLngBounds();

                for (var i=0; i< app.locations.length; i++) {
                    bounds.extend( app.markers[i].getPosition()); 
                    app.markers[i].setVisible(true);
                }

                app.map.fitBounds(bounds);
            },
            hideOutsideRadius(places) {
                console.log('hideOutsideRadius');
                let app = this;
                
                var placeLat = places[0].geometry.location.lat();
                var placeLng = places[0].geometry.location.lng();

                var originPlace = new google.maps.LatLng(placeLat, placeLng);

                let active = [];

                for (var i=0; i < app.locations.length; i++) {
                    let newPlace = new google.maps.LatLng(app.locations[i].lat, app.locations[i].lng);
                    var distanceBT = google.maps.geometry.spherical.computeDistanceBetween(originPlace, newPlace);

                    if (distanceBT > 5000) {
                        // app.markers[i].setVisible(false);
                    } else {
                        active.push(app.locations[i]);
                    }
                }

                return active;
                // send active to activeList prop in state
                // Make sure activeList is what buildMarkers uses

                // app.buildMarkers();
            },
            applyFilters(filtered = null) {
                let app = this;

                console.log('applyFilters');

                // Close the activity filter
                this.$store.dispatch("filterViewState",this.$store.state.filterViewState );

                // Make sure the searchbox shrinks
                let input = document.getElementById('pac-input');
                if (input.classList.contains('small-search')) {
                } else {
                    input.classList.add('small-search');
                }

                // Grab the IDs of the checked activities
                let nameArray = app.$store.state.checkedActivityList;

                // This function tests whether two array have at least one matching value
                let findOne = function (haystack, arr) {
                    return arr.some(function (v) {
                        return haystack.indexOf(v) >= 0;
                    });
                }

                // Check if there is a value in the searchbox and checked checkboxes
                let value = input.value;
                let checkboxes = document.getElementsByClassName('ck-box');
                let check = [];
                for(var i = 0; i < checkboxes.length; i++) {
                    if (checkboxes[i].checked == true) {
                        check.push(i);
                    }
                }

                if ((value.length == 0 && check.length == 0) || (value.length==0 && check.length > 0) ) {
                    console.log('Filter Option 1');
                    // app.showAllMarkers();
                    app.clearMarkers();

                    // let bounds = new google.maps.LatLngBounds();

                    let active = [];
                    for (var i=0; i<app.locations.length; i++) {
                        // Grab the array of activity (taxonomy) IDs
                        let combined = app.locations[i].activity;

                        // Compare both 
                        var test = findOne(combined,nameArray);
                        
                        // If false, event does not include at least one of the 
                        // activities in the checkedActivityList array in the store
                        if (test == false) {
                            // app.markers[i].setVisible(false);
                        } else {
                            // bounds.extend( app.markers[i].getPosition()); 
                            active.push(app.locations[i]);
                        }
                    }

                    console.log('activityMatch', active);
                    app.$store.dispatch("setActiveEvents", active );

                    // app.rebuildMarkers();
                    // console.log(bounds);
                    // if (bounds.b.b != 180 ) {
                    //     app.map.fitBounds(bounds);
                    // } else {
                    //     // TK ISSUE
                    // }

                } else if (value.length>0 && check.length > 0) {
                    console.log('Filter Option 2');
                    // let bounds = new google.maps.LatLngBounds();

                    app.clearMarkers();

                    let places = app.searchBox.getPlaces();
                    var placeLat = places[0].geometry.location.lat();
                    var placeLng = places[0].geometry.location.lng();

                    var originPlace = new google.maps.LatLng(placeLat, placeLng);

                    let active = [];
                    for (var i=0; i<app.locations.length; i++) {
                        // Grab the array of activity (taxonomy) IDs
                        let combined = app.locations[i].activity;

                        // Compare both 
                        var test = findOne(combined,nameArray);

                        let newPlace = new google.maps.LatLng(app.locations[i].lat, app.locations[i].lng);
                        var distanceBT = google.maps.geometry.spherical.computeDistanceBetween(originPlace, newPlace);
                        
                        // If false, event does not include at least one of the 
                        // activities in the checkedActivityList array in the store
                        if (test == false || distanceBT > 5000) {
                            // app.markers[i].setVisible(false);
                        } else {
                            // bounds.extend( app.markers[i].getPosition()); 
                            active.push(app.locations[i]);
                        }
                    }

                    // console.log(bounds);
                    // if (bounds.b.b != 180 ) {
                    //     app.map.fitBounds(bounds);
                    // } else {
                    //     // TKISSUE
                    // }

                    console.log('activityMatch', active);
                    app.$store.dispatch("setActiveEvents", active );

                    // app.rebuildMarkers();

                } else if (value.length >0 && check.length == 0) {
                    console.log('Filter Option 3');
                } else if (value.length == 0 && check.length > 0) {
                    console.log('Filter Option 4');
                } else {
                    console.log('Filter Option 5');
                }    

            },
            triggerSearchReset() {
                let app = this;
                console.log('resetting location');

                let input = document.getElementById('pac-input');
                input.value ='';
                input.focus();

                this.resetMarkers();
            },
            triggerSearch() {
                console.log('triggerSearch');
                let app = this;

                app.clearMarkers();

                let places = this.searchBox.getPlaces();
                
                if (places.length == 0) {
                    return;
                }

                console.log('places: ', places.length, places);

                let input = document.getElementById('pac-input');
                if (input.classList.contains('small-search')) {
                } else {
                    input.classList.add('small-search');
                }
                
                let reset = document.getElementById('reset-location');
                if (reset.classList.contains('hidden-reset-loc')) {
                    reset.classList.remove('hidden-reset-loc');
                }

                let inRange = this.hideOutsideRadius(places);

                var bounds = new google.maps.LatLngBounds();
                places.forEach(function(place) {
                    if (!place.geometry) {
                        console.log("Returned place contains no geometry");
                        return;
                    }

                    var placeLat = place.geometry.location.lat();
                    var placeLng = place.geometry.location.lng();

                    var originPlace = new google.maps.LatLng(placeLat, placeLng);
                    // console.log(originPlace); 
                    // console.log(placeLat, placeLng); 
                    
                    var icon = {
                        url: place.icon,
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(25, 25)
                    };

                    // Create a marker for each place.
                    var markerLabel = "YOU";
                    app.markers.push(new google.maps.Marker({
                        map: app.map,
                        label: {
                            text: markerLabel,
                            color: "#ffffff",
                            fontSize: "10px",
                            fontWeight: "bold"
                        },
                        // icon: icon,
                        // title: place.name,
                        position: place.geometry.location,
                    }));

                    // Do we add an infoWindow so that markers and infowWindows arrays have the same amount of items?

                    // let windowString = "Current Location";

                    // let infoWindow = new google.maps.InfoWindow({
                    //     content: windowString
                    // });

                    // app.infoWindows.push( infoWindow );

                    if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                        bounds.union(place.geometry.viewport);
                    } else {
                        bounds.extend(place.geometry.location);
                    }
                })
                app.map.fitBounds(bounds);

                console.log('inRange', inRange);
                app.$store.dispatch("setActiveEvents", inRange );

                // this.rebuildMarkers();

            },
            buildMarkers(){

                // app.clearMarkers();

                // Let's combine this method with rebuildMarkers
                // We can set a variable to contain the right set of locations with a conditional
                this.markers = [];
                this.infoWindows = [];

                // Icons
                let blueMarker = 'https://parkpeople.ca/listings/custom/uploads/2018/04/blue_marker_svg.svg';
                let orangeMarker = 'https://parkpeople.ca/listings/custom/uploads/2018/04/orange_marker_svg.svg';
                let greenMarker = 'https://parkpeople.ca/listings/custom/uploads/2018/04/green_marker_small.svg';

                /*
                    Iterate over all of the cafes
                */
                for( var i = 0; i < this.locations.length; i++ ){
                    /*
                        Set marker position
                    */
                    let theposition = new google.maps.LatLng(this.locations[i].lat, this.locations[i].lng);

                    /*
                        Choose marker style based on type
                    */
                    if (this.locations[i].type == 'event') {
                        
                        let the_icon = '';
                        if (this.locations[i].timeframe == 'morethan30') {
                            the_icon = blueMarker;
                        } else if (this.locations[i].timeframe == 'within30') {
                            the_icon = orangeMarker;
                        } else {
                            the_icon = greenMarker; 
                        }

                        /*
                            Create the marker for each of the locations and set the
                            latitude and longitude to the latitude and longitude
                            of the location. Also set the map to be the local map.
                        */
                        var marker = new google.maps.Marker({
                            position: theposition,
                            map: this.map,
                            title: this.locations[i].title,
                            icon: {
                                url: the_icon
                            }
                        });

                        /*
                            Push the new marker on to the array.
                        */
                        this.markers.push( marker );

                        /*
                            Create the group string
                        */
                        // let groupString ='';
                        // if (locations[i].listing[1] != undefined) {
                        //     groupString = '<p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-users"></i> '+  this.locations[i].listing[1] +'</p>';
                        // } else {
                        //     groupString = '';
                        // }

                        let windowString = '';

                        if (this.locations[i].timeframe == 'past') {
                            windowString = '<div style="width: 250px;">' + '<h6 style="margin-bottom: 10px;font-size: 16px;">'+ this.locations[i].title + '</h6><p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-users"></i> '+  this.locations[i].listing[1] +'</p><p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-calendar-o" aria-hidden="true"></i> '+  this.locations[i].nice_start_date +'</p><p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-clock-o" aria-hidden="true"></i> '+this.locations[i].start_time+' - '+this.locations[i].end_time+'</p><span>'+this.locations[i].timeframe+'</span></div>';
                        } else {
                            windowString = '<div style="width: 250px;">' + '<h6 style="margin-bottom: 10px;font-size: 16px;"><a href="https://parkpeople.ca/listings/events/?n='+ this.locations[i].slug+ '&id='+ this.locations[i].id +'&tdgrant=true" target="_blank">'+ this.locations[i].title +'</a></h6><p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-users"></i> '+  this.locations[i].listing[1] +'</p><p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-calendar-o" aria-hidden="true"></i> '+  this.locations[i].nice_start_date +'</p><p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-clock-o" aria-hidden="true"></i> '+this.locations[i].start_time+' - '+this.locations[i].end_time+'</p><span>'+this.locations[i].timeframe+'</span></div>';
                        }

                        /*
                            Create the info window and add it to the local
                            array.
                        */
                        let infoWindow = new google.maps.InfoWindow({
                            content: windowString
                        });

                        this.infoWindows.push( infoWindow );
                        
                        /*
                        Add the event listener to open the info window for the marker.
                        */ 
                        // marker.addListener('click', function() {
                        //     // infoWindow.close();
                        //     // if (infoWindow) { infoWindow.close();}
                        //     infoWindow.open(this.map, this);
                        // });
                        //Allow each marker to have an info window    
                        google.maps.event.addListener(marker, 'spider_click', (function(marker, i) {
                            return function() {
                                infoWindow.setContent(windowString);
                                infoWindow.open(this.map, marker);
                            }
                        })(marker, i));
                        // let theMap = this.map;
                        // let infoWindow = new google.maps.InfoWindow();
                        // this.oms.addListener('click', function(marker, event, i) {
                        //     infoWindow.setContent('hey');
                        //     infoWindow.open(theMap, marker);
                        // });
                        
                        this.oms.addMarker(marker);

                        // var windowString = '<div style="width: 250px;">' + '<h6 style="margin-bottom: 10px;font-size: 16px;"><a href="'+ 'eLink' +'">'+ this.locations[i].title +'</a></h6><p style="margin:0;font-size:12px;"><i class="fa fa-users"></i> '+  this.locations[i].listing[1] +'</p><p style="margin:0;font-size:12px;"><i class="fa fa-calendar-o" aria-hidden="true"></i> '+  this.locations[i].start_date +'</p><p style="margin:0;font-size:12px;"><i class="fa fa-clock-o" aria-hidden="true"></i> '+this.locations[i].start_time+' - '+this.locations[i].end_time+'</p></div>';

                        // windowArray.push(windowString);
                        // this.windows.push(windowArray);
                        
                        // var infoWindow = new google.maps.InfoWindow(), marker, i;
                    } else {
                        return
                    }

                }

                this.map.panBy(-80, -200);

            },
            clearMarkers(){
                console.log('clearMarkers start', this.markers, this.infoWindows);
                let app = this;
                /*
                    Iterate over all of the markers and set the map
                    to null so they disappear.
                */
                for( var i = 0; i < app.markers.length; i++ ){
                    app.markers[i].setMap( null );
                    app.markers[i].setVisible(false);
                }

                app.markers = [];
                app.infoWindows = [];
                console.log('clearMarkers end', app.markers, app.infoWindows);
            },
            checkLoader(){
                if (this.$store.state.locationList.length > 0) {
                    this.showLoader = false;
                } else {
                    this.showLoader = false;
                }
            },
            rebuildMarkers(){
                console.log('rebuild markers');
                
                this.markers = [];
                this.infoWindows = [];

                let app = this;

                // Icons
                let blueMarker = 'https://parkpeople.ca/listings/custom/uploads/2018/04/blue_marker_svg.svg';
                let orangeMarker = 'https://parkpeople.ca/listings/custom/uploads/2018/04/orange_marker_svg.svg';
                let greenMarker = 'https://parkpeople.ca/listings/custom/uploads/2018/04/green_marker_small.svg';

                let bounds = new google.maps.LatLngBounds();

                /*
                    Iterate over all of the cafes
                */
                for( var i = 0; i < app.activeMarkers.length; i++ ){
                    /*
                        Set marker position
                    */
                    let theposition = new google.maps.LatLng(app.activeMarkers[i].lat, app.activeMarkers[i].lng);

                    /*
                        Choose marker style based on type
                    */
                    if (app.activeMarkers[i].type == 'event') {

                        // console.log(this.locations[i]);
                        
                        let the_icon = '';
                        if (app.activeMarkers[i].timeframe == 'morethan30') {
                            the_icon = blueMarker;
                        } else if (app.activeMarkers[i].timeframe == 'within30') {
                            the_icon = orangeMarker;
                        } else {
                            the_icon = greenMarker; 
                        }

                        /*
                            Create the marker for each of the locations and set the
                            latitude and longitude to the latitude and longitude
                            of the location. Also set the map to be the local map.
                        */
                        var marker = new google.maps.Marker({
                            position: theposition,
                            map: app.map,
                            title: app.activeMarkers[i].title,
                            icon: {
                                url: the_icon
                            }
                        });

                        /*
                            Push the new marker on to the array.
                        */
                        app.markers.push( marker );

                        /*
                            Create the group string
                        */
                        // let groupString ='';
                        // if (locations[i].listing[1] != undefined) {
                        //     groupString = '<p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-users"></i> '+  this.locations[i].listing[1] +'</p>';
                        // } else {
                        //     groupString = '';
                        // }

                         let windowString = '';

                        if (this.activeMarkers[i].timeframe == 'past') {
                            windowString = '<div style="width: 250px;">' + '<h6 style="margin-bottom: 10px;font-size: 16px;">'+ this.activeMarkers[i].title + '</h6><p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-users"></i> '+  this.activeMarkers[i].listing[1] +'</p><p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-calendar-o" aria-hidden="true"></i> '+  this.activeMarkers[i].nice_start_date +'</p><p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-clock-o" aria-hidden="true"></i> '+this.activeMarkers[i].start_time+' - '+this.activeMarkers[i].end_time+'</p><span>'+this.activeMarkers[i].timeframe+'</span></div>';
                        } else {
                            windowString = '<div style="width: 250px;">' + '<h6 style="margin-bottom: 10px;font-size: 16px;"><a href="https://parkpeople.ca/listings/events/?n='+ this.activeMarkers[i].slug+ '&id='+ this.activeMarkers[i].id +'&tdgrant=true" target="_blank">'+ this.activeMarkers[i].title +'</a></h6><p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-users"></i> '+  this.activeMarkers[i].listing[1] +'</p><p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-calendar-o" aria-hidden="true"></i> '+  this.activeMarkers[i].nice_start_date +'</p><p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-clock-o" aria-hidden="true"></i> '+this.activeMarkers[i].start_time+' - '+this.activeMarkers[i].end_time+'</p><span>'+this.activeMarkers[i].timeframe+'</span></div>';
                        }

                        /*
                            Create the info window and add it to the local
                            array.
                        */
                        let infoWindow = new google.maps.InfoWindow({
                            content: windowString
                        });

                        app.infoWindows.push( infoWindow );
                        
                        /*
                        Add the event listener to open the info window for the marker.
                        */ 
                        // marker.addListener('click', function() {
                        //     // infoWindow.close();
                        //     // if (infoWindow) { infoWindow.close();}
                        //     infoWindow.open(app.map, this);
                        // });
                        // Allow each marker to have an info window    
                        google.maps.event.addListener(marker, 'spider_click', (function(marker, i) {
                            return function() {
                                infoWindow.setContent(windowString);
                                infoWindow.open(this.map, marker);
                            }
                        })(marker, i));
                        // let theMap = this.map;
                        // let infoWindow = new google.maps.InfoWindow();
                        // this.oms.addListener('click', function(marker, event, i) {
                        //     infoWindow.setContent('hey');
                        //     infoWindow.open(theMap, marker);
                        // });
                        
                        bounds.extend( app.markers[i].getPosition()); 
                        app.oms.addMarker(marker);

                        // windowArray.push(windowString);
                        // this.windows.push(windowArray);
                        
                        // var infoWindow = new google.maps.InfoWindow(), marker, i;
                    } else {
                        return
                    }

                    app.map.fitBounds(bounds);
                }

            },
            resetMarkers(){
                console.log('resetMarkers');
                
                let app = this;
                
                app.clearMarkers();

                // Let's combine this method with rebuildMarkers
                // We can set a variable to contain the right set of locations with a conditional
                this.markers = [];
                this.infoWindows = [];

                // Icons
                let blueMarker = 'https://parkpeople.ca/listings/custom/uploads/2018/04/blue_marker_svg.svg';
                let orangeMarker = 'https://parkpeople.ca/listings/custom/uploads/2018/04/orange_marker_svg.svg';
                let greenMarker = 'https://parkpeople.ca/listings/custom/uploads/2018/04/green_marker_small.svg';

                // let bounds = new google.maps.LatLngBounds();

                /*
                    Iterate over all of the cafes
                */
                for( var i = 0; i < this.locations.length; i++ ){
                    /*
                        Set marker position
                    */
                    let theposition = new google.maps.LatLng(this.locations[i].lat, this.locations[i].lng);

                    /*
                        Choose marker style based on type
                    */
                    if (this.locations[i].type == 'event') {

                        // console.log(this.locations[i]);
                        
                        let the_icon = '';
                        if (this.locations[i].timeframe == 'morethan30') {
                            the_icon = blueMarker;
                        } else if (this.locations[i].timeframe == 'within30') {
                            the_icon = orangeMarker;
                        } else {
                            the_icon = greenMarker; 
                        }

                        /*
                            Create the marker for each of the locations and set the
                            latitude and longitude to the latitude and longitude
                            of the location. Also set the map to be the local map.
                        */
                        var marker = new google.maps.Marker({
                            position: theposition,
                            map: this.map,
                            title: this.locations[i].title,
                            icon: {
                                url: the_icon
                            }
                        });

                        /*
                            Push the new marker on to the array.
                        */
                        this.markers.push( marker );

                        /*
                            Create the group string
                        */
                        // let groupString ='';
                        // if (locations[i].listing[1] != undefined) {
                        //     groupString = '<p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-users"></i> '+  this.locations[i].listing[1] +'</p>';
                        // } else {
                        //     groupString = '';
                        // }

                        let windowString = '';

                        if (this.locations[i].timeframe == 'past') {
                            windowString = '<div style="width: 250px;">' + '<h6 style="margin-bottom: 10px;font-size: 16px;">'+ this.locations[i].title + '</h6><p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-users"></i> '+  this.locations[i].listing[1] +'</p><p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-calendar-o" aria-hidden="true"></i> '+  this.locations[i].nice_start_date +'</p><p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-clock-o" aria-hidden="true"></i> '+this.locations[i].start_time+' - '+this.locations[i].end_time+'</p><span>'+this.locations[i].timeframe+'</span></div>';
                        } else {
                            windowString = '<div style="width: 250px;">' + '<h6 style="margin-bottom: 10px;font-size: 16px;"><a href="https://parkpeople.ca/listings/events/?n='+ this.locations[i].slug+ '&id='+ this.locations[i].id +'&tdgrant=true" target="_blank">'+ this.locations[i].title +'</a></h6><p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-users"></i> '+  this.locations[i].listing[1] +'</p><p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-calendar-o" aria-hidden="true"></i> '+  this.locations[i].nice_start_date +'</p><p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-clock-o" aria-hidden="true"></i> '+this.locations[i].start_time+' - '+this.locations[i].end_time+'</p><span>'+this.locations[i].timeframe+'</span></div>';
                        }

                        /*
                            Create the info window and add it to the local
                            array.
                        */
                        let infoWindow = new google.maps.InfoWindow({
                            content: windowString
                        });

                        this.infoWindows.push( infoWindow );
                        
                        /*
                        Add the event listener to open the info window for the marker.
                        */ 
                        marker.addListener('click', function() {
                            // infoWindow.close();
                            // if (infoWindow) { infoWindow.close();}
                            infoWindow.open(this.map, this);
                        });
                        //Allow each marker to have an info window    
                        // google.maps.event.addListener(marker, 'spider_click', (function(marker, i) {
                        //     console.log('hey');
                        //     return function() {
                        //         infoWindow.setContent(windowString);
                        //         infoWindow.open(this.map, marker);
                        //     }
                        // })(marker, i));
                        // let theMap = this.map;
                        // let infoWindow = new google.maps.InfoWindow();
                        // this.oms.addListener('click', function(marker, event, i) {
                        //     infoWindow.setContent('hey');
                        //     infoWindow.open(theMap, marker);
                        // });
                        // bounds.extend( app.markers[i].getPosition()); 
                        this.oms.addMarker(marker);

                    } else {
                        return
                    }

                }
                
                /*
                    Bring map back to original position
                */ 
                // Makea a latlng from original co-ords
                let LatLng = new google.maps.LatLng(43.52385109999999,-79.71254299999998);
                // Position the map accordingly
                this.map.panTo(LatLng);
                this.map.setZoom(4);
                this.map.panBy(-80, -120);
            },
            setMarkers(type){
                // app.clearMarkers();

                // Let's combine this method with rebuildMarkers
                // We can set a variable to contain the right set of locations with a conditional
                this.markers = [];
                this.infoWindows = [];

                // Icons
                let blueMarker = 'https://parkpeople.ca/listings/custom/uploads/2018/04/blue_marker_svg.svg';
                let orangeMarker = 'https://parkpeople.ca/listings/custom/uploads/2018/04/orange_marker_svg.svg';
                let greenMarker = 'https://parkpeople.ca/listings/custom/uploads/2018/04/green_marker_small.svg';

                /*
                    Iterate over all of the cafes
                */
                for( var i = 0; i < this.locations.length; i++ ){
                    /*
                        Set marker position
                    */
                    let theposition = new google.maps.LatLng(this.locations[i].lat, this.locations[i].lng);

                    /*
                        Choose marker style based on type
                    */
                    if (this.locations[i].type == 'event') {
                        
                        let the_icon = '';
                        if (this.locations[i].timeframe == 'morethan30') {
                            the_icon = blueMarker;
                        } else if (this.locations[i].timeframe == 'within30') {
                            the_icon = orangeMarker;
                        } else {
                            the_icon = greenMarker; 
                        }

                        /*
                            Create the marker for each of the locations and set the
                            latitude and longitude to the latitude and longitude
                            of the location. Also set the map to be the local map.
                        */
                        var marker = new google.maps.Marker({
                            position: theposition,
                            map: this.map,
                            title: this.locations[i].title,
                            icon: {
                                url: the_icon
                            }
                        });

                        /*
                            Push the new marker on to the array.
                        */
                        this.markers.push( marker );

                        /*
                            Create the group string
                        */
                        // let groupString ='';
                        // if (locations[i].listing[1] != undefined) {
                        //     groupString = '<p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-users"></i> '+  this.locations[i].listing[1] +'</p>';
                        // } else {
                        //     groupString = '';
                        // }

                        let windowString = '';

                        if (this.locations[i].timeframe == 'past') {
                            windowString = '<div style="width: 250px;">' + '<h6 style="margin-bottom: 10px;font-size: 16px;">'+ this.locations[i].title + '</h6><p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-users"></i> '+  this.locations[i].listing[1] +'</p><p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-calendar-o" aria-hidden="true"></i> '+  this.locations[i].nice_start_date +'</p><p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-clock-o" aria-hidden="true"></i> '+this.locations[i].start_time+' - '+this.locations[i].end_time+'</p><span>'+this.locations[i].timeframe+'</span></div>';
                        } else {
                            windowString = '<div style="width: 250px;">' + '<h6 style="margin-bottom: 10px;font-size: 16px;"><a href="https://parkpeople.ca/listings/events/?n='+ this.locations[i].slug+ '&id='+ this.locations[i].id +'&tdgrant=true" target="_blank">'+ this.locations[i].title +'</a></h6><p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-users"></i> '+  this.locations[i].listing[1] +'</p><p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-calendar-o" aria-hidden="true"></i> '+  this.locations[i].nice_start_date +'</p><p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-clock-o" aria-hidden="true"></i> '+this.locations[i].start_time+' - '+this.locations[i].end_time+'</p><span>'+this.locations[i].timeframe+'</span></div>';
                        }

                        /*
                            Create the info window and add it to the local
                            array.
                        */
                        let infoWindow = new google.maps.InfoWindow({
                            content: windowString
                        });

                        this.infoWindows.push( infoWindow );
                        
                        /*
                        Add the event listener to open the info window for the marker.
                        */ 
                        marker.addListener('click', function() {
                            // infoWindow.close();
                            // if (infoWindow) { infoWindow.close();}
                            infoWindow.open(this.map, this);
                        });
                        //Allow each marker to have an info window    
                        // google.maps.event.addListener(marker, 'spider_click', (function(marker, i) {
                        //     console.log('hey');
                        //     return function() {
                        //         infoWindow.setContent(windowString);
                        //         infoWindow.open(this.map, marker);
                        //     }
                        // })(marker, i));
                        // let theMap = this.map;
                        // let infoWindow = new google.maps.InfoWindow();
                        // this.oms.addListener('click', function(marker, event, i) {
                        //     infoWindow.setContent('hey');
                        //     infoWindow.open(theMap, marker);
                        // });
                        
                        this.oms.addMarker(marker);

                        // var windowString = '<div style="width: 250px;">' + '<h6 style="margin-bottom: 10px;font-size: 16px;"><a href="'+ 'eLink' +'">'+ this.locations[i].title +'</a></h6><p style="margin:0;font-size:12px;"><i class="fa fa-users"></i> '+  this.locations[i].listing[1] +'</p><p style="margin:0;font-size:12px;"><i class="fa fa-calendar-o" aria-hidden="true"></i> '+  this.locations[i].start_date +'</p><p style="margin:0;font-size:12px;"><i class="fa fa-clock-o" aria-hidden="true"></i> '+this.locations[i].start_time+' - '+this.locations[i].end_time+'</p></div>';

                        // windowArray.push(windowString);
                        // this.windows.push(windowArray);
                        
                        // var infoWindow = new google.maps.InfoWindow(), marker, i;
                    } else {
                        return
                    }

                }

                this.map.panBy(-80, -120);

            }
        },
        computed: {
            locations(){
                return this.$store.getters.allLocations;
                // return this.$store.getters.allActiveEvents;
            },
            activeMarkers(){
                // return this.$store.getters.activeMarkers;
                return this.$store.getters.allActiveEvents;
                // if (this.$store.getters.allActiveEvents.length > 0) {
                //     return this.$store.getters.allActiveEvents;
                // } else {
                //     return this.$store.getters.allLocations;
                // }
            },
            activeInfoWindows(){
                return this.$store.getters.activeInfoWindows;
            },
            activeEvents(){
                // console.log(this.$store.state.activeEvents[0]);
                if (this.$store.state.activeEvents[0] == 'init') {
                    console.log('activeEvents = initial load');
                    return this.$store.state.allLocations;
                } else if (this.$store.state.activeEvents.length > 0) {
                    console.log('activeEvents is not empty');
                    return this.$store.state.activeEvents;
                } else {
                    console.log('activeEvents is empty');
                    // return this.$store.state.activeEvents;
                    return this.$store.state.allLocations;
                }
            }
        },
        watch: {
            /*
                Watches the list of locations in the store. 
                When they are updated, clear the markers and re build them.
                TKNOTE: This is eventually should be attached to the getter that contained filtered results.
            */
            locations(){
                // this.clearMarkers();
                this.buildMarkers();
                // this.checkLoader();
            },
            activeMarkers(){
                // this.clearMarkers();
                this.rebuildMarkers();
                // this.checkLoader();
            }
        },
    }
</script>

<style lang="scss" scoped>

@import '../../styles/variables.scss';
@import '../../styles/components/loader.scss';
@import '../../styles/components/map.scss';

</style>