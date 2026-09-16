import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useLocation } from "wouter";
import {
  ShieldCheck,
  TrendingUp,
  Users,
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
  Building2,
  DollarSign,
  FileBarChart,
  Settings,
  PlusCircle,
  UserCheck,
} from "lucide-react";

const CORRECT_PIN = "0909";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  // Admin PIN Authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("smartpark-admin-auth") === "true";
  });
  const [enteredPin, setEnteredPin] = useState<string>("");
  const [pinError, setPinError] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<"overview" | "locations" | "users" | "pricing" | "reports">("overview");

  // Platform Level Stats
  const platformStats = {
    locations: 18,
    totalSlots: 2450,
    registeredUsers: 12840,
    todayBookings: 684,
    revenue: 284500,
    occupancyRate: 72,
  };

  const locationsList = [
    { id: "1", name: "City Center Hub", city: "Jaipur", slots: 120, occupancy: "65%", operator: "Ramesh Sharma", rate: "₹30/hr" },
    { id: "2", name: "Mall of Jaipur", city: "Jaipur", slots: 200, occupancy: "82%", operator: "Vikram Singh", rate: "₹40/hr" },
    { id: "3", name: "Railway Station Deck", city: "Jaipur", slots: 80, occupancy: "90%", operator: "Amit Verma", rate: "₹25/hr" },
    { id: "4", name: "Airport Terminal 3 Hub", city: "Delhi NCR", slots: 350, occupancy: "70%", operator: "Suresh Kumar", rate: "₹60/hr" },
    { id: "5", name: "Tech Park Central", city: "Bengaluru", slots: 250, occupancy: "58%", operator: "Karan Patel", rate: "₹50/hr" },
  ];

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
      sessionStorage.setItem("smartpark-admin-auth", "true");
      setIsAuthenticated(true);
      toast.success("Platform Super-Admin Access Granted. Welcome!");
    } else {
      setPinError(true);
      toast.error("Invalid Admin Passcode. Please try again.");
      setTimeout(() => setEnteredPin(""), 500);
    }
  };

  const handleLockAdmin = () => {
    sessionStorage.removeItem("smartpark-admin-auth");
    setIsAuthenticated(false);
    setEnteredPin("");
    toast.info("Admin console locked.");
  };

  // PIN Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white border-slate-200 shadow-2xl p-8 rounded-3xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center mx-auto border border-indigo-200 shadow-inner">
            <KeyRound className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl font-black text-slate-900">Platform Admin Super-Console</h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Enter the master security PIN to manage multi-city hubs, operator accounts, and pricing models.
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
                      ? "border-indigo-600 bg-indigo-50 text-indigo-800 shadow-sm"
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
                className="w-16 h-14 rounded-2xl bg-slate-50 hover:bg-indigo-50 active:bg-indigo-100 border border-slate-200 text-slate-900 font-extrabold text-lg transition-all shadow-sm flex items-center justify-center mx-auto"
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
              className="w-16 h-14 rounded-2xl bg-slate-50 hover:bg-indigo-50 active:bg-indigo-100 border border-slate-200 text-slate-900 font-extrabold text-lg transition-all shadow-sm flex items-center justify-center mx-auto"
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
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm shadow-md flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              Unlock Platform Super-Console
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
      {/* Admin Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setLocation("/")}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black text-slate-900 tracking-tight">SmartPark</span>
                <span className="block text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
                  Platform Admin
                </span>
              </div>
            </button>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
              {[
                { id: "overview", label: "Overview" },
                { id: "locations", label: "Parking Locations" },
                { id: "users", label: "Users & Staff" },
                { id: "pricing", label: "Pricing & Plans" },
                { id: "reports", label: "Platform Analytics" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-indigo-50 text-indigo-800 font-bold"
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
              onClick={handleLockAdmin}
              className="border-slate-300 bg-white hover:bg-rose-50 text-rose-600 text-xs font-semibold flex items-center gap-1"
            >
              <Lock className="w-3.5 h-3.5" />
              Lock Console
            </Button>
            <Button
              size="sm"
              onClick={() => setLocation("/operations")}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
            >
              Operations Portal
            </Button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Platform KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card className="bg-white border-slate-200 p-4 rounded-2xl shadow-sm text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Locations</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{platformStats.locations}</p>
          </Card>
          <Card className="bg-white border-slate-200 p-4 rounded-2xl shadow-sm text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Slots</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{platformStats.totalSlots.toLocaleString()}</p>
          </Card>
          <Card className="bg-white border-slate-200 p-4 rounded-2xl shadow-sm text-center">
            <span className="text-[10px] uppercase font-bold text-indigo-600">Registered Users</span>
            <p className="text-2xl font-black text-indigo-600 mt-1">{platformStats.registeredUsers.toLocaleString()}</p>
          </Card>
          <Card className="bg-white border-slate-200 p-4 rounded-2xl shadow-sm text-center">
            <span className="text-[10px] uppercase font-bold text-blue-600">Today Bookings</span>
            <p className="text-2xl font-black text-blue-600 mt-1">{platformStats.todayBookings}</p>
          </Card>
          <Card className="bg-white border-slate-200 p-4 rounded-2xl shadow-sm text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-600">Total Revenue</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">₹{platformStats.revenue.toLocaleString()}</p>
          </Card>
          <Card className="bg-white border-slate-200 p-4 rounded-2xl shadow-sm text-center">
            <span className="text-[10px] uppercase font-bold text-amber-600">Occupancy</span>
            <p className="text-2xl font-black text-amber-600 mt-1">{platformStats.occupancyRate}%</p>
          </Card>
        </div>

        {/* Multi-Location Management Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                Managed Parking Facilities
              </h2>
              <p className="text-xs text-slate-500">
                Configure rates, assign operators, and monitor facility health
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => toast.success("New Parking Hub registration dialog opened.")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              Add Parking Location
            </Button>
          </div>

          <Card className="bg-white border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Facility Name</th>
                    <th className="py-3 px-4">City / Region</th>
                    <th className="py-3 px-4">Total Slots</th>
                    <th className="py-3 px-4">Live Occupancy</th>
                    <th className="py-3 px-4">Hourly Tariff</th>
                    <th className="py-3 px-4">Assigned Operator</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {locationsList.map((loc) => (
                    <tr key={loc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{loc.name}</td>
                      <td className="py-3.5 px-4 text-slate-600">{loc.city}</td>
                      <td className="py-3.5 px-4 font-mono font-semibold">{loc.slots} spots</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {loc.occupancy}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600">{loc.rate}</td>
                      <td className="py-3.5 px-4 flex items-center gap-1.5 text-slate-700">
                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                        {loc.operator}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setLocation("/operations")}
                          className="border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-[11px] h-7 px-2.5 rounded-lg shadow-sm"
                        >
                          View Ops
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
