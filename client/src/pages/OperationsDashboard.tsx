import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useLocation } from "wouter";
import {
  ShieldCheck,
  TrendingUp,
  Car,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  RefreshCw,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  Activity,
  Layers,
  Lock,
  Unlock,
  KeyRound,
  ArrowDownCircle,
  ArrowUpCircle,
  ShieldAlert,
  FileText,
  DollarSign,
  AlertOctagon,
} from "lucide-react";

interface SlotItem {
  id: string;
  code: string;
  location: string;
  floor: string;
  type: "standard" | "ev" | "disabled";
  status: "available" | "occupied" | "reserved" | "blocked" | "maintenance";
  currentVehicle?: string;
  occupiedSince?: string;
  pricePerHour: number;
}

const INITIAL_SLOTS: SlotItem[] = [
  { id: "s1", code: "A1", location: "City Center Hub", floor: "Level 1", type: "standard", status: "available", pricePerHour: 30 },
  { id: "s2", code: "A2", location: "City Center Hub", floor: "Level 1", type: "standard", status: "occupied", currentVehicle: "DL-01-AB-1234", occupiedSince: "10:15 AM", pricePerHour: 30 },
  { id: "s3", code: "A3", location: "City Center Hub", floor: "Level 1", type: "ev", status: "available", pricePerHour: 45 },
  { id: "s4", code: "A4", location: "City Center Hub", floor: "Level 1", type: "standard", status: "available", pricePerHour: 30 },
  { id: "s5", code: "B1", location: "City Center Hub", floor: "Level 1", type: "disabled", status: "reserved", currentVehicle: "HR-26-DQ-8921", occupiedSince: "11:00 AM", pricePerHour: 30 },
  { id: "s6", code: "B2", location: "City Center Hub", floor: "Level 1", type: "standard", status: "available", pricePerHour: 30 },
  { id: "s7", code: "B3", location: "City Center Hub", floor: "Level 1", type: "standard", status: "occupied", currentVehicle: "UP-16-CC-4012", occupiedSince: "09:30 AM", pricePerHour: 30 },
  { id: "s8", code: "B4", location: "City Center Hub", floor: "Level 1", type: "standard", status: "available", pricePerHour: 30 },
  { id: "s9", code: "C1", location: "City Center Hub", floor: "Level 1", type: "standard", status: "available", pricePerHour: 30 },
  { id: "s10", code: "C2", location: "City Center Hub", floor: "Level 1", type: "standard", status: "available", pricePerHour: 30 },
  { id: "s11", code: "C3", location: "City Center Hub", floor: "Level 1", type: "standard", status: "available", pricePerHour: 30 },
  { id: "s12", code: "C4", location: "City Center Hub", floor: "Level 1", type: "standard", status: "blocked", pricePerHour: 30 },
];

const CORRECT_PIN = "0909";

