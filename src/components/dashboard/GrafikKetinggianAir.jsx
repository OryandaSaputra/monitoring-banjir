import { Calendar } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatAngka, formatPersen } from "../../utils/format";

export default function GrafikKetinggianAir({
  dataGrafik,
  sedangMemuat,
  rentangTanggalTidakValid,
}) {
  return (
    <div className="lg:col-span-8 rounded-[28px] border border-white/10 bg-white/5 p-4 sm:p-5 lg:p-6">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white sm:text-xl">
            Grafik Ketinggian Air
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Menampilkan data berdasarkan rentang tanggal yang dipilih.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300">
          Data aktif:{" "}
          <span className="font-semibold text-white">
            {formatAngka(dataGrafik.length)}
          </span>
        </div>
      </div>

      {renderIsiGrafik({ dataGrafik, sedangMemuat, rentangTanggalTidakValid })}
    </div>
  );
}

function renderIsiGrafik({
  dataGrafik,
  sedangMemuat,
  rentangTanggalTidakValid,
}) {
  if (sedangMemuat) {
    return <PesanGrafik>Memuat data dari Google Sheets...</PesanGrafik>;
  }

  if (rentangTanggalTidakValid) {
    return (
      <PesanGrafik className="border-red-500/20 bg-red-500/5 text-red-200">
        Rentang tanggal tidak valid. Silakan periksa tanggal mulai dan tanggal
        akhir.
      </PesanGrafik>
    );
  }

  if (dataGrafik.length === 0) {
    return (
      <div className="flex h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-slate-950/30 px-6 text-center text-slate-400 sm:h-[420px]">
        <Calendar className="mb-3 h-10 w-10 text-slate-500" />
        <p className="text-base font-medium text-slate-300">
          Tidak ada data pada filter yang dipilih
        </p>
        <p className="mt-2 max-w-md text-sm">
          Coba ubah rentang tanggal agar data grafik muncul.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[320px] sm:h-[420px] lg:h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={dataGrafik}
          margin={{ top: 10, right: 8, left: -12, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" />
          <XAxis
            dataKey="chartLabel"
            stroke="#cbd5e1"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis
            domain={[0, 100]}
            stroke="#cbd5e1"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={42}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(15, 23, 42, 0.94)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "16px",
              color: "#fff",
            }}
            formatter={(value) => [formatPersen(value), "Persentase"]}
            labelFormatter={(_, payload) =>
              payload?.[0]?.payload?.fullLabel || "-"
            }
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Line
            type="monotone"
            dataKey="persen"
            stroke="#22d3ee"
            strokeWidth={3}
            dot={dataGrafik.length <= 30 ? { r: 3 } : false}
            activeDot={{ r: 6 }}
            name="Persentase Ketinggian Air"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function PesanGrafik({
  children,
  className = "border-white/10 bg-slate-950/40 text-slate-400",
}) {
  return (
    <div
      className={`flex h-[320px] items-center justify-center rounded-3xl border px-6 text-center sm:h-[420px] ${className}`}
    >
      {children}
    </div>
  );
}