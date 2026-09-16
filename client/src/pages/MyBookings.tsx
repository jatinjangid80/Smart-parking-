import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  QrCode as QrIcon,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Timer,
  Printer,
  Share2,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  XCircle,
  RefreshCw,
  LogOut,
  ChevronLeft,
} from "lucide-react";

export interface BookingRecord {
  id: string;
  locationName: string;
  address: string;
  spotNumber: string;
  floor: string;
  vehicleNumber: string;
  date: string;
  entryTime: string;
  exitTime: string;
  durationHours: number;
  amount: number;
  status: "active" | "upcoming" | "completed" | "cancelled";
  paymentMethod: string;
}

const DEFAULT_BOOKINGS: BookingRecord[] = [
  {
    id: "SPK-892401",
    locationName: "Downtown Parking Hub",
    address: "102 Main Street, City Center",
    spotNumber: "A-12",
    floor: "Level 1 (Ground)",
    vehicleNumber: "DL-08-BK-4921",
    date: "Today, 16 Sep 2026",
    entryTime: "17:30",
    exitTime: "19:30",
    durationHours: 2,
    amount: 100.0,
    status: "active",
    paymentMethod: "UPI / Razorpay",
  },
  {
    id: "SPK-774912",
    locationName: "Central Plaza",
    address: "45 Broadway Ave, Sector 4",
    spotNumber: "B-04",
    floor: "Level 2",
    vehicleNumber: "DL-08-BK-4921",
    date: "Tomorrow, 17 Sep 2026",
    entryTime: "10:00",
    exitTime: "13:00",
    durationHours: 3,
    amount: 120.0,
    status: "upcoming",
    paymentMethod: "Credit Card (HDFC)",
  },
  {
    id: "SPK-610238",
    locationName: "Mall of India Parking",
    address: "Sector 18, Commercial Belt",
    spotNumber: "C-15",
    floor: "Basement B1",
    vehicleNumber: "DL-08-BK-4921",
    date: "14 Sep 2026",
    entryTime: "14:00",
    exitTime: "17:00",
    durationHours: 3,
    amount: 90.0,
    status: "completed",
    paymentMethod: "Google Pay",
  },
  {
    id: "SPK-504918",
    locationName: "Airport Terminal 3 Hub",
    address: "IGI Airport, Arrival Lane",
    spotNumber: "T3-08",
    floor: "Terminal Deck",
    vehicleNumber: "DL-08-BK-4921",
    date: "10 Sep 2026",
    entryTime: "08:00",
    exitTime: "10:00",
    durationHours: 2,
    amount: 120.0,
    status: "cancelled",
    paymentMethod: "Refunded to UPI",
  },
];

