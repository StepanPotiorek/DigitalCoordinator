import Link from "next/link"

type Accommodation = {
  id: number
  workerId: number
  address: string
  room: string | null
  rules: string | null
  contactName: string | null
  contactPhone: string | null
  mapUrl: string | null
}

export function AccommodationCard({
  accommodation,
  workerId,
}: {
  accommodation: Accommodation
  workerId: number
}) {
  const rulesList = accommodation.rules
    ? accommodation.rules.split("\n").filter(Boolean)
    : []

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Accommodation</h2>
        <Link
          href={`/dashboard/workers/${workerId}/accommodation`}
          className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-600"
        >
          Manage
        </Link>
      </div>

      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-400">Address</dt>
          <dd className="text-right text-white">{accommodation.address}</dd>
        </div>
        {accommodation.room && (
          <div className="flex justify-between">
            <dt className="text-slate-400">Room</dt>
            <dd className="text-white">{accommodation.room}</dd>
          </div>
        )}
        {accommodation.contactName && (
          <div className="flex justify-between">
            <dt className="text-slate-400">Contact</dt>
            <dd className="text-right text-white">
              {accommodation.contactName}
              {accommodation.contactPhone && (
                <span className="block text-xs text-slate-400">
                  {accommodation.contactPhone}
                </span>
              )}
            </dd>
          </div>
        )}
      </dl>

      {rulesList.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            House Rules
          </h3>
          <ul className="space-y-1">
            {rulesList.map((rule, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-300"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-600" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      )}

      {accommodation.mapUrl && (
        <a
          href={accommodation.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
        >
          Open in Maps
          <span className="text-xs">↗</span>
        </a>
      )}
    </div>
  )
}
