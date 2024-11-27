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
import moment from "moment-timezone";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"; 

const RescuePage = () => {
  const [rescues, setRescues] = useState([]);
  const [filteredRescues, setFilteredRescues] = useState([]);
  const [monthYearOptions, setMonthYearOptions] = useState([]);
  const [selectedMonthYear, setSelectedMonthYear] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRescueData = async () => {
      try {
        const baseUrl = window.location.origin;
        const apiUrl = `${baseUrl}/api/rescue`;
        const response = await axios.get(apiUrl);
        setRescues(response.data);

        const monthYearMap = {};
        response.data.forEach((rescue) => {
          const date = moment.utc(rescue.fullDate);
          const month = date.month() + 1;
          const year = date.year();
          const monthStr = ("0" + month).slice(-2);
          const monthYearStr = `${year}-${monthStr}`;

          if (!monthYearMap[monthYearStr]) {
            monthYearMap[monthYearStr] = {
              value: monthYearStr,
              label: `${monthStr}/${year}`,
            };
          }
        });

        const monthYearArray = Object.values(monthYearMap);

        monthYearArray.sort((a, b) => b.value.localeCompare(a.value));

        setMonthYearOptions(monthYearArray);
        const currentDate = moment.utc();
        const currentMonth = currentDate.month() + 1;
        const currentYear = currentDate.year();
        const currentMonthStr = ("0" + currentMonth).slice(-2);
        const currentMonthYear = `${currentYear}-${currentMonthStr}`;
        setSelectedMonthYear(currentMonthYear);
      } catch (error) {
        console.error("Erro ao fazer a requisição:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRescueData();
  }, []);

  useEffect(() => {
    if (selectedMonthYear && rescues.length > 0) {
      const filtered = rescues.filter((rescue) => {
        const date = moment.utc(rescue.fullDate);
        const month = date.month() + 1;
        const year = date.year();
        const monthStr = ("0" + month).slice(-2);
        const monthYearStr = `${year}-${monthStr}`;
        return monthYearStr === selectedMonthYear;
      });
      setFilteredRescues(filtered);
    } else {
      setFilteredRescues(rescues);
    }
  }, [selectedMonthYear, rescues]);

  const handleRowClick = (rescue) => {
    sessionStorage.setItem("selectedRescue", JSON.stringify(rescue));
    router.push("/pages/rescue/modOffline");
  };

  return (
    <div
      className="responsive-table"
      style={{ position: "relative", minHeight: "200px", padding: "1rem" }}
    >
      {isLoading ? (
        <div className="flex h-screen w-full items-center justify-center px-4">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div style={{ marginBottom: "1rem", width: "200px" }}>
            <Select
              value={selectedMonthYear}
              onValueChange={setSelectedMonthYear}
              placeholder="Selecione o mês e ano"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o mês e ano" />
              </SelectTrigger>
              <SelectContent>
                {monthYearOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Table isStriped isCompact>
            <TableHeader>
              <TableColumn>Espécie</TableColumn>
              <TableColumn>Situação</TableColumn>
              <TableColumn>Chamado via</TableColumn>
              <TableColumn>Data e hora</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"Não há registros salvos para o período selecionado."}>
              {filteredRescues.map((rescue) => (
                <TableRow
                  key={rescue.id}
                  onClick={() => handleRowClick(rescue)}
                  style={{ cursor: "pointer" }}
                  className="table-row-hover"
                >
                  <TableCell>{rescue.species.commonName}</TableCell>
                  <TableCell>
                    {rescue.situation?.name || "Situação desconhecida"}
                  </TableCell>
                  <TableCell>
                    {rescue.calledBy?.name || "Chamado por desconhecido"}
                  </TableCell>
                  <TableCell>
                    {moment.utc(rescue.fullDate).format("DD/MM HH:mm")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
};

export default RescuePage;
