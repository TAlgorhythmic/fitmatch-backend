import React from "react";
import { Autocomplete, GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const libs = ["maps", "marker", "places"];

export default function MapLocationPicker(props) {

    const setLocation = props.setLocation;
    const location = props.location;
    const onChange = props.onChange;
    const i = React.useRef(null);
    const iMap = React.useRef(null);
    const geocoder = React.useRef(null);

    const isApiLoaded = useJsApiLoader({
        googleMapsApiKey: "AIzaSyDRX596iAVeF6aX9PT3PkgeN-GK0ytG99A",
        libraries: libs
      }).isLoaded;

    // Centre d'espanya aprox
    const center = {
        lat: 40.463667,
        lng: -3.74922
    };

    if (!isApiLoaded) {
        return <></>;
    }

    function handleChange(e) {
        setLocation({
            ...location,
            address: e.target.value
        })
    }

    function onPlaceChanged() {
        const place = i.current.getPlace();
        if (place.geometry) {
            const address = place.formatted_address || place.name;
            const latitude = place.geometry.location.lat();
            const longitude = place.geometry.location.lng();

            console.log(address);

            setLocation({
                address: address,
                lat: latitude,
                lng: longitude
            });
        }
    }

    function onMapClick(ev) {
        const lat = ev.latLng.lat();
        const lng = ev.latLng.lng();
        
        geocoder.current.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results[0]) {
                setLocation({
                    address: results[0].formatted_address,
                    lat: lat,
                    lng: lng
                })
            } else {
                setLocation({
                    address: `${lat}, ${lng}`,
                    lat: lat,
                    lng: lng
                })
            }
        })
    }

    if (!isApiLoaded) return <></>;

    return (
        <>
            <GoogleMap
                mapContainerClassName="map map-box bottom-margin"
                center={location.lat && location.lng ? location : center}
                zoom={6}
                options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false
                }}
                onLoad={
                    im => {
                        iMap.current = im;
                        geocoder.current = new window.google.maps.Geocoder();
                    }}
                onClick={onMapClick}
            >
                {location.lat && location.lng ? (
                        <Marker position={location} />
                ) : <></>}
                <Autocomplete onLoad={instance => i.current = instance} onPlaceChanged={onPlaceChanged}>
                    <input
                        id="search"
                        className="search-input"
                        name="search"
                        onChange={e => {
                            handleChange(e);
                            if (onChange) onChange(e);
                        }}
                        value={location.address}
                        type="text"
                        placeholder="Buscar ubicaciones"
                    />
                </Autocomplete>
            </GoogleMap>
        </>
    );
}