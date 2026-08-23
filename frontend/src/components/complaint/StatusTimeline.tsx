import { statusLabel } from "@/lib/status";
import type { ComplaintStatus, TimelineEvent } from "@/types";
import { cn } from "@/lib/utils";

const FLOW: ComplaintStatus[] = [
  "submitted",
  "email_sent",
  "acknowledged",
  "in_progress",
  "resolved",
];

function formatWhen(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function StatusTimeline({
  current,
  events,
}: {
  current: ComplaintStatus;
  events: TimelineEvent[];
}) {
  if (current === "rejected") {
    const rejection = events.find((event) => event.status === "rejected");
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        This complaint was rejected{rejection ? ` on ${formatWhen(rejection.at)}` : ""}.
        {rejection?.note ? ` ${rejection.note}` : ""}
      </div>
    );
  }

  const currentIndex = FLOW.indexOf(current);

  return (
    <ol className="space-y-4">
      {FLOW.map((status, index) => {
        const event = events.find((item) => item.status === status);
        const done = index <= currentIndex;

        return (
          <li key={status} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "mt-0.5 h-3 w-3 rounded-full",
                  done ? "bg-blue-600" : "bg-slate-200"
                )}
              />
              {index < FLOW.length - 1 ? (
                <span className={cn("mt-1 w-px flex-1", done ? "bg-blue-200" : "bg-slate-200")} />
              ) : null}
            </div>
            <div className="pb-2">
              <p className={cn("text-sm font-semibold", done ? "text-slate-900" : "text-slate-400")}>
                {statusLabel(status)}
              </p>
              {event ? (
                <>
                  <p className="mt-1 text-xs text-slate-500">{formatWhen(event.at)}</p>
                  <p className="mt-1 text-sm text-slate-600">{event.note}</p>
                </>
              ) : (
                <p className="mt-1 text-xs text-slate-400">Pending</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
