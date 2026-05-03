import { BarChart3 } from "lucide-react";
import { formatAngka } from "../../utils/format";

export default function RingkasanJumlahData({ jumlah }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
      <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
        <div className="mb-3 flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-cyan-300" />
          <p className="font-medium text-white">Data tampil</p>
        </div>
        <p className="text-3xl font-bold text-white">{formatAngka(jumlah)}</p>
        <p className="mt-1 text-sm text-slate-400">Setelah filter aktif</p>
      </div>
    </div>
  );
}