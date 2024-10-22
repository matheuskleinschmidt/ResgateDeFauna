'use client';

import React from 'react';

import Head from 'next/head';

import 'ol/ol.css';

import { fromLonLat } from 'ol/proj';

import { RMap, ROSM } from 'rlayers';


export function Browser({ children }) {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};

export default function Home() {
  return (
    <div>
      <Head>
        <title>rlayers test</title>
      </Head>
      <Browser>
        <RMap width={'100%'} height={'60vh'} initial={{ center: fromLonLat([2.364, 48.82]), zoom: 11 }}>
          <ROSM />
        </RMap>
      </Browser>
    </div>
  )
}
