"use client";

import MonthRescues from "@/app/components/MonthRescues";
import  PieChart  from "@/app/components/PieChart";

//TODO otimizar para que a request seja feita uma única vez e os dados sejam passados para os componentes filhos

export default function Chart() {
  return (
    <div className="flex flex-wrap justify-center min-h-screen gap-4 p-4">
      <div className="w-full max-w-xl flex-1 min-w-[400px] min-h-[500px]">
        <MonthRescues />
      </div>
      <div className="w-full max-w-xl flex-1 min-w-[300px] min-h-[200px]">
        <PieChart Title="Registros filtrados por tipo de chamado" Description="" propertyPath="calledBy.name" />
      </div>
      <div className="w-full max-w-xl flex-1 min-w-[300px] min-h-[200px]">
        <PieChart Title="Registros filtrados por idade" Description="" propertyPath="ageRange.name" />
      </div>
      <div className="w-full max-w-xl flex-1 min-w-[300px] min-h-[200px]">
        <PieChart Title="Registros filtrados por tipo de orientação" Description="" propertyPath="procedureOrientationBy.name" />
      </div>
      <div className="w-full max-w-xl flex-1 min-w-[300px] min-h-[200px]">
        <PieChart Title="Registros filtrados por situação dos animais" Description="" propertyPath="situation.name" />
      </div>
      <div className="w-full max-w-xl flex-1 min-w-[300px] min-h-[200px]">
        <PieChart Title="Registros filtrados por tipo de Pós-resgate" Description="" propertyPath="postRescue.name" />
      </div>
    </div>
  );
}