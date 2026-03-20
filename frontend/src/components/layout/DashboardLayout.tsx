import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Settings, 
  Sparkles,
  FileUp
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Upload Resume', path: '/upload-resume', icon: <FileUp size={20} /> },
    { name: 'Job Matches', path: '/job-matches', icon: <Briefcase size={20} /> },
    { name: 'Applications', path: '/applications', icon: <FileText size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between hidden md:flex">
        <div>
          {/* Logo & Brand */}
          <div className="px-6 py-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center text-white shrink-0">
              <Sparkles size={16} className="fill-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight tracking-tight">AutoJob AI</h1>
              <p className="text-[11px] font-medium text-gray-400">Career Assistant</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-3 space-y-2 mt-4 flex flex-col">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#EDF2FE] text-[#2563EB]'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
            
            <div className="pt-2">
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#EDF2FE] text-[#2563EB]'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Settings size={20} />
                Settings
              </NavLink>
            </div>
          </nav>
        </div>

        {/* Bottom Sidebar */}
        <div className="p-4">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Pro Plan</p>
            <p className="text-[13px] font-bold text-gray-900 mb-3">Unlock AI Analysis</p>
            <button className="w-full bg-[#2563EB] hover:bg-blue-600 text-white text-[13px] font-semibold py-2 rounded-lg transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-10 max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
