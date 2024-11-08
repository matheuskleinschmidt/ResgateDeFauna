"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import MonthRescues from "@/app/components/MonthRescues";
import PieChart from "@/app/components/PieChart";
import AnimalRecordsChart from "@/app/components/AreaChartStacked";

export default function Chart() {
  const [rescues, setRescues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRescueData = async () => {
      try {
        const apiUrl = `${window.location.origin}/api/rescue`;
        const response = await axios.get(apiUrl);
        setRescues(response.data);
      } catch (err) {
        console.error("Erro ao fazer a requisição:", err);
        setError("Falha ao carregar os dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchRescueData();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-4xl">
        <h1>Carregando...</h1>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-wrap justify-center min-h-screen gap-4 p-4">
      <div className="w-full max-w-xl flex-1 min-w-[400px] min-h-[500px]">
        <AnimalRecordsChart
          title="Grupos de animais resgatados por mês"
          description=""
          data={rescues}
          propertyPath="species.AnimalGroup.groupName"
        />
      </div>
      <div className="w-full max-w-xl flex-1 min-w-[400px] min-h-[500px]">
        <MonthRescues 
                  title="Grupos de animais resgatados por mês"
                  description=""
                  rescues={rescues}
                  propertyPath="species.AnimalGroup.groupName"/>
      </div>
      <div className="w-full max-w-xl flex-1 min-w-[300px] min-h-[200px]">
        <PieChart
          title="Registros filtrados por tipo de chamado"
          description=""
          propertyPath="calledBy.name"
          rescues={rescues}
        />
      </div>
      <div className="w-full max-w-xl flex-1 min-w-[300px] min-h-[200px]">
        <PieChart
          title="Registros filtrados por idade"
          description=""
          propertyPath="ageRange.name"
          rescues={rescues}
        />
      </div>
      <div className="w-full max-w-xl flex-1 min-w-[300px] min-h-[200px]">
        <PieChart
          title="Registros filtrados por tipo de orientação"
          description=""
          propertyPath="procedureOrientationBy.name"
          rescues={rescues}
        />
      </div>
      <div className="w-full max-w-xl flex-1 min-w-[300px] min-h-[200px]">
        <PieChart
          title="Registros filtrados por situação dos animais"
          description=""
          propertyPath="situation.name"
          rescues={rescues}
        />
      </div>
      <div className="w-full max-w-xl flex-1 min-w-[300px] min-h-[200px]">
        <PieChart
          title="Registros filtrados por tipo de Pós-resgate"
          description=""
          propertyPath="postRescue.name"
          rescues={rescues}
        />
      </div>
    </div>
  );
}
