import { formatAngka, formatPersen } from "../../utils/format";
import GrafikRingkas from "./GrafikRingkas";

export default function KartuKondisiTerkini({
  data,
  dataSaatIni,
  statistik,
  metaStatus,
}) {
  const IkonStatus = metaStatus.icon;

  return (
    <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/8 to-white/5 p-4 sm:p-5 lg:p-6">
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm text-cyan-200">Kondisi terkini</p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div
              className={`inline-flex items-center gap-3 rounded-2xl border px-4 py-3 text-lg font-semibold ${metaStatus.color}`}
            >
              <IkonStatus className="h-7 w-7" />
              {dataSaatIni?.status || "AMAN"}
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300">
              Total data:{" "}
              <span className="font-semibold text-white">
                {formatAngka(data.length)}
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-end gap-2">
            <span className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
              {dataSaatIni ? dataSaatIni.persen.toFixed(1) : "0.0"}
            </span>
            <span className="pb-2 text-lg text-slate-300 sm:text-2xl">%</span>
          </div>

          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Persentase ketinggian air saat ini
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:w-[360px] xl:grid-cols-1">
          <InfoStatistik
            label="Rata-rata"
            nilai={formatPersen(statistik.avg)}
          />
          <InfoStatistik
            label="Tertinggi"
            nilai={formatPersen(statistik.max)}
          />
          <InfoStatistik
            label="Perubahan terakhir"
            nilai={`${statistik.rise >= 0 ? "+" : ""}${formatPersen(statistik.rise)}`}
            className={
              statistik.rise >= 0 ? "text-amber-300" : "text-emerald-300"
            }
          />
        </div>
      </div>

      <GrafikRingkas data={data} />
    </div>
  );
}

function InfoStatistik({ label, nilai, className = "text-white" }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-bold ${className}`}>{nilai}</p>
    </div>
  );
}