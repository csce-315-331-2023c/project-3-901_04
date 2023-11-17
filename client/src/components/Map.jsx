// Map.jsx
import React from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

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