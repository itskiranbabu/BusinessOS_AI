import React, { useState } from 'react';
import { BusinessBlueprint } from '../types';
import { Save, User, Briefcase, Target, ShieldCheck } from 'lucide-react';

interface SettingsProps {
  blueprint: BusinessBlueprint;
  userEmail: string | null;
  onUpdateProfile: (data: Partial<BusinessBlueprint>) => void;
}

const Settings: React.FC<SettingsProps> = ({ blueprint, userEmail, onUpdateProfile }) => {
  const [formData, setFormData] = useState({
    businessName: blueprint.businessName,
    niche: blueprint.niche,
    mission: blueprint.mission,
    targetAudience: blueprint.targetAudience
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your business profile and preferences.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User size={20} className="text-slate-400" /> Account Info
          </h2>
        </div>
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-primary-500/30">
              {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-lg">Signed in as</p>
              <p className="text-slate-500 dark:text-slate-400">{userEmail}</p>
            </div>
            <div className="ml-auto flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium bg-green-50 dark:bg-green-900/20 px-4 py-1.5 rounded-full border border-green-200 dark:border-green-800">
              <ShieldCheck size={14} /> Secure Connection
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase size={20} className="text-slate-400" /> Business Profile
          </h2>
          <button 
            type="submit"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg ${
              isSaved 
                ? 'bg-green-600 text-white shadow-green-600/20' 
                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-600/30'
            }`}
          >
            <Save size={18} /> {isSaved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Business Name</label>
              <input 
                type="text" 
                value={formData.businessName}
                onChange={e => setFormData({...formData, businessName: e.target.value})}
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Niche / Speciality</label>
              <input 
                type="text" 
                value={formData.niche}
                onChange={e => setFormData({...formData, niche: e.target.value})}
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-all"
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Mission Statement</label>
             <textarea 
               rows={3}
               value={formData.mission}
               onChange={e => setFormData({...formData, mission: e.target.value})}
               className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-all"
             />
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
               <Target size={16} /> Target Audience
             </label>
             <textarea 
               rows={2}
               value={formData.targetAudience}
               onChange={e => setFormData({...formData, targetAudience: e.target.value})}
               className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-all"
             />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Settings;