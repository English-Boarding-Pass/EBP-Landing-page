export type DepartureRow = {
  code: string;
  route: string;
  duration: string;
  classes: string;
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
  columns: { route: string; duration: string; classes: string };
  rows: DepartureRow[];
}) {
  return (
    <div className="w-full max-w-lg rounded-card border border-white/10 bg-[#060d33] p-6 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.6)] sm:p-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <span className="font-board text-sm font-semibold tracking-[0.25em] text-sky uppercase">
          {label}
        </span>
        <span
          className="flex size-3 animate-pulse rounded-full bg-sky"
          aria-hidden
        />
      </div>

      <div className="grid grid-cols-2 gap-4 border-b border-white/10 py-5 font-board text-xs sm:text-sm">
        <div>
          <p className="tracking-[0.2em] text-white/40 uppercase">{gate}</p>
          <p className="mt-1.5 text-base font-semibold text-white sm:text-lg">
            {gateValue}
          </p>
        </div>
        <div>
          <p className="tracking-[0.2em] text-white/40 uppercase">{status}</p>
          <p className="mt-1.5 text-base font-semibold text-sky sm:text-lg">
            {statusValue}
          </p>
        </div>
      </div>

      <table className="mt-5 w-full font-board text-xs sm:text-sm">
        <thead>
          <tr className="text-left tracking-[0.15em] text-white/40 uppercase">
            <th className="pb-3 font-medium">{columns.route}</th>
            <th className="pb-3 font-medium">{columns.duration}</th>
            <th className="pb-3 text-right font-medium">{columns.classes}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.code} className="border-t border-white/10 text-white">
              <td className="py-3.5 font-semibold">{row.code}</td>
              <td className="py-3.5 text-white/70">{row.duration}</td>
              <td className="py-3.5 text-right font-semibold text-sky">
                {row.classes}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
