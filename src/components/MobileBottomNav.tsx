import { Link, useLocation } from "react-router-dom";
import { Home, Briefcase, DollarSign, LayoutDashboard, History, Settings } from "lucide-react";

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MobileBottomNavProps {
  isAuthenticated: boolean;
}

export const MobileBottomNav = ({ isAuthenticated }: MobileBottomNavProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const publicNavItems: NavItem[] = [
    { path: "/", label: "Home", icon: Home },
    { path: "/services", label: "Services", icon: Briefcase },
    { path: "/pricing", label: "Pricing", icon: DollarSign },
  ];

  const authenticatedNavItems: NavItem[] = [
    { path: "/", label: "Home", icon: Home },
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/signals-history", label: "History", icon: History },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center min-w-[64px] h-12 rounded-lg transition-colors ${
                active 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${active ? "fill-current" : ""}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
