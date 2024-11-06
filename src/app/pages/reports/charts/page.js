"use client";
import MonthRescues from "@/app/components/MonthRescues";
import ProcedureOrientationPieChart from "@/app/components/ProcedureOrientationPieChart";
import SituationPieChart from "@/app/components/SituationPieChart";

export default function Chart() {
  return (
    <div className="flex flex-wrap justify-center min-h-screen gap-4 p-4">
      <div className="w-full max-w-xl flex-1">
        <MonthRescues />
      </div>
      <div className="w-full max-w-xl flex-1">
        <ProcedureOrientationPieChart />
      </div>
      <div className="w-full max-w-xl flex-1">
        <SituationPieChart />
      </div>
    </div>
  );
}
