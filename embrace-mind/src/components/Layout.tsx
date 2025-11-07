import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/store/useAuth";
import { useEffect, useState } from "react";
import {
  Home,
  MessageCircle,
  TrendingUp,
  Droplets,
  Shield,
  LogOut,
  Menu,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { motion } from "framer-motion";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/app/dashboard" },
    { icon: MessageCircle, label: "Chat", path: "/app/chat" },
    { icon: TrendingUp, label: "Insights", path: "/app/insights" },
    ...(user?.gender === "female"
      ? [{ icon: Droplets, label: "Cycle", path: "/app/cycle" }]
      : []),
    { icon: Shield, label: "Blockchain", path: "/app/blockchain" },
  ];

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 80 }}
        className="glass-card fixed left-0 top-0 h-screen border-r overflow-hidden z-10"
      >
        <div className="flex h-16 items-center justify-between px-4">
          {sidebarOpen && (
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold gradient-text"
            >
              MediMinds
            </motion.h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "default" : "ghost"}
              className={`justify-start gap-3 ${!sidebarOpen && "justify-center"}`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Button>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 240 : 80 }}
      >
        {/* Header */}
        <header className="glass-card sticky top-0 z-20 border-b">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-foreground">
                {navItems.find((item) => item.path === location.pathname)?.label ||
                  "MediMinds"}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-medium">
                      {user?.name?.[0] || user?.email?.[0] || "U"}
                    </div>
                    {user?.name || user?.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
