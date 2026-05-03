import { Bell } from "lucide-react";

export default function PeringatanStatus({
  dataSaatIni,
  metaStatus,
  notifikasiAktif,
  aktifkanNotifikasi,
}) {
  if (
    !(dataSaatIni?.status === "WASPADA" || dataSaatIni?.status === "BAHAYA")
  ) {
    return null;
  }

  return (
    <div className={`mb-4 rounded-2xl border px-4 py-4 ${metaStatus.soft}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">
            Peringatan otomatis: status {dataSaatIni?.status}
          </p>
          <p className="mt-1 text-sm text-slate-300">
            {metaStatus.description}
          </p>
        </div>

        <button
          type="button"
          onClick={aktifkanNotifikasi}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
        >
          <Bell className="h-4 w-4" />
          {notifikasiAktif ? "Notifikasi aktif" : "Aktifkan notifikasi"}
        </button>
      </div>
    </div>
  );
}