import React from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

class GoogleMapsComponent extends React.Component {
    render() {
        const mapStyles = {
            width: '100%',
            height: '100%',
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
                    title={"Mo's"}
                />
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyBngrehX3C19VORW1xnYpYn8GyYbIsD-GA'
})(GoogleMapsComponent);
