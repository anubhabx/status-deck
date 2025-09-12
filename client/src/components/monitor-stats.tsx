"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { IChecks } from "@/types";

interface MonitorStatsProps {
  checks: IChecks[];
}

const MonitorStats = ({ checks }: MonitorStatsProps) => {
  const averageResponseTime =
    checks.length > 0
      ? checks.reduce((acc, check) => acc + check.responseTime, 0) /
        checks.length
      : 0;

  const successfulChecks = checks.filter(
    (check) => check.statusCode >= 200 && check.statusCode < 300
  ).length;
  const uptime =
    checks.length > 0 ? (successfulChecks / checks.length) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Avg. Response Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {averageResponseTime.toFixed(2)}ms
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Uptime
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{uptime.toFixed(2)}%</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Checks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{checks.length}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonitorStats;
