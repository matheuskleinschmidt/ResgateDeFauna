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

const timezone = 'America/Sao_Paulo'; // Timezone do Brasil

const RescuePage = () => {
  const [rescues, setRescues] = useState([]);

  useEffect(() => {
    const fetchRescueData = async () => {
      try {
        const baseUrl = window.location.origin;
        
        const apiUrl = `${baseUrl}/api/rescue`;
        console.log(apiUrl);
        const response = await axios.get(apiUrl);

        console.log(response);
        setRescues(response.data);
      } catch (error) {
        console.error("Erro ao fazer a requisição:", error);
      }
    };
    

    fetchRescueData();
  }, []);

  return (
    <div className="responsive-table">
    
      <Table isStriped="true" isCompact="true">
        <TableHeader>
          <TableColumn>Espécie</TableColumn>
          <TableColumn>Situação</TableColumn>
          <TableColumn>Chamado via</TableColumn>
          <TableColumn>Data e hora</TableColumn>
        </TableHeader>
        <TableBody items={rescues}>
          {(rescues) => (
            <TableRow key={rescues.id}>
              <TableCell>{rescues.species}</TableCell>
              <TableCell>{rescues.situation}</TableCell>
              <TableCell>{rescues.calledVia}</TableCell>
              <TableCell>{moment(rescues.date).tz(timezone).format('DD/MM/YYYY HH:mm:ss')}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <style jsx>{`
        .responsive-table {
          overflow-x: auto;
        }

        @media (max-width: 768px) {
          .responsive-table {
            display: block;
            width: 100%;
          }
          table {
            width: 100%;
            table-layout: auto;
          }
          thead {
            display: none;
          }
          tbody tr {
            display: block;
            margin-bottom: 10px;
            border: 1px solid #ccc;
          }
          tbody td {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            border-bottom: 1px solid #ddd;
          }
          tbody td:before {
            content: attr(data-label);
            flex: 1;
            text-align: left;
            font-weight: bold;
            padding-right: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default RescuePage;
