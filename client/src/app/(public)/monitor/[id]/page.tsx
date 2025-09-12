"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import StatusBadge from "@/components/status-badge";
import UILoader from "@/components/loader";
import { VerifiedIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import RecentCheckChart from "@/components/recent-check-chart";
import { IChecks } from "@/types";

interface IPublicMonitorData {
  name: string;
  status: "UP" | "DOWN" | "UNKNOWN";
  lastChecked: Date;
  averageResponseTime: number;
  uptime: number;
  checks: IChecks[];
}

const timeAgo = (dateString: Date) => {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval} year${interval > 1 ? "s" : ""} ago`;
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} month${interval > 1 ? "s" : ""} ago`;
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} day${interval > 1 ? "s" : ""} ago`;
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} hour${interval > 1 ? "s" : ""} ago`;
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval} minute${interval > 1 ? "s" : ""} ago`;
  return `${Math.floor(seconds)} second${Math.floor(seconds) !== 1 ? "s" : ""} ago`;
};

const PublicStatusPage = () => {
  const { id } = useParams();
  const [monitor, setMonitor] = useState<IPublicMonitorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchMonitorData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/monitors/public/${id}`);

        if (response.status === 200) {
          setMonitor(response.data.data);
        } else {
          setError("Failed to load monitor status.");
        }
      } catch (err) {
        setError("Monitor not found or an error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchMonitorData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <UILoader />
      </div>
    );
  }

  if (error || !monitor) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">{error || "Monitor not found."}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{monitor.name}</CardTitle>
            <StatusBadge status={monitor.status} />
          </div>
          <CardDescription>
            Last checked: {timeAgo(monitor.lastChecked)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium text-muted-foreground">
                Uptime (All-time)
              </p>
              <p className="text-2xl font-bold">{monitor.uptime.toFixed(2)}%</p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium text-muted-foreground">
                Avg. Response Time
              </p>
              <p className="text-2xl font-bold">
                {monitor.averageResponseTime.toFixed(0)}ms
              </p>
            </div>
          </div>
        </CardContent>

        <CardContent className="h-64 flex flex-col items-center justify-center">
          <RecentCheckChart data={monitor.checks.slice(0, 10)} />
          <span className="text-sm text-muted-foreground text-center w-full my-2">
            Recent History
          </span>
        </CardContent>

        <Separator className="my-0" />

        <CardFooter className="flex items-center justify-center text-sm text-primary">
          <VerifiedIcon className="inline-block mr-2" size={14} />
          Status provided by StatusDeck
        </CardFooter>
      </Card>
    </div>
  );
};

export default PublicStatusPage;
