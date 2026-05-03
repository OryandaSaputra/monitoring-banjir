export const formatPersen = (nilai) => `${Number(nilai || 0).toFixed(1)}%`;

export const formatAngka = (nilai) =>
  new Intl.NumberFormat("id-ID").format(nilai || 0);

export const formatWaktuLengkap = (nilai) => {
  if (!nilai) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(nilai);
};

export const formatLabelGrafik = (nilai, ringkas = false) => {
  if (!nilai) return "";

  const tanggal = new Date(nilai);
  if (Number.isNaN(tanggal.getTime())) return nilai;

  const pilihanFormat = ringkas
    ? { day: "2-digit", month: "short" }
    : { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" };

  return new Intl.DateTimeFormat("id-ID", pilihanFormat).format(tanggal);
};