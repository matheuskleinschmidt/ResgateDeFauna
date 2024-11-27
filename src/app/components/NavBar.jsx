"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Navbar,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  Link,
  NavbarItem,
} from "@nextui-org/react";
import { AcmeLogo } from "./AcmeLogo.jsx";
import axios from "axios";
import { signOut } from "next-auth/react";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: "Resgates", href: "/pages/rescue" },
    { label: "Adicionar Resgate", href: "/pages/rescue/addRescue" },
    { label: "Mapas", href: "/pages/reports/maps" },
    { label: "Gráficos", href: "/pages/reports/charts" },
    { label: "Configurações", href: "/pages/configurations" },
  ];

  const transformArray = (arr) => {
    return arr.map((item) => ({
      key: String(item.id),
      label: item.name,
    }));
  };

  const fetchUtils = useCallback(async () => {
    try {
      const response = await axios.get(
        `${window.location.origin}/api/dateUtil/auxiliaryInfos`
      );
      const data = response.data;

      const calledBys = transformArray(data.calledBys);
      const procedureOrientationBys = transformArray(
        data.procedureOrientationBys
      );
      const ageRanges = transformArray(data.ageRanges);
      const situations = transformArray(data.situations);
      const postRescues = transformArray(data.postRescues);
      const status = transformArray(data.status);

      const transformedData = {
        calledBys,
        procedureOrientationBys,
        ageRanges,
        situations,
        postRescues,
        status,
      };

      localStorage.setItem("utils", JSON.stringify(transformedData));
    } catch (error) {
      console.error("Erro ao buscar dados utils:", error);
    }
  }, []);

  const fetchSpeciesAndAnimalGroups = useCallback(async () => {
    try {
      const response = await axios.get(
        `${window.location.origin}/api/dateUtil/speciesAndAnimalGroups`
      );
      localStorage.setItem(
        "speciesAndAnimalGroups",
        JSON.stringify(response.data)
      );
    } catch (error) {
      console.error("Erro ao buscar speciesAndAnimalGroups:", error);
    }
  }, []);

  useEffect(() => {
    const utils = localStorage.getItem("utils");
    if (!utils) {
      fetchUtils();
    }

    const speciesAndAnimalGroups = localStorage.getItem(
      "speciesAndAnimalGroups"
    );
    if (!speciesAndAnimalGroups) {
      fetchSpeciesAndAnimalGroups();
    }
  }, [fetchUtils, fetchSpeciesAndAnimalGroups]);

  const handleRefresh = async () => {
    localStorage.removeItem("utils");
    localStorage.removeItem("speciesAndAnimalGroups");

    await fetchUtils();
    await fetchSpeciesAndAnimalGroups();
  };

  return (
    <Navbar
      position="static"
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="mb-4"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        />
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex gap-4"
        justify="center"
      ></NavbarContent>

      <NavbarContent justify="end">
        <Link color="foreground" href="/">
          <NavbarItem>
            <AcmeLogo />
          </NavbarItem>
          <NavbarItem>
            <p className="font-bold text-inherit -ml-2">Fujama</p>
          </NavbarItem>
        </Link>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.label}-${index}`}>
            <Link className="w-full" href={item.href} size="lg">
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <Link className="w-full" size="lg">
            <button onClick={handleRefresh}>Renovar cache</button>
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className="w-full" size="lg">
            <button onClick={() => signOut()}>Sair</button>
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
