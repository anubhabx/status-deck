"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Link2Icon } from "lucide-react";

import { IMonitor } from "@/types";
import StatusBadge from "./status-badge";
import { Button } from "@/components/ui/button";
import EditMonitorSheet from "./edit-monitor-sheet";

const cleanUrl = (url: string) => {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
};

const MonitorDetailsHeader = ({ monitor }: { monitor: IMonitor }) => {
  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/dashboard/monitors"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Monitors
      </Link>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <StatusBadge status={monitor.status} />
            {monitor.name}
          </h1>
          <div className="flex items-center gap-2 overflow-hidden rounded bg-muted px-2 py-1 text-sm text-muted-foreground">
            <Link2Icon className="h-3 w-3 shrink-0" />
            <p className="truncate text-nowrap overflow-ellipsis max-w-lg w-full font-mono text-xs">
              {cleanUrl(monitor.url)}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Link
            href={`/monitor/${monitor.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="mr-2">
              View Public Page
            </Button>
          </Link>
          <EditMonitorSheet monitor={monitor} />
        </div>
      </div>
    </div>
  );
};

export default MonitorDetailsHeader;
