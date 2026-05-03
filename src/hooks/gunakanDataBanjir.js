import { useCallback, useEffect, useMemo, useState } from "react";
import { ambilDataBanjir } from "../services/dataBanjir";
import { formatPersen, formatWaktuLengkap } from "../utils/format";
import { akhirHari, awalHari, tanggalKeInput } from "../utils/tanggal";

const BATAS_RENTANG = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

const hitungStatistik = (dataTersaring) => {
  if (!dataTersaring.length) {
    return { min: 0, max: 0, avg: 0, latest: 0, rise: 0 };
  }

  const nilai = dataTersaring.map((item) => item.persen);
  const latest = dataTersaring[dataTersaring.length - 1]?.persen || 0;
  const previous = dataTersaring[dataTersaring.length - 2]?.persen || latest;

  return {
    min: Math.min(...nilai),
    max: Math.max(...nilai),
    avg: nilai.reduce((total, item) => total + item, 0) / nilai.length,
    latest,
    rise: latest - previous,
  };
};

const buatInsight = (dataTersaring) => {
  if (!dataTersaring.length) return [];

  const tertinggi = dataTersaring.reduce(
    (maksimum, item) => (item.persen > maksimum.persen ? item : maksimum),
    dataTersaring[0],
  );
  const terendah = dataTersaring.reduce(
    (minimum, item) => (item.persen < minimum.persen ? item : minimum),
    dataTersaring[0],
  );

  let kenaikanTercepat = null;

  for (let index = 1; index < dataTersaring.length; index += 1) {
    const sebelumnya = dataTersaring[index - 1];
    const sekarang = dataTersaring[index];
    const selisih = sekarang.persen - sebelumnya.persen;

    if (!kenaikanTercepat || selisih > kenaikanTercepat.selisih) {
      kenaikanTercepat = { dari: sebelumnya, ke: sekarang, selisih };
    }
  }

  return [
    `Nilai tertinggi pada ${formatWaktuLengkap(tertinggi.date)} sebesar ${formatPersen(tertinggi.persen)}.`,
    `Nilai terendah pada ${formatWaktuLengkap(terendah.date)} sebesar ${formatPersen(terendah.persen)}.`,
    kenaikanTercepat
      ? `Kenaikan tercepat sebesar ${formatPersen(kenaikanTercepat.selisih)} dari ${formatWaktuLengkap(kenaikanTercepat.dari.date)} ke ${formatWaktuLengkap(kenaikanTercepat.ke.date)}.`
      : "Belum ada cukup data untuk menghitung kenaikan tercepat.",
  ];
};

export const useDataBanjir = () => {
  const [data, setData] = useState([]);
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [sedangRefresh, setSedangRefresh] = useState(false);
  const [pesanError, setPesanError] = useState(null);
  const [dataSaatIni, setDataSaatIni] = useState(null);
  const [filterRentang, setFilterRentang] = useState("all");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");
  const [batasHistori, setBatasHistori] = useState(10);

  const muatData = useCallback(
    async (refreshManual = false) => {
      try {
        if (refreshManual) {
          setSedangRefresh(true);
        } else {
          setSedangMemuat(true);
        }

        setPesanError(null);
        const hasil = await ambilDataBanjir();
        setData(hasil);
        setDataSaatIni(hasil[hasil.length - 1] || null);

        if (hasil.length > 0 && !tanggalMulai && !tanggalAkhir) {
          setTanggalMulai(tanggalKeInput(hasil[0].date));
          setTanggalAkhir(tanggalKeInput(hasil[hasil.length - 1].date));
        }
      } catch (error) {
        console.error("Error saat mengambil data:", error);
        setPesanError(error.message || "Terjadi kesalahan saat memuat data.");
      } finally {
        setSedangMemuat(false);
        setSedangRefresh(false);
      }
    },
    [tanggalMulai, tanggalAkhir],
  );

  useEffect(() => {
    muatData();
    const interval = setInterval(() => muatData(false), 60000);
    return () => clearInterval(interval);
  }, [muatData]);

  const tanggalMinimum = useMemo(() => {
    if (!data.length) return "";
    return tanggalKeInput(data[0].date);
  }, [data]);

  const tanggalMaksimum = useMemo(() => {
    if (!data.length) return "";
    return tanggalKeInput(data[data.length - 1].date);
  }, [data]);

  const dataTersaring = useMemo(() => {
    let hasilFilter = [...data];
    const mulai = awalHari(tanggalMulai);
    const akhir = akhirHari(tanggalAkhir);

    if (mulai) hasilFilter = hasilFilter.filter((item) => item.date >= mulai);
    if (akhir) hasilFilter = hasilFilter.filter((item) => item.date <= akhir);

    const batasWaktu = BATAS_RENTANG[filterRentang];
    if (!batasWaktu) return hasilFilter;

    const waktuTerakhir = hasilFilter[hasilFilter.length - 1]?.timestamp;
    return waktuTerakhir
      ? hasilFilter.filter(
          (item) => item.timestamp >= waktuTerakhir - batasWaktu,
        )
      : hasilFilter;
  }, [data, tanggalMulai, tanggalAkhir, filterRentang]);

  const dataGrafik = useMemo(
    () =>
      dataTersaring.map((item) => ({
        ...item,
        chartLabel:
          dataTersaring.length <= 10 ? item.fullLabel : item.shortLabel,
      })),
    [dataTersaring],
  );

  const statistik = useMemo(
    () => hitungStatistik(dataTersaring),
    [dataTersaring],
  );
  const histori = useMemo(
    () => [...dataTersaring].reverse().slice(0, batasHistori),
    [dataTersaring, batasHistori],
  );
  const insight = useMemo(() => buatInsight(dataTersaring), [dataTersaring]);
  const rentangTanggalTidakValid = Boolean(
    tanggalMulai &&
    tanggalAkhir &&
    new Date(tanggalMulai).getTime() > new Date(tanggalAkhir).getTime(),
  );

  const resetFilterTanggal = () => {
    setFilterRentang("all");
    setTanggalMulai(tanggalMinimum);
    setTanggalAkhir(tanggalMaksimum);
  };

  return {
    data,
    dataSaatIni,
    dataGrafik,
    dataTersaring,
    histori,
    insight,
    statistik,
    sedangMemuat,
    sedangRefresh,
    pesanError,
    filterRentang,
    tanggalMulai,
    tanggalAkhir,
    tanggalMinimum,
    tanggalMaksimum,
    batasHistori,
    rentangTanggalTidakValid,
    muatData,
    setFilterRentang,
    setTanggalMulai,
    setTanggalAkhir,
    setBatasHistori,
    resetFilterTanggal,
  };
};
