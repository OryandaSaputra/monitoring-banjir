import { formatPersen, formatWaktuLengkap } from "../../utils/format";
import { ambilStatusAir } from "../../utils/status";

const PILIHAN_BATAS = [10, 25, 50];

export default function TabelHistori({
  histori,
  batasHistori,
  setBatasHistori,
}) {
  return (
    <div className="px-4 pb-4 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 sm:p-5 lg:p-6">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white sm:text-xl">
              Histori Data Terbaru
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Tabel ini memudahkan operator membaca data tanpa harus melihat
              grafik saja.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {PILIHAN_BATAS.map((limit) => (
              <button
                key={limit}
                type="button"
                onClick={() => setBatasHistori(limit)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  batasHistori === limit
                    ? "bg-cyan-400 text-slate-950"
                    : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {limit} data
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 text-left font-medium">No</th>
                <th className="px-4 py-3 text-left font-medium">Waktu</th>
                <th className="px-4 py-3 text-left font-medium">Persentase</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 bg-slate-950/20 text-slate-200">
              {histori.map((item, index) => {
                const meta = ambilStatusAir(item.persen);

                return (
                  <tr key={item.id} className="hover:bg-white/5">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatWaktuLengkap(item.date)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-white">
                      {formatPersen(item.persen)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${meta.color}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
