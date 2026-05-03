import { useMemo } from "react";
import { useDataBanjir } from "../hooks/gunakanDataBanjir";
import { usePeringatanBanjir } from "../hooks/gunakanPeringatanBanjir";
import { exportCsvBanjir, exportPdfBanjir } from "../services/laporan";
import { ambilStatusAir } from "../utils/status";
import EksporLaporan from "./dashboard/EksporLaporan";
import FilterTanggal from "./dashboard/FilterTanggal";
import GrafikKetinggianAir from "./dashboard/GrafikKetinggianAir";
import HeaderDasbor from "./dashboard/HeaderDasbor";
import InsightOtomatis from "./dashboard/InsightOtomatis";
import KartuKondisiTerkini from "./dashboard/KartuKondisiTerkini";
import PeringatanStatus from "./dashboard/PeringatanStatus";
import RingkasanJumlahData from "./dashboard/RingkasanJumlahData";
import TabelHistori from "./dashboard/TabelHistori";

export default function Dasbor() {
  const dataBanjir = useDataBanjir();
  const { notifikasiAktif, aktifkanNotifikasi } = usePeringatanBanjir(
    dataBanjir.dataSaatIni,
  );
  const metaStatus = useMemo(
    () => ambilStatusAir(dataBanjir.dataSaatIni?.persen || 0),
    [dataBanjir.dataSaatIni],
  );

  const saatExportPdf = () => {
    exportPdfBanjir({
      histori: dataBanjir.histori,
      dataSaatIni: dataBanjir.dataSaatIni,
      statistik: dataBanjir.statistik,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_35%),linear-gradient(180deg,_rgba(15,23,42,1)_0%,_rgba(2,6,23,1)_100%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
          <HeaderDasbor
            dataSaatIni={dataBanjir.dataSaatIni}
            sedangRefresh={dataBanjir.sedangRefresh}
            saatRefresh={dataBanjir.muatData}
          />

          <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-12 lg:p-8">
            <div className="lg:col-span-8">
              {dataBanjir.pesanError && (
                <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {dataBanjir.pesanError}
                </div>
              )}

              <PeringatanStatus
                dataSaatIni={dataBanjir.dataSaatIni}
                metaStatus={metaStatus}
                notifikasiAktif={notifikasiAktif}
                aktifkanNotifikasi={aktifkanNotifikasi}
              />

              <KartuKondisiTerkini
                data={dataBanjir.data}
                dataSaatIni={dataBanjir.dataSaatIni}
                statistik={dataBanjir.statistik}
                metaStatus={metaStatus}
              />
            </div>

            <div className="grid gap-4 lg:col-span-4">
              <FilterTanggal
                tanggalMulai={dataBanjir.tanggalMulai}
                tanggalAkhir={dataBanjir.tanggalAkhir}
                tanggalMinimum={dataBanjir.tanggalMinimum}
                tanggalMaksimum={dataBanjir.tanggalMaksimum}
                filterRentang={dataBanjir.filterRentang}
                rentangTanggalTidakValid={dataBanjir.rentangTanggalTidakValid}
                setTanggalMulai={dataBanjir.setTanggalMulai}
                setTanggalAkhir={dataBanjir.setTanggalAkhir}
                setFilterRentang={dataBanjir.setFilterRentang}
                resetFilterTanggal={dataBanjir.resetFilterTanggal}
              />

              <EksporLaporan
                saatExportCsv={() => exportCsvBanjir(dataBanjir.dataTersaring)}
                saatExportPdf={saatExportPdf}
              />

              <RingkasanJumlahData jumlah={dataBanjir.dataTersaring.length} />
            </div>
          </div>

          <div className="grid gap-4 px-4 pb-4 sm:px-6 sm:pb-6 lg:grid-cols-12 lg:px-8 lg:pb-8">
            <GrafikKetinggianAir
              dataGrafik={dataBanjir.dataGrafik}
              sedangMemuat={dataBanjir.sedangMemuat}
              rentangTanggalTidakValid={dataBanjir.rentangTanggalTidakValid}
            />

            <InsightOtomatis daftarInsight={dataBanjir.insight} />
          </div>

          <TabelHistori
            histori={dataBanjir.histori}
            batasHistori={dataBanjir.batasHistori}
            setBatasHistori={dataBanjir.setBatasHistori}
          />
        </div>
      </div>
    </div>
  );
}