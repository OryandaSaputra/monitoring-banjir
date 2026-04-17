import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Calendar,
  Clock,
  Database,
  Download,
  Droplets,
  FileText,
  RefreshCw,
  Shield,
  Smartphone,
  TrendingUp,
} from 'lucide-react';
import Papa from 'papaparse';

const SHEET_ID = '10QUwCUkwvopxpeZY6QXPg994_NdmwJiOVXBTgc4R3CI';
const GOOGLE_SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;

const parseDateTime = (dateStr = '', timeStr = '') => {
  const rawDate = String(dateStr).trim();
  const rawTime = String(timeStr).trim() || '00:00:00';
  if (!rawDate) return null;

  const normalizedDate = rawDate.replace(/\//g, '-');
  const parts = normalizedDate.split('-').map((part) => part.trim());

  let day;
  let month;
  let year;

  if (parts.length === 3) {
    if (parts[0]?.length === 4) {
      year = Number(parts[0]);
      month = Number(parts[1]);
      day = Number(parts[2]);
    } else {
      day = Number(parts[0]);
      month = Number(parts[1]);
      year = Number(parts[2]);
    }
  }

  if (!day || !month || !year) return null;

  const [hours = '0', minutes = '0', seconds = '0'] = rawTime.split(':');
  const parsed = new Date(
    year,
    month - 1,
    day,
    Number(hours),
    Number(minutes),
    Number(seconds)
  );

  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatPercent = (value) => `${Number(value || 0).toFixed(1)}%`;
const formatNumber = (value) => new Intl.NumberFormat('id-ID').format(value || 0);

const formatDateTime = (value) => {
  if (!value) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);
};

const formatDateOnly = (value) => {
  if (!value) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(value);
};

const formatChartTick = (value, compact = false) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(
    'id-ID',
    compact
      ? { day: '2-digit', month: 'short' }
      : { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }
  ).format(date);
};

const getStatusMeta = (value) => {
  if (value >= 70) {
    return {
      status: 'BAHAYA',
      color: 'text-red-300 bg-red-500/15 border-red-500/30',
      soft: 'bg-red-500/10 border-red-500/20',
      icon: AlertTriangle,
      description:
        'Permukaan air tinggi. Butuh tindakan cepat dan pemantauan intensif.',
    };
  }

  if (value >= 40) {
    return {
      status: 'WASPADA',
      color: 'text-amber-300 bg-amber-500/15 border-amber-500/30',
      soft: 'bg-amber-500/10 border-amber-500/20',
      icon: AlertTriangle,
      description:
        'Permukaan air mulai meningkat. Siapkan langkah antisipasi.',
    };
  }

  return {
    status: 'AMAN',
    color: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30',
    soft: 'bg-emerald-500/10 border-emerald-500/20',
    icon: Shield,
    description: 'Kondisi air relatif aman dan masih terkendali.',
  };
};

const toInputDate = (date) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getStartOfDay = (dateString) => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

const getEndOfDay = (dateString) => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day, 23, 59, 59, 999);
};

