"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";

import {
  Card,
  CardContent,
  CardDescription,

  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

export default function Component({ data, propertyPath, title, description }) {
  const chartData = useMemo(() => {
    const groupedByMonth = {};

    data.forEach((item) => {
      if (!item.fullDate) return;
      const date = new Date(item.fullDate);
      const month = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      const propValue = getNestedValue(item, propertyPath) || "Não informado";

      if (!groupedByMonth[month]) {
        groupedByMonth[month] = { month };
      }
      if (!groupedByMonth[month][propValue]) {
        groupedByMonth[month][propValue] = 0;
      }
      groupedByMonth[month][propValue] += 1;
    });

    return Object.values(groupedByMonth);
  }, [data, propertyPath]);

  const keys = useMemo(() => {
    const keysSet = new Set();
    data.forEach((item) => {
      const propValue = getNestedValue(item, propertyPath) || "Não informado";
      keysSet.add(propValue);
    });
    return Array.from(keysSet);
  }, [data, propertyPath]);

  const chartConfig = useMemo(() => {
    const config = {};
    keys.forEach((key, index) => {
      config[key] = {
        label: key,
        color: COLORS[index % COLORS.length],
      };
    });
    return config;
  }, [keys]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
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
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              {keys.map((key) => (
                <Area
                  key={key}
                  dataKey={key}
                  type="monotone"
                  fill={chartConfig[key].color}
                  fillOpacity={0.4}
                  stroke={chartConfig[key].color}
                  stackId="a"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
