import { Building2, Mail, MapPin, Phone } from "lucide-react";
import Card from "@/components/ui/Card";
import type { MatchedCivicBody } from "@/types";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  municipal: "Municipal body",
  electricity: "Electricity desk",
  water: "Water board",
  pwd: "Public works",
  traffic: "Traffic authority",
};

export default function CivicBodyCard({
  match,
  highlight = false,
}: {
  match: MatchedCivicBody;
  highlight?: boolean;
}) {
  const { body, distanceKm, matchReasons } = match;

  return (
    <Card
      className={cn(
        "p-6 hover:translate-y-0",
        highlight && "border-amber-300 ring-2 ring-amber-100"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--saffron)]">
            {TYPE_LABELS[body.type] ?? body.type}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">{body.name}</h3>
          <p className="text-sm text-slate-500">{body.shortName}</p>
        </div>
        {distanceKm !== null ? (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {distanceKm} km
          </span>
        ) : null}
      </div>

      <ul className="mt-5 space-y-2 text-sm text-slate-600">
        <li className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <span>
            {body.address}, {body.city} - {body.pincode}
          </span>
        </li>
        <li className="flex items-center gap-2">
          <Mail className="h-4 w-4 shrink-0 text-slate-400" />
          <span>{body.email}</span>
        </li>
        <li className="flex items-center gap-2">
          <Phone className="h-4 w-4 shrink-0 text-slate-400" />
          <span>{body.phone}</span>
        </li>
        <li className="flex items-center gap-2">
          <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
          <span>{body.officeHours}</span>
        </li>
      </ul>

      {matchReasons.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {matchReasons.map((reason) => (
            <span
              key={reason}
              className="rounded-full bg-[#f7efe3] px-2.5 py-1 text-xs text-[var(--navy)]"
            >
              {reason}
            </span>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
