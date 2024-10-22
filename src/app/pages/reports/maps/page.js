'use client';

import React from 'react';
import Head from 'next/head';
import 'ol/ol.css';

import { fromLonLat } from 'ol/proj';
import { Coordinate } from 'ol/coordinate';
import { Point } from 'ol/geom';

import {
  RMap,
  ROSM,
  RLayerVector,
  RFeature,
  ROverlay,
  RStyle,
} from 'rlayers';

export function Browser({ children }) {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}

const coords = {
  origin: [2.364, 48.82],
  ArcDeTriomphe: [2.295, 48.8737],
};
//src\app\pages\reports\maps\location.svg
export default function Home() {
  return (
    <div>
      <Head>
        <title>rlayers test</title>
      </Head>
      <Browser>
        <RMap
          width={'100%'}
          height={'60vh'}
          initial={{ center: fromLonLat(coords.origin), zoom: 11 }}
        >
          <ROSM />
          <RLayerVector zIndex={10}>
            <RStyle.RStyle>
              <RStyle.RIcon src="/location.svg" anchor={[0.5, 0.8]} />
            </RStyle.RStyle>
            <RFeature
              geometry={new Point(fromLonLat(coords.ArcDeTriomphe))}
              onClick={(e) =>
                e.map.getView().fit(e.target.getGeometry().getExtent(), {
                  duration: 250,
                  maxZoom: 15,
                })
              }
            >
              <ROverlay className="example-overlay">
                Arc de Triomphe
                <br />
                <em>&#11017; click to zoom</em>
              </ROverlay>
            </RFeature>
          </RLayerVector>
        </RMap>
      </Browser>
    </div>
  );
}
