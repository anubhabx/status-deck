import { Loader2Icon } from "lucide-react";
import React from "react";

const UILoader = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2Icon className="animate-spin size-6 text-muted-foreground" />
      Loading
    </div>
  );
};

export default UILoader;
