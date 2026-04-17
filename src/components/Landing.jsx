import { useNavigate } from 'react-router-dom';
import { Activity, BarChart3, Droplets, Smartphone } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,_rgba(2,6,23,1)_0%,_rgba(15,23,42,1)_55%,_rgba(8,47,73,1)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px] opacity-30" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              Monitoring aktif dan siap real-time
            </div>

            <h1 className="mt-5 max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Dashboard Monitoring Banjir yang lebih modern, jelas, dan responsif.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Pantau kondisi banjir di Kelurahan Meranti Pandak, Jalan Pesisir
              dengan tampilan yang nyaman di laptop maupun HP.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                <Activity className="mb-3 h-5 w-5 text-cyan-300" />
                <p className="text-sm font-semibold text-white">Live status</p>
                <p className="mt-1 text-sm text-slate-400">
                  Pantau kondisi terbaru secara cepat.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                <Smartphone className="mb-3 h-5 w-5 text-cyan-300" />
                <p className="text-sm font-semibold text-white">Mobile ready</p>
                <p className="mt-1 text-sm text-slate-400">
                  Nyaman dibuka dari layar kecil.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                <BarChart3 className="mb-3 h-5 w-5 text-cyan-300" />
                <p className="text-sm font-semibold text-white">Grafik interaktif</p>
                <p className="mt-1 text-sm text-slate-400">
                  Filter tanggal, bulan, dan tahun.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-cyan-400 px-6 py-4 text-base font-semibold text-slate-950 transition hover:bg-cyan-300 active:scale-[0.98]"
              >
                <Droplets className="h-5 w-5" />
                Buka Dashboard
              </button>

              <div className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-slate-300 backdrop-blur-md">
                Dirancang untuk operator lapangan dan monitoring harian.
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-xl sm:p-5">
              <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/15">
                      <Droplets className="h-7 w-7 text-cyan-300" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Preview panel</p>
                      <p className="font-semibold text-white">Monitoring Banjir</p>
                    </div>
                  </div>

                  <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                    Online
                  </div>
                </div>

                <img
                  src="https://picsum.photos/id/1015/1200/720"
                  alt="Area pemantauan banjir"
                  className="h-52 w-full rounded-3xl object-cover sm:h-64"
                />

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Status
                    </p>
                    <p className="mt-2 text-lg font-bold text-emerald-300">AMAN</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Update
                    </p>
                    <p className="mt-2 text-lg font-bold text-white">Realtime</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Akses
                    </p>
                    <p className="mt-2 text-lg font-bold text-white">HP & Laptop</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}