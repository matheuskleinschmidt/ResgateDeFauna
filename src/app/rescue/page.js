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

const RescuePage = () => {
  const [rescues, setRescues] = useState([]);

  useEffect(() => {
    const fetchRescueData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/rescue");
        console.log(response);
        setRescues(response.data);
      } catch (error) {
        console.error("Erro ao fazer a requisição:", error);
      }
    };

    fetchRescueData();
  }, []);

  return (
    <div style={{ overflowX: "auto" }}>
      <Table isStriped="true" isCompact="true" css={{
        '@media (max-width: 600px)': {
          '& th:nth-child(3), & td:nth-child(3)': {
            display: 'none',
          },
        },
      }}>
        <TableHeader>
          <TableColumn>Espécie</TableColumn>
          <TableColumn>situação</TableColumn>
          <TableColumn>Chamado via</TableColumn>
          <TableColumn>Data</TableColumn>
        </TableHeader>
        <TableBody items={rescues}>
          {(rescues) => (
            <TableRow key={rescues.id}>
              {<TableCell>{rescues.species}</TableCell>}
              {<TableCell>{rescues.situation}</TableCell>}
              {<TableCell>{rescues.calledVia}</TableCell>}
              {<TableCell>{rescues.date}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RescuePage;
