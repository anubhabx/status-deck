import { IChecks } from "@/types";

export const CheckHistoryMini = ({ checks }: { checks: IChecks[] }) => {
  return (
    <div className="flex gap-1 items-center">
      {checks.length > 0 &&
        checks.map((check) => (
          <span
            key={check.id}
            className={`w-2 h-2 rounded-full 
            ${
              check.statusCode >= 200 && check.statusCode < 300
                ? "bg-green-400"
                : check.statusCode === 0
                  ? "bg-gray-400"
                  : "bg-red-400"
            }`}
            title={`HTTP ${check.statusCode} at ${new Date(check.createdAt).toLocaleTimeString()}`}
          />
        ))}
    </div>
  );
};
