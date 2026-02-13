import React from 'react';
import { motion } from 'motion/react';
import { User, Settings, CreditCard, ShieldCheck, LogOut, ChevronRight, HelpCircle, FileText } from 'lucide-react';

interface ProfilePageProps {
  user: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
  } | null;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  const menuItems = [
    { icon: CreditCard, label: 'Доставка и оплата', color: 'bg-blue-50 text-blue-500' },
    { icon: ShieldCheck, label: 'Условия возврата', color: 'bg-green-50 text-green-500' },
    { icon: FileText, label: 'Пользовательское соглашение', color: 'bg-purple-50 text-purple-500' },
    { icon: HelpCircle, label: 'Служба поддержки', color: 'bg-amber-50 text-amber-500' },
  ];

  const displayName = user ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Гость';
  const displayUsername = user?.username ? `@${user.username}` : 'Режим просмотра';

  return (
    <div className="px-4 pb-24 space-y-6">
      {/* Header Profile Info */}
      <div className="bg-white rounded-[32px] p-6 shadow-xl border border-stone-100 flex items-center gap-4">
        <div className="w-20 h-20 bg-[#0ABAB5]/10 rounded-full flex items-center justify-center overflow-hidden border-2 border-[#0ABAB5]/20">
          {user?.photo_url ? (
            <img src={user.photo_url} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <User className="w-10 h-10 text-[#0ABAB5]" />
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold text-stone-800 serif leading-tight">
            {displayName}
          </h2>
          <p className="text-stone-400 text-sm font-medium">{displayUsername}</p>
        </div>
      </div>

      {/* Settings Menu */}
      <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-stone-100">
        {menuItems.map((item, index) => (
          <button 
            key={index}
            className="w-full flex items-center justify-between p-5 hover:bg-stone-50 transition-colors border-b border-stone-50 last:border-0"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="font-bold text-stone-700 text-sm">{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-300" />
          </button>
        ))}
      </div>

      {/* Logout Button */}
      <button className="w-full flex items-center justify-center gap-3 p-5 bg-stone-50 text-stone-400 font-bold rounded-[24px] hover:bg-red-50 hover:text-red-500 transition-all border border-stone-100">
        <LogOut className="w-5 h-5" />
        Выйти из аккаунта
      </button>

      <div className="text-center">
        <p className="text-[10px] text-stone-300 font-bold uppercase tracking-[0.2em]">Дело в деталях • v1.2.1</p>
      </div>
    </div>
  );
};
