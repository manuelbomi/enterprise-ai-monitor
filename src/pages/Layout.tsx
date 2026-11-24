// App shell — sidebar navigation + top bar
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Users, BrainCircuit, DollarSign,
  ShieldAlert, FileText, LogOut,
} from 'lucide-react';

export const Layout: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('monitor_access_token');
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-60 bg-slate-900 text-white flex flex-col">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <BrainCircuit className="w-6 h-6 text-brand-400" />
            <div>
              <p className="font-bold text-sm leading-tight">AI Monitor</p>
              <p className="text-xs text-slate-400">Cost & Usage Analytics</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <Item to="/"             icon={<LayoutDashboard className="w-4 h-4" />} label="Overview"       />
          <Item to="/by-team"      icon={<Users className="w-4 h-4" />}           label="Cost by Team"   />
          <Item to="/by-user"      icon={<Users className="w-4 h-4" />}           label="Cost by User"   />
          <Item to="/by-model"     icon={<BrainCircuit className="w-4 h-4" />}    label="Cost by Model"  />
          <Item to="/budget"       icon={<ShieldAlert className="w-4 h-4" />}     label="Budget Status"  />
          <Item to="/weekly-report"icon={<FileText className="w-4 h-4" />}        label="Weekly Report"  />
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-xs w-full py-1.5 px-2 rounded hover:bg-slate-700 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

const Item: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    end={to === '/'}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
        isActive ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`
    }
  >
    {icon}{label}
  </NavLink>
);
