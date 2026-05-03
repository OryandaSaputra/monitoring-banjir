import { useEffect, useRef, useState } from "react";
import { formatPersen } from "../utils/format";

export const usePeringatanBanjir = (dataSaatIni) => {
  const [notifikasiAktif, setNotifikasiAktif] = useState(false);
  const idPeringatanTerakhir = useRef(null);

  useEffect(() => {
    if (!dataSaatIni) return;

    const perluPeringatan =
      dataSaatIni.status === "WASPADA" || dataSaatIni.status === "BAHAYA";
    if (!perluPeringatan || idPeringatanTerakhir.current === dataSaatIni.id)
      return;

    idPeringatanTerakhir.current = dataSaatIni.id;

    if (
      notifikasiAktif &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification(`Status ${dataSaatIni.status}`, {
        body: `Ketinggian air ${formatPersen(dataSaatIni.persen)} pada ${dataSaatIni.waktu}`,
      });
    }
  }, [dataSaatIni, notifikasiAktif]);

  const aktifkanNotifikasi = async () => {
    if (!("Notification" in window)) {
      window.alert("Browser ini tidak mendukung notifikasi.");
      return;
    }

    const izin = await Notification.requestPermission();
    setNotifikasiAktif(izin === "granted");
  };

  return { notifikasiAktif, aktifkanNotifikasi };
};
