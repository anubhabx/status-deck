"use client";

import React from "react";
import { useMonitorStore } from "@/store/monitor-store";
import { useAuth } from "@clerk/nextjs";

import MonitorCard from "./monitor-card";
import UILoader from "./loader";

const MonitorsGrid = () => {
  const [loading, setLoading] = React.useState(false);
  const { getToken } = useAuth();
  const { monitors, initialized, initialize } = useMonitorStore();


  if (loading || !initialized) {
    return <UILoader />;
  }

  if (monitors.length === 0) {
    return <p>No monitors available. Please add a monitor.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {monitors.map((monitor) => (
        <MonitorCard key={monitor.id} {...monitor} />
      ))}
    </div>
  );
};

export default MonitorsGrid;
