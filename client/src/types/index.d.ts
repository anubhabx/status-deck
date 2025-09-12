export interface IMonitor {
  id: string;
  name: string;
  url: string;
  status: "UP" | "DOWN" | "UNKNOWN";
  interval: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  checks: IChecks[];
  isActive: boolean;
  lastChecked?: Date;
}

export interface IChecks {
  id: string;
  monitorId: string;
  statusCode: number;
  responseTime: number;
  createdAt: Date;
}

export interface IMonitorFormData {
  name: string;
  url: string;
  interval: string;
}
