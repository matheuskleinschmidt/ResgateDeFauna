import React from 'react';
import {
  RMap,
  ROSM,
  RLayerVector,
  RFeature,
  RStyle,
} from 'rlayers';
import { fromLonLat } from 'ol/proj';
import { LineString } from 'ol/geom';
import 'ol/ol.css';

const data = [
  {
    id: 11,
    releaseLocationCoordinates: {
      latitude: -26.2663045,
      longitude: -48.8039795,
    },
    locationCoordinates: {
      latitude: -26.2663383,
      longitude: -48.803985,
    },
  },
];

function isValidCoordinates(coords) {
  return (
    coords &&
    coords.latitude != null &&
    coords.longitude != null
  );
}

function MapComponent({ rescues }) {
  if (!data || data.length === 0) {
    return <div>Carregando mapa...</div>;
  }

  const initialCoords = [
    data[0].locationCoordinates.longitude,
    data[0].locationCoordinates.latitude,
  ];

  return (
    <RMap
      width="100%"
      height="70vh"
      initial={{ center: fromLonLat(initialCoords), zoom: 18 }}
    >
      <ROSM />
      <RLayerVector>
        {data.map((item) => {
          if (
            isValidCoordinates(item.locationCoordinates) &&
            isValidCoordinates(item.releaseLocationCoordinates)
          ) {
            const coordinates = [
              fromLonLat([
                item.locationCoordinates.longitude,
                item.locationCoordinates.latitude,
              ]),
              fromLonLat([
                item.releaseLocationCoordinates.longitude,
                item.releaseLocationCoordinates.latitude,
              ]),
            ];
            return (
              <RFeature key={item.id} geometry={new LineString(coordinates)}>
                <RStyle.RStyle>
                  <RStyle.RStroke color="blue" width={2} />
                </RStyle.RStyle>
              </RFeature>
            );
          } else {
            return null; 
          }
        })}
        {rescues && rescues.map((item) => {
          if (
            isValidCoordinates(item.locationCoordinates) &&
            isValidCoordinates(item.releaseLocationCoordinates)
          ) {
            const coordinates = [
              fromLonLat([
                item.locationCoordinates.longitude,
                item.locationCoordinates.latitude,
              ]),
              fromLonLat([
                item.releaseLocationCoordinates.longitude,
                item.releaseLocationCoordinates.latitude,
              ]),
            ];
            return (
              <RFeature key={item.id} geometry={new LineString(coordinates)}>
                <RStyle.RStyle>
                  <RStyle.RStroke color="blue" width={2} />
                </RStyle.RStyle>
              </RFeature>
            );
          } else {
            return null;
          }
        })}
      </RLayerVector>
    </RMap>
  );
}

export default MapComponent;
