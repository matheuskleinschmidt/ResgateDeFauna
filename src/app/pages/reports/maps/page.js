"use client";

import React, { useState } from "react";
import Head from "next/head";
import "ol/ol.css";
import Image from "next/image";

import { fromLonLat } from "ol/proj";
import { Point } from "ol/geom";
import axios from "axios";
import { RMap, ROSM, RLayerVector, RFeature, ROverlay, RStyle } from "rlayers";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  CardFooter,
} from "@nextui-org/react";
import Link from "next/link";
import  Loader  from "@/app/components/loader";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/app/components/map"), { ssr: false });

//TODO - Refatorar para um COLOCAR ICONE EM VEZ DE ID

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
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchRescueData = async () => {
      try {
        const baseUrl = window.location.origin;
        const apiUrl = `${baseUrl}/api/rescue`;
      
        const response = await fetch(apiUrl, {
          method: 'GET',
          cache: 'force-cache',
          headers: {
            'Cache-Control': 'max-age=600',
          },
        });
      
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
      
        const data = await response.json(); 
        setRescues(data);                   
      } catch (error) {
        console.error("Erro ao fazer a requisição:", error);
      } finally {
        setIsLoading(false); 
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

  function getIconSrc(animalGroupId) {
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
  }

  const animalGroups = [
    { id: 1, name: "Mamífero", svg: "/mammal.svg" },
    { id: 2, name: "Réptil", svg: "/reptile.svg" },
    { id: 3, name: "Ave", svg: "/bird.svg" },
    { id: 4, name: "Peixe", svg: "/fish.svg" },
    { id: 5, name: "Anfíbio", svg: "/amphibian.svg" },
  ];

  return (
    <div>
      {isLoading ? (
          <Loader size="lg" />
      ) : (
        <div>
          <Card className="m-2">
            <CardHeader>
              <div className="flex flex-col">
                <h1 className="text-md">Locais de resgates</h1>
                <p className="text-small text-default-500">
                  Clique no ícone para ampliar ou na legenda para acessar o
                  resgate
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <Head>
                <title>rlayers test</title>
              </Head>
              <Browser>
                <RMap
                  width={"100%"}
                  height={"70vh"}
                  initial={{ center: fromLonLat(initialCoords), zoom: 11 }}
                >
                  <ROSM />
                  <RLayerVector zIndex={10}>
                    {rescues.length > 0 ? (
                      rescues.map((rescue) => (
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
                              src={getIconSrc(rescue.species.AnimalGroup.id)}
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
                                &#11017;{" "}
                                {rescue.species.commonName || "Resgate"}
                              </em>
                            </ROverlay>
                          </Link>
                        </RFeature>
                      ))
                    ) : (
                      <RFeature
                        geometry={
                          new Point(fromLonLat([-48.8177664, -26.3225344]))
                        }
                      >
                        <ROverlay className="example-overlay">
                          <br />
                          <em className="bg-white/70 rounded">
                            Nenhum resgate foi feito
                          </em>
                        </ROverlay>
                      </RFeature>
                    )}
                  </RLayerVector>
                </RMap>
              </Browser>
            </CardBody>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">Legenda</div>
              <div className="m-2">
                <div className="flex flex-wrap">
                  {animalGroups.map((group) => (
                    <div key={group.id} className="flex items-center m-2">
                      <Image
                        src={group.svg}
                        alt={group.name}
                        width={30}
                        height={30}
                        className="w-6 h-6 mr-2"
                      />
                      <span>{group.name}</span>
                    </div>
                  ))}
                  <div className="flex items-center m-2">
                    <Image
                      src="/location.svg"
                      alt="Outros"
                      width={30}
                      height={30}
                      className="w-6 h-6 mr-2"
                    />
                    <span>Outros</span>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
          <Card className="m-2">
            <CardHeader>
              <div className="flex flex-col">
                <h1 className="text-md">Locais de Soltura</h1>
                <p className="text-small text-default-500">
                  Clique no ícone para ampliar ou na legenda para acessar o
                  resgate
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <Head>
                <title>rlayers test</title>
              </Head>
              <Browser>
                <RMap
                  width={"100%"}
                  height={"70vh"}
                  initial={{ center: fromLonLat(initialCoords), zoom: 11 }}
                >
                  <ROSM />
                  <RLayerVector zIndex={10}>
                    {rescues.length > 0 ? (
                      rescues
                        .filter(
                          (rescue) =>
                            rescue.releaseLocationCoordinates &&
                            typeof rescue.releaseLocationCoordinates
                              .longitude === "number" &&
                            typeof rescue.releaseLocationCoordinates
                              .latitude === "number"
                        )
                        .map((rescue) => (
                          <RFeature
                            key={rescue.id}
                            geometry={
                              new Point(
                                fromLonLat([
                                  rescue.releaseLocationCoordinates.longitude,
                                  rescue.releaseLocationCoordinates.latitude,
                                ])
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
                                src={getIconSrc(rescue.species.AnimalGroup.id)}
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
                                  &#11017;{" "}
                                  {rescue.species.commonName || "Resgate"}
                                </em>
                              </ROverlay>
                            </Link>
                          </RFeature>
                        ))
                    ) : (
                      <RFeature
                        geometry={
                          new Point(fromLonLat([-48.8177664, -26.3225344]))
                        }
                      >
                        <ROverlay className="example-overlay">
                          <br />
                          <em className="bg-white/70 rounded">
                            Nenhum resgate foi feito
                          </em>
                        </ROverlay>
                      </RFeature>
                    )}
                  </RLayerVector>
                </RMap>
              </Browser>
            </CardBody>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">Legenda</div>
              <div className="m-2">
                <div className="flex flex-wrap">
                  {animalGroups.map((group) => (
                    <div key={group.id} className="flex items-center m-2">
                      <Image
                        src={group.svg}
                        alt={group.name}
                        width={30}
                        height={30}
                        className="w-6 h-6 mr-2"
                      />
                      <span>{group.name}</span>
                    </div>
                  ))}
                  <div className="flex items-center m-2">
                    <Image
                      src="/location.svg"
                      alt="Outros"
                      width={30}
                      height={30}
                      className="w-6 h-6 mr-2"
                    />
                    <span>Outros</span>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
          <Card className="m-2">
            <CardHeader>
              <div className="flex flex-col">
                <h1 className="text-md">
                  Mapa de onde foi pego o animal para onde foi solto
                </h1>
                <p className="text-small text-default-500"></p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <Map rescues={rescues} />
            </CardBody>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                A Flecha está apontando para o local de soltura
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
