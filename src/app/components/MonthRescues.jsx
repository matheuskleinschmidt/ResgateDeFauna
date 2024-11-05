"use client"

import React, { useEffect, useState } from 'react'
import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import axios from "axios"

const groupRecordsByDateAndGroup = (records) => {
  const grouped = records.reduce((acc, record) => {
    const date = new Date(record.fullDate).toISOString().split('T')[0]
    const groupName = record.species?.AnimalGroup?.groupName || 'Unknown'
    
    if (!acc[date]) {
      acc[date] = { date }
    }
    
    if (!acc[date][groupName]) {
      acc[date][groupName] = 0
    }
    
    acc[date][groupName]++
    return acc
  }, {})
  
  return Object.values(grouped)
}

export default function AnimalRecordsChart() {
  const [rescues, setRescues] = useState([])
  const [groups, setGroups] = useState([])

  useEffect(() => {
    const fetchRescueData = async () => {
      try {
        const baseUrl = window.location.origin
        const apiUrl = `${baseUrl}/api/rescue`
        const response = await axios.get(apiUrl)
        const groupedData = groupRecordsByDateAndGroup(response.data)
        setRescues(groupedData)
        
        const uniqueGroups = Array.from(new Set(response.data.map(record => record.species?.AnimalGroup?.groupName || 'Unknown')))
        setGroups(uniqueGroups)
      } catch (error) {
        console.error("Erro ao fazer a requisição:", error)
      }
    }

    fetchRescueData()
  }, [])

  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
    "#d0ed57",
    "#a28fd0",
    "#ffbb28"
  ]

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Registros de Animais por Data e Grupo</CardTitle>
        <CardDescription>Número de registros agrupados por data e grupo animal</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={
            groups.reduce((acc, group, index) => {
              acc[group] = {
                label: group,
                color: colors[index % colors.length]
              }
              return acc
            }, {})
          }
        >
          <BarChart data={rescues} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            {groups.map((group, index) => (
              <Bar 
                key={group} 
                dataKey={group} 
                stackId="a" 
                fill={colors[index % colors.length]} 
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
