import React from "react";

const colorMap = {
  UP: "bg-green-500",
  DOWN: "bg-red-500",
  UNKNOWN: "bg-gray-400"
};

const StatusBadge = ({ status }: { status: "UP" | "DOWN" | "UNKNOWN" }) => {
  return (
    <span
      className={`inline-block w-3 h-3 rounded-full ${colorMap[status] || colorMap.UNKNOWN}`}
    />
  );
};

export default StatusBadge;
