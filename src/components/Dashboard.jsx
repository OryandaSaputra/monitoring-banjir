import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Droplets, AlertTriangle, Shield, Clock, Calendar, RefreshCw } from 'lucide-react';
import Papa from 'papaparse';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalData, setTotalData] = useState(0);

  const SHEET_ID = "10QUwCUkwvopxpeZY6QXPg994_NdmwJiOVXBTgc4R3CI";
  const GOOGLE_SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(GOOGLE_SHEET_CSV_URL);
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const parsedData = result.data
            .map((row) => {
              // Parsing robust seperti kode lama Anda
              const persenRaw = row.Persentase || row.persentase || row['Persentase '] || row[' Persentase'] || "0";
              const persenStr = persenRaw.toString().trim().replace(',', '.');
              const persen = parseFloat(persenStr);

              return {
                waktu: `${(row.Tanggal || '').toString().trim()} ${(row.Jam || '').toString().trim()}`.trim(),
                persen: isNaN(persen) ? 0 : persen,
                status: (row.Status || row.status || 'AMAN').toString().trim(),
              };
            })
            .filter(item => item.waktu !== '' && item.persen >= 0);

          setData(parsedData);
          setCurrent(parsedData[parsedData.length - 1] || null);
          setTotalData(parsedData.length);
        },
      });
    } catch (err) {
      console.error("❌ Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (data.length > 0) setCurrent(data[data.length - 1]);
  }, [data]);

  // Filter logic
  const getDisplayedData = () => {
    if (activeFilter === 'all') return data.slice(-20);
    if (activeFilter === 'hour') return data.slice(-24);   // 24 data terbaru (1 jam)
    if (activeFilter === 'day') return data.slice(-48);    // 48 data terbaru (24 jam)
    return data.slice(-20);
  };

  const displayedData = getDisplayedData();

  const getStatusColor = (status) => {
    if (status === "BAHAYA") return "text-red-500 bg-red-500/10 border-red-500/30";
    if (status === "WASPADA") return "text-amber-500 bg-amber-500/10 border-amber-500/30";
    return "text-emerald-500 bg-emerald-500/10 border-emerald-500/30";
  };

  const getStatusIcon = (status) => {
    return (status === "BAHAYA" || status === "WASPADA") 
      ? <AlertTriangle className="w-8 h-8" /> 
      : <Shield className="w-8 h-8" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1428] to-[#1e3a5f] text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-3xl p-8 shadow-2xl">

          {/* Header + Last Updated */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-3">
              <Droplets className="w-10 h-10 text-cyan-400" />
              <div>
                <h1 className="text-3xl font-bold">Monitoring Banjir</h1>
                <p className="text-cyan-300">Kelurahan Meranti Pandak • Jalan Pesisir</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-sm text-white/70">
                <Clock className="w-4 h-4" />
                <span>Data terakhir diperbarui</span>
              </div>
              <p className="font-medium text-white">
                {current ? current.waktu : '-'}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-2xl text-red-300">
              ⚠️ {error}
            </div>
          )}

          {/* Status Card */}
          {current && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8 flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-3xl text-2xl font-bold border ${getStatusColor(current.status)}`}>
                  {getStatusIcon(current.status)} {current.status}
                </div>
                <div className="mt-6 text-8xl font-bold tracking-tighter">
                  {current.persen.toFixed(1)}<span className="text-4xl text-white/70 ml-1">%</span>
                </div>
                <p className="text-xl text-white/70 mt-2">Ketinggian Air Saat Ini</p>
              </div>

              <div className="flex-1 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.slice(-12)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="waktu" stroke="#ffffff60" fontSize={12} />
                    <YAxis domain={[0, 100]} stroke="#ffffff60" />
                    <Tooltip />
                    <Line type="monotone" dataKey="persen" stroke="#22d3ee" strokeWidth={4} dot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Filter Buttons */}
          <div className="flex gap-3 mb-6">
            <button 
              onClick={() => setActiveFilter('all')} 
              className={`px-6 py-3 rounded-2xl font-medium ${activeFilter === 'all' ? 'bg-cyan-500 text-white' : 'glass text-white/70'}`}
            >
              Semua Data
            </button>
            <button 
              onClick={() => setActiveFilter('hour')} 
              className={`px-6 py-3 rounded-2xl font-medium flex items-center gap-2 ${activeFilter === 'hour' ? 'bg-cyan-500 text-white' : 'glass text-white/70'}`}
            >
              <Clock className="w-4 h-4" /> Per Jam
            </button>
            <button 
              onClick={() => setActiveFilter('day')} 
              className={`px-6 py-3 rounded-2xl font-medium flex items-center gap-2 ${activeFilter === 'day' ? 'bg-cyan-500 text-white' : 'glass text-white/70'}`}
            >
              <Calendar className="w-4 h-4" /> Per Hari (24 jam)
            </button>
          </div>

          {/* Grafik Utama */}
          <div className="glass rounded-3xl p-6" style={{ minHeight: "580px" }}>
            <h2 className="text-xl font-semibold mb-1">Grafik Ketinggian Air</h2>
            <p className="text-cyan-300 text-sm mb-4">
              {activeFilter === 'all' && "20 data terbaru"}
              {activeFilter === 'hour' && "24 data terbaru (Per Jam)"}
              {activeFilter === 'day' && "48 data terbaru (Per Hari)"}
            </p>

            {loading ? (
              <div className="h-[480px] flex items-center justify-center text-white/60">
                Memuat data dari Google Sheets...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={480}>
                <LineChart data={displayedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="waktu" stroke="#ffffff70" angle={-45} height={90} fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#ffffff70" />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="persen" 
                    stroke="#22d3ee" 
                    strokeWidth={3} 
                    dot={{ r: 5 }} 
                    name="Persentase Ketinggian Air" 
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}