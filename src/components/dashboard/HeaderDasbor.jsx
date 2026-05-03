import { Clock, Droplets, RefreshCw } from "lucide-react";
import { formatWaktuLengkap } from "../../utils/format";

export default function HeaderDasbor({
  dataSaatIni,
  sedangRefresh,
  saatRefresh,
}) {
  return (
    <div className="border-b border-white/10 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/15 ring-1 ring-cyan-400/30">
            <Droplets className="h-8 w-8 text-cyan-300" />
          </div>

          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Sistem monitoring aktif
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Monitoring Banjir
            </h1>
            <p className="mt-1 text-sm text-slate-300 sm:text-base">
              Kelurahan Meranti Pandak • Jalan Pesisir
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[340px]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-400">
              <Clock className="h-4 w-4" />
              Update terakhir
            </div>
            <p className="text-sm font-semibold text-white sm:text-base">
              {dataSaatIni ? formatWaktuLengkap(dataSaatIni.date) : "-"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => saatRefresh(true)}
            className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-left transition hover:border-cyan-300/60 hover:bg-cyan-400/15"
          >
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-cyan-200">
              <RefreshCw
                className={`h-4 w-4 ${sedangRefresh ? "animate-spin" : ""}`}
              />
              Sinkronisasi
            </div>
            <p className="text-sm font-semibold text-white sm:text-base">
              {sedangRefresh ? "Memperbarui data..." : "Refresh data sekarang"}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}