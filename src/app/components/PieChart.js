"use client"

import { useState, useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}

export default function PieChartComponent({ rescues, Title, Description, propertyPath }) {
  const [selectedMonth, setSelectedMonth] = useState('Todos')

  const availableMonths = useMemo(() => {
    const monthsSet = new Set(
      rescues
        .filter(({ fullDate }) => fullDate)
        .map(({ fullDate }) => {
          const date = new Date(fullDate)
          return `${date.getMonth() + 1}/${date.getFullYear()}`
        })
    )
    const sortedMonths = Array.from(monthsSet).sort((a, b) => {
      const [monthA, yearA] = a.split('/').map(Number)
      const [monthB, yearB] = b.split('/').map(Number)
      return yearA !== yearB ? yearA - yearB : monthA - monthB
    })
    return ['Todos', ...sortedMonths]
  }, [rescues])

  const chartData = useMemo(() => {
    if (!rescues.length) return []

    const filteredRescues = selectedMonth === 'Todos'
      ? rescues
      : rescues.filter(({ fullDate }) => {
          if (!fullDate) return false
          const date = new Date(fullDate)
          const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`
          return monthYear === selectedMonth
        })

    const groupedData = filteredRescues.reduce((acc, item) => {
      const propertyValue = getNestedValue(item, propertyPath) || 'Não informado'
      acc[propertyValue] = (acc[propertyValue] || 0) + 1
      return acc
    }, {})

    return Object.entries(groupedData).map(([name, value]) => ({ name, value }))
  }, [rescues, selectedMonth, propertyPath])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const { name, value } = payload[0].payload
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow">
          <p>{`Propriedade: ${name}`}</p>
          <p>{`Quantidade: ${value}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>{Title}</CardTitle>
        <CardDescription>{Description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center">
          <label htmlFor="monthFilter" className="mr-2 font-medium">Filtrar por Mês:</label>
          <select
            id="monthFilter"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            {availableMonths.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        {chartData.length === 0 ? (
          <div>Nenhum dado disponível para exibir o gráfico.</div>
        ) : (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
