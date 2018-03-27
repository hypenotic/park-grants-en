<template v-if="this.$store.state.locationList != null">
    <div>
        <app-filter></app-filter>
        <div class="map-container">
            <section class="google-map" id="grants-map"></section>
            <!-- <input id="pac-input" class="controls" type="text" placeholder="Enter your address to find park groups and events near you." style="position: absolute; top: 0; z-index: 15; ">
            <div id="reset-location" class="button hidden-reset-loc" style="position: absolute; z-index: 1; ">Reset Location</div> -->
        </div>
    </div>
</template>

<script>
    import Filter from './Filter.vue';
    export default {
        components: {
            appFilter: Filter
        },
        props: ['data'],
        data() {
            return {
                mapName: "grants-map",
                markerCoordinates: [],
                map: null,
                bounds: null,
                markers: [],
                posts: [],
                lat: '',
                lng: ''
            }
        },
        mounted() {
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                var isDraggable = false;
            } else {
                var isDraggable = true;
            }
            this.markerCoordinates.push(
                {latitude: 43.52385109999999, longitude: -79.71254299999998},
            );
            this.bounds     = new google.maps.LatLngBounds();
            const element   = document.getElementById(this.mapName)
            const mapCentre = this.markerCoordinates[0]
            const options   = {
                // How zoomed in you want the map to start at (always required)
                zoom: 15,

                scrollwheel:  false,
                draggable: isDraggable,

                // The latitude and longitude to center the map (always required)
                center: new google.maps.LatLng(43.52385109999999, -79.71254299999998), 

                // How you would like to style the map. 
                // This is where you would paste any style found on Snazzy Maps.
                styles: [{"featureType": 'poi.park', elementType: 'geometry',stylers: [{color: '#137E23'}]},{"featureType":"poi.business","stylers": [{ "visibility": "off" }]},{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}]
            }
            this.map = new google.maps.Map(element, options);
            
            var markers_array = [];
            this.map.panBy(0, -120);

            this.buildMarkers();
        },
        methods: {
            buildMarkers(){
                this.markers = [];
                /*
                    Iterate over all of the cafes
                */
                for( var i = 0; i < this.$store.state.locationList.length; i++ ){

                    /*
                    Create the marker for each of the cafes and set the
                    latitude and longitude to the latitude and longitude
                    of the cafe. Also set the map to be the local map.
                    */
                    var marker = new google.maps.Marker({
                    position: { lat: parseFloat( this.$store.state.locationList[i].lat ), lng: parseFloat( this.$store.state.locationList[i].lng ) },
                    map: this.map
                    });

                    /*
                    Push the new marker on to the array.
                    */
                    this.markers.push( marker );
                }
            }
        },
        computed: {
        },
    }
</script>

<style lang="scss" scoped>

@import '../styles/variables.scss';

.contact-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 50px 0;
}

.map-container {
    position: relative;
}

#grants-map {
	width: 100%;
    min-height: 80vh;
    margin-bottom: 50px;
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
		// padding: 20px;
	}
	@media #{$small-and-down} {
		width: 90%;
		margin-left: 5%;
		margin-top: 5%;
	}
}   

</style>