import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, MapPin, Mail, Lock, Car, ShieldCheck, Building2, User, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [, setLocation] = useLocation();
  const [selectedRole, setSelectedRole] = useState<"customer" | "operations" | "admin">("customer");
  const [email, setEmail] = useState("jatin@smartpark.io");
  const [password, setPassword] = useState("••••••••");
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role: "customer" | "operations" | "admin") => {
    setSelectedRole(role);
    if (role === "customer") {
      setEmail("jatin@smartpark.io");
    } else if (role === "operations") {
      setEmail("operator@smartpark.io");
    } else {
      setEmail("admin@smartpark.io");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      if (selectedRole === "customer") {
        const name = email.includes("jatin") ? "Jatin Jangid" : email.split("@")[0];
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
        localStorage.setItem(
          "smartpark-user",
          JSON.stringify({
            name: formattedName,
            email: email,
            role: "Customer / Driver",
          })
        );
        toast.success(`Welcome back, ${formattedName}!`);
        setLocation("/customer");
      } else if (selectedRole === "operations") {
        sessionStorage.setItem("smartpark-ops-auth", "true");
        localStorage.setItem(
          "smartpark-user",
          JSON.stringify({
            name: "Ground Operator",
            email: email,
            role: "Operations Staff",
          })
        );
        toast.success("Operations Console Authenticated!");
        setLocation("/operations");
      } else {
        sessionStorage.setItem("smartpark-admin-auth", "true");
        localStorage.setItem(
          "smartpark-user",
          JSON.stringify({
            name: "Platform Admin",
            email: email,
            role: "Platform Admin",
          })
        );
        toast.success("Platform Super-Admin Authenticated!");
        setLocation("/admin");
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-2">
          <div
            onClick={() => setLocation("/")}
            className="flex items-center justify-center gap-2 cursor-pointer"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-md">
              <Car className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">SmartPark</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Choose Role & Sign In</h1>
          <p className="text-xs text-slate-500">
            Select your interface portal to access features
          </p>
        </div>

        {/* 3 Role Selection Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold">
          <button
            type="button"
            onClick={() => handleRoleSelect("customer")}
            className={`py-2.5 rounded-xl transition-all flex flex-col items-center gap-1 ${
              selectedRole === "customer"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Customer</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect("operations")}
            className={`py-2.5 rounded-xl transition-all flex flex-col items-center gap-1 ${
              selectedRole === "operations"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Operations</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect("admin")}
            className={`py-2.5 rounded-xl transition-all flex flex-col items-center gap-1 ${
              selectedRole === "admin"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

        {/* Login Form */}
        <Card className="p-6 border-slate-200 shadow-sm bg-white rounded-2xl space-y-5">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
            <span className="text-slate-500">Destination Portal:</span>
            <span className="font-bold text-slate-900 capitalize">
              {selectedRole === "customer" ? "Customer Dashboard (/customer)" : selectedRole === "operations" ? "Ground Operations (/operations)" : "Super-Admin Console (/admin)"}
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password / Passcode
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-bold py-3 rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition-all ${
                selectedRole === "customer"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : selectedRole === "operations"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Authenticating..." : `Sign In to ${selectedRole === "customer" ? "Customer Space" : selectedRole === "operations" ? "Operations Console" : "Admin Console"}`}
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </form>

          {/* Quick 1-Click Demo Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block text-center">
              Quick 1-Click Demo Sign-in
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  handleRoleSelect("customer");
                  localStorage.setItem("smartpark-user", JSON.stringify({ name: "Jatin Jangid", email: "jatin@smartpark.io", role: "Customer / Driver" }));
                  setLocation("/customer");
                  toast.success("Welcome, Jatin!");
                }}
                className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-200"
              >
                Jatin (Driver)
              </button>

              <button
                type="button"
                onClick={() => {
                  handleRoleSelect("operations");
                  sessionStorage.setItem("smartpark-ops-auth", "true");
                  setLocation("/operations");
                  toast.success("Welcome, Ground Operator!");
                }}
                className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200"
              >
                Operator Staff
              </button>

              <button
                type="button"
                onClick={() => {
                  handleRoleSelect("admin");
                  sessionStorage.setItem("smartpark-admin-auth", "true");
                  setLocation("/admin");
                  toast.success("Welcome, Platform Super-Admin!");
                }}
                className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-[11px] font-bold border border-indigo-200"
              >
                Super Admin
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
