"use client";

import {useState, useEffect} from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
} from "@nextui-org/react";
import { AcmeLogo } from "./AcmeLogo.jsx";
import axios from "axios";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: "Resgates", href: "/pages/rescue" },
    { label: "Adicionar Resgate", href: "/pages/rescue/addRescue" },
  ];

  
  function transformArray(arr) {
    return arr.map(item => ({
      key: String(item.id), 
      label: item.name,
    }));
  }
  
  useEffect(() => {
    const utils = localStorage.getItem('utils');
    
    if (!utils) {
      axios.get(`${window.location.origin}/api/dateUtil/auxiliaryInfos`)
        .then((response) => {
          const data = response.data;
          
          const calledBys = transformArray(data.calledBys);
          const procedureOrientationBys = transformArray(data.procedureOrientationBys);
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
            status
          };
  
          localStorage.setItem('utils', JSON.stringify(transformedData));
        })
        .catch((error) => {
          console.error("Erro ao buscar dados:", error);
        });
    }
  }, []);
  
  useEffect(() => {
    const speciesAndAnimalGroups = localStorage.getItem('speciesAndAnimalGroups');
    if (!speciesAndAnimalGroups) {
      axios.get(`${window.location.origin}/api/dateUtil/speciesAndAnimalGroups`)
        .then((data) => localStorage.setItem('speciesAndAnimalGroups', JSON.stringify(data.data)));
    }
  }, []);
 
  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} className="mb-4">
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <AcmeLogo />
          <Link color="foreground" href="/">
            <p className="font-bold text-inherit">Fujama</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <AcmeLogo />
          <Link color="foreground" href="/">
            <p className="font-bold text-inherit">Fujama</p>
          </Link>
        </NavbarBrand>
        <NavbarItem>
          <Link color="foreground" href="/pages/rescue">
            Resgates
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/pages/rescue/addRescue">
            Adicionar Resgate
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.label}-${index}`}>
            <Link className="w-full" href={item.href} size="lg">
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
