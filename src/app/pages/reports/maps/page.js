'use client';

import React from 'react';
import Head from 'next/head';
import 'ol/ol.css';

import { fromLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
import axios from "axios";
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

export default function Home() {
  const [rescues, setRescues] = React.useState([]);

  React.useEffect(() => {
    const fetchRescueData = async () => {
      try {
        const baseUrl = window.location.origin;
        const apiUrl = `${baseUrl}/api/rescue`;
        const response = await axios.get(apiUrl);
        setRescues(response.data);
      } catch (error) {
        console.error("Erro ao fazer a requisição:", error);
      }
    };

    fetchRescueData();
  }, []);

  const initialCoords = rescues.length > 0
    ? [rescues[0].locationCoordinates.longitude, rescues[0].locationCoordinates.latitude]
    : [-48.8177664, -26.3225344]; 

  return (
    <div>
    <h1>Locais de resgates</h1>
    <p>Clique no icone para ampliar</p>
      <Head>
        <title>rlayers test</title>
      </Head>
      <Browser>
        <RMap
          width={'100%'}
          height={'70vh'}
          initial={{ center: fromLonLat(initialCoords), zoom: 11 }}
        >
          <ROSM />
          <RLayerVector zIndex={10}>
            <RStyle.RStyle>
              <RStyle.RIcon src="/location.svg" anchor={[0.5, 0.8]} />
            </RStyle.RStyle>
            {rescues.map((rescue) => (
              <RFeature
                key={rescue.id}
                geometry={
                  new Point(
                    fromLonLat([
                      rescue.locationCoordinates.longitude,
                      rescue.locationCoordinates.latitude,
                    ])
                  )
                }
                onClick={(e) =>
                  e.map.getView().fit(e.target.getGeometry().getExtent(), {
                    duration: 250,
                    maxZoom: 15,
                  })
                }
              >
                <ROverlay className="example-overlay">
                  <br />
                  <em className='bg-white/70 rounded'>&#11017; {rescue.species.commonName || 'Resgate'}</em>
                </ROverlay>
              </RFeature>
            ))}
          </RLayerVector>
        </RMap>
      </Browser>
    </div>
  );
}
