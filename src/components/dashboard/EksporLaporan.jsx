import { Database, Download, FileText } from "lucide-react";

export default function EksporLaporan({ saatExportCsv, saatExportPdf }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl bg-cyan-500/15 p-3">
          <Download className="h-5 w-5 text-cyan-300" />
        </div>
        <div>
          <h2 className="font-semibold text-white">Export Laporan</h2>
          <p className="text-sm text-slate-400">
            CSV untuk Excel dan PDF untuk cetak
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        <button
          type="button"
          onClick={saatExportCsv}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10"
        >
          <Database className="h-4 w-4" />
          Export Excel (CSV)
        </button>

        <button
          type="button"
          onClick={saatExportPdf}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10"
        >
          <FileText className="h-4 w-4" />
          Export PDF
        </button>
      </div>
    </div>
  );
}