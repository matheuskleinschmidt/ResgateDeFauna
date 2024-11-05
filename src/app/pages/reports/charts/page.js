"use client";
import MonthRescues from "@/app/components/MonthRescues";

export default function Chart() {
  return (
    <div className="flex justify-center min-h-screen">
      <div className="w-full max-w-xl">
        <MonthRescues />
      </div>
    </div>
  );
}
