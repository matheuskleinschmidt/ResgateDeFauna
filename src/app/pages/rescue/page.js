"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import moment from "moment";
import "moment-timezone";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

const timezone = "America/Sao_Paulo";

const RescuePage = () => {
  const [rescues, setRescues] = useState([]);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Check if the user is authenticated
  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session) {
      router.push("/signin");
    }
  }, [session, status, router]);

  // Fetch rescue data only if the user is authenticated
  useEffect(() => {
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

    if (session) {
      fetchRescueData();
    }
  }, [session]);

  if (status === "loading") {
    return <div>Carregando...</div>; // Display a loading indicator
  }

  if (!session) {
    return null; // Return null while redirecting
  }

  return (
    <div className="responsive-table">
      <Table isStriped isCompact>
        <TableHeader>
          <TableColumn>Espécie</TableColumn>
          <TableColumn>Situação</TableColumn>
          <TableColumn>Chamado via</TableColumn>
          <TableColumn>Data e hora</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"Não há registros salvos."}>
          {Array.isArray(rescues) && rescues.length > 0
            ? rescues.map((rescue) => (
                <TableRow key={rescue.id}>
                  <TableCell>
                    <Link
                      href={"/pages/rescue/modOffline"}
                      onClick={() => {
                        sessionStorage.setItem(
                          "selectedRescue",
                          JSON.stringify(rescue)
                        );
                      }}
                    >
                      {rescue.species.commonName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {rescue.situation?.name || "Situação desconhecida"}
                  </TableCell>
                  <TableCell>
                    {rescue.calledBy?.name || "Chamado por desconhecido"}
                  </TableCell>
                  <TableCell>
                    {moment(rescue.fullDate)
                      .tz(timezone)
                      .format("DD/MM/YYYY HH:mm:ss")}
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
      <button onClick={() => signOut({ callbackUrl: "/" })}>
      Sair
    </button>
    </div>
  );
};

export default RescuePage;
