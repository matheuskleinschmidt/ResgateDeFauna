"use client"

import { useMemo } from "react"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const getValueByPath = (obj, path) => {
  return path.split('.').reduce((acc, part) => {
    if (acc && acc[part] !== undefined && acc[part] !== null) {
      return acc[part]
    }
    return undefined
  }, obj)
}

export default function Component({ rescues, propertyPath, title, description }) {
  const { chartData, chartConfig, speciesList } = useMemo(() => {

    const speciesSet = new Set()
    rescues.forEach((item) => {
      const speciesName = getValueByPath(item, propertyPath)
      if (speciesName) {
        speciesSet.add(speciesName)
      }
    })
    const speciesList = Array.from(speciesSet)

    const chartConfig = {}
    speciesList.forEach((name, index) => {
      chartConfig[name] = {
        label: name,
        color: `hsl(var(--chart-${index + 1}))`,
      }
    })

    const dataByMonth = {}
    rescues.forEach((item) => {
      const date = new Date(item.fullDate)
      if (isNaN(date)) return
      const month = date.toISOString().slice(0, 7)
      if (!dataByMonth[month]) {
        dataByMonth[month] = {}
      }
      const speciesName = getValueByPath(item, propertyPath)
      if (speciesName) {
        if (!dataByMonth[month][speciesName]) {
          dataByMonth[month][speciesName] = 0
        }
        dataByMonth[month][speciesName] += 1
      }
    })

    const chartData = []
    Object.keys(dataByMonth)
      .sort()
      .forEach((month) => {
        const monthData = { month }
        speciesList.forEach((name) => {
          monthData[name] = dataByMonth[month][name] || 0
        })
        chartData.push(monthData)
      })

    return { chartData, chartConfig, speciesList }
  }, [rescues, propertyPath])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const [year, month] = value.split("-")
                return `${month}/${year}`
              }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {speciesList.map((name) => (
              <Line
                key={name}
                dataKey={name}
                type="monotone"
                stroke={chartConfig[name].color}
                strokeWidth={2}
                dot={{
                    fill: name.color,
                  }}
              />
              
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Tendência de aumento neste mês <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Mostrando ocorrências totais por categoria nos últimos meses
            </div>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  )
}
