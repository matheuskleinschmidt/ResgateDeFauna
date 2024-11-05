"use client"

import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function ProcedureOrientationChart() {
  const [rescues, setRescues] = useState([])
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRescueData = async () => {
      try {
        const baseUrl = window.location.origin
        const apiUrl = `${baseUrl}/api/rescue`
        const response = await axios.get(apiUrl)
        const data = response.data

        setRescues(data)

        
        const uniqueGroups = Array.from(new Set(data.map(record => record.species?.AnimalGroup?.groupName || 'Unknown')))
        setGroups(uniqueGroups)
      } catch (error) {
        console.error("Erro ao fazer a requisição:", error)
        setError("Falha ao carregar os dados.")
      } finally {
        setLoading(false)
      }
    }

    fetchRescueData()
  }, [])

  
  const chartData = useMemo(() => {
    if (rescues.length === 0) return []

  
    const groupedData = rescues.reduce((acc, item) => {
      if (item.procedureOrientationBy) {
        const date = new Date(item.fullDate)
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`
        const procedureName = item.procedureOrientationBy.name || 'Unknown'

        const key = `${monthYear}-${procedureName}`
        acc[key] = (acc[key] || 0) + 1
      }
      return acc
    }, {})

    const processedData = Object.entries(groupedData).map(([key, value]) => {
      const [monthYear, name] = key.split('-')
      return { monthYear, name, value }
    })

    return processedData
  }, [rescues])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow">
          <p>{`Mês/Ano: ${data.monthYear}`}</p>
          <p>{`Procedimento: ${data.name}`}</p>
          <p>{`Quantidade: ${data.value}`}</p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return <div>Carregando dados...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Distribuição de Procedimentos por Mês</CardTitle>
        <CardDescription>Baseado na propriedade procedureOrientationBy.name</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div>Nenhum dado disponível para exibir o gráfico.</div>
        ) : (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
