import AddMonitorForm from "@/components/add-monitor-form";
import MonitorsGrid from "@/components/monitors-grid";
import React from "react";

const MonitorsPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="">
          <h1 className="text-lg font-bold">Monitors</h1>
        </div>
        <AddMonitorForm />
      </div>

      <div className="mt-4">
        {/* Monitors list will go here */}
        <MonitorsGrid />
      </div>
    </div>
  );
};

export default MonitorsPage;
