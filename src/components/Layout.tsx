// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { Button } from '@/components/ui/button';
// import { cn } from '@/lib/utils';
// import { useToast } from '@/hooks/use-toast';
// import { LogOut, Menu, X, LayoutDashboard, Users, BarChart3, Settings, FileText } from 'lucide-react';
// import { Separator } from '@/components/ui/separator';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// // Corrected import: Renamed useMobile to useIsMobile
// import { useIsMobile } from '@/hooks/use-mobile';

// interface LayoutProps {
//   children: React.ReactNode;
// }

// const Layout: React.FC<LayoutProps> = ({ children }) => {
//   const { user, logout } = useAuth();
//   const location = useLocation();
//   const { toast } = useToast();
//   // Corrected hook usage: Renamed useMobile to useIsMobile
//   const isMobile = useIsMobile();
//   const [sidebarOpen, setSidebarOpen] = useState(!isMobile); // Start open on desktop, closed on mobile

//   const tenantName = "ACME Finance";

//   const navigation = [
//     { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
//     { name: 'Users', href: '/users', icon: Users },
//     { name: 'Analytics', href: '/analytics', icon: BarChart3 },
//     { name: 'Settings', href: '/settings', icon: Settings },
//     { name: 'Reporting', href: '/reporting', icon: FileText },
//   ];

//   const handleLogout = async () => {
//     try {
//       await logout();
//       toast({
//         title: "Logged out",
//         description: "You have been successfully logged out.",
//       });
//       // Optionally redirect after logout
//       // navigate('/login');
//     } catch (error) {
//       console.error("Logout error:", error); // Log the error for debugging
//       toast({
//         title: "Logout Failed",
//         description: "Failed to log out. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   // Close sidebar on navigation in mobile view
//   const handleLinkClick = () => {
//     if (isMobile) {
//       setSidebarOpen(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex">
//       {/* Sidebar */}
//       <div className={cn(
//         "w-64 bg-card h-screen fixed top-0 left-0 border-r transition-transform duration-300 ease-in-out",
//         // Apply translation based on sidebarOpen state and isMobile
//         isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0",
//         "z-40 flex flex-col" // Added flex flex-col here
//       )}>
//         <div className="p-6 flex justify-between items-center shrink-0"> {/* Added items-center for vertical alignment */}
//           <div className="flex flex-col items-center flex-grow">
//             <Link to="/dashboard" onClick={handleLinkClick} className="block"> {/* Added block display and bottom margin */}
//               <img
//                 src="/lovable-uploads/c27b88a7-cf98-47ce-9a0d-6398e4cf91dd.png"
//                 alt="Recon logo"
//                 className="h-20 w-auto object-contain"
//               />
//             </Link>

//             {tenantName && (
//               // Corrected font-sm (not standard) to font-medium or just text-sm if no extra weight needed
//               <span className="text-sm font-medium text-foreground mt-0">
//                 {tenantName}
//               </span>
//             )}
//           </div>

//           {/* ── mobile close button ─────────────────────────────────── */}
//           {isMobile ? (
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setSidebarOpen(false)}
//               aria-label="Close sidebar"
//               className="flex-shrink-0" // Prevent button from shrinking
//             >
//               <X className="h-5 w-5" />
//             </Button>
//           ) : (
//             // Add an invisible placeholder on desktop to balance justify-between
//             // Use approx the same width as the icon button (size="icon" is usually w-10 h-10)
//             <div className="w-10 flex-shrink-0"></div> // Placeholder needs width to push center element
//           )}
//         </div>


//         <nav className="flex-grow px-4 overflow-y-auto"> {/* Added padding and overflow */}
//           <ul className="space-y-1"> {/* Reduced space-y */}
//             {navigation.map((item) => (
//               <li key={item.name}>
//                 <Link
//                   to={item.href}
//                   className={cn(
//                     "flex items-center space-x-3 rounded-md p-2 text-sm font-medium transition-colors", // Increased space-x
//                     location.pathname.startsWith(item.href) // Use startsWith for better matching (e.g., /users/1)
//                       ? "bg-primary text-primary-foreground" // Use primary for active link
//                       : "text-muted-foreground hover:bg-muted hover:text-foreground", // Use muted colors
//                   )}
//                   onClick={handleLinkClick}
//                 >
//                   <item.icon className="h-4 w-4" />
//                   <span>{item.name}</span>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </nav>

//         <div className="p-4 mt-auto border-t"> {/* Added border-t */}
//           <div className="flex items-center space-x-3 mb-4"> {/* Increased space */}
//             <Avatar className="h-9 w-9"> {/* Slightly larger avatar */}
//               <AvatarImage src={user?.avatar || undefined} alt={user?.name || 'User'} /> {/* Added alt text and handle undefined src */}
//               <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback> {/* Added fallback and uppercase */}
//             </Avatar>
//             <div className="overflow-hidden"> {/* Prevent text overflow */}
//               <p className="text-sm font-medium truncate">{user?.name || 'User Name'}</p> {/* Added fallback and truncate */}
//               <p className="text-xs text-muted-foreground truncate">{user?.email || 'user@example.com'}</p> {/* Added fallback and truncate */}
//             </div>
//           </div>
//           <Button variant="outline" className="w-full justify-start text-sm" onClick={handleLogout}> {/* justify-start */}
//             <LogOut className="h-4 w-4 mr-2" />
//             Logout
//           </Button>
//         </div>
//       </div>

