import { Outlet, Link } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { authService } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';

const AdminLayout = () => {
  const { toast } = useToast();

  const handleLogout = async () => {
    await authService.logout();
    toast({ title: 'Logged out successfully' });
    // TODO: Redirect to login page
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-card flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <Link to="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
                <span className="tracking-tight">SUPER</span>
                <span className="font-extrabold tracking-wider">Pi</span>
              </Link>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </header>
          <main className="flex-1 p-6 bg-background">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
