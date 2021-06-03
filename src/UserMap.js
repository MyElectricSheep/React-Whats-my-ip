import React from "react";
import { Map, TileLayer } from "react-leaflet";

const UserMap = ({ position, zoom }) => {
  return (
    <Map center={position} zoom={zoom} zoomControl={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
    </Map>
  );
};

export default UserMap;
