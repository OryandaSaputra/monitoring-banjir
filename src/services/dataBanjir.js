import Papa from "papaparse";
import { GOOGLE_SHEET_CSV_URL } from "../config/sumberData";
import { formatLabelGrafik } from "../utils/format";
import { ambilStatusAir } from "../utils/status";
import { ubahKeTanggal } from "../utils/tanggal";

const ambilNilaiKolom = (baris, daftarNamaKolom, nilaiAwal = "") => {
  const kolom = daftarNamaKolom.find(
    (namaKolom) => baris[namaKolom] !== undefined,
  );
  return kolom ? baris[kolom] : nilaiAwal;
};

const ubahBarisKeDataBanjir = (baris, index) => {
  const persenMentah = ambilNilaiKolom(
    baris,
    ["Persentase", "persentase", "Persentase ", " Persentase"],
    "0",
  );
  const persen = Number.parseFloat(
    String(persenMentah).trim().replace(",", "."),
  );
  const tanggal = String(ambilNilaiKolom(baris, ["Tanggal", "tanggal"])).trim();
  const jam = String(ambilNilaiKolom(baris, ["Jam", "jam"])).trim();
  const date = ubahKeTanggal(tanggal, jam);
  const nilaiPersen = Number.isNaN(persen) ? 0 : persen;
  const meta = ambilStatusAir(nilaiPersen);

  return {
    id: `${tanggal}-${jam}-${index}`,
    tanggal,
    jam,
    waktu: `${tanggal} ${jam}`.trim(),
    persen: nilaiPersen,
    status: meta.status,
    date,
    timestamp: date ? date.getTime() : null,
    shortLabel: date ? formatLabelGrafik(date, true) : `${tanggal} ${jam}`,
    fullLabel: date ? formatLabelGrafik(date, false) : `${tanggal} ${jam}`,
  };
};

export const parsingCsvBanjir = (csvText) => {
  const hasil = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (hasil.errors?.length) {
    console.warn("Beberapa baris CSV gagal diparsing:", hasil.errors);
  }

  return hasil.data
    .map(ubahBarisKeDataBanjir)
    .filter((item) => item.date && item.persen >= 0)
    .sort((a, b) => a.timestamp - b.timestamp);
};

export const ambilDataBanjir = async () => {
  const response = await fetch(GOOGLE_SHEET_CSV_URL, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Gagal mengambil data. Status: ${response.status}`);
  }

  const csvText = await response.text();
  return parsingCsvBanjir(csvText);
};