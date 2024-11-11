import React from 'react';
import {
  RMap,
  ROSM,
  RLayerVector,
  RFeature,
  RStyle,
} from 'rlayers';
import { fromLonLat } from 'ol/proj';
import { LineString, Point } from 'ol/geom';
import { Fill, Stroke } from 'ol/style';
import 'ol/ol.css';

function isValidCoordinates(coords) {
  return coords && coords.latitude != null && coords.longitude != null;
}

function getMidpoint(fromCoords, toCoords) {
  return [
    (fromCoords[0] + toCoords[0]) / 2,
    (fromCoords[1] + toCoords[1]) / 2,
  ];
}

function calculateAngle(fromCoords, toCoords) {
  const dx = toCoords[0] - fromCoords[0];
  const dy = toCoords[1] - fromCoords[1];
  return Math.atan2(dy, dx);
}

const arrowIcon =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
      <polygon points="0,5 15,10 0,15" fill="red" />
    </svg>
  `);

function MapComponent({ rescues }) {
  if (!rescues || rescues.length === 0) {
    return <div>Carregando mapa...</div>;
  }

  const initialRescue = rescues.find((item) =>
    isValidCoordinates(item.locationCoordinates)
  );

  const initialCoords = initialRescue
    ? [
        initialRescue.locationCoordinates.longitude,
        initialRescue.locationCoordinates.latitude,
      ]
    : [0, 0];

  const createFeatures = (item) => {
    if (
      isValidCoordinates(item.locationCoordinates) &&
      isValidCoordinates(item.releaseLocationCoordinates)
    ) {
      const from = [
        item.locationCoordinates.longitude,
        item.locationCoordinates.latitude,
      ];
      const to = [
        item.releaseLocationCoordinates.longitude,
        item.releaseLocationCoordinates.latitude,
      ];

      const fromProjected = fromLonLat(from);
      const toProjected = fromLonLat(to);

      const midpoint = getMidpoint(fromProjected, toProjected);
      const angle = calculateAngle(fromProjected, toProjected);

      const line = new LineString([fromProjected, toProjected]);
      const distance = line.getLength();

      return (
        <React.Fragment key={item.id}>
          <RFeature geometry={line}>
            <RStyle.RStyle>
              <RStyle.RStroke color="black" lineCap="butt" width={2} />
            </RStyle.RStyle>
          </RFeature>

          <RFeature geometry={new Point(midpoint)}>
            <RStyle.RStyle>
              <RStyle.RIcon
                src={arrowIcon}
                anchor={[0.5, 0.5]}
                rotateWithView={false}
                rotation={-angle}
                scale={1}
              />
            </RStyle.RStyle>
          </RFeature>

          <RFeature geometry={new Point(midpoint)}>
            <RStyle.RStyle>
              <RStyle.RText
                text={`${Math.round(distance)} m`}
                offsetY={-20}
                fill={new Fill({ color: 'black' })}
                stroke={new Stroke({ color: 'white', width: 2 })}
              />
            </RStyle.RStyle>
          </RFeature>
        </React.Fragment>
      );
    }
    return null;
  };

  return (
    <RMap
      width="100%"
      height="70vh"
      initial={{ center: fromLonLat(initialCoords), zoom: 14 }}
    >
      <ROSM />
      <RLayerVector>{rescues.map(createFeatures)}</RLayerVector>
    </RMap>
  );
}

export default MapComponent;
