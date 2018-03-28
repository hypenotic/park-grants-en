<template v-if="this.$store.state.locationList != null">
    <div>
        <app-filter></app-filter>
        <div class="map-container">
            <section class="google-map" id="grants-map"></section>
            <section class="map-list"></section>
            <div class="loading" v-bind:class="{ 'active-loader': showLoader }">Loading&#8230;</div>
            <input id="pac-input" class="controls small-search" type="text" placeholder="Enter your address to find park groups and events near you." style="position: absolute; top: 0; z-index: 15; ">
            <!-- <div id="reset-location" class="button hidden-reset-loc" style="position: absolute; z-index: 1; ">Reset Location</div> -->
        </div>
    </div>
</template>

<script>
    import Filter from './Filter.vue';
    export default {
        components: {
            appFilter: Filter
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
                markers: [],
                infoWindows: [],
                posts: [],
                showLoader: true
                // lat: '',
                // lng: ''
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
                styles: [{"featureType": 'poi.park', elementType: 'geometry',stylers: [{color: '#137E23'}]},{"featureType":"poi.business","stylers": [{ "visibility": "off" }]},{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}]
            }

            let input = document.getElementById('pac-input');
            this.searchBox = new google.maps.places.SearchBox(input);
            
            // Listen for the event fired when the user selects a prediction and retrieve more details for that place.
            this.searchBox.addListener('places_changed', function() {
                console.log('rbwrbwrvsr');
                // var places = searchBox.getPlaces();
                
                // if (places.length == 0) {
                //     return;
                // }

                // $('#reset-location').removeClass('hidden-reset-loc');
                // $('#pac-input').addClass('small-search');
                // // console.log(places);

                // // Might have to do a check for activities and type filter
                // // TK NOTE
                // showAllMarkers();
                // showListAll('list-item');
                // hide10k();
                // showHide();
                

                // // Clear out the old markers.
                // markers.forEach(function(marker) {
                //     marker.setMap(null);
                // });
                // markers = [];
                // // console.log(markers);

                // // For each place, get the icon, name and location.
                // // for (var i=0, n=arr.length; i < n; i++){}
                // var bounds = new google.maps.LatLngBounds();
                // places.forEach(function(place) {
                //     if (!place.geometry) {
                //         console.log("Returned place contains no geometry");
                //         return;
                //     }

                //     var placeLat = place.geometry.location.lat();
                //     var placeLng = place.geometry.location.lng();

                //     var originPlace = new google.maps.LatLng(placeLat, placeLng);
                //     // console.log(originPlace); 
                //     // console.log(placeLat, placeLng); 
                    
                //     var icon = {
                //         url: place.icon,
                //         size: new google.maps.Size(71, 71),
                //         origin: new google.maps.Point(0, 0),
                //         anchor: new google.maps.Point(17, 34),
                //         scaledSize: new google.maps.Size(25, 25)
                //     };

                //     // Create a marker for each place.
                //     markers.push(new google.maps.Marker({
                //         map: map,
                //         icon: icon,
                //         title: place.name,
                //         position: place.geometry.location,
                //     }));

                //     if (place.geometry.viewport) {
                //     // Only geocodes have viewport.
                //         bounds.union(place.geometry.viewport);
                //     } else {
                //         bounds.extend(place.geometry.location);
                //     }
                // })
                // map.fitBounds(bounds);
                // zoomChangeBoundsListener = 
                // google.maps.event.addListenerOnce(map, 'bounds_changed', function(event) {
                //     if (this.getZoom()){
                //         console.log(map.getZoom());
                //         var oldZoom = map.getZoom();
                //         this.setZoom(oldZoom-1);
                //     }
                // });
                // setTimeout(function(){google.maps.event.removeListener(zoomChangeBoundsListener)}, 1000);
            });

            this.map = new google.maps.Map(element, options);

            this.oms = new OverlappingMarkerSpiderfier(this.map, {
                markersWontMove: true,
                markersWontHide: true,
                basicFormatEvents: true
            });

            this.buildMarkers();
        },
        methods: {
            triggerSearch() {
                console.log('CHANGE');
            },
            buildMarkers(){
                this.markers = [];
                this.infoWindows = [];
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
                        if (this.locations[i].timeframe =='morethan30') {
                            the_icon = 'data:image/svg+xml;utf-8, \
                            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"> \
                                <circle cx="16" cy="16" r="12" stroke="#1687b7" stroke-width="4" fill="#1a97c9" /> \
                            </svg>';
                        } else if (this.locations[i].timeframe =='within30') {
                            the_icon = 'data:image/svg+xml;utf-8, \
                            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"> \
                                <circle cx="16" cy="16" r="12" stroke="#1eb1f2" stroke-width="4" fill="#eaeaea" /> \
                            </svg>';
                        } else {
                            the_icon = 'data:image/svg+xml;utf-8, \
                            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"> \
                                <circle cx="16" cy="16" r="12" stroke="#d1d1d1" stroke-width="4" fill="#e3e3e3" /> \
                            </svg>';
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


                        // let groupString ='';
                        // if (locations[i].listing[1] != undefined) {
                        //     groupString = '<p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-users"></i> '+  this.locations[i].listing[1] +'</p>';
                        // } else {
                        //     groupString = '';
                        // }

                        var windowString = '<div style="width: 250px;">' + '<h6 style="margin-bottom: 10px;font-size: 16px;"><a href="https://parkpeople.ca/listings/events/?n='+ this.locations[i].slug+ '/&id='+ this.locations[i].id +'" target="_blank">'+ this.locations[i].title +'</a></h6><p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-users"></i> '+  this.locations[i].listing[1] +'</p><p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-calendar-o" aria-hidden="true"></i> '+  this.locations[i].start_date +'</p><p style="margin:0;font-size:12px;line-height: 1.5;"><i class="fa fa-clock-o" aria-hidden="true"></i> '+this.locations[i].start_time+' - '+this.locations[i].end_time+'</p></div>';

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

            },
            clearMarkers(){
                /*
                    Iterate over all of the markers and set the map
                    to null so they disappear.
                */
                for( var i = 0; i < this.markers.length; i++ ){
                this.markers[i].setMap( null );
                }
            },
            checkLoader(){
                if (this.$store.state.locationList.length > 0) {
                    this.showLoader = false;
                } else {
                    this.showLoader = true;
                }
            },
        },
        computed: {
            locations(){
                return this.$store.getters.allLocations;
            }
        },
        watch: {
            /*
                Watches the cafes. When they are updated, clear the markers
                and re build them.
            */
            locations(){
                this.clearMarkers();
                this.buildMarkers();
                this.checkLoader();
            }
        },
    }