const downloadFile = (filename, content, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(null);

  const [rangeFilter, setRangeFilter] = useState('all');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  const [historyLimit, setHistoryLimit] = useState(10);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const lastAlertIdRef = useRef(null);

  const fetchData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const response = await fetch(GOOGLE_SHEET_CSV_URL, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Gagal mengambil data. Status: ${response.status}`);
      }

      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const parsed = result.data
            .map((row, index) => {
              const persenRaw =
                row.Persentase ||
                row.persentase ||
                row['Persentase '] ||
                row[' Persentase'] ||
                '0';

              const persenStr = String(persenRaw).trim().replace(',', '.');
              const persen = Number.parseFloat(persenStr);

              const tanggal = String(row.Tanggal || row.tanggal || '').trim();
              const jam = String(row.Jam || row.jam || '').trim();
              const date = parseDateTime(tanggal, jam);

              const meta = getStatusMeta(Number.isNaN(persen) ? 0 : persen);

              return {
                id: `${tanggal}-${jam}-${index}`,
                tanggal,
                jam,
                waktu: `${tanggal} ${jam}`.trim(),
                persen: Number.isNaN(persen) ? 0 : persen,
                status: meta.status,
                date,
                timestamp: date ? date.getTime() : null,
                shortLabel: date ? formatChartTick(date, true) : `${tanggal} ${jam}`,
                fullLabel: date ? formatChartTick(date, false) : `${tanggal} ${jam}`,
              };
            })
            .filter((item) => item.date && item.persen >= 0)
            .sort((a, b) => a.timestamp - b.timestamp);

          setData(parsed);
          setCurrent(parsed[parsed.length - 1] || null);

          if (parsed.length > 0 && !startDateFilter && !endDateFilter) {
            setStartDateFilter(toInputDate(parsed[0].date));
            setEndDateFilter(toInputDate(parsed[parsed.length - 1].date));
          }
        },
      });
    } catch (err) {
      console.error('Error saat mengambil data:', err);
      setError(err.message || 'Terjadi kesalahan saat memuat data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(false), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!current) return;

    const shouldAlert = current.status === 'WASPADA' || current.status === 'BAHAYA';
    if (!shouldAlert) return;
    if (lastAlertIdRef.current === current.id) return;

    lastAlertIdRef.current = current.id;

    if (
      notificationsEnabled &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      new Notification(`Status ${current.status}`, {
        body: `Ketinggian air ${formatPercent(current.persen)} pada ${current.waktu}`,
      });
    }
  }, [current, notificationsEnabled]);

  const minAvailableDate = useMemo(() => {
    if (!data.length) return '';
    return toInputDate(data[0].date);
  }, [data]);

  const maxAvailableDate = useMemo(() => {
    if (!data.length) return '';
    return toInputDate(data[data.length - 1].date);
  }, [data]);

  const filteredData = useMemo(() => {
    let filtered = [...data];

    const startDate = getStartOfDay(startDateFilter);
    const endDate = getEndOfDay(endDateFilter);

    if (startDate) {
      filtered = filtered.filter((item) => item.date >= startDate);
    }

    if (endDate) {
      filtered = filtered.filter((item) => item.date <= endDate);
    }

    if (rangeFilter === '24h') {
      const endTime = filtered[filtered.length - 1]?.timestamp;
      return endTime
        ? filtered.filter((item) => item.timestamp >= endTime - 24 * 60 * 60 * 1000)
        : filtered;
    }

    if (rangeFilter === '7d') {
      const endTime = filtered[filtered.length - 1]?.timestamp;
      return endTime
        ? filtered.filter((item) => item.timestamp >= endTime - 7 * 24 * 60 * 60 * 1000)
        : filtered;
    }

    if (rangeFilter === '30d') {
      const endTime = filtered[filtered.length - 1]?.timestamp;
      return endTime
        ? filtered.filter((item) => item.timestamp >= endTime - 30 * 24 * 60 * 60 * 1000)
        : filtered;
    }

    return filtered;
  }, [data, startDateFilter, endDateFilter, rangeFilter]);

  const chartData = useMemo(() => {
    return filteredData.map((item) => ({
      ...item,
      chartLabel: filteredData.length <= 10 ? item.fullLabel : item.shortLabel,
    }));
  }, [filteredData]);

  const currentMeta = getStatusMeta(current?.persen || 0);
  const CurrentStatusIcon = currentMeta.icon;

  const stats = useMemo(() => {
    if (!filteredData.length) {
      return { min: 0, max: 0, avg: 0, latest: 0, rise: 0 };
    }

    const values = filteredData.map((item) => item.persen);
    const latest = filteredData[filteredData.length - 1]?.persen || 0;
    const previous = filteredData[filteredData.length - 2]?.persen || latest;

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((sum, value) => sum + value, 0) / values.length,
      latest,
      rise: latest - previous,
    };
  }, [filteredData]);

  const historyRows = useMemo(() => {
    return [...filteredData].reverse().slice(0, historyLimit);
  }, [filteredData, historyLimit]);

  const insights = useMemo(() => {
    if (!filteredData.length) return [];

    const highest = filteredData.reduce(
      (max, item) => (item.persen > max.persen ? item : max),
      filteredData[0]
    );

    const lowest = filteredData.reduce(
      (min, item) => (item.persen < min.persen ? item : min),
      filteredData[0]
    );

    let sharpestRise = null;

    for (let i = 1; i < filteredData.length; i += 1) {
      const prev = filteredData[i - 1];
      const currentItem = filteredData[i];
      const delta = currentItem.persen - prev.persen;

      if (!sharpestRise || delta > sharpestRise.delta) {
        sharpestRise = {
          from: prev,
          to: currentItem,
          delta,
        };
      }
    }

    return [
      `Nilai tertinggi pada ${formatDateTime(highest.date)} sebesar ${formatPercent(highest.persen)}.`,
      `Nilai terendah pada ${formatDateTime(lowest.date)} sebesar ${formatPercent(lowest.persen)}.`,
      sharpestRise
        ? `Kenaikan tercepat sebesar ${formatPercent(sharpestRise.delta)} dari ${formatDateTime(sharpestRise.from.date)} ke ${formatDateTime(sharpestRise.to.date)}.`
        : 'Belum ada cukup data untuk menghitung kenaikan tercepat.',
    ];
  }, [filteredData]);

  const exportToExcel = () => {
    const header = ['Tanggal', 'Jam', 'Waktu Lengkap', 'Persentase', 'Status'];

    const rows = filteredData.map((item) => [
      item.tanggal,
      item.jam,
      formatDateTime(item.date),
      item.persen,
      item.status,
    ]);

    const csv = Papa.unparse([header, ...rows]);
    downloadFile(
      `monitoring-banjir-${Date.now()}.csv`,
      `\uFEFF${csv}`,
      'text/csv;charset=utf-8;'
    );
  };

  const exportToPDF = () => {
    const htmlRows = historyRows
      .map(
        (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${formatDateTime(item.date)}</td>
            <td>${item.persen.toFixed(1)}%</td>
            <td>${item.status}</td>
          </tr>
        `
      )
      .join('');

    const printWindow = window.open('', '_blank', 'width=1000,height=800');
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
          <div class="meta">Dicetak pada ${formatDateTime(new Date())}</div>

          <div class="cards">
            <div class="card"><strong>Status Saat Ini</strong><br/>${current?.status || '-'}</div>
            <div class="card"><strong>Ketinggian Saat Ini</strong><br/>${formatPercent(current?.persen || 0)}</div>
            <div class="card"><strong>Rata-rata</strong><br/>${formatPercent(stats.avg)}</div>
            <div class="card"><strong>Tertinggi</strong><br/>${formatPercent(stats.max)}</div>
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

  const enableNotifications = async () => {
    if (!('Notification' in window)) {
      window.alert('Browser ini tidak mendukung notifikasi.');
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationsEnabled(permission === 'granted');
  };

  const resetDateFilter = () => {
    setRangeFilter('all');
    setStartDateFilter(minAvailableDate);
    setEndDateFilter(maxAvailableDate);
  };

  const isInvalidDateRange =
    startDateFilter &&
    endDateFilter &&
    new Date(startDateFilter).getTime() > new Date(endDateFilter).getTime();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_35%),linear-gradient(180deg,_rgba(15,23,42,1)_0%,_rgba(2,6,23,1)_100%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
          <div className="border-b border-white/10 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/15 ring-1 ring-cyan-400/30">
                  <Droplets className="h-8 w-8 text-cyan-300" />
                </div>

                <div>
                  <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Sistem monitoring aktif
                  </p>
                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Monitoring Banjir
                  </h1>
                  <p className="mt-1 text-sm text-slate-300 sm:text-base">
                    Kelurahan Meranti Pandak • Jalan Pesisir
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[340px]">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-400">
                    <Clock className="h-4 w-4" />
                    Update terakhir
                  </div>
                  <p className="text-sm font-semibold text-white sm:text-base">
                    {current ? formatDateTime(current.date) : '-'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => fetchData(true)}
                  className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-left transition hover:border-cyan-300/60 hover:bg-cyan-400/15"
                >
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-cyan-200">
                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Sinkronisasi
                  </div>
                  <p className="text-sm font-semibold text-white sm:text-base">
                    {refreshing ? 'Memperbarui data...' : 'Refresh data sekarang'}
                  </p>
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-12 lg:p-8">
            <div className="lg:col-span-8">
              {error && (
                <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              {(current?.status === 'WASPADA' || current?.status === 'BAHAYA') && (
                <div className={`mb-4 rounded-2xl border px-4 py-4 ${currentMeta.soft}`}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Peringatan otomatis: status {current?.status}
                      </p>
                      <p className="mt-1 text-sm text-slate-300">
                        {currentMeta.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={enableNotifications}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
                    >
                      <Bell className="h-4 w-4" />
                      {notificationsEnabled ? 'Notifikasi aktif' : 'Aktifkan notifikasi'}
                    </button>
                  </div>
                </div>
              )}

              <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/8 to-white/5 p-4 sm:p-5 lg:p-6">
                <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <p className="text-sm text-cyan-200">Kondisi terkini</p>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div
                        className={`inline-flex items-center gap-3 rounded-2xl border px-4 py-3 text-lg font-semibold ${currentMeta.color}`}
                      >
                        <CurrentStatusIcon className="h-7 w-7" />
                        {current?.status || 'AMAN'}
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300">
                        Total data:{' '}
                        <span className="font-semibold text-white">
                          {formatNumber(data.length)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 flex items-end gap-2">
                      <span className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
                        {current ? current.persen.toFixed(1) : '0.0'}
                      </span>
                      <span className="pb-2 text-lg text-slate-300 sm:text-2xl">%</span>
                    </div>

                    <p className="mt-2 text-sm text-slate-400 sm:text-base">
                      Persentase ketinggian air saat ini
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 xl:w-[360px] xl:grid-cols-1">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        Rata-rata
                      </p>
                      <p className="mt-2 text-2xl font-bold text-white">
                        {formatPercent(stats.avg)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        Tertinggi
                      </p>
                      <p className="mt-2 text-2xl font-bold text-white">
                        {formatPercent(stats.max)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        Perubahan terakhir
                      </p>
                      <p
                        className={`mt-2 text-2xl font-bold ${
                          stats.rise >= 0 ? 'text-amber-300' : 'text-emerald-300'
                        }`}
                      >
                        {stats.rise >= 0 ? '+' : ''}
                        {formatPercent(stats.rise)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="h-72 sm:h-80 lg:h-[340px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.slice(-16)}>
                      <defs>
                        <linearGradient id="floodGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.45} />
                          <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" />
                      <XAxis
                        dataKey="shortLabel"
                        stroke="#cbd5e1"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        domain={[0, 100]}
                        stroke="#cbd5e1"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(15, 23, 42, 0.92)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          borderRadius: '16px',
                          color: '#fff',
                        }}
                        formatter={(value) => [formatPercent(value), 'Ketinggian']}
                        labelFormatter={(_, payload) =>
                          payload?.[0]?.payload?.fullLabel || '-'
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="persen"
                        stroke="#22d3ee"
                        strokeWidth={3}
                        fill="url(#floodGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:col-span-4">
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
                  <label className="block">
                    <span className="mb-2 block text-sm text-slate-300">Tanggal mulai</span>
                    <input
                      type="date"
                      value={startDateFilter}
                      min={minAvailableDate}
                      max={maxAvailableDate}
                      onChange={(e) => setStartDateFilter(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-slate-300">Tanggal akhir</span>
                    <input
                      type="date"
                      value={endDateFilter}
                      min={minAvailableDate}
                      max={maxAvailableDate}
                      onChange={(e) => setEndDateFilter(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                    />
                  </label>

                  {isInvalidDateRange && (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      Tanggal mulai tidak boleh lebih besar dari tanggal akhir.
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    { key: 'all', label: 'Semua' },
                    { key: '24h', label: '24 Jam' },
                    { key: '7d', label: '7 Hari' },
                    { key: '30d', label: '30 Hari' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setRangeFilter(item.key)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        rangeFilter === item.key
                          ? 'bg-cyan-400 text-slate-950'
                          : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={resetDateFilter}
                  className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10"
                >
                  Reset filter tanggal
                </button>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-2xl bg-cyan-500/15 p-3">
                    <Download className="h-5 w-5 text-cyan-300" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">Export Laporan</h2>
                    <p className="text-sm text-slate-400">
                      CSV untuk Excel dan PDF untuk cetak
                    </p>
                  </div>
                </div>

                <div className="grid gap-3">
                  <button
                    onClick={exportToExcel}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10"
                  >
                    <Database className="h-4 w-4" />
                    Export Excel (CSV)
                  </button>

                  <button
                    onClick={exportToPDF}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10"
                  >
                    <FileText className="h-4 w-4" />
                    Export PDF
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-cyan-300" />
                    <p className="font-medium text-white">Data tampil</p>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {formatNumber(filteredData.length)}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">Setelah filter aktif</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-4 pb-4 sm:px-6 sm:pb-6 lg:grid-cols-12 lg:px-8 lg:pb-8">
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
                  Data aktif:{' '}
                  <span className="font-semibold text-white">
                    {formatNumber(chartData.length)}
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="flex h-[320px] items-center justify-center rounded-3xl border border-white/10 bg-slate-950/40 text-slate-400 sm:h-[420px]">
                  Memuat data dari Google Sheets...
                </div>
              ) : isInvalidDateRange ? (
                <div className="flex h-[320px] items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/5 px-6 text-center text-red-200 sm:h-[420px]">
                  Rentang tanggal tidak valid. Silakan periksa tanggal mulai dan tanggal akhir.
                </div>
              ) : chartData.length === 0 ? (
                <div className="flex h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-slate-950/30 px-6 text-center text-slate-400 sm:h-[420px]">
                  <Calendar className="mb-3 h-10 w-10 text-slate-500" />
                  <p className="text-base font-medium text-slate-300">
                    Tidak ada data pada filter yang dipilih
                  </p>
                  <p className="mt-2 max-w-md text-sm">
                    Coba ubah rentang tanggal agar data grafik muncul.
                  </p>
                </div>
              ) : (
                <div className="h-[320px] sm:h-[420px] lg:h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
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
                          background: 'rgba(15, 23, 42, 0.94)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          borderRadius: '16px',
                          color: '#fff',
                        }}
                        formatter={(value) => [formatPercent(value), 'Persentase']}
                        labelFormatter={(_, payload) =>
                          payload?.[0]?.payload?.fullLabel || '-'
                        }
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Line
                        type="monotone"
                        dataKey="persen"
                        stroke="#22d3ee"
                        strokeWidth={3}
                        dot={chartData.length <= 30 ? { r: 3 } : false}
                        activeDot={{ r: 6 }}
                        name="Persentase Ketinggian Air"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="lg:col-span-4 rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-cyan-500/15 p-3">
                  <AlertTriangle className="h-5 w-5 text-cyan-300" />
                </div>
                <div>
                  <h2 className="font-semibold text-white">Insight Otomatis</h2>
                  <p className="text-sm text-slate-400">
                    Ringkasan cepat dari data yang sedang aktif
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {insights.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-4 pb-4 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 sm:p-5 lg:p-6">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white sm:text-xl">
                    Histori Data Terbaru
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Tabel ini memudahkan operator membaca data tanpa harus melihat
                    grafik saja.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[10, 25, 50].map((limit) => (
                    <button
                      key={limit}
                      type="button"
                      onClick={() => setHistoryLimit(limit)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        historyLimit === limit
                          ? 'bg-cyan-400 text-slate-950'
                          : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {limit} data
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto rounded-3xl border border-white/10">
                <table className="min-w-full divide-y divide-white/10 text-sm">
                  <thead className="bg-white/5 text-slate-300">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">No</th>
                      <th className="px-4 py-3 text-left font-medium">Waktu</th>
                      <th className="px-4 py-3 text-left font-medium">Persentase</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/5 bg-slate-950/20 text-slate-200">
                    {historyRows.map((item, index) => {
                      const meta = getStatusMeta(item.persen);

                      return (
                        <tr key={item.id} className="hover:bg-white/5">
                          <td className="px-4 py-3">{index + 1}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {formatDateTime(item.date)}
                          </td>
                          <td className="px-4 py-3 font-semibold text-white">
                            {formatPercent(item.persen)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${meta.color}`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}