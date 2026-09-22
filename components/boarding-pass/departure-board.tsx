export type DepartureRow = {
  code: string;
  route: string;
  duration: string;
  classes: string;
  seats: number;
};

/**
 * Airport split-flap departure board — hero's boarding-pass motif anchor.
 * Flight-board details (codes, counts, dates) use the monospace face;
 * everything else stays on the brand's regular typefaces.
 */
export function DepartureBoard({
  label,
  gate,
  gateValue,
  status,
  statusValue,
  columns,
  rows,
}: {
  label: string;
  gate: string;
  gateValue: string;
  status: string;
  statusValue: string;
  columns: { route: string; duration: string; classes: string; seats: string };
  rows: DepartureRow[];
}) {
  return (
    <div className="w-full max-w-md rounded-card border border-white/10 bg-[#060d33] p-5 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.6)] sm:p-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <span className="font-board text-xs font-semibold tracking-[0.25em] text-sky uppercase">
          {label}
        </span>
        <span
          className="flex size-2.5 animate-pulse rounded-full bg-sky"
          aria-hidden
        />
      </div>

      <div className="grid grid-cols-2 gap-4 border-b border-white/10 py-4 font-board text-xs">
        <div>
          <p className="tracking-[0.2em] text-white/40 uppercase">{gate}</p>
          <p className="mt-1 text-sm font-semibold text-white">{gateValue}</p>
        </div>
        <div>
          <p className="tracking-[0.2em] text-white/40 uppercase">{status}</p>
          <p className="mt-1 text-sm font-semibold text-sky">{statusValue}</p>
        </div>
      </div>

      <table className="mt-4 w-full font-board text-[11px] sm:text-xs">
        <thead>
          <tr className="text-left tracking-[0.15em] text-white/40 uppercase">
            <th className="pb-2 font-medium">{columns.route}</th>
            <th className="pb-2 font-medium">{columns.duration}</th>
            <th className="pb-2 font-medium">{columns.classes}</th>
            <th className="pb-2 text-right font-medium">{columns.seats}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.code} className="border-t border-white/10 text-white">
              <td className="py-2.5 font-semibold">{row.code}</td>
              <td className="py-2.5 text-white/70">{row.duration}</td>
              <td className="py-2.5 text-white/70">{row.classes}</td>
              <td className="py-2.5 text-right font-semibold text-sky">
                {row.seats}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
