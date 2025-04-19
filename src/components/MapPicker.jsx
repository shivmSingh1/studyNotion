// MapWithDraggableMarker.jsx

import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
	width: '100%',
	height: '400px'
};

// Default location (Delhi)
const center = {
	lat: 28.6139,
	lng: 77.2090
};

function MapPicker() {
	console.log("env", import.meta.env)
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
	});

	const [markerPosition, setMarkerPosition] = useState(center);

	// Drag end hone par ye function call hoga
	const onMarkerDragEnd = useCallback((event) => {
		const newLat = event.latLng.lat();
		const newLng = event.latLng.lng();
		setMarkerPosition({ lat: newLat, lng: newLng });
		console.log("New position:", newLat, newLng);
	}, []);

	if (!isLoaded) return <div>Loading...</div>;

	return (
		<GoogleMap
			mapContainerStyle={containerStyle}
			center={markerPosition}
			zoom={12}
		>
			<Marker
				position={markerPosition}
				draggable={true}
				onDragEnd={onMarkerDragEnd}
			/>
		</GoogleMap>
	);
}

export default MapPicker;