</script>

<style lang="scss" scoped>

@import '../styles/variables.scss';
@import '../styles/components/loader.scss';
@import '../styles/components/map.scss';

.contact-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 50px 0;
}

.map-container {
    position: relative;
}

.map-container.list-open {
    .map-list {
        display: inline-block;
        width: 30%;
        height: 80vh;
        background: $white;
    }
    #grants-map {
	    width: 70%;
    }
}

#grants-map {
	width: 100%;
    min-height: 80vh;
    margin-bottom: 50px;
    display: inline-block;
}


.contact__single__copy {
    font-size: 21px;
    line-height: 1.3;
    h4 {
        font-size: 32px;
        margin: 0;
        color: #444;
    }
    img {
        display: block;
        margin: 0 auto;
    }
}

.contact__single__buttons {
    text-align: center;
    button {
        font-family: "Audimat3000-Regulier",sans-serif;
        font-size: 24px;
        width: 90%;
        height: 60px;
        padding: 10px 15px;
        color: #fcd838;
        margin-top: 20px;
        background-color: #000;
        border: none;
    }
    a, h3 {
        text-decoration: none;
        font-family: 'Audimat3000-Leger',sans-serif;
    }
    h3 span {
        border-bottom: 1px solid grey;
    }
}

#pac-input {
	background-color: #fff;
	font-size: 16px;
	font-weight: 300;
	margin-left: 12px;
	text-overflow: ellipsis;
	width: 400px;
	border: 2px dashed #0072C2;
	border-radius: 5px;
	color: #666666;
	padding: .9em .5em;
	transition: all 0.5s ease;
	font-family: 'Dosis', sans-serif;
	@media #{$medium-and-up} {
		width: 80%;
		font-size: 40px;
		margin-left: 10%;
		margin-top: 15%;
		padding: 20px;
	}
	@media #{$small-and-down} {
		width: 90%;
		margin-left: 5%;
		margin-top: 5%;
	}
}   

#pac-input.small-search {
	background-color: #fff;
	font-size: 16px;
	font-weight: 300;
	margin-left: 12px;
	text-overflow: ellipsis;
	width: 400px;
	border: 2px dashed #0072C2;
	border-radius: 5px;
	color: #666666;
	padding: .8em;
	@media #{$medium-and-up} {
		width: 600px;
		margin-left: 12px;
		margin-top: 16px;
		// font-size: 30px;
	}
	@media #{$small-and-down} {
		width: 90%;
		margin-left: 5%;
		margin-top: 5%;
	}
}

#pac-input:focus {
		border-color: #4d90fe;
}

</style>