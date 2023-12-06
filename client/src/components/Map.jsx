import React from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import '../styles/Home.css';

/**
 * GMap Component - Displays a Google Map with a marker for Mo's Irish Pub.
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.google - Google API object provided by the GoogleApiWrapper.
 * @returns {JSX.Element} - Rendered component.
 */
class GMap extends React.Component {
  /**
   * Render function for the GMap component.
   * @returns {JSX.Element} - Rendered component.
   */
  render() {
    const mapStyles = {
      width: "39.6vw",
      height: "44.0vh",
      position: "inline",
      border: "3px solid #333",
      display: "inline"
    };

    return (
      <div class="theMap">
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
      </div>
    );
  }
}

// Wrap the GMap component with the GoogleApiWrapper and provide the API key
export default GoogleApiWrapper({
  apiKey: 'AIzaSyBngrehX3C19VORW1xnYpYn8GyYbIsD-GA'
})(GMap);
