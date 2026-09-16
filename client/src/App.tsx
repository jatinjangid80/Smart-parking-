import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Chatbot from "./components/Chatbot";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ParkingSlots from "./pages/ParkingSlots";
import FileManager from "./pages/FileManager";
import CustomerDashboard from "./pages/CustomerDashboard";
import OperationsDashboard from "./pages/OperationsDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MyBookings from "./pages/MyBookings";
import Notifications from "./pages/Notifications";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/customer"} component={CustomerDashboard} />
      <Route path={"/dashboard"} component={CustomerDashboard} />
      <Route path={"/operations"} component={OperationsDashboard} />
      <Route path={"/operator"} component={OperationsDashboard} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/login"} component={Login} />
      <Route path={"/signup"} component={SignUp} />
      <Route path={"/parking-slots"} component={ParkingSlots} />
      <Route path={"/find-parking"} component={ParkingSlots} />
      <Route path={"/map"} component={ParkingSlots} />
      <Route path={"/my-bookings"} component={MyBookings} />
      <Route path={"/bookings"} component={MyBookings} />
      <Route path={"/file-manager"} component={FileManager} />
      <Route path={"/notifications"} component={Notifications} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
          <Chatbot />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
