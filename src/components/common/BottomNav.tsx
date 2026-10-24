import React from 'react';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  FileSpreadsheet, 
  CreditCard,
  CalendarDays,
  MessageSquare 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface BottomNavProps {
  activeModule: string;
  setActiveModule: (mod: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeModule, setActiveModule }) => {
  const { currentUser } = useAuth();
  const isParent = currentUser?.role === 'wali_murid';

  const parentItems = [
    { id: 'dashboard', label: 'Ananda', icon: LayoutDashboard },
    { id: 'parent_schedule', label: 'Jadwal', icon: CalendarDays },
    { id: 'finance', label: 'Tagihan', icon: CreditCard },
    { id: 'sdr', label: 'Report SDR', icon: FileSpreadsheet },
    { id: 'consultations', label: 'Konsultasi', icon: MessageSquare }
  ];

  const defaultItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admissions', label: 'PSB', icon: UserPlus },
    { id: 'students', label: 'Siswa', icon: Users },
    { id: 'sdr', label: 'SDR', icon: FileSpreadsheet },
    { id: 'finance', label: 'SPP', icon: CreditCard }
  ];

  const items = isParent ? parentItems : defaultItems;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-amber-200/60 shadow-2xl pb-safe">
      {/* Top micro jewel accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-amber-400 via-rose-500 via-purple-600 to-blue-600" />
      
      <div className="flex items-center justify-around max-w-md mx-auto py-2 px-2">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-2xl transition-all cursor-pointer relative ${
                isActive 
                  ? 'text-blue-700 font-black scale-105 bg-blue-50/80 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 whitespace-nowrap font-display">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-amber-400 absolute bottom-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
