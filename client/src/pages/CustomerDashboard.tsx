import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { LiveParkingMap } from "@/components/Map";
import {
  MapPin,
  Calendar,
  Clock,
  Navigation,
  Car,
  QrCode as QrIcon,
  ShieldCheck,
  Zap,
  Search,
  ArrowRight,
  Heart,
  History,
  User,
  LogOut,
  ChevronRight,
  Activity,
  Layers,
  Sparkles,
  CreditCard,
  Bell,
  Star,
  CheckCircle2,
} from "lucide-react";

export default function CustomerDashboard() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<{ name: string; email: string; role: string }>({
    name: "Jatin Jangid",
    email: "jatin@smartpark.io",
    role: "Customer / Driver",
  });

  const [activeTab, setActiveTab] = useState<"dashboard" | "find" | "map" | "bookings" | "history" | "favorites" | "profile">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  const [activeBooking, setActiveBooking] = useState<{
    id: string;
    locationName: string;
    spotNumber: string;
    vehicleNumber: string;
    entryTime: string;
    exitTime: string;
    amount: number;
    floor: string;
  }>({
    id: "SPK-892401",
    locationName: "City Center Parking",
    spotNumber: "A-12",
    floor: "Level 1 (Ground)",
    vehicleNumber: "DL-08-BK-4921",
    entryTime: "10:30 AM",
    exitTime: "12:30 PM",
    amount: 60,
  });

  useEffect(() => {
    const saved = localStorage.getItem("smartpark-user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("smartpark-user");
    toast.success("Logged out successfully");
    setLocation("/login");
  };

  const nearbyLocations = [
    {
      id: "loc1",
      name: "City Center Parking",
      address: "102 Main Street, MI Road",
      available: 78,
      total: 120,
      price: 30,
      distance: "1.2 km",
      rating: 4.9,
      isFav: true,
    },
    {
      id: "loc2",
      name: "Mall Parking Hub",
      address: "Sector 4, Commercial Belt",
      available: 42,
      total: 100,
      price: 40,
      distance: "2.4 km",
      rating: 4.8,
      isFav: true,
    },
    {
      id: "loc3",
      name: "Railway Station Parking",
      address: "Station Road, Platform 1 Lane",
      available: 19,
      total: 60,
      price: 25,
      distance: "3.5 km",
      rating: 4.6,
      isFav: false,
    },
    {
      id: "loc4",
      name: "Airport Terminal 3 Hub",
      address: "IGI Airport, Arrival Lane",
      available: 145,
      total: 300,
      price: 60,
      distance: "8.5 km",
      rating: 4.9,
      isFav: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Customer Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setLocation("/")}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md text-white">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black text-slate-900 tracking-tight">SmartPark</span>
                <span className="block text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                  Customer Portal
                </span>
              </div>
            </button>

            {/* Desktop Tabs */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
              {[
                { id: "dashboard", label: "Dashboard" },
                { id: "find", label: "Find Parking", route: "/parking-slots" },
                { id: "map", label: "Live Map", route: "/parking-slots" },
                { id: "bookings", label: "My Bookings", route: "/my-bookings" },
                { id: "history", label: "Parking History", route: "/my-bookings" },
                { id: "profile", label: "Profile" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.route) setLocation(item.route);
                    else setActiveTab(item.id as any);
                  }}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-700 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* User Account Pill */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
                <p className="text-[10px] text-emerald-700 font-semibold">● Verified Driver</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleLogout}
              className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 h-8 px-2.5"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Customer Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Greeting Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                Customer Space
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-white">
                Good Evening, {user.name.split(" ")[0]} 👋
              </h1>
              <p className="text-sm text-blue-100 mt-1">
                Where do you want to park today? Instant slot reservations and digital QR passes.
              </p>
            </div>
            <Button
              onClick={() => setLocation("/parking-slots")}
              className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-6 py-2.5 rounded-xl shadow-md text-sm shrink-0"
            >
              Reserve a Slot Now →
            </Button>
          </div>

          {/* Quick Search */}
          <div className="bg-white p-2 rounded-2xl shadow-lg flex items-center gap-2 max-w-2xl">
            <Search className="w-5 h-5 text-slate-400 ml-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search parking hub, shopping mall, airport, station..."
              className="w-full py-2 text-slate-900 text-sm font-medium focus:outline-none placeholder-slate-400"
            />
            <Button
              onClick={() => setLocation("/parking-slots")}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              Search
            </Button>
          </div>
        </div>

        {/* 2 Summary KPI Cards: Available Spots & Active Booking */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Live Available Spots */}
          <Card className="bg-white border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Available Parking</h2>
                  <p className="text-xs text-slate-500">Real-time spots across city hubs</p>
                </div>
              </div>
              <span className="text-2xl font-black text-emerald-600">128 Spots</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-100">
              <div className="p-2 bg-slate-50 rounded-xl">
                <p className="font-bold text-slate-900">78 Free</p>
                <p className="text-[10px] text-slate-500">City Center</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <p className="font-bold text-slate-900">42 Free</p>
                <p className="text-[10px] text-slate-500">Mall Hub</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <p className="font-bold text-slate-900">19 Free</p>
                <p className="text-[10px] text-slate-500">Station</p>
              </div>
            </div>

            <Button
              onClick={() => setLocation("/parking-slots")}
              className="w-full bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
            >
              Browse 2D Slot Map →
            </Button>
          </Card>

          {/* Card 2: Active Booking */}
          <Card className="bg-white border-slate-200 p-6 rounded-2xl shadow-sm space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Active Booking</h2>
                  <p className="text-xs text-emerald-700 font-semibold">● Valid QR Pass Active</p>
                </div>
              </div>
              <span className="text-2xl font-black text-blue-600 font-mono">
                {activeBooking.spotNumber}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-700 border border-slate-200">
              <div className="flex justify-between font-semibold">
                <span>{activeBooking.locationName}</span>
                <span className="text-emerald-600 font-bold">PAID (₹{activeBooking.amount})</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Time: {activeBooking.entryTime} – {activeBooking.exitTime}</span>
                <span className="font-mono">{activeBooking.vehicleNumber}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => setLocation("/my-bookings")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
              >
                <QrIcon className="w-4 h-4" />
                QR Pass
              </Button>
              <Button
                onClick={() =>
                  window.open(
                    "https://www.google.com/maps/dir/?api=1&destination=28.6315,77.2167",
                    "_blank"
                  )
                }
                variant="outline"
                className="border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-4 h-4 text-blue-600" />
                Navigate
              </Button>
            </div>
          </Card>
        </div>

        {/* Nearby Parking Locations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Nearby Parking Locations
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/parking-slots")}
              className="text-xs font-bold border-slate-300"
            >
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {nearbyLocations.map((loc) => (
              <Card
                key={loc.id}
                className="bg-white border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-slate-900 text-base">{loc.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {loc.available} left
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {loc.address}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Rate</span>
                    <span className="text-base font-black text-slate-900">₹{loc.price}</span>
                    <span className="text-slate-500 text-[10px]"> / hr</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Distance</span>
                    <span className="font-bold text-blue-600">{loc.distance}</span>
                  </div>
                </div>

                <Button
                  onClick={() => setLocation("/parking-slots")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm"
                >
                  View Slots & Book
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Customer Profile Section */}
        {activeTab === "profile" && (
          <Card className="bg-white border-slate-200 p-6 rounded-2xl shadow-sm space-y-6 max-w-2xl">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                <p className="text-xs text-slate-500">{user.email}</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Verified Customer / Driver
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block">Registered Vehicle</span>
                <span className="font-mono font-bold text-slate-900 text-sm">DL-08-BK-4921</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block">Saved Wallet</span>
                <span className="font-bold text-emerald-600 text-sm">₹450 (UPI Active)</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <Button
                onClick={() => setLocation("/my-bookings")}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl flex-1"
              >
                View Full Booking History
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold py-2.5 rounded-xl"
              >
                Sign Out
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
