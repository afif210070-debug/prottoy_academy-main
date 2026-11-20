// components/ui/DataTable.tsx
export function DataTable<T>({ columns, rows }: {
  columns: { key: keyof T; label: string }[];
  rows: T[];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            {columns.map((c) => (
              <th key={String(c.key)} className="px-4 py-3 text-left font-semibold">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
              {columns.map((c) => (
                <td key={String(c.key)} className="px-4 py-3">{String(r[c.key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}