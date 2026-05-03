import { AlertTriangle } from "lucide-react";

export default function InsightOtomatis({ daftarInsight }) {
  return (
    <div className="lg:col-span-4 rounded-[28px] border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl bg-cyan-500/15 p-3">
          <AlertTriangle className="h-5 w-5 text-cyan-300" />
        </div>
        <div>
          <h2 className="font-semibold text-white">Insight Otomatis</h2>
          <p className="text-sm text-slate-400">
            Ringkasan cepat dari data yang sedang aktif
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {daftarInsight.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-300"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}