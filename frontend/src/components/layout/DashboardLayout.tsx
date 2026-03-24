import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Settings, 
  Sparkles,
  FileUp,
  MessageSquare,
  Search,
  Bell,
  HelpCircle,
  UserCircle2
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} strokeWidth={2.2} /> },
    { name: 'Upload Resume', path: '/upload-resume', icon: <FileUp size={20} strokeWidth={2.2} /> },
    { name: 'Job Matches', path: '/job-matches', icon: <Briefcase size={20} strokeWidth={2.2} /> },
    { name: 'Applications', path: '/applications', icon: <FileText size={20} strokeWidth={2.2} /> },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#F8F9FA] md:bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex-col justify-between hidden md:flex shrink-0 h-full">
        <div>
          {/* Logo & Brand */}
          <div className="px-6 py-6 pb-8 flex items-center gap-3">
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center text-white shrink-0 shadow-[0_2px_8px_rgba(37,99,235,0.3)]">
              <Sparkles size={16} className="fill-white" />
            </div>
            <h1 className="text-[19px] font-extrabold text-gray-900 tracking-tight font-inter">AutoJob AI</h1>
          </div>

          {/* Navigation */}
          <nav className="px-4 flex flex-col gap-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-[14.5px] font-bold transition-all ${
                    isActive
                      ? 'bg-[#F0F4FF] text-[#2563EB]'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
            
            <NavLink
              to="/messages"
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-[14.5px] font-bold transition-all ${
                  isActive
                    ? 'bg-[#F0F4FF] text-[#2563EB]'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <div className="flex items-center gap-3.5">
                <MessageSquare size={20} strokeWidth={2.2} />
                Messages
              </div>
              <span className="bg-[#2563EB] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full leading-none flex items-center justify-center min-w-[20px] h-[20px]">
                4
              </span>
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-[14.5px] font-bold transition-all mt-1 ${
                  isActive
                    ? 'bg-[#F0F4FF] text-[#2563EB]'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Settings size={20} strokeWidth={2.2} />
              Settings
            </NavLink>
          </nav>
        </div>

        {/* Bottom User Profile */}
        <div className="p-4">
          <div className="bg-gray-50 rounded-[14px] p-4 border border-gray-100/80">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                  <UserCircle2 size={36} className="text-[#2563EB] stroke-1" />
               </div>
               <div>
                 <p className="text-[13px] font-bold text-gray-900 leading-tight">Alex Rivera</p>
                 <p className="text-[11px] font-medium text-gray-500">Premium Plan</p>
               </div>
            </div>
            
            <button className="w-full bg-[#2563EB] hover:bg-blue-600 shadow-sm text-white text-[13px] font-bold py-2.5 rounded-[10px] transition-colors">
              Upgrade Account
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white md:rounded-tl-[32px] md:border-l md:border-t md:border-gray-200/60 shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
        
        {/* Top Navbar */}
        <header className="h-[76px] px-8 flex items-center justify-between shrink-0 border-b border-gray-100 bg-white md:rounded-tl-[32px]">
           <div className="relative w-full max-w-md">
             <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
               <Search size={16} className="text-gray-400" strokeWidth={2.5} />
             </div>
             <input 
               type="text" 
               placeholder="Search for jobs, companies, or keywords..."
               className="w-full bg-[#F4F5F7] border-none text-[13.5px] text-gray-900 font-medium rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-100 transition-shadow placeholder:text-gray-400"
             />
           </div>
           
           <div className="flex items-center gap-4 text-gray-400">
             <button className="hover:text-gray-600 transition-colors">
               <Bell size={20} className="fill-current" strokeWidth={0} />
             </button>
             <button className="hover:text-gray-600 transition-colors">
               <HelpCircle size={20} className="fill-current" strokeWidth={0} />
             </button>
           </div>
        </header>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto w-full p-8 bg-white">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
