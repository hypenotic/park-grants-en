<template>
  <div>
    <div id="map" ref="map"></div>
  </div>
</template>

<script>
import axios from "axios";
import MarkerClusterer from "@googlemaps/markerclustererplus";
export default {
  name: "App",
  data() {
    return {
      center: { lat: 48.6822591, lng: -92.5988429 },
      events: [],
      locations: []
    };
  },
  mounted() {
    axios
      .get("https://parkpeople.ca/wp-json/wp/v2/eventsapp")
      .then(response => {
        this.events = response.data;
        this.setLocations();
        this.initMap();
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  methods: {
    setLocations() {
      this.events.forEach(e => {
        if (e.event_td_grant == 1) {
          this.locations.push({
            lat: parseFloat(e.lat),
            lng: parseFloat(e.lng),
            title: e.title,
            image: e.image,
            slug: e.slug,
            address: e.address,
            description: e.description
          });
        }
      });
    },
    initMap() {
      const styledMapType = new window.google.maps.StyledMapType(
        [
          {
            featureType: "administrative",
            elementType: "geometry.fill",
            stylers: [
              {
                color: "#7f2200"
              },
              {
                visibility: "off"
              }
            ]
          },
          {
            featureType: "administrative",
            elementType: "geometry.stroke",
            stylers: [
              {
                visibility: "on"
              },
              {
                color: "#87ae79"
              }
            ]
          },
          {
            featureType: "administrative",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#495421"
              }
            ]
          },
          {
            featureType: "administrative",
            elementType: "labels.text.stroke",
            stylers: [
              {
                color: "#ffffff"
              },
              {
                visibility: "on"
              },
              {
                weight: 4.1
              }
            ]
          },
          {
            featureType: "administrative.locality",
            elementType: "all",
            stylers: [
              {
                visibility: "on"
              }
            ]
          },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#566f39"
              }
            ]
          },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.stroke",
            stylers: [
              {
                color: "#ffffff"
              }
            ]
          },
          {
            featureType: "administrative.neighborhood",
            elementType: "labels",
            stylers: [
              {
                visibility: "off"
              }
            ]
          },
          {
            featureType: "administrative.land_parcel",
            elementType: "labels",
            stylers: [
              {
                visibility: "off"
              }
            ]
          },
          {
            featureType: "landscape",
            elementType: "geometry.fill",
            stylers: [
              {
                color: "#abce83"
              }
            ]
          },
          {
            featureType: "landscape",
            elementType: "labels",
            stylers: [
              {
                visibility: "off"
              }
            ]
          },
          {
            featureType: "poi",
            elementType: "geometry.fill",
            stylers: [
              {
                color: "#769E72"
              }
            ]
          },
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [
              {
                visibility: "off"
              }
            ]
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#7B8758"
              }
            ]
          },
          {
            featureType: "poi",
            elementType: "labels.text.stroke",
            stylers: [
              {
                color: "#EBF4A4"
              }
            ]
          },
          {
            featureType: "poi.park",
            elementType: "all",
            stylers: [
              {
                visibility: "on"
              }
            ]
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [
              {
                visibility: "simplified"
              },
              {
                color: "#8dab68"
              }
            ]
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#ffffff"
              },
              {
                weight: "0.5"
              }
            ]
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.stroke",
            stylers: [
              {
                color: "#51823a"
              }
            ]
          },
          {
            featureType: "road",
            elementType: "all",
            stylers: [
              {
                visibility: "on"
              }
            ]
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [
              {
                visibility: "off"
              }
            ]
          },
          {
            featureType: "road",
            elementType: "geometry.fill",
            stylers: [
              {
                visibility: "simplified"
              }
            ]
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [
              {
                visibility: "simplified"
              }
            ]
          },
          {
            featureType: "road",
            elementType: "labels",
            stylers: [
              {
                visibility: "simplified"
              }
            ]
          },
          {
            featureType: "road",
            elementType: "labels.text",
            stylers: [
              {
                visibility: "simplified"
              }
            ]
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#5B5B3F"
              },
              {
                visibility: "simplified"
              }
            ]
          },
          {
            featureType: "road",
            elementType: "labels.text.stroke",
            stylers: [
              {
                color: "#ffffff"
              },
              {
                visibility: "simplified"
              }
            ]
          },
          {
            featureType: "road",
            elementType: "labels.icon",
            stylers: [
              {
                visibility: "on"
              }
            ]
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [
              {
                color: "#ebf4a4"
              }
            ]
          },
          {
            featureType: "road.highway",
            elementType: "labels.icon",
            stylers: [
              {
                visibility: "off"
              }
            ]
          },
          {
            featureType: "road.arterial",
            elementType: "geometry",
            stylers: [
              {
                color: "#a0c176"
              }
            ]
          },
          {
            featureType: "road.arterial",
            elementType: "labels.icon",
            stylers: [
              {
                visibility: "off"
              }
            ]
          },
          {
            featureType: "road.local",
            elementType: "geometry",
            stylers: [
              {
                color: "#A4C67D"
              },
              {
                visibility: "on"
              }
            ]
          },
          {
            featureType: "transit",
            elementType: "all",
            stylers: [
              {
                visibility: "off"
              }
            ]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [
              {
                visibility: "on"
              },
              {
                color: "#ceefee"
              }
            ]
          }
        ],
        { name: "Styled Map" }
      );
      const map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: this.center,
        mapTypeControl: false,
        streetViewControl: false
      });
      let infowindow = new window.google.maps.InfoWindow();
      //Associate the styled map with the MapTypeId and set it to display.
      map.mapTypes.set("styled_map", styledMapType);
      map.setMapTypeId("styled_map");
      const markers = this.locations.map((location, i) => {
        let marker = new window.google.maps.Marker({
          position: location,
          icon: "src/assets/pin.png",
          map: map,
          title: location.title
        });
        marker.addListener(
          "click",
          (marker => {
            return () => {
              infowindow.setContent(
                '<div id="iw-container">' +
                  '<div class="iw-content">' +
                  '<img style="height: 100px; width: 100%; object-fit:cover" src="' +
                  location.image +
                  '"/>' +
                  '<table><tr><td style="width:50%; vertical-align: top; padding: 20px 10px 20px 20px;">' +
                  '<div class="iw-title">' +
                  location.title +
                  "</a>" +
                  "<br><br>" +
                  location.address +
                  "</td>" +
                  '<td style="width:50%; vertical-align: top; padding: 20px 20px 20px 10px;">' +
                  "<p style=\"font: normal normal 15px/18px 'Dosis'\">" +
                  location.description +
                  "</p>" +
                  "</td></tr></table>" +
                  "</div>" +
                  "</div>" +
                  "</div>"
              );
              infowindow.open(map, marker);
            };
          })(marker, i)
        );
        return marker;
      });
      // Add a marker clusterer to manage the markers.
      new MarkerClusterer(map, markers, {
        imagePath: "src/assets/m"
      });
    }
  }
};
</script>

<style>
html,
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#map {
  height: 600px;
  background: gray;
}
</style>