//       {/* Overlay for mobile */}
//       {isMobile && sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/60 z-30 lg:hidden" // Added lg:hidden
//           onClick={() => setSidebarOpen(false)}
//           aria-hidden="true"
//         ></div>
//       )}

//       {/* Main Content Area */}
//       <div className={cn(
//         "flex-1 transition-all duration-300 ease-in-out",
//         // Adjust padding based on sidebar visibility on desktop
//         isMobile ? "pl-0" : "pl-64"
//       )}>
//         <header className={cn(
//           "sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
//           isMobile ? "p-4 border-b flex items-center" : "hidden" // Show header only on mobile
//         )}>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="mr-2" // Add margin
//             onClick={() => setSidebarOpen(true)}
//             aria-label="Open sidebar"
//           >
//             <Menu className="h-6 w-6" />
//           </Button>
//           {/* Optional: Add page title or other header elements here */}
//           {/* <h2 className="font-semibold text-lg">{navigation.find(item => location.pathname.startsWith(item.href))?.name}</h2> */}
//         </header>
//         <main className="p-6 lg:p-8"> {/* Adjust padding */}
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Menu, X, LayoutDashboard, Users, BarChart3, Settings, FileText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// Corrected import: Renamed useMobile to useIsMobile
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  // Corrected hook usage: Renamed useMobile to useIsMobile
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile); // Start open on desktop, closed on mobile

  const tenantName = "ACME Finance";

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/users', icon: Users },
    // { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Recon Settings', href: '/settings', icon: Settings },
    { name: 'Reporting Settings', href: '/reporting', icon: FileText },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      // Optionally redirect after logout
      // navigate('/login');
    } catch (error) {
      console.error("Logout error:", error); // Log the error for debugging
      toast({
        title: "Logout Failed",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Close sidebar on navigation in mobile view
  const handleLinkClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className={cn(
        // Sidebar classes...
         "w-64 bg-card h-screen fixed top-0 left-0 border-r transition-transform duration-300 ease-in-out",
         isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0",
         "z-40 flex flex-col"
      )}>
        <div className="p-6 flex justify-between items-center shrink-0"> {/* Added items-center for vertical alignment */}
          <div className="flex flex-col items-center flex-grow">
            <Link to="/dashboard" onClick={handleLinkClick} className="block"> {/* Added block display and bottom margin */}
              <img
                src="/lovable-uploads/c27b88a7-cf98-47ce-9a0d-6398e4cf91dd.png"
                alt="Recon logo"
                className="h-20 w-auto object-contain"
              />
            </Link>
            {tenantName && (
              // Corrected font-sm (not standard) to font-medium or just text-sm if no extra weight needed
              <span className="text-sm font-medium text-foreground mt-0">
                {tenantName}
              </span>
            )}
          </div>

          {/* ── mobile close button ─────────────────────────────────── */}
          {isMobile ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
              className="flex-shrink-0" // Prevent button from shrinking
            >
              <X className="h-5 w-5" />
            </Button>
          ) : (
            // Add an invisible placeholder on desktop to balance justify-between
            // Use approx the same width as the icon button (size="icon" is usually w-10 h-10)
            <div className="w-10 flex-shrink-0"></div> // Placeholder needs width to push center element
          )}
        </div>


        <nav className="flex-grow px-4 overflow-y-auto"> {/* Added padding and overflow */}
          <ul className="space-y-1"> {/* Reduced space-y */}
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 rounded-md p-2 text-sm font-medium transition-colors", // Increased space-x
                    location.pathname.startsWith(item.href) // Use startsWith for better matching (e.g., /users/1)
                      ? "bg-primary text-primary-foreground" // Use primary for active link
                      : "text-muted-foreground hover:bg-muted hover:text-foreground", // Use muted colors
                  )}
                  onClick={handleLinkClick}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 mt-auto border-t"> {/* Added border-t */}
          <div className="flex items-center space-x-3 mb-4"> {/* Increased space */}
            <Avatar className="h-9 w-9"> {/* Slightly larger avatar */}
              <AvatarImage src={user?.avatar || undefined} alt={user?.name || 'User'} /> {/* Added alt text and handle undefined src */}
              <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback> {/* Added fallback and uppercase */}
            </Avatar>
            <div className="overflow-hidden"> {/* Prevent text overflow */}
              <p className="text-sm font-medium truncate">{user?.name || 'User Name'}</p> {/* Added fallback and truncate */}
              <p className="text-xs text-muted-foreground truncate">{user?.email || 'user@example.com'}</p> {/* Added fallback and truncate */}
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start text-sm" onClick={handleLogout}> {/* justify-start */}
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden" // Added lg:hidden
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        // Adjust padding based on sidebar visibility on desktop
        isMobile ? "pl-0" : "pl-64"
      )}>
        <header className={cn(
          "sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          isMobile ? "p-4 border-b flex items-center" : "hidden" // Show header only on mobile
        )}>
          <Button
            variant="ghost"
            size="icon"
            className="mr-2" // Add margin
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </Button>
          {/* Optional: Add page title or other header elements here */}
          {/* <h2 className="font-semibold text-lg">{navigation.find(item => location.pathname.startsWith(item.href))?.name}</h2> */}
        </header>
        <main className="p-6 lg:p-8"> {/* Adjust padding */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;