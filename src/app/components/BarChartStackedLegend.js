"use client"

import React, { useMemo } from 'react'
import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const getValueByPath = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}

const groupRecordsByDateAndGroup = (records, propertyPath) => {
  const grouped = records.reduce((acc, record) => {
    const date = new Date(record.fullDate).toISOString().split('T')[0]
    const groupName = getValueByPath(record, propertyPath) || 'Unknown'
    
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

export default function AnimalRecordsChart({ rescues, propertyPath, title, description }) {
  const groupedData = useMemo(() => groupRecordsByDateAndGroup(rescues, propertyPath), [rescues, propertyPath])
  
  const groups = useMemo(
    () => Array.from(new Set(rescues.map(record => getValueByPath(record, propertyPath) || 'Unknown'))),
    [rescues, propertyPath]
  )

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
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
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
          <BarChart data={groupedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
