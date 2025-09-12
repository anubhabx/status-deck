import { create } from "zustand";
import { IMonitor, IChecks, IMonitorFormData } from "@/types";
import api from "@/lib/axios";
import { toast } from "sonner";

interface MonitorState {
  monitors: IMonitor[];
  initialized: boolean;
  initialize: (JWT: string) => Promise<void>;
  setMonitors: (monitors: IMonitor[]) => void;
  addMonitor: (monitor: IMonitorFormData, token: string) => Promise<void>;
  removeMonitor: (id: string, token: string) => Promise<void>;
  updateMonitor: (
    id: string,
    data: IMonitorFormData,
    token: string
  ) => Promise<void>;
  updateMonitorStatus: (
    id: string,
    status: "UP" | "DOWN" | "UNKNOWN",
    lastCheck: Date
  ) => void;
}

export const useMonitorStore = create<MonitorState>((set, get) => ({
  monitors: [],
  initialized: false,
  initialize: async (JWT: string) => {
    if (get().initialized) return;
    if (!JWT) return;

    try {
      const response = await api.get("/monitors", {
        headers: { Authorization: `Bearer ${JWT}`, "Cache-Control": "no-cache" }
      });
      if (response.status === 200) {
        set({ monitors: response.data.data, initialized: true });
      } else {
        toast.error("Failed to fetch monitors, please try again.");
      }
    } catch (error) {
      toast.error("Failed to fetch monitors, please try again.");
    }
  },
  setMonitors: (monitors) => set({ monitors }),
  addMonitor: async (monitor, token) => {
    try {
      const response = await api.post("/monitors", monitor);

      if (response.status === 201) {
        set((state) => ({
          monitors: [...state.monitors, response.data.data]
        }));
        toast.success("Monitor added successfully!");
      } else {
        toast.error("Failed to add monitor, please try again.");
      }
    } catch (error) {
      toast.error("Failed to add monitor, please try again.");
    }
  },
  removeMonitor: async (id, token) => {
    try {
      const response = await api.delete(`/monitors/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        set((state) => ({
          monitors: state.monitors.filter((monitor) => monitor.id !== id)
        }));
        toast.success("Monitor deleted successfully!");
      } else {
        toast.error("Failed to delete monitor, please try again.");
      }
    } catch (error) {
      toast.error("Failed to delete monitor, please try again.");
    }
  },
  updateMonitor: async (id, data, token) => {
    try {
      const response = await api.put(`/monitors/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        set((state) => ({
          monitors: state.monitors.map((m) =>
            m.id === id ? { ...m, ...response.data.data } : m
          )
        }));
        toast.success("Monitor updated successfully!");
      } else {
        toast.error("Failed to update monitor, please try again.");
      }
    } catch (error) {
      toast.error("Failed to update monitor, please try again.");
    }
  },
  updateMonitorStatus: async (id, status, lastCheck) => {
    try {
      const response = await api.put(`/monitors/${id}`, {
        status,
        lastCheck
      });
      if (response.status === 200) {
        set((state) => ({
          monitors: state.monitors.map((monitor) =>
            monitor.id === id ? { ...monitor, status, lastCheck } : monitor
          )
        }));
        toast.success("Monitor status updated successfully!");
      } else {
        toast.error("Failed to update monitor status, please try again.");
      }
    } catch (error) {
      toast.error("Failed to update monitor status, please try again.");
    }
  }
}));
