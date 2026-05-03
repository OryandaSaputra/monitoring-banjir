import { Calendar } from "lucide-react";

const PILIHAN_RENTANG = [
  { key: "all", label: "Semua" },
  { key: "24h", label: "24 Jam" },
  { key: "7d", label: "7 Hari" },
  { key: "30d", label: "30 Hari" },
];

export default function FilterTanggal({
  tanggalMulai,
  tanggalAkhir,
  tanggalMinimum,
  tanggalMaksimum,
  filterRentang,
  rentangTanggalTidakValid,
  setTanggalMulai,
  setTanggalAkhir,
  setFilterRentang,
  resetFilterTanggal,
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl bg-cyan-500/15 p-3">
          <Calendar className="h-5 w-5 text-cyan-300" />
        </div>
        <div>
          <h2 className="font-semibold text-white">Filter Tanggal</h2>
          <p className="text-sm text-slate-400">
            Pilih rentang dari tanggal berapa sampai tanggal berapa
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        <InputTanggal
          label="Tanggal mulai"
          value={tanggalMulai}
          min={tanggalMinimum}
          max={tanggalMaksimum}
          onChange={setTanggalMulai}
        />
        <InputTanggal
          label="Tanggal akhir"
          value={tanggalAkhir}
          min={tanggalMinimum}
          max={tanggalMaksimum}
          onChange={setTanggalAkhir}
        />

        {rentangTanggalTidakValid && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            Tanggal mulai tidak boleh lebih besar dari tanggal akhir.
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {PILIHAN_RENTANG.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setFilterRentang(item.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filterRentang === item.key
                ? "bg-cyan-400 text-slate-950"
                : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={resetFilterTanggal}
        className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10"
      >
        Reset filter tanggal
      </button>
    </div>
  );
}

function InputTanggal({ label, value, min, max, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-slate-300">{label}</span>
      <input
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
      />
    </label>
  );
}