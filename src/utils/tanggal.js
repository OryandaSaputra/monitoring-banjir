export const ubahKeTanggal = (tanggalString = "", jamString = "") => {
  const tanggalMentah = String(tanggalString).trim();
  const jamMentah = String(jamString).trim() || "00:00:00";

  if (!tanggalMentah) return null;

  const tanggalNormal = tanggalMentah.replace(/\//g, "-");
  const bagianTanggal = tanggalNormal.split("-").map((bagian) => bagian.trim());

  let hari;
  let bulan;
  let tahun;

  if (bagianTanggal.length === 3) {
    if (bagianTanggal[0]?.length === 4) {
      tahun = Number(bagianTanggal[0]);
      bulan = Number(bagianTanggal[1]);
      hari = Number(bagianTanggal[2]);
    } else {
      hari = Number(bagianTanggal[0]);
      bulan = Number(bagianTanggal[1]);
      tahun = Number(bagianTanggal[2]);
    }
  }

  if (!hari || !bulan || !tahun) return null;

  const [jam = "0", menit = "0", detik = "0"] = jamMentah.split(":");
  const hasil = new Date(
    tahun,
    bulan - 1,
    hari,
    Number(jam),
    Number(menit),
    Number(detik),
  );

  return Number.isNaN(hasil.getTime()) ? null : hasil;
};

export const tanggalKeInput = (tanggal) => {
  if (!tanggal) return "";

  const tahun = tanggal.getFullYear();
  const bulan = String(tanggal.getMonth() + 1).padStart(2, "0");
  const hari = String(tanggal.getDate()).padStart(2, "0");

  return `${tahun}-${bulan}-${hari}`;
};

export const awalHari = (tanggalString) => {
  if (!tanggalString) return null;

  const [tahun, bulan, hari] = tanggalString.split("-").map(Number);
  return new Date(tahun, bulan - 1, hari, 0, 0, 0, 0);
};

export const akhirHari = (tanggalString) => {
  if (!tanggalString) return null;

  const [tahun, bulan, hari] = tanggalString.split("-").map(Number);
  return new Date(tahun, bulan - 1, hari, 23, 59, 59, 999);
};