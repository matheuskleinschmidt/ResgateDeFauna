"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import PieChart from "@/app/components/PieChart";
import AreaChartStacked from "@/app/components/AreaChartStacked";
import BarChartStackedLegend from "@/app/components/BarChartStackedLegend";
import { Spinner } from "@nextui-org/react";

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
      <div className="flex h-screen w-full items-center justify-center px-4">
      <Spinner size="lg" />
    </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-wrap justify-center min-h-screen gap-4 p-4">
      <div className="w-full max-w-xl flex-1 min-w-[400px] min-h-[380px]">
        <BarChartStackedLegend
          title="Grupos de animais resgatados por mês"
          description=""
          rescues={rescues}
          propertyPath="species.commonName"
        />
      </div>
      <div className="w-full max-w-xl flex-1 min-w-[400px] min-h-[380px]">
        <BarChartStackedLegend
          title="Grupos de animais resgatados por mês"
          description=""
          rescues={rescues}
          propertyPath="species.AnimalGroup.groupName"
        />
      </div>
      <div className="w-full max-w-xl flex-1 min-w-[400px] min-h-[500px]">
        <PieChart
          title="Registros filtrados por tipo de chamado"
          description=""
          propertyPath="calledBy.name"
          rescues={rescues}
        />
      </div>
      <div className="w-full max-w-xl flex-1 min-w-[400px] min-h-[500px]">
        <PieChart
          title="Registros filtrados por idade"
          description=""
          propertyPath="ageRange.name"
          rescues={rescues}
        />
      </div>
      <div className="w-full max-w-xl flex-1 min-w-[400px] min-h-[500px]">
        <PieChart
          title="Registros filtrados por tipo de orientação"
          description=""
          propertyPath="procedureOrientationBy.name"
          rescues={rescues}
        />
      </div>
      <div className="w-full max-w-xl flex-1 min-w-[400px] min-h-[500px]">
        <PieChart
          title="Registros filtrados por situação dos animais"
          description=""
          propertyPath="situation.name"
          rescues={rescues}
        />
      </div>
      <div className="w-full max-w-xl flex-1 min-w-[400px] min-h-[500px]">
        <PieChart
          title="Registros filtrados por tipo de Pós-resgate"
          description=""
          propertyPath="postRescue.name"
          rescues={rescues}
        />
      </div>
      <div className="w-full max-w-xl flex-1 min-w-[400px] min-h-[500px]">
        <AreaChartStacked
          title="Grupos de animais resgatados por mês"
          description=""
          data={rescues}
          propertyPath="species.AnimalGroup.groupName"
        />
      </div>
    </div>
  );
}