export default function MyBookings() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"all" | "active" | "upcoming" | "completed" | "cancelled">("all");
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    try {
      const saved = localStorage.getItem("smartpark-bookings");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_BOOKINGS;
    } catch {
      return DEFAULT_BOOKINGS;
    }
  });

  const [selectedPass, setSelectedPass] = useState<BookingRecord | null>(null);

  // Sync bookings
  useEffect(() => {
    try {
      const saved = localStorage.getItem("smartpark-bookings");
      if (!saved) {
        localStorage.setItem("smartpark-bookings", JSON.stringify(DEFAULT_BOOKINGS));
      }
    } catch {}
  }, []);

  const handleCancelBooking = (bookingId: string) => {
    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: "cancelled" as const } : b
    );
    setBookings(updated);
    localStorage.setItem("smartpark-bookings", JSON.stringify(updated));
    toast.success(`Booking ${bookingId} cancelled. Refund initiated.`);
  };

  const handleExtendTime = (bookingId: string) => {
    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        const [h, m] = b.exitTime.split(":").map(Number);
        const newH = (h + 1) % 24;
        const newExitTime = `${String(newH).padStart(2, "0")}:${String(m || 0).padStart(2, "0")}`;
        return {
          ...b,
          durationHours: b.durationHours + 1,
          amount: b.amount + 50,
          exitTime: newExitTime,
        };
      }
      return b;
    });
    setBookings(updated);
    localStorage.setItem("smartpark-bookings", JSON.stringify(updated));
    toast.success("Parking duration extended by +1 Hour (+₹50).");
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "all") return true;
    return b.status === activeTab;
  });

  const counts = {
    all: bookings.length,
    active: bookings.filter((b) => b.status === "active").length,
    upcoming: bookings.filter((b) => b.status === "upcoming").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Bar - Clean Light Theme */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Home
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
                <Car className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-slate-900">My Parking Bookings</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={() => setLocation("/parking-slots")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              Book New Slot
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Booking History & Passes</h2>
            <p className="text-xs text-slate-500">
              Manage your live parking sessions, download QR passes, or extend durations
            </p>
          </div>

          {/* Tab Filter */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 text-xs shadow-sm overflow-x-auto">
            {(["all", "active", "upcoming", "completed", "cancelled"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg capitalize font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {tab} ({counts[tab]})
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <Card className="bg-white border-slate-200 p-12 text-center rounded-2xl shadow-sm space-y-4">
            <Car className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No {activeTab} bookings found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You don't have any bookings matching this category. Reserve a spot instantly from the live map!
            </p>
            <Button
              onClick={() => setLocation("/parking-slots")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              Find Available Spots
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBookings.map((b) => (
              <Card
                key={b.id}
                className="bg-white border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md flex flex-col justify-between space-y-5 relative overflow-hidden transition-all"
              >
                <div className="space-y-4">
                  {/* Status Badge & ID */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            b.status === "active"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse"
                              : b.status === "upcoming"
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : b.status === "completed"
                              ? "bg-slate-100 text-slate-600"
                              : "bg-rose-100 text-rose-800 border border-rose-200"
                          }`}
                        >
                          ● {b.status}
                        </span>
                        <span className="text-xs font-mono font-semibold text-slate-500">{b.id}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-1.5">{b.locationName}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {b.address}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                        Assigned Bay
                      </span>
                      <span className="text-2xl font-black text-blue-600">{b.spotNumber}</span>
                      <span className="text-[10px] text-slate-500 block font-medium">{b.floor}</span>
                    </div>
                  </div>

                  {/* Booking Details Grid */}
                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-500 flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date
                      </span>
                      <p className="font-semibold text-slate-800 mt-0.5">{b.date}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> Timing
                      </span>
                      <p className="font-semibold text-slate-800 mt-0.5">
                        {b.entryTime} – {b.exitTime} ({b.durationHours}h)
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500 flex items-center gap-1 font-medium">
                        <Car className="w-3.5 h-3.5 text-slate-400" /> Vehicle
                      </span>
                      <p className="font-mono font-bold text-slate-800 mt-0.5">{b.vehicleNumber}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 flex items-center gap-1 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Total Paid
                      </span>
                      <p className="font-bold text-emerald-600 mt-0.5">₹{b.amount.toFixed(2)} (INR)</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    onClick={() => setSelectedPass(b)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 flex-1 shadow-sm"
                  >
                    <QrIcon className="w-3.5 h-3.5" />
                    Digital Pass
                  </Button>

                  {b.status === "active" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExtendTime(b.id)}
                        className="border-slate-300 bg-white hover:bg-slate-50 text-amber-700 text-xs font-semibold rounded-xl"
                      >
                        <Timer className="w-3.5 h-3.5 mr-1 text-amber-600" />
                        +1 Hour (₹50)
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCancelBooking(b.id)}
                        className="text-rose-600 hover:bg-rose-50 text-xs rounded-xl font-medium"
                      >
                        Cancel
                      </Button>
                    </>
                  )}

                  {b.status === "upcoming" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCancelBooking(b.id)}
                      className="text-rose-600 hover:bg-rose-50 text-xs rounded-xl font-medium"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* QR Code Pass Dialog (Light Theme) */}
      <Dialog open={Boolean(selectedPass)} onOpenChange={(open) => !open && setSelectedPass(null)}>
        <DialogContent className="max-w-md bg-white text-slate-900 border-slate-200 p-6 rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
              <QrIcon className="w-5 h-5 text-emerald-600" />
              Smart Entry / Exit QR Pass
            </DialogTitle>
          </DialogHeader>

          {selectedPass && (
            <div className="space-y-6 pt-2">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center space-y-4 shadow-inner">
                <div className="space-y-1">
                  <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider">
                    ● {selectedPass.status.toUpperCase()} PARKING PASS
                  </span>
                  <h3 className="text-3xl font-black text-slate-900">{selectedPass.spotNumber}</h3>
                  <p className="text-xs text-slate-600 font-semibold">{selectedPass.locationName} · {selectedPass.floor}</p>
                </div>

                <div className="p-4 bg-white rounded-xl inline-block shadow-md border border-slate-200">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                      `SMARTPARK:${selectedPass.id}|SLOT:${selectedPass.spotNumber}|VEH:${selectedPass.vehicleNumber}`
                    )}`}
                    alt="Parking QR Pass"
                    className="w-44 h-44"
                  />
                </div>

                <div className="text-xs space-y-1 font-mono text-slate-700 font-medium">
                  <p>Booking Ref: {selectedPass.id}</p>
                  <p>Vehicle: {selectedPass.vehicleNumber}</p>
                  <p>
                    Validity: {selectedPass.entryTime} – {selectedPass.exitTime}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => window.print()}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  Print Pass
                </Button>
                <Button
                  onClick={() => {
                    navigator.clipboard?.writeText(
                      `SmartPark Pass: ${selectedPass.id} | Slot: ${selectedPass.spotNumber} | Valid until ${selectedPass.exitTime}`
                    );
                    toast.success("Pass details copied to clipboard!");
                  }}
                  variant="outline"
                  className="border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-4 h-4" />
                  Share Pass
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