export default function OperationsDashboard() {
  const [, setLocation] = useLocation();

  // Staff PIN Authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("smartpark-ops-auth") === "true";
  });
  const [enteredPin, setEnteredPin] = useState<string>("");
  const [pinError, setPinError] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<"overview" | "live" | "slots" | "entries" | "incidents">("overview");
  const [slots, setSlots] = useState<SlotItem[]>(INITIAL_SLOTS);
  const [selectedSlotCode, setSelectedSlotCode] = useState<string>("A1");

  const [barrierStatus, setBarrierStatus] = useState<"automatic" | "open" | "locked">("automatic");

  const totalSlots = 250;
  const occupiedCount = 168;
  const availableCount = 82;
  const todayEntries = 324;
  const todayExits = 301;
  const todayRevenue = 24500;

  const handleDigitPress = (digit: string) => {
    if (enteredPin.length < 4) {
      const newPin = enteredPin + digit;
      setEnteredPin(newPin);
      setPinError(false);
      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleBackspace = () => {
    setEnteredPin((prev) => prev.slice(0, -1));
    setPinError(false);
  };

  const verifyPin = (pin: string) => {
    if (pin === CORRECT_PIN) {
      sessionStorage.setItem("smartpark-ops-auth", "true");
      setIsAuthenticated(true);
      toast.success("Operations Security PIN Verified! Welcome Staff.");
    } else {
      setPinError(true);
      toast.error("Invalid Staff PIN. Please try again.");
      setTimeout(() => setEnteredPin(""), 500);
    }
  };

  const handleLockOps = () => {
    sessionStorage.removeItem("smartpark-ops-auth");
    setIsAuthenticated(false);
    setEnteredPin("");
    toast.info("Operations panel locked.");
  };

  const handleBlockSlot = (slotCode: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.code === slotCode ? { ...s, status: "blocked" as const } : s))
    );
    toast.warning(`Slot ${slotCode} is now BLOCKED for maintenance.`);
  };

  const handleReleaseSlot = (slotCode: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.code === slotCode ? { ...s, status: "available" as const, currentVehicle: undefined } : s))
    );
    toast.success(`Slot ${slotCode} is now RELEASED and available.`);
  };

  const handleManualVehicleEntry = (slotCode: string) => {
    const plate = `RJ-14-EA-${Math.floor(1000 + Math.random() * 9000)}`;
    setSlots((prev) =>
      prev.map((s) =>
        s.code === slotCode
          ? { ...s, status: "occupied" as const, currentVehicle: plate, occupiedSince: "Just now" }
          : s
      )
    );
    toast.success(`Manual Entry Logged: ${plate} assigned to slot ${slotCode}.`);
  };

  // PIN Gate Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white border-slate-200 shadow-2xl p-8 rounded-3xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto border border-amber-200 shadow-inner">
            <KeyRound className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl font-black text-slate-900">Operations Staff Portal</h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Enter the 4-digit staff passcode to manage live parking bays and boom barriers.
            </p>
          </div>

          {/* 4-Digit Display */}
          <div className="flex items-center justify-center gap-3 py-2">
            {[0, 1, 2, 3].map((index) => {
              const char = enteredPin[index];
              return (
                <div
                  key={index}
                  className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center text-xl font-bold font-mono transition-all ${
                    pinError
                      ? "border-rose-400 bg-rose-50 text-rose-700 animate-shake"
                      : char
                      ? "border-blue-600 bg-blue-50 text-blue-800 shadow-sm"
                      : "border-slate-200 bg-slate-50 text-slate-400"
                  }`}
                >
                  {char ? "●" : ""}
                </div>
              );
            })}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3 pt-2 max-w-[280px] mx-auto">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
              <button
                key={num}
                onClick={() => handleDigitPress(num)}
                className="w-16 h-14 rounded-2xl bg-slate-50 hover:bg-blue-50 active:bg-blue-100 border border-slate-200 text-slate-900 font-extrabold text-lg transition-all shadow-sm flex items-center justify-center mx-auto"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => {
                setEnteredPin("");
                setPinError(false);
              }}
              className="w-16 h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs transition-all shadow-sm flex items-center justify-center mx-auto"
            >
              Clear
            </button>
            <button
              onClick={() => handleDigitPress("0")}
              className="w-16 h-14 rounded-2xl bg-slate-50 hover:bg-blue-50 active:bg-blue-100 border border-slate-200 text-slate-900 font-extrabold text-lg transition-all shadow-sm flex items-center justify-center mx-auto"
            >
              0
            </button>
            <button
              onClick={handleBackspace}
              className="w-16 h-14 rounded-2xl bg-slate-50 hover:bg-rose-50 border border-slate-200 text-slate-600 hover:text-rose-700 font-bold text-sm transition-all shadow-sm flex items-center justify-center mx-auto"
            >
              ⌫
            </button>
          </div>

          <div className="space-y-2 pt-2">
            <Button
              onClick={() => verifyPin(enteredPin)}
              disabled={enteredPin.length < 4}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm shadow-md flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              Unlock Operations Console
            </Button>
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="w-full text-slate-500 hover:text-slate-800 text-xs font-semibold"
            >
              ← Back to Public Homepage
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Operations Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setLocation("/")}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black text-slate-900 tracking-tight">SmartPark</span>
                <span className="block text-[10px] text-amber-700 font-bold uppercase tracking-wider">
                  Operations Console
                </span>
              </div>
            </button>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
              {[
                { id: "overview", label: "Overview" },
                { id: "live", label: "Live Parking" },
                { id: "slots", label: "Slots Management" },
                { id: "entries", label: "Entry / Exit Logs" },
                { id: "incidents", label: "Incidents & Alerts" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-amber-50 text-amber-800 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={handleLockOps}
              className="border-slate-300 bg-white hover:bg-rose-50 text-rose-600 text-xs font-semibold flex items-center gap-1"
            >
              <Lock className="w-3.5 h-3.5" />
              Lock Panel
            </Button>
            <Button
              size="sm"
              onClick={() => setLocation("/customer")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
            >
              Customer View
            </Button>
          </div>
        </div>
      </header>

      {/* Main Operations Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          <Card className="bg-white border-slate-200 p-4 rounded-2xl shadow-sm text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Slots</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalSlots}</p>
          </Card>
          <Card className="bg-white border-slate-200 p-4 rounded-2xl shadow-sm text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-600">Available</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">{availableCount}</p>
          </Card>
          <Card className="bg-white border-slate-200 p-4 rounded-2xl shadow-sm text-center">
            <span className="text-[10px] uppercase font-bold text-rose-600">Occupied</span>
            <p className="text-2xl font-black text-rose-600 mt-1">{occupiedCount}</p>
          </Card>
          <Card className="bg-white border-slate-200 p-4 rounded-2xl shadow-sm text-center">
            <span className="text-[10px] uppercase font-bold text-blue-600">Today Entries</span>
            <p className="text-2xl font-black text-blue-600 mt-1">{todayEntries}</p>
          </Card>
          <Card className="bg-white border-slate-200 p-4 rounded-2xl shadow-sm text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500">Today Exits</span>
            <p className="text-2xl font-black text-slate-800 mt-1">{todayExits}</p>
          </Card>
          <Card className="bg-white border-slate-200 p-4 rounded-2xl shadow-sm text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-600">Revenue (INR)</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">₹{todayRevenue.toLocaleString()}</p>
          </Card>
        </div>

        {/* Live Parking Bay Matrix & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Live Bay Grid (Col 8) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-600" />
                Live Parking - Facility Area A
              </h2>
              <span className="text-xs text-slate-500 font-semibold">
                Click any slot for operator override
              </span>
            </div>

            <Card className="bg-white border-slate-200 p-6 rounded-2xl shadow-sm space-y-5">
              <div className="flex items-center justify-between bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold">
                <span className="text-slate-800">Ground Floor Level 1</span>
                <span className="text-blue-600">Gate Boom Barrier: {barrierStatus.toUpperCase()}</span>
              </div>

              {/* 2D Bay Grid */}
              <div className="grid grid-cols-4 gap-3">
                {slots.map((slot) => {
                  let bg = "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100";
                  let icon = "🟢";
                  if (slot.status === "occupied") {
                    bg = "bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100";
                    icon = "🔴";
                  } else if (slot.status === "reserved") {
                    bg = "bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100";
                    icon = "🟡";
                  } else if (slot.status === "blocked") {
                    bg = "bg-slate-200 border-slate-400 text-slate-700";
                    icon = "⛔";
                  }

                  const isSelected = selectedSlotCode === slot.code;

                  return (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlotCode(slot.code)}
                      className={`p-3.5 rounded-2xl border text-center transition-all shadow-sm flex flex-col items-center justify-center gap-1 ${bg} ${
                        isSelected ? "ring-2 ring-blue-600 ring-offset-2 scale-105" : ""
                      }`}
                    >
                      <span className="text-sm font-black font-mono">{slot.code}</span>
                      <span className="text-xs">{icon}</span>
                      <span className="text-[10px] font-mono truncate max-w-full font-bold">
                        {slot.currentVehicle || (slot.status === "blocked" ? "BLOCKED" : "FREE")}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 font-medium">
                <span>🟢 Available</span>
                <span>🔴 Occupied</span>
                <span>🟡 Reserved</span>
                <span>⛔ Blocked / Maintenance</span>
              </div>
            </Card>
          </div>

          {/* Slot Action Sidebar (Col 4) */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-blue-600" />
              Slot Action Panel
            </h2>

            <Card className="bg-white border-slate-200 p-6 rounded-2xl shadow-sm space-y-5">
              <div>
                <span className="text-xs text-slate-400 uppercase font-bold">Selected Bay</span>
                <p className="text-3xl font-black text-slate-900 font-mono">{selectedSlotCode}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <Button
                  onClick={() => handleReleaseSlot(selectedSlotCode)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Release / Make Available
                </Button>

                <Button
                  onClick={() => handleManualVehicleEntry(selectedSlotCode)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <ArrowDownCircle className="w-4 h-4" />
                  Log Manual Vehicle Entry
                </Button>

                <Button
                  onClick={() => handleBlockSlot(selectedSlotCode)}
                  variant="outline"
                  className="w-full border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  <AlertOctagon className="w-4 h-4" />
                  Block Slot (Maintenance)
                </Button>
              </div>

              {/* Boom Barrier Quick Gate Control */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Gate Barrier Controller</span>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setBarrierStatus("open");
                      toast.success("Entry Boom Barrier opened manually.");
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                  >
                    Open Barrier
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setBarrierStatus("automatic");
                      toast.info("Boom Barrier set to Automatic Scanner Mode.");
                    }}
                    className="border-slate-300 text-xs font-bold"
                  >
                    Auto Mode
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
