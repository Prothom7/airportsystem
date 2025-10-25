"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet"; 
import "leaflet/dist/leaflet.css";

interface TaxiMapProps {
  pickupCoords: [number, number] | null;
  dropoffCoords: [number, number] | null;
  setPickupCoords: (coords: [number, number]) => void;
  setDropoffCoords: (coords: [number, number]) => void;
}

const pickupIcon = L.icon({
  iconUrl: "/image/pickup.png", 
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const dropoffIcon = L.icon({
  iconUrl: "/image/pickup.png", 
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});


const LocationMarker = ({
  type,
  setPickupCoords,
  setDropoffCoords,
}: {
  type: "pickup" | "dropoff";
  setPickupCoords: (coords: [number, number]) => void;
  setDropoffCoords: (coords: [number, number]) => void;
}) => {
  useMapEvents({
    click(e) {
      const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
      if (type === "pickup") setPickupCoords(coords);
      else setDropoffCoords(coords);
    },
  });
  return null;
};

const TaxiMap: React.FC<TaxiMapProps> = ({
  pickupCoords,
  dropoffCoords,
  setPickupCoords,
  setDropoffCoords,
}) => {
  return (
    <MapContainer
      center={pickupCoords || [20, 77]}
      zoom={12}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {pickupCoords && (
        <Marker position={pickupCoords} icon={pickupIcon}>
          <Popup>Pickup Location</Popup>
        </Marker>
      )}

      {dropoffCoords && (
        <Marker position={dropoffCoords} icon={dropoffIcon}>
          <Popup>Dropoff Location</Popup>
        </Marker>
      )}

      <LocationMarker
        type="dropoff"
        setPickupCoords={setPickupCoords}
        setDropoffCoords={setDropoffCoords}
      />
    </MapContainer>
  );
};

export default TaxiMap;
