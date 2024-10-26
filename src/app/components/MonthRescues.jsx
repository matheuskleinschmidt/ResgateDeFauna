"use client"

import React, { useEffect, useState } from 'react'
import { Bar, BarChart, XAxis, YAxis, Tooltip } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import axios from "axios";

const groupRecordsByDate = (records) => {
  const grouped = records.reduce((acc, record) => {
    const date = new Date(record.fullDate).toISOString().split('T')[0]
    if (!acc[date]) {
      acc[date] = { date, count: 0 }
    }
    acc[date].count++
    return acc
  }, {})
  return Object.values(grouped)
}

export default function AnimalRecordsChart() {
  const [rescues, setRescues] = useState([]);

  useEffect(() => {
    const fetchRescueData = async () => {
      try {
        const baseUrl = window.location.origin;

        const apiUrl = `${baseUrl}/api/rescue`;

        const response = await axios.get(apiUrl);
        setRescues(groupRecordsByDate(response.data));
      } catch (error) {
        console.error("Erro ao fazer a requisição:", error);
      }
    };

    fetchRescueData();
  }, []);

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Registros de Animais por Data</CardTitle>
        <CardDescription>Número de registros agrupados por data</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            count: {
              label: "Número de Registros: ",
              color: "hsl(var(--chart-1))",
            },
          }}
        >
          <BarChart data={rescues}>
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}