import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Building2, LogOut, LayoutDashboard, UserCircle, Menu, X } from 'lucide-react'; // Added Menu and X icons

const Header = () => {
  // FUNCTIONALITY UNTOUCHED: Auth context and state
  const { user, logout, loading, token } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [hostelName, setHostelName] = useState<string | null>(null);

  // FUNCTIONALITY UNTOUCHED: useEffect for fetching hostel name
  useEffect(() => {
    const m = location.pathname.match(/^\/hostels\/(\d+)(?:\/.*)?$/);
    if (!m) {
      setHostelName(null);
      return;
    }
    const id = Number(m[1]);
    let cancelled = false;
    (async () => {
      try {
        // FUNCTIONALITY UNTOUCHED: API URL and fetch
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://vardhan.pythonanywhere.com/api'}/hostels/hostels/${id}/`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setHostelName(data.name || null);
      } catch (err) {
        console.error('Failed to fetch hostel name for header', err);
      }
    })();
    return () => { cancelled = true; };
  }, [location.pathname]);

  // Combined Navigation Buttons component
  const NavButtons = ({ isMobile = false }) => (
    <>
      <Link to="/about" onClick={() => isMobile && setOpen(false)}>
        <Button variant="ghost" className="w-full justify-start md:w-auto">About</Button>
      </Link>
      <Link to="/hostels" onClick={() => isMobile && setOpen(false)}>
        <Button variant="ghost" className="w-full justify-start md:w-auto">Browse Hostels</Button>
      </Link>
      {loading ? (
        // Skeleton loader for loading state
        <div className="w-full h-8 bg-gray-200 rounded animate-pulse md:w-32" />
      ) : (user || token) ? (
        <>
          {/* FUNCTIONALITY UNTOUCHED: User Type Conditional Logic */}
          {(() => {
            const userType = user?.profile?.user_type || user?.user_type || '';
            const isWarden = userType.toString().toLowerCase() === 'warden';
            return (
              <>
                <Link to={isWarden ? '/warden-dashboard' : '/dashboard'} onClick={() => isMobile && setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start md:w-auto">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link to={user ? `/profile/${user.id || user.pk}` : '/profile/me'} onClick={() => isMobile && setOpen(false)}>
                  <Button variant="ghost" title="Profile" className="w-full justify-start md:w-auto">
                    <UserCircle className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="truncate max-w-[100px] sm:max-w-full">
                      <strong className="font-semibold text-gray-800">
                        {user?.full_name || user?.name || user?.username || user?.email?.split('@')[0] || 'Profile'}
                      </strong>
                    </span>
                  </Button>
                </Link>
              </>
            );
          })()}
          <Button 
            variant="default" // Changed to default for prominence
            onClick={() => { logout(); isMobile && setOpen(false); }}
            className="w-full justify-center md:w-auto bg-red-500 hover:bg-red-600 shadow-md"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </>
      ) : (
        <>
          <Link to="/login" onClick={() => isMobile && setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start md:w-auto">Log In</Button>
          </Link>
          <Link to="/signup" onClick={() => isMobile && setOpen(false)}>
            <Button className="w-full justify-center md:w-auto bg-blue-600 hover:bg-blue-700 shadow-md">Sign Up</Button>
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/80 shadow-lg"> {/* Enhanced styling */}
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        
        {/* Logo and Dynamic Title */}
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl sm:text-2xl text-gray-900 transition-colors hover:text-blue-600">
          <Building2 className="h-6 w-6 text-blue-600 transition-transform hover:scale-105" />
          <span className="truncate max-w-[200px]">
            {hostelName ?? 'HostelHub'}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-4">
          <NavButtons />
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setOpen(!open)} 
            className="p-1 h-10 w-10 text-gray-700 border-gray-300 hover:bg-gray-100"
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      {open && (
        <div className="md:hidden absolute top-16 left-0 w-full border-t bg-white shadow-xl z-40 animate-in slide-in-from-top-4 duration-300">
          <div className="container flex flex-col py-3 space-y-1.5 px-4 sm:px-6">
            <NavButtons isMobile={true} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;