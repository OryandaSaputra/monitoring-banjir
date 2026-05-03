import Papa from "papaparse";
import { formatPersen, formatWaktuLengkap } from "../utils/format";
import { unduhFile } from "../utils/unduh";

export const exportCsvBanjir = (dataTersaring) => {
  const header = ["Tanggal", "Jam", "Waktu Lengkap", "Persentase", "Status"];
  const baris = dataTersaring.map((item) => [
    item.tanggal,
    item.jam,
    formatWaktuLengkap(item.date),
    item.persen,
    item.status,
  ]);

  const csv = Papa.unparse([header, ...baris]);
  unduhFile(
    `monitoring-banjir-${Date.now()}.csv`,
    `\uFEFF${csv}`,
    "text/csv;charset=utf-8;",
  );
};

export const exportPdfBanjir = ({ histori, dataSaatIni, statistik }) => {
  const htmlRows = histori
    .map(
      (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${formatWaktuLengkap(item.date)}</td>
          <td>${item.persen.toFixed(1)}%</td>
          <td>${item.status}</td>
        </tr>
      `,
    )
    .join("");

  const printWindow = window.open("", "_blank", "width=1000,height=800");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>Laporan Monitoring Banjir</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #0f172a; }
          h1 { margin-bottom: 4px; }
          .meta { margin-bottom: 24px; color: #475569; }
          .cards { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
          .card { flex: 1; min-width: 180px; border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 13px; }
          th { background: #e2e8f0; }
        </style>
      </head>
      <body>
        <h1>Laporan Monitoring Banjir</h1>
        <div class="meta">Dicetak pada ${formatWaktuLengkap(new Date())}</div>

        <div class="cards">
          <div class="card"><strong>Status Saat Ini</strong><br/>${dataSaatIni?.status || "-"}</div>
          <div class="card"><strong>Ketinggian Saat Ini</strong><br/>${formatPersen(dataSaatIni?.persen || 0)}</div>
          <div class="card"><strong>Rata-rata</strong><br/>${formatPersen(statistik.avg)}</div>
          <div class="card"><strong>Tertinggi</strong><br/>${formatPersen(statistik.max)}</div>
        </div>

        <h2>Histori Terbaru</h2>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Waktu</th>
              <th>Persentase</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${htmlRows}</tbody>
        </table>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};