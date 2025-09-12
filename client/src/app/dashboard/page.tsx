"use client";

import React, { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { useMonitorStore } from "@/store/monitor-store";
import { IChecks, IMonitor } from "@/types";
import { useAuth } from "@clerk/nextjs";
import api from "@/lib/axios";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import AddMonitorForm from "@/components/add-monitor-form";
import StatusBadge from "@/components/status-badge";
import UILoader from "@/components/loader";

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

const DashboardPage = () => {
  const { monitors, initialized } = useMonitorStore();
  const { getToken } = useAuth();
  const [allChecks, setAllChecks] = useState<
    (IChecks & { monitorId: string })[]
  >([]);

  useEffect(() => {
    const fetchAllChecksForMonitors = async () => {
      if (!initialized || monitors.length === 0) return;

      const token = await getToken();
      if (!token) return;

      const checkPromises = monitors.map((monitor) =>
        api
          .get(`/checks/${monitor.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          .then((res) =>
            res.data.data.map((check: IChecks) => ({
              ...check,
              monitorId: monitor.id
            }))
          )
      );

      try {
        const checksPerMonitor = await Promise.all(checkPromises);
        setAllChecks(checksPerMonitor.flat());
      } catch (error) {
        console.error("Failed to fetch all checks for dashboard", error);
      }
    };

    fetchAllChecksForMonitors();
  }, [monitors, initialized, getToken]);

  const stats = useMemo(() => {
    const total = monitors.length;
    const up = monitors.filter((m) => m.status === "UP").length;
    const down = monitors.filter((m) => m.status === "DOWN").length;
    const unknown = total - up - down;

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    let totalChecks24h = 0;
    let successfulChecks24h = 0;

    allChecks.forEach((check) => {
      if (new Date(check.createdAt) >= twentyFourHoursAgo) {
        totalChecks24h++;
        if (check.statusCode >= 200 && check.statusCode < 300) {
          successfulChecks24h++;
        }
      }
    });

    const uptimePercentage =
      totalChecks24h > 0 ? (successfulChecks24h / totalChecks24h) * 100 : 100;

    return { total, up, down, unknown, uptimePercentage };
  }, [monitors, allChecks]);

  const recentActivity = useMemo(() => {
    const checksWithMonitorNames: (IChecks & { monitorName: string })[] = [];
    allChecks.forEach((check) => {
      const monitor = monitors.find((m) => m.id === check.monitorId);
      if (monitor) {
        checksWithMonitorNames.push({ ...check, monitorName: monitor.name });
      }
    });
    return checksWithMonitorNames
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }, [allChecks, monitors]);

  const downMonitors = useMemo(
    () => monitors.filter((m) => m.status === "DOWN"),
    [monitors]
  );

  if (!initialized) {
    return <UILoader />;
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's a summary of your monitors.
          </p>
        </div>
        <AddMonitorForm />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Monitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monitors Up
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">{stats.up}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monitors Down
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">{stats.down}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall Uptime (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {allChecks.length > 0
                ? `${stats.uptimePercentage.toFixed(1)}%`
                : "--"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex w-full h-4 rounded-full overflow-hidden">
            <div
              className="bg-green-500"
              style={{ width: `${(stats.up / stats.total) * 100}%` }}
              title={`Up: ${stats.up}`}
            />
            <div
              className="bg-red-500"
              style={{ width: `${(stats.down / stats.total) * 100}%` }}
              title={`Down: ${stats.down}`}
            />
            <div
              className="bg-gray-400"
              style={{ width: `${(stats.unknown / stats.total) * 100}%` }}
              title={`Unknown: ${stats.unknown}`}
            />
          </div>
          <div className="flex justify-start gap-4 text-xs text-muted-foreground mt-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Up: {stats.up}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Down: {stats.down}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              Unknown: {stats.unknown}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Highlight Problem Monitors */}
        <Card>
          <CardHeader>
            <CardTitle>Currently Down</CardTitle>
            <CardDescription>
              These monitors require your attention.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {downMonitors.length > 0 ? (
              <ul className="space-y-3">
                {downMonitors.map((monitor) => (
                  <li
                    key={monitor.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <Link
                        href={`/dashboard/monitors/${monitor.id}`}
                        className="font-semibold hover:underline"
                      >
                        {monitor.name}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        Down since {timeAgo(monitor.lastChecked!)}
                      </span>
                    </div>
                    <Link href={`/dashboard/monitors/${monitor.id}`}>
                      <Button variant="secondary" size="sm">
                        Details
                      </Button>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                All monitors are up. Great job!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              The latest checks from your monitors.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <ul className="space-y-3">
                {recentActivity.map((check) => (
                  <li
                    key={check.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <StatusBadge
                        status={
                          check.statusCode >= 200 && check.statusCode < 300
                            ? "UP"
                            : "DOWN"
                        }
                      />
                      <span>{check.monitorName}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {timeAgo(check.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No recent activity to display.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
