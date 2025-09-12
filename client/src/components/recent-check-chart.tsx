import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { Line, LineChart, XAxis } from "recharts";
import { IChecks } from "@/types";

const chartConfig = {
  checks: {
    color: "primary",
    label: "Check Data"
  }
} satisfies ChartConfig;

const RecentCheckChart = ({ data }: { data: IChecks[] }) => {
  return (
    <ChartContainer
      config={chartConfig}
      className="w-full h-full bg-accent rounded-md p-4"
    >
      <LineChart accessibilityLayer data={data}>
        <Line
          dataKey="responseTime"
          name="Response Time (ms) "
          stroke="var(--primary)"
          strokeWidth={2}
        />
        <XAxis
          dataKey="createdAt"
          tickFormatter={(date) =>
            new Date(date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })
          }
          format={"HH:mm"}
          stroke="var(--muted-foreground)"
          tick={{ fontSize: 10 }}
          interval="preserveStartEnd"
          minTickGap={10}
        />
        <ChartTooltip
          contentStyle={{ border: "none", boxShadow: "var(--shadow)" }}
          content={<ChartTooltipContent />}
          wrapperClassName="space-x-2"
          labelClassName="font-mono text-xs mr-2"
        />
      </LineChart>
    </ChartContainer>
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default RecentCheckChart;
