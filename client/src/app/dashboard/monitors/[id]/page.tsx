"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useMonitorStore } from "@/store/monitor-store";
import { useAuth } from "@clerk/nextjs";
import { IMonitor, IChecks } from "@/types";
import api from "@/lib/axios";

import UILoader from "@/components/loader";
import MonitorDetailsHeader from "@/components/monitor-details-header";
import MonitorStats from "@/components/monitor-stats";
import ChecksTable from "@/components/checks-table";

const MonitorDetailsPage = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const { monitors, initialized, initialize } = useMonitorStore();
  const [monitor, setMonitor] = useState<IMonitor | null>(null);
  const [allChecks, setAllChecks] = useState<IChecks[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!initialized) {
        const token = await getToken();
        if (token) {
          await initialize(token);
        }
      }
    };
    init();
  }, [getToken, initialize, initialized]);

  useEffect(() => {
    if (initialized) {
      const foundMonitor = monitors.find((m) => m.id === id);
      if (foundMonitor) {
        setMonitor(foundMonitor);
        // Initially, we only have a few checks. We'll fetch all of them.
        fetchAllChecks(foundMonitor.id);
      } else {
        setLoading(false);
      }
    }
  }, [id, monitors, initialized]);

  const fetchAllChecks = async (monitorId: string) => {
    try {
      const token = await getToken();
      const response = await api.get(`/checks/${monitorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        setAllChecks(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch all checks", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !initialized) {
    return <UILoader />;
  }

  if (!monitor) {
    return <div>Monitor not found.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <MonitorDetailsHeader monitor={monitor} />
      <MonitorStats
        checks={allChecks.length > 0 ? allChecks : monitor.checks}
      />
      <ChecksTable checks={allChecks.length > 0 ? allChecks : monitor.checks} />
    </div>
  );
};

export default MonitorDetailsPage;
