import { useAuth } from "@/hooks/useAuth";
import { PublicNavigation } from "./PublicNavigation";
import { AuthenticatedNavigation } from "./AuthenticatedNavigation";
import { MobileBottomNav } from "./MobileBottomNav";

export const Navigation = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-inset-top">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xl md:text-2xl text-foreground">
              <span className="tracking-tight">SUPER</span>
              <span className="font-extrabold tracking-wider">Pi</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {isAuthenticated ? <AuthenticatedNavigation /> : <PublicNavigation />}
      <MobileBottomNav isAuthenticated={isAuthenticated} />
    </>
  );
};
