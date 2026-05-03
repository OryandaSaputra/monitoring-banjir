import { AlertTriangle, Shield } from "lucide-react";

export const ambilStatusAir = (nilai) => {
  if (nilai >= 70) {
    return {
      status: "BAHAYA",
      color: "text-red-300 bg-red-500/15 border-red-500/30",
      soft: "bg-red-500/10 border-red-500/20",
      icon: AlertTriangle,
      description:
        "Permukaan air tinggi. Butuh tindakan cepat dan pemantauan intensif.",
    };
  }

  if (nilai >= 40) {
    return {
      status: "WASPADA",
      color: "text-amber-300 bg-amber-500/15 border-amber-500/30",
      soft: "bg-amber-500/10 border-amber-500/20",
      icon: AlertTriangle,
      description: "Permukaan air mulai meningkat. Siapkan langkah antisipasi.",
    };
  }

  return {
    status: "AMAN",
    color: "text-emerald-300 bg-emerald-500/15 border-emerald-500/30",
    soft: "bg-emerald-500/10 border-emerald-500/20",
    icon: Shield,
    description: "Kondisi air relatif aman dan masih terkendali.",
  };
};