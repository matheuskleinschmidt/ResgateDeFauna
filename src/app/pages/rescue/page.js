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
import { Spinner } from "@nextui-org/react";
import moment from "moment";
import "moment-timezone";
import { useRouter } from "next/navigation";

const timezone = "America/Sao_Paulo";

const RescuePage = () => {
  const [rescues, setRescues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); 

  useEffect(() => {
    const fetchRescueData = async () => {
      try {
        const baseUrl = window.location.origin;
        const apiUrl = `${baseUrl}/api/rescue`;
        const response = await axios.get(apiUrl);
        setRescues(response.data);
      } catch (error) {
        console.error("Erro ao fazer a requisição:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRescueData();
  }, []);

  const handleRowClick = (rescue) => {
    sessionStorage.setItem("selectedRescue", JSON.stringify(rescue));
    router.push("/pages/rescue/modOffline");
  };

  return (
    <div className="responsive-table" style={{ position: "relative", minHeight: "200px" }}>
      {isLoading ? (
        <div className="flex h-screen w-full items-center justify-center px-4">
          <Spinner size="lg" />
        </div>
      ) : (
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
                  <TableRow
                    key={rescue.id}
                    onClick={() => handleRowClick(rescue)}
                    style={{ cursor: "pointer" }}
                    className="table-row-hover"
                  >
                    <TableCell>
                      {rescue.species.commonName}
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
      )}
    </div>
  );
};

export default RescuePage;
