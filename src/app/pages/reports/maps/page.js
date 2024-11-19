"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import "ol/ol.css";
import { fromLonLat } from "ol/proj";
import { Point } from "ol/geom";
import {
  RMap,
  ROSM,
  RLayerVector,
  RFeature,
  ROverlay,
  RStyle,
} from "rlayers";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  CardFooter,
} from "@nextui-org/react";
import Link from "next/link";

const MapComponent = dynamic(() => import("@/app/components/map"), {
  ssr: false,
});

function Legend({ animalGroups }) {
  return (
    <div className="m-2">
      <div className="flex flex-wrap">
        {animalGroups.map((group) => (
          <div key={group.id} className="flex items-center m-2">
            <img src={group.svg} alt={group.name} className="w-6 h-6 mr-2" />
            <span>{group.name}</span>
          </div>
        ))}
        <div className="flex items-center m-2">
          <img src="/location.svg" alt="Outros" className="w-6 h-6 mr-2" />
          <span>Outros</span>
        </div>
      </div>
    </div>
  );
}

Legend.propTypes = {
  animalGroups: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      svg: PropTypes.string.isRequired,
    })
  ).isRequired,
};

function RescueMap({
  title,
  rescues,
  filterFunction,
  noDataMessage,
  initialCoords,
  iconGetter,
  animalGroups,
  coordinateGetter,
}) {
  const filteredRescues = filterFunction
    ? rescues.filter(filterFunction)
    : rescues;

  return (
    <Card className="m-2">
      <CardHeader>
        <div className="flex flex-col">
          <h1 className="text-md">{title}</h1>
          <p className="text-small text-default-500">
            Clique no ícone para ampliar ou na legenda para acessar o resgate
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <RMap
          width={"100%"}
          height={"70vh"}
          initial={{ center: fromLonLat(initialCoords), zoom: 11 }}
        >
          <ROSM />
          <RLayerVector zIndex={10}>
            {filteredRescues.length > 0 ? (
              filteredRescues.map((rescue) => {
                const coords = coordinateGetter(rescue);
                return (
                  coords && (
                    <RFeature
                      key={rescue.id}
                      geometry={
                        new Point(
                          fromLonLat([coords.longitude, coords.latitude])
                        )
                      }
                      onClick={(e) =>
                        e.map
                          .getView()
                          .fit(e.target.getGeometry().getExtent(), {
                            duration: 250,
                            maxZoom: 15,
                          })
                      }
                    >
                      <RStyle.RStyle>
                        <RStyle.RIcon
                          src={iconGetter(rescue.species.AnimalGroup.id)}
                          anchor={[0.5, 0.1]}
                        />
                      </RStyle.RStyle>
                      <Link
                        href={"/pages/rescue/modOffline"}
                        onClick={() => {
                          sessionStorage.setItem(
                            "selectedRescue",
                            JSON.stringify(rescue)
                          );
                        }}
                      >
                        <ROverlay className="example-overlay">
                          <br />
                          <em className="bg-white/70 rounded">
                            &#11017; {rescue.species.commonName || "Resgate"}
                          </em>
                        </ROverlay>
                      </Link>
                    </RFeature>
                  )
                );
              })
            ) : (
              <RFeature
                geometry={new Point(fromLonLat([-48.8177664, -26.3225344]))}
              >
                <ROverlay className="example-overlay">
                  <br />
                  <em className="bg-white/70 rounded">{noDataMessage}</em>
                </ROverlay>
              </RFeature>
            )}
          </RLayerVector>
        </RMap>
      </CardBody>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">Legenda</div>
        <Legend animalGroups={animalGroups} />
      </CardFooter>
    </Card>
  );
}

RescueMap.propTypes = {
  title: PropTypes.string.isRequired,
  rescues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      species: PropTypes.shape({
        commonName: PropTypes.string,
        AnimalGroup: PropTypes.shape({
          id: PropTypes.number.isRequired,
        }).isRequired,
      }).isRequired,
      locationCoordinates: PropTypes.shape({
        longitude: PropTypes.number.isRequired,
        latitude: PropTypes.number.isRequired,
      }),
      releaseLocationCoordinates: PropTypes.shape({
        longitude: PropTypes.number,
        latitude: PropTypes.number,
      }),
    })
  ).isRequired,
  filterFunction: PropTypes.func,
  noDataMessage: PropTypes.string.isRequired,
  initialCoords: PropTypes.arrayOf(PropTypes.number).isRequired,
  iconGetter: PropTypes.func.isRequired,
  animalGroups: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      svg: PropTypes.string.isRequired,
    })
  ).isRequired,
  coordinateGetter: PropTypes.func.isRequired,
};

RescueMap.defaultProps = {
  filterFunction: null,
};

export function Browser({ children }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}

Browser.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function Home() {
  const [rescues, setRescues] = useState([]);

  useEffect(() => {
    const fetchRescueData = async () => {
      try {
        const response = await fetch("/api/rescue");
        const data = await response.json();
        setRescues(data);
      } catch (error) {
        console.error("Erro ao fazer a requisição:", error);
      }
    };

    fetchRescueData();
  }, []);

  const initialCoords =
    rescues.length > 0
      ? [
          rescues[0].locationCoordinates.longitude,
          rescues[0].locationCoordinates.latitude,
        ]
      : [-48.8177664, -26.3225344];

  const getIconSrc = (animalGroupId) => {
    switch (animalGroupId) {
      case 1:
        return "/mammal.svg";
      case 2:
        return "/reptile.svg";
      case 3:
        return "/bird.svg";
      case 4:
        return "/fish.svg";
      case 5:
        return "/amphibian.svg";
      default:
        return "/location.svg";
    }
  };

  const animalGroups = [
    { id: 1, name: "Mamífero", svg: "/mammal.svg" },
    { id: 2, name: "Réptil", svg: "/reptile.svg" },
    { id: 3, name: "Ave", svg: "/bird.svg" },
    { id: 4, name: "Peixe", svg: "/fish.svg" },
    { id: 5, name: "Anfíbio", svg: "/amphibian.svg" },
  ];

  return (
    <div>
      <RescueMap
        title="Locais de resgates"
        rescues={rescues}
        noDataMessage="Nenhum resgate foi feito"
        initialCoords={initialCoords}
        iconGetter={getIconSrc}
        animalGroups={animalGroups}
        coordinateGetter={(rescue) => rescue.locationCoordinates}
      />
      <RescueMap
        title="Locais de Soltura"
        rescues={rescues}
        filterFunction={(rescue) =>
          rescue.releaseLocationCoordinates &&
          typeof rescue.releaseLocationCoordinates.longitude === "number" &&
          typeof rescue.releaseLocationCoordinates.latitude === "number"
        }
        noDataMessage="Nenhum resgate foi feito"
        initialCoords={initialCoords}
        iconGetter={getIconSrc}
        animalGroups={animalGroups}
        coordinateGetter={(rescue) => rescue.releaseLocationCoordinates}
      />
      <Card className="m-2">
        <CardHeader>
          <div className="flex flex-col">
            <h1 className="text-md">
              Mapa de onde foi pego o animal para onde foi solto
            </h1>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <MapComponent rescues={rescues} />
        </CardBody>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            A Flecha está apontando para o local de soltura
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

Home.propTypes = {};