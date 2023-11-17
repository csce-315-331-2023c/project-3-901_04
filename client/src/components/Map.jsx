// Map.jsx
import React, {useEffect} from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';  

/* const Map = withGoogleMap(({ location }) => (
  <GoogleMap
    defaultZoom={15}
    defaultCenter={{ lat: location.lat, lng: location.lng }}
  >
    <Marker position={{ lat: location.lat, lng: location.lng }} />
  </GoogleMap>
)); */

/* const Map = () => {
  useEffect(() => {
    // Load Google Maps API script dynamically
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBngrehX3C19VORW1xnYpYn8GyYbIsD-GA&libraries=maps,marker&v=beta';
    script.async = true;

    script.onerror = () => {
      console.error('Error loading Google Maps API script.');
    };

    document.head.appendChild(script);

    // Cleanup the script tag on component unmount
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div style={{ height: '100%' }}>
      <gmp-map center="30.623876571655273,-96.33992004394531" zoom="14" map-id="DEMO_MAP_ID">
        <gmp-advanced-marker position="30.623876571655273,-96.33992004394531" title="My location"></gmp-advanced-marker>
      </gmp-map>
    </div>
  );
};

export default Map; */
class GMap extends React.Component {
  render() {
      const mapStyles = {
          width: 700,
          height: 500,
      };

      return (
          <Map
              google={this.props.google}
              zoom={16}
              style={mapStyles}
              initialCenter={{ lat: 30.623876571655273, lng: -96.33992004394531 }}
          >
              <Marker
                  position={{ lat: 30.623876571655273, lng: -96.33992004394531 }}
                  title={"Mo's Irish Pub"}
              />
          </Map>
      );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBngrehX3C19VORW1xnYpYn8GyYbIsD-GA'
})(GMap);