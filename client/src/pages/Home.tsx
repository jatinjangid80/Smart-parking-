import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  TrendingUp,
  Search,
  ArrowRight,
  Printer,
  Share2,
  Download,
  CheckCircle2,
  User,
  LogOut,
  LogIn,
  Layers,
  ChevronRight,
  Activity,
  Sparkles,
  PhoneCall,
  Lock,
  Compass,
  Smartphone,
  Building2,
} from "lucide-react";
import { APP_TITLE } from "@/const";

export default function Home() {
  const [, setLocation] = useLocation();

  // User state
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState("jatin@smartpark.io");
  const [searchQuery, setSearchQuery] = useState("Jaipur, Rajasthan");
  const [showQrModal, setShowQrModal] = useState(false);

  // Active booking for demo
  const [activeBooking, setActiveBooking] = useState<{
    id: string;
    locationName: string;
    spotNumber: string;
    vehicleNumber: string;
    entryTime: string;
    exitTime: string;
    amount: number;
  } | null>({
    id: "SPK-892401",
    locationName: "City Center Parking",
    spotNumber: "A-12",
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
      } catch {
        setUser({ name: "Jatin Jangid", email: "jatin@smartpark.io", role: "Verified Driver" });
      }
    } else {
      const defaultUser = { name: "Jatin Jangid", email: "jatin@smartpark.io", role: "Verified Driver" };
      localStorage.setItem("smartpark-user", JSON.stringify(defaultUser));
      setUser(defaultUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("smartpark-user");
    setUser(null);
    toast.success("Logged out successfully");
  };

  const handleQuickLogin = (email: string) => {
    const name = email.includes("jatin") ? "Jatin Jangid" : email.split("@")[0] || "Driver";
    const loggedUser = {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: email,
      role: "Verified Driver",
    };
    localStorage.setItem("smartpark-user", JSON.stringify(loggedUser));
    setUser(loggedUser);
    setShowLoginModal(false);
    toast.success(`Welcome back, ${loggedUser.name}!`);
  };

  const requireAuthAndNavigate = (targetPath: string) => {
    if (!user) {
      setShowLoginModal(true);
      toast.info("Please sign in first to book and manage parking slots.");
      return;
    }
    setLocation(targetPath);
  };

  const nearbyParkingList = [
    {
      id: "loc1",
      name: "City Center Parking",
      address: "102 Main Street, MI Road",
      available: 78,
      total: 120,
      price: 30,
      distance: "1.2 km",
      lat: 28.6315,
      lng: 77.2167,
      rating: 4.9,
    },
    {
      id: "loc2",
      name: "Mall of Jaipur Parking",
      address: "Sector 4, Malviya Nagar",
      available: 42,
      total: 100,
      price: 40,
      distance: "2.4 km",
      lat: 28.628,
      lng: 77.209,
      rating: 4.8,
    },
    {
      id: "loc3",
      name: "Railway Station Parking",
      address: "Station Road, Platform 1 Lane",
      available: 19,
      total: 60,
      price: 25,
      distance: "3.5 km",
      lat: 28.5672,
      lng: 77.3211,
      rating: 4.6,
    },
    {
      id: "loc4",
      name: "Airport Terminal Hub",
      address: "Sanganer Airport, Parking Deck A",
      available: 145,
      total: 300,
      price: 60,
      distance: "8.5 km",
      lat: 28.5562,
      lng: 77.1,
      rating: 4.9,
    },
  ];

  const filteredParking = nearbyParkingList.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      searchQuery.includes("Jaipur")
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* 1. Header / Navigation Bar (Clean Light Theme) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setLocation("/")}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                  SmartPark
                </span>
                <span className="block text-[10px] text-blue-600 font-semibold tracking-wider uppercase">
                  Real-Time Parking
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <button
                onClick={() => setLocation("/")}
                className="px-3.5 py-2 rounded-lg text-blue-600 bg-blue-50/80 font-bold transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => requireAuthAndNavigate("/parking-slots")}
                className="px-3.5 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Find Parking
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("how-it-works");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-3.5 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => requireAuthAndNavigate("/my-bookings")}
                className="px-3.5 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                My Bookings
              </button>
            </nav>
          </div>

          {/* User Account / Auth Status */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
                    <p className="text-[10px] text-emerald-700 font-semibold">● {user.role}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-red-600 hover:bg-red-50 h-8 px-2.5"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowLoginModal(true)}
                  className="text-slate-700 hover:bg-slate-100 text-xs font-semibold"
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowLoginModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm text-xs font-semibold"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Hero & Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* 2. Hero Section: Find Your Spot. Park Smarter. */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white p-6 sm:p-12 shadow-xl">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left: Value Proposition & Live Search */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-semibold shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                🟢 78 Spots Available Near You
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                  Find Your Spot. <br />
                  <span className="text-blue-200">Park Smarter.</span>
                </h1>
                <p className="text-base sm:text-lg text-blue-50 max-w-xl leading-relaxed">
                  Real-time parking availability, easy reservations, and contactless digital QR pass entrance.
                </p>
              </div>

              {/* Live Availability Search Bar */}
              <div className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1 flex items-center">
                  <MapPin className="absolute left-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter location (e.g. Jaipur, Rajasthan / City Center)"
                    className="w-full pl-11 pr-4 py-2.5 text-slate-900 text-sm font-medium focus:outline-none placeholder-slate-400"
                  />
                </div>
                <Button
                  onClick={() => requireAuthAndNavigate("/parking-slots")}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 h-auto rounded-xl shadow-md flex items-center justify-center gap-2 text-sm"
                >
                  <Search className="w-4 h-4 text-emerald-400" />
                  Find Parking
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  onClick={() => requireAuthAndNavigate("/parking-slots")}
                  className="bg-white hover:bg-blue-50 text-blue-700 font-bold px-5 py-2.5 rounded-xl shadow-md text-sm"
                >
                  Explore Live Map
                </Button>
                <Button
                  onClick={() => {
                    const el = document.getElementById("nearby-parking");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  variant="outline"
                  className="border-white/40 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl"
                >
                  View Nearby Rates (₹/hr)
                </Button>
              </div>

              {/* 3 Metric Pills */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/20 text-center">
                <div>
                  <p className="text-2xl font-black text-white">120+</p>
                  <p className="text-[11px] text-blue-100 font-medium">Parking Spots</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white">35+</p>
                  <p className="text-[11px] text-blue-100 font-medium">Locations</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-emerald-300">24/7</p>
                  <p className="text-[11px] text-blue-100 font-medium">Live Telemetry</p>
                </div>
              </div>
            </div>

            {/* Right: Live Visual 2D Layout & Map Card Preview */}
            <div className="lg:col-span-5">
              <Card className="bg-white text-slate-900 p-5 rounded-2xl shadow-2xl border-0 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-extrabold text-sm text-slate-900">Live Parking Map Preview</span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                    Gate A Entrance ↓
                  </span>
                </div>

                {/* 2D Mini Slot Grid */}
                <div className="grid grid-cols-4 gap-2.5 py-2">
                  {[
                    { code: "A1", status: "available" },
                    { code: "A2", status: "available" },
                    { code: "A3", status: "occupied" },
                    { code: "A4", status: "available" },
                    { code: "B1", status: "available" },
                    { code: "B2", status: "selected" },
                    { code: "B3", status: "occupied" },
                    { code: "B4", status: "available" },
                    { code: "C1", status: "occupied" },
                    { code: "C2", status: "available" },
                    { code: "C3", status: "available" },
                    { code: "C4", status: "available" },
                  ].map((bay) => {
                    let bg = "bg-emerald-50 border-emerald-300 text-emerald-800";
                    let icon = "🟢";
                    if (bay.status === "occupied") {
                      bg = "bg-rose-50 border-rose-300 text-rose-800";
                      icon = "🔴";
                    } else if (bay.status === "selected") {
                      bg = "bg-blue-50 border-blue-400 text-blue-800 ring-2 ring-blue-500";
                      icon = "🔵";
                    }
                    return (
                      <button
                        key={bay.code}
                        onClick={() => requireAuthAndNavigate("/parking-slots")}
                        className={`p-2 rounded-xl border text-center transition-all hover:scale-105 shadow-sm ${bg}`}
                      >
                        <p className="text-xs font-black font-mono">{bay.code}</p>
                        <span className="text-[10px]">{icon}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-100 font-medium">
                  <span>🟢 Available</span>
                  <span>🔵 Selected</span>
                  <span>🔴 Occupied</span>
                  <span>🟡 Reserved</span>
                </div>

                <Button
                  onClick={() => requireAuthAndNavigate("/parking-slots")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md"
                >
                  Book Selected Bay (A2) →
                </Button>
              </Card>
            </div>
          </div>
        </div>

        {/* 3. Active Booking Card (If Driver Has Active Pass) */}
        {activeBooking && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                Your Active Booking
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
                ● Gate Pass Active
              </span>
            </div>

            <Card className="bg-white border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-left w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-slate-900 font-mono">
                    Slot {activeBooking.spotNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {activeBooking.locationName}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  Timing: {activeBooking.entryTime} – {activeBooking.exitTime} · Vehicle:{" "}
                  <span className="font-mono font-bold text-slate-900">
                    {activeBooking.vehicleNumber}
                  </span>{" "}
                  · Paid: <span className="font-bold text-emerald-600">₹{activeBooking.amount} (INR)</span>
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  onClick={() => setShowQrModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-sm flex items-center justify-center gap-2 flex-1 sm:flex-initial"
                >
                  <QrIcon className="w-4 h-4" />
                  QR Gate Pass
                </Button>
                <Button
                  onClick={() =>
                    window.open(
                      "https://www.google.com/maps/dir/?api=1&destination=28.6315,77.2167",
                      "_blank"
                    )
                  }
                  variant="outline"
                  className="border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 flex-1 sm:flex-initial"
                >
                  <Navigation className="w-4 h-4 text-blue-600" />
                  Navigate
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* 4. How Smart Parking Works (3 Steps) */}
        <section id="how-it-works" className="py-6 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How Smart Parking Works
            </h2>
            <p className="text-sm text-slate-500">
              Frictionless urban parking in 3 straightforward steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg shadow-inner">
                01
              </div>
              <h3 className="text-xl font-bold text-slate-900">Find Parking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your destination or browse the live GPS map to check real-time spot occupancy across parking hubs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg shadow-inner">
                02
              </div>
              <h3 className="text-xl font-bold text-slate-900">Select Slot</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pick your preferred 2D bay code, select standard or EV charging spots, choose hours, and pay transparent INR rates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg shadow-inner">
                03
              </div>
              <h3 className="text-xl font-bold text-slate-900">Park & Go</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Show your instant digital QR pass at the boom barrier scanner for contactless entry and exit.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Nearby Parking Hubs */}
        <section id="nearby-parking" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-600" />
                Nearby Parking Locations
              </h2>
              <p className="text-xs text-slate-500">
                Live availability verified from IoT sensor controllers
              </p>
            </div>
            <Button
              onClick={() => requireAuthAndNavigate("/parking-slots")}
              variant="outline"
              className="border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold"
            >
              View All Parking (35+ Hubs) →
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredParking.map((loc) => (
              <Card
                key={loc.id}
                className="bg-white border-slate-200 hover:border-blue-300 p-5 rounded-2xl flex flex-col justify-between space-y-4 transition-all hover:translate-y-[-2px] shadow-sm hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-slate-900 text-base leading-snug">{loc.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {loc.available} free
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{loc.address}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Hourly Rate</span>
                    <span className="text-base font-black text-slate-900">₹{loc.price}</span>
                    <span className="text-slate-500 text-[10px]"> / hr</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Distance</span>
                    <span className="font-bold text-blue-600">{loc.distance}</span>
                  </div>
                </div>

                <Button
                  onClick={() => requireAuthAndNavigate("/parking-slots")}
                  className="w-full bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  View Slots & Book <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* 6. Live Google Map Embed */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              Live Interactive Parking Map
            </h2>
            <span className="text-xs font-semibold text-slate-500">Live GPS & Slot Telemetry</span>
          </div>

          <Card className="bg-white border-slate-200 p-4 rounded-2xl overflow-hidden shadow-sm">
            <LiveParkingMap
              selectedLocationName="City Center Parking"
              onSelectLocation={() => {}}
            />
          </Card>
        </section>

        {/* 7. Why SmartPark? (4 Value Props) */}
        <section className="py-8 border-t border-slate-200 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Why SmartPark?</h2>
            <p className="text-sm text-slate-500">Built for speed, accuracy, and hassle-free driving</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Real-Time Availability</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                IoT sensors detect free and occupied slots in milliseconds with 99.9% telemetry accuracy.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Secure Booking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reserve parking in Indian Rupees (`₹`) with zero hidden charges and instant cancellation refunds.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Navigation className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Easy Navigation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                One-tap Google Maps turn-by-turn routing leads you right to your assigned parking bay.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Digital QR Pass</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Contactless digital entry and exit slips ready for gate scanning, printing, or sharing.
              </p>
            </div>
          </div>
        </section>

        {/* 8. Role-Based Access Portals */}
        <section className="py-8 border-t border-slate-200 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">Platform Role Portals</h2>
            <p className="text-xs text-slate-500">
              Dedicated workspaces for drivers, facility operators, and system administrators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Portal 1: Customer */}
            <Card className="bg-white border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Customer Portal</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Search nearby parking, select 2D bays, view digital QR entry passes, and manage vehicle history.
                </p>
              </div>
              <Button
                onClick={() => setLocation("/customer")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl"
              >
                Open Customer Space →
              </Button>
            </Card>

            {/* Portal 2: Operations */}
            <Card className="bg-white border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Operations Console</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Manage on-ground parking slots, boom barrier controls, manual entries/exits, and facility telemetry.
                </p>
              </div>
              <Button
                onClick={() => setLocation("/operations")}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2.5 rounded-xl"
              >
                Launch Operations Console →
              </Button>
            </Card>

            {/* Portal 3: Platform Admin */}
            <Card className="bg-white border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Platform Admin</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Oversee multi-city locations, platform-wide revenue metrics, operator staff rosters, and tariff plans.
                </p>
              </div>
              <Button
                onClick={() => setLocation("/admin")}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl"
              >
                Access Admin Super-Console →
              </Button>
            </Card>
          </div>
        </section>

        {/* 9. Call To Action (Ready to park smarter?) */}
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 text-center space-y-5 shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-black">Ready to park smarter?</h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Find your parking spot today. Save up to 30 minutes every trip with instant reservations.
          </p>
          <div>
            <Button
              onClick={() => requireAuthAndNavigate("/parking-slots")}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3.5 h-auto rounded-xl shadow-lg shadow-blue-600/30 text-sm"
            >
              Find Parking Now →
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="text-slate-800 font-bold">
            Smart Parking System · Real-Time IoT & AI Parking Management SaaS
          </p>
          <p>© 2026 SmartPark Platform. Designed & Built for Jatin Jangid.</p>
        </div>
      </footer>

      {/* Digital QR Entry Pass Modal (Light Theme) */}
      <Dialog open={showQrModal} onOpenChange={setShowQrModal}>
        <DialogContent className="max-w-md bg-white text-slate-900 border-slate-200 p-6 rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
              <QrIcon className="w-5 h-5 text-emerald-600" />
              Digital Gate Parking Pass
            </DialogTitle>
          </DialogHeader>

          {activeBooking && (
            <div className="space-y-6 pt-2">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center space-y-4 shadow-inner">
                <div className="space-y-1">
                  <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider">
                    ● Valid Active Gate Pass
                  </span>
                  <h3 className="text-3xl font-black text-slate-900">{activeBooking.spotNumber}</h3>
                  <p className="text-xs text-slate-600 font-semibold">{activeBooking.locationName}</p>
                </div>

                <div className="p-4 bg-white rounded-xl inline-block shadow-md border border-slate-200">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                      `SMARTPARK:${activeBooking.id}|SLOT:${activeBooking.spotNumber}|VEH:${activeBooking.vehicleNumber}`
                    )}`}
                    alt="Parking QR Pass"
                    className="w-40 h-40"
                  />
                </div>

                <div className="text-xs space-y-1 font-mono text-slate-700 font-medium">
                  <p>Booking ID: {activeBooking.id}</p>
                  <p>Vehicle: {activeBooking.vehicleNumber}</p>
                  <p>
                    Validity: {activeBooking.entryTime} – {activeBooking.exitTime}
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
                      `SmartPark Pass: ${activeBooking.id} | Slot: ${activeBooking.spotNumber} | Valid until ${activeBooking.exitTime}`
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

      {/* Sign In / Auth Prompt Modal (Light Theme) */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="max-w-md bg-white text-slate-900 border-slate-200 p-6 rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5 text-blue-600" />
              Sign In to SmartPark
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <p className="text-xs text-slate-500 text-center">
              Sign in to manage your active bookings, view digital QR passes, and reserve real-time slots.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="jatin@smartpark.io"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Button
                onClick={() => handleQuickLogin(loginEmail)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm shadow-md"
              >
                Sign In as Verified Driver
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-400 font-semibold">Quick Demo Accounts</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleQuickLogin("jatin@smartpark.io")}
                  className="border-slate-300 bg-slate-50 text-slate-700 text-xs py-2 rounded-lg hover:bg-slate-100"
                >
                  Jatin Jangid
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleQuickLogin("operator@smartpark.io")}
                  className="border-slate-300 bg-slate-50 text-slate-700 text-xs py-2 rounded-lg hover:bg-slate-100"
                >
                  Admin Operator
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
