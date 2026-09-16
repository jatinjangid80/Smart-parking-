import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { LiveParkingMap } from "@/components/Map";
import {
  MapPin,
  Calendar,
  Clock,
  Navigation,
  ChevronUp,
  ChevronDown,
  LogOut,
  Printer,
  Download,
  CheckCircle2,
  Car,
  Receipt,
  Share2,
  ShieldCheck,
  QrCode as QrIcon,
  Sparkles,
} from "lucide-react";

export default function ParkingSlots() {
  const [, setLocation] = useLocation();
  const [date, setDate] = useState("2025-04-21");
  const [time, setTime] = useState("18:07");
  const [duration, setDuration] = useState(2);
  const [vehicleNumber, setVehicleNumber] = useState("DL-08-BK-4921");
  const [selectedSlot, setSelectedSlot] = useState<string>("Downtown Parking");
  const [showSlip, setShowSlip] = useState(false);
  const [slipData, setSlipData] = useState<{
    bookingId: string;
    locationName: string;
    spotNumber: string;
    floor: string;
    address: string;
    date: string;
    entryTime: string;
    exitTime: string;
    duration: number;
    vehicleNumber: string;
    ratePerHour: number;
    totalAmount: number;
    bookingTime: string;
  } | null>(null);

  // Mock parking data with real coordinates and INR pricing
  const parkingLocations = [
    {
      id: "loc1",
      name: "Downtown Parking",
      lat: 28.6315,
      lng: 77.2167,
      available: 24,
      total: 150,
      distance: "0.5 km",
      rate: 50.0,
      price: "₹50.00/hr",
      address: "102 Main Street, City Center",
    },
    {
      id: "loc2",
      name: "Central Plaza",
      lat: 28.6280,
      lng: 77.2090,
      available: 8,
      total: 100,
      distance: "1.2 km",
      rate: 40.0,
      price: "₹40.00/hr",
      address: "45 Broadway Ave, Sector 4",
    },
    {
      id: "loc3",
      name: "Mall Parking",
      lat: 28.5355,
      lng: 77.2180,
      available: 45,
      total: 200,
      distance: "2.1 km",
      rate: 30.0,
      price: "₹30.00/hr",
      address: "Grand Galleria Mall, West Gate",
    },
  ];

  const currentLocation =
    parkingLocations.find((loc) => loc.name === selectedSlot) ||
    parkingLocations[0];
  const ratePerHour = currentLocation.rate;
  const totalCost = (duration * ratePerHour).toFixed(2);

  const calculateExitTime = (startTimeStr: string, durHours: number) => {
    try {
      const [h, m] = startTimeStr.split(":").map(Number);
      const exitH = (h + durHours) % 24;
      return `${String(exitH).padStart(2, "0")}:${String(m || 0).padStart(2, "0")}`;
    } catch {
      return "20:07";
    }
  };

  const handleBooking = () => {
    if (!currentUser) {
      toast.error("Please sign in to book your parking spot.");
      setLocation("/login");
      return;
    }

    if (!selectedSlot) {
      toast.error("Please select a parking location");
      return;
    }

    const randomSpot = `P-${Math.floor(Math.random() * 50) + 1}`;
    const floorNumber = ["Level 1 (Ground)", "Level 2", "Basement B1"][
      Math.floor(Math.random() * 3)
    ];
    const randomBookingId = `SPK-${Math.floor(100000 + Math.random() * 900000)}`;
    const exitTime = calculateExitTime(time, duration);

    const newSlip = {
      bookingId: randomBookingId,
      locationName: selectedSlot,
      spotNumber: randomSpot,
      floor: floorNumber,
      address: currentLocation.address,
      date,
      entryTime: time,
      exitTime,
      duration,
      vehicleNumber: vehicleNumber.trim() || "DL-08-BK-4921",
      ratePerHour,
      totalAmount: parseFloat(totalCost),
      bookingTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setSlipData(newSlip);

    // Persist into smartpark-bookings for MyBookings page
    try {
      const existing = localStorage.getItem("smartpark-bookings");
      const list = existing ? JSON.parse(existing) : [];
      const newBookingRecord = {
        id: randomBookingId,
        locationName: selectedSlot,
        address: currentLocation.address,
        spotNumber: randomSpot,
        floor: floorNumber,
        vehicleNumber: vehicleNumber.trim() || "DL-08-BK-4921",
        date: date === "2025-04-21" ? "Today, " + new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : date,
        entryTime: time,
        exitTime: exitTime,
        durationHours: duration,
        amount: parseFloat(totalCost),
        status: "active",
        paymentMethod: "UPI / Razorpay",
      };
      localStorage.setItem("smartpark-bookings", JSON.stringify([newBookingRecord, ...list]));
    } catch (e) {
      console.error("Failed to save booking:", e);
    }

    setShowSlip(true);
    toast.success("Parking spot reserved! Scan your QR pass at the gate.");
  };

  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem("smartpark-user");
      if (saved) return JSON.parse(saved);
      return {
        name: "Jatin Jangid",
        email: "jatin@smartpark.io",
        role: "Verified Driver",
      };
    } catch {
      return {
        name: "Jatin Jangid",
        email: "jatin@smartpark.io",
        role: "Verified Driver",
      };
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("smartpark-user");
    setCurrentUser(null);
    toast.info("Logged out successfully");
    setLocation("/login");
  };

  const handlePrintSlip = () => {
    window.print();
  };

  const handleSaveSlip = () => {
    toast.success("Slip saved to your receipts!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-slate-100">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-sm">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 block leading-none">SmartPark</span>
              <span className="text-[10px] text-slate-500 font-medium">Smart Parking System</span>
            </div>
          </div>

          {/* Logged in Account Profile Section */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-full py-1 pl-1.5 pr-3 shadow-xs">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shadow-xs relative">
                  {currentUser.name.charAt(0).toUpperCase()}
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-slate-900 leading-tight">
                      {currentUser.name}
                    </p>
                    <span className="text-[9px] bg-blue-100 text-blue-700 font-semibold px-1.5 py-0.2 rounded">
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-none">
                    {currentUser.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-slate-500 hover:text-red-600 font-medium text-xs ml-1 pl-2 border-l border-slate-200 transition-colors cursor-pointer"
                  title="Sign out of account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Button
                onClick={() => setLocation("/login")}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Available Parking Slots
            </h1>
            <p className="text-slate-600">
              Find, reserve, and generate your instant digital parking slip
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Filters and Booking */}
            <div className="lg:col-span-1">
              <Card className="p-6 border-0 shadow-lg sticky top-24">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-blue-600" />
                  Reserve Parking Slot
                </h2>

                {/* Vehicle Number */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Vehicle Number
                  </label>
                  <div className="relative">
                    <Car className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. DL-08-BK-4921"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-medium uppercase"
                    />
                  </div>
                </div>

                {/* Date Selection */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Time Selection */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Entry Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Duration Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Duration (hours)
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setDuration(Math.max(1, duration - 1))}
                      className="p-2 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
                      type="button"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </button>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) =>
                        setDuration(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="flex-1 text-center py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
                    />
                    <button
                      onClick={() => setDuration(duration + 1)}
                      className="p-2 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
                      type="button"
                    >
                      <ChevronUp className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-slate-600 mt-2 flex justify-between">
                    <span>Rate: ₹{ratePerHour.toFixed(2)}/hr</span>
                    <span className="font-semibold text-blue-600">Total: ₹{totalCost}</span>
                  </p>
                </div>

                {/* Selected Slot Info */}
                {selectedSlot && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
                    <p className="text-xs text-blue-700 font-medium uppercase tracking-wide mb-1">
                      Selected Facility:
                    </p>
                    <p className="font-bold text-slate-900">{selectedSlot}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{currentLocation.address}</p>
                  </div>
                )}

                {/* Book Button */}
                <Button
                  onClick={handleBooking}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all text-base flex items-center justify-center gap-2"
                >
                  <Receipt className="w-5 h-5" />
                  Generate Parking Slip
                </Button>
              </Card>
            </div>

            {/* Right Content - Parking Locations and Map */}
            <div className="lg:col-span-2 space-y-6">
              {/* Live Interactive Map Section */}
              <Card className="p-6 border-0 shadow-lg overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Live Parking Map
                    </h2>
                    <p className="text-xs text-slate-500">
                      Real-time interactive Google Map with slot availability & navigation
                    </p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Navigation
                  </span>
                </div>

                <LiveParkingMap
                  locations={parkingLocations}
                  selectedLocationName={selectedSlot}
                  onSelectLocation={(name) => setSelectedSlot(name)}
                  className="h-84"
                />
              </Card>

              {/* Available Parking Slots */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  Available Locations
                </h2>
                <div className="space-y-3">
                  {parkingLocations.map((location) => (
                    <Card
                      key={location.id}
                      onClick={() => setSelectedSlot(location.name)}
                      className={`p-4 border-2 cursor-pointer transition-all ${selectedSlot === location.name
                          ? "border-blue-600 bg-blue-50/70 shadow-lg ring-2 ring-blue-600/20"
                          : "border-slate-200 hover:border-blue-300 hover:shadow-md"
                        }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900">
                              {location.name}
                            </h3>
                            {selectedSlot === location.name && (
                              <span className="bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                Selected
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mb-2">{location.address}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              {location.distance}
                            </span>
                            <span className="font-semibold text-slate-900">{location.price}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">
                            {location.available}
                          </p>
                          <p className="text-xs text-slate-600">
                            of {location.total} slots free
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-full"
                          style={{
                            width: `${(location.available / location.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Booking Summary */}
              <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-slate-50">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  Reservation Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Location:</span>
                    <span className="font-semibold text-slate-900">{selectedSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Vehicle:</span>
                    <span className="font-semibold text-slate-900">{vehicleNumber || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Date:</span>
                    <span className="font-semibold text-slate-900">{date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Entry Time:</span>
                    <span className="font-semibold text-slate-900">{time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Duration:</span>
                    <span className="font-semibold text-slate-900">
                      {duration} hour{duration !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                    <span className="font-semibold text-slate-900 text-base">
                      Total Cost:
                    </span>
                    <span className="text-xl font-bold text-blue-600">
                      ₹{totalCost}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Modern Digital Parking Slip Dialog */}
      <Dialog open={showSlip} onOpenChange={setShowSlip}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl">
          {slipData && (
            <div>
              {/* Slip Header Banner */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white p-6 relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                      <Car className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">SmartPark</span>
                  </div>
                  <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    CONFIRMED
                  </div>
                </div>

                <h2 className="text-2xl font-black tracking-tight">Parking Pass & Slip</h2>
                <p className="text-blue-100 text-xs mt-0.5">
                  Pass ID: <span className="font-mono font-bold text-white">{slipData.bookingId}</span>
                </p>
              </div>

              {/* Slip Body */}
              <div className="p-6 space-y-6">
                {/* Spot & Location Spotlight */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                  <div className="border-r border-slate-200 pr-2">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Assigned Spot
                    </span>
                    <span className="text-2xl font-black text-blue-700 font-mono">
                      {slipData.spotNumber}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      {slipData.floor}
                    </span>
                  </div>
                  <div className="pl-2">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Vehicle No.
                    </span>
                    <span className="text-base font-bold text-slate-900 font-mono block truncate">
                      {slipData.vehicleNumber}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-medium flex items-center justify-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>
                </div>

                {/* Details List */}
                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                    <span className="text-slate-500">Parking Facility</span>
                    <span className="font-semibold text-slate-900 text-right">{slipData.locationName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                    <span className="text-slate-500">Address</span>
                    <span className="font-medium text-slate-700 text-right max-w-[200px] truncate">{slipData.address}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                    <span className="text-slate-500">Date</span>
                    <span className="font-semibold text-slate-900">{slipData.date}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                    <span className="text-slate-500">Entry & Valid Until</span>
                    <span className="font-semibold text-slate-900">{slipData.entryTime} – {slipData.exitTime} ({slipData.duration} hrs)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                    <span className="text-slate-500">Payment Status</span>
                    <span className="font-semibold text-emerald-600">PAID (₹{slipData.totalAmount.toFixed(2)})</span>
                  </div>
                </div>

                {/* QR Code Graphic for Scanner */}
                <div className="flex flex-col items-center justify-center p-4 bg-slate-900 text-white rounded-xl">
                  {/* Stylized QR representation */}
                  <div className="w-28 h-28 bg-white p-2 rounded-lg flex items-center justify-center shadow-inner mb-2">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                      <rect x="5" y="5" width="25" height="25" fill="#0f172a" />
                      <rect x="10" y="10" width="15" height="15" fill="#ffffff" />
                      <rect x="14" y="14" width="7" height="7" fill="#0f172a" />

                      <rect x="70" y="5" width="25" height="25" fill="#0f172a" />
                      <rect x="75" y="10" width="15" height="15" fill="#ffffff" />
                      <rect x="79" y="14" width="7" height="7" fill="#0f172a" />

                      <rect x="5" y="70" width="25" height="25" fill="#0f172a" />
                      <rect x="10" y="75" width="15" height="15" fill="#ffffff" />
                      <rect x="14" y="79" width="7" height="7" fill="#0f172a" />

                      <rect x="35" y="10" width="10" height="10" fill="#0f172a" />
                      <rect x="50" y="15" width="15" height="8" fill="#0f172a" />
                      <rect x="35" y="25" width="8" height="20" fill="#0f172a" />
                      <rect x="48" y="28" width="14" height="14" fill="#0f172a" />
                      <rect x="68" y="38" width="12" height="12" fill="#0f172a" />
                      <rect x="10" y="40" width="18" height="10" fill="#0f172a" />
                      <rect x="35" y="52" width="28" height="10" fill="#0f172a" />
                      <rect x="70" y="60" width="22" height="12" fill="#0f172a" />
                      <rect x="38" y="70" width="12" height="22" fill="#0f172a" />
                      <rect x="58" y="78" width="22" height="14" fill="#0f172a" />
                    </svg>
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium">Scan QR code at entry barrier scanner</p>
                  <span className="text-[10px] font-mono text-slate-400 tracking-wider mt-0.5">{slipData.bookingId}</span>
                </div>

                {/* Slip Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button
                    onClick={handlePrintSlip}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 border-slate-300 text-slate-700 hover:bg-slate-100"
                  >
                    <Printer className="w-4 h-4" />
                    Print / PDF
                  </Button>
                  <Button
                    onClick={handleSaveSlip}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Save Slip
                  </Button>
                </div>

                <Button
                  onClick={() => {
                    setShowSlip(false);
                    setLocation("/my-bookings");
                  }}
                  variant="ghost"
                  className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs font-semibold"
                >
                  View in My Bookings →
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
