import { IMonitor } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import React from "react";
import StatusBadge from "./status-badge";
import { CheckHistoryMini } from "./check-history-mini";
import { Button } from "@/components/ui/button";
import { Link2Icon, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import RecentCheckChart from "./recent-check-chart";
import Link from "next/link";

const MonitorCard = (monitor: IMonitor) => {
  console.log("Rendering MonitorCard for:", cronToText(monitor.interval));

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center w-full overflow-ellipsis">
          <div className="flex flex-col gap-2 max-w-full">
            <CardTitle className="flex items-center gap-2">
              <StatusBadge status={monitor.status} />
              <Link
                href={`/dashboard/monitors/${monitor.id}`}
                className="hover:underline"
              >
                {monitor.name}
              </Link>
            </CardTitle>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Edit Monitor</DropdownMenuItem>
              <DropdownMenuItem>Delete Monitor</DropdownMenuItem>
              <DropdownMenuItem>Pause Monitor</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>
          <div className="mt-1 flex items-center gap-2 overflow-hidden rounded bg-muted px-2 py-1 text-sm text-muted-foreground">
            <Link2Icon className="h-3 w-3 shrink-0" />
            <p className="truncate text-nowrap overflow-ellipsis max-w-lg w-full font-mono text-xs">
              {cleanUrl(monitor.url)}
            </p>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            {cronToText(monitor.interval)}
          </p>
          <CheckHistoryMini checks={monitor.checks} />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
          <p className="text-muted-foreground">
            Last checked: {timeAgo(monitor.lastChecked!)}
          </p>
        </div>

        <div className="flex flex-col w-full gap-2 items-center justify-center">
          <RecentCheckChart data={monitor.checks} />
          <p className="text-xs text-muted-foreground mb-1">
            Response Time (ms)
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

const timeAgo = (dateString: Date) => {
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
  return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
};

const cronToText = (cron: string) => {
  console.log("cron:", cron);

  switch (cron) {
    case "*/10 * * * *":
      return "Every 10 minutes";
    case "*/15 * * * *":
      return "Every 15 minutes";
    case "*/30 * * * *":
      return "Every 30 minutes";
    case "0 * * * *":
      return "Every hour";
    default:
      return cron;
  }
};

const cleanUrl = (url: string) => {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
};

export default MonitorCard;